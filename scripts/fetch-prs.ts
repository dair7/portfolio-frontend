import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";

import type {
  OpenSourceData,
  OpenSourcePullRequest,
} from "../src/types/opensource.ts";

const GITHUB_USER = "dair7";
const SEARCH_QUERY = `is:pr author:${GITHUB_USER} is:merged`;

const API_ROOT = "https://api.github.com";
const PER_PAGE = 100;
// The Search API caps at 1000 results; this stops a malformed response from looping forever.
const MAX_PAGES = 10;

const OUTPUT_PATH = path.join(
  import.meta.dirname,
  "..",
  "src",
  "data",
  "opensource.json",
);
const OUTPUT_LABEL = "src/data/opensource.json";

interface SearchItem {
  title: string;
  html_url: string;
  closed_at: string | null;
  repository_url: string;
  pull_request?: { merged_at?: string | null };
}

interface SearchResponse {
  total_count: number;
  items: SearchItem[];
}

interface RepositoryReference {
  owner: string;
  name: string;
}

function buildHeaders(): Record<string, string> {
  const headers: Record<string, string> = {
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
    // GitHub rejects API requests without a User-Agent.
    "User-Agent": `${GITHUB_USER}-portfolio-build`,
  };

  const token = process.env.GITHUB_TOKEN;
  if (token) headers.Authorization = `Bearer ${token}`;

  return headers;
}

function buildSearchUrl(page: number): URL {
  const url = new URL("/search/issues", API_ROOT);
  url.searchParams.set("q", SEARCH_QUERY);
  url.searchParams.set("sort", "created");
  url.searchParams.set("order", "desc");
  url.searchParams.set("per_page", String(PER_PAGE));
  url.searchParams.set("page", String(page));
  return url;
}

async function fetchPage(page: number): Promise<SearchResponse> {
  const response = await fetch(buildSearchUrl(page), {
    headers: buildHeaders(),
  });

  if (!response.ok) {
    const exhausted = response.headers.get("x-ratelimit-remaining") === "0";
    const hint = exhausted
      ? " — rate limit exhausted, set GITHUB_TOKEN to raise it from 60/h"
      : "";
    throw new Error(
      `GitHub search returned ${response.status} ${response.statusText}${hint}`,
    );
  }

  return (await response.json()) as SearchResponse;
}

function parseRepositoryUrl(repositoryUrl: string): RepositoryReference | null {
  const match = /\/repos\/([^/]+)\/([^/]+)\/?$/.exec(repositoryUrl);
  return match ? { owner: match[1], name: match[2] } : null;
}

function isOwnRepository(repository: RepositoryReference): boolean {
  return repository.owner.toLowerCase() === GITHUB_USER.toLowerCase();
}

function toPullRequest(item: SearchItem): OpenSourcePullRequest | null {
  const repository = parseRepositoryUrl(item.repository_url);
  if (!repository || isOwnRepository(repository)) return null;

  // Search results only expose merged_at inside pull_request; closed_at is the same instant for merged PRs.
  const mergedAt = item.pull_request?.merged_at ?? item.closed_at;
  if (!mergedAt) return null;

  return {
    organization: repository.owner,
    repository: repository.name,
    title: item.title,
    url: item.html_url,
    mergedAt,
  };
}

async function collectPullRequests(): Promise<OpenSourcePullRequest[]> {
  const collected: OpenSourcePullRequest[] = [];
  let expected = Number.POSITIVE_INFINITY;
  let seen = 0;

  for (let page = 1; page <= MAX_PAGES; page += 1) {
    const body = await fetchPage(page);
    if (page === 1) expected = body.total_count;
    if (body.items.length === 0) break;

    seen += body.items.length;
    for (const item of body.items) {
      const pullRequest = toPullRequest(item);
      if (pullRequest) collected.push(pullRequest);
    }

    if (seen >= expected || body.items.length < PER_PAGE) break;
  }

  // The Search API cannot sort by merge date, so the order is decided here.
  return collected.sort((a, b) => b.mergedAt.localeCompare(a.mergedAt));
}

async function writeData(data: OpenSourceData): Promise<void> {
  await writeFile(OUTPUT_PATH, `${JSON.stringify(data, null, 2)}\n`, "utf8");
}

async function hasExistingData(): Promise<boolean> {
  try {
    JSON.parse(await readFile(OUTPUT_PATH, "utf8"));
    return true;
  } catch {
    return false;
  }
}

async function refreshData(): Promise<void> {
  const pullRequests = await collectPullRequests();
  await writeData({
    generatedAt: new Date().toISOString(),
    count: pullRequests.length,
    pullRequests,
  });
  console.log(
    `[fetch-prs] wrote ${pullRequests.length} merged PR(s) to ${OUTPUT_LABEL}`,
  );
}

// A failed refresh must never fail the build: keep the committed data or write an empty payload.
async function recoverFrom(error: unknown): Promise<void> {
  const reason = error instanceof Error ? error.message : String(error);
  console.warn(`[fetch-prs] could not refresh the open source data: ${reason}`);

  if (await hasExistingData()) {
    console.warn(`[fetch-prs] keeping the committed ${OUTPUT_LABEL}`);
    return;
  }

  await writeData({
    generatedAt: new Date().toISOString(),
    count: 0,
    pullRequests: [],
  });
  console.warn(`[fetch-prs] no usable ${OUTPUT_LABEL}; wrote an empty payload`);
}

try {
  await refreshData();
} catch (error) {
  await recoverFrom(error);
}
