/**
 * Regenerates `src/data/opensource.json` from the GitHub Search API.
 *
 * This runs at build time (see the `prebuild` script in package.json), never in
 * the browser. Two reasons that matter:
 *
 *  - The unauthenticated API allows 60 requests/hour per IP. Fetching from the
 *    client would mean a visitor arriving on an exhausted IP sees an empty
 *    section. Baking the data into the bundle makes that impossible.
 *  - A token can be used safely here. GITHUB_TOKEN lives in the build
 *    environment and never reaches the shipped JavaScript.
 *
 * The script is deliberately unable to fail the build: if GitHub is down, rate
 * limited, or returns anything unexpected, it keeps the JSON already committed
 * to the repo and prints a warning. A stale section beats a red deploy.
 */
import { readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'

import type { OpenSourceData, OpenSourcePullRequest } from '../src/types/index.ts'

const GITHUB_USER = 'dair7'
const SEARCH_QUERY = `is:pr author:${GITHUB_USER} is:merged`

const API_ROOT = 'https://api.github.com'
const PER_PAGE = 100
// The Search API caps out at 1000 results anyway; this just stops a malformed
// response from spinning the loop forever.
const MAX_PAGES = 10

const OUTPUT_PATH = path.join(import.meta.dirname, '..', 'src', 'data', 'opensource.json')
const OUTPUT_LABEL = 'src/data/opensource.json'

/** The subset of a search result we actually read. */
interface SearchItem {
  title: string
  html_url: string
  closed_at: string | null
  repository_url: string
  pull_request?: { merged_at?: string | null }
}

interface SearchResponse {
  total_count: number
  items: SearchItem[]
}

function buildHeaders(): Record<string, string> {
  const headers: Record<string, string> = {
    Accept: 'application/vnd.github+json',
    'X-GitHub-Api-Version': '2022-11-28',
    // GitHub rejects API requests that do not identify themselves.
    'User-Agent': `${GITHUB_USER}-portfolio-build`,
  }

  // Optional. Without it the request still works, just on the lower rate limit.
  const token = process.env.GITHUB_TOKEN
  if (token) headers.Authorization = `Bearer ${token}`

  return headers
}

async function fetchPage(page: number): Promise<SearchResponse> {
  const url = new URL('/search/issues', API_ROOT)
  url.searchParams.set('q', SEARCH_QUERY)
  url.searchParams.set('sort', 'created')
  url.searchParams.set('order', 'desc')
  url.searchParams.set('per_page', String(PER_PAGE))
  url.searchParams.set('page', String(page))

  const response = await fetch(url, { headers: buildHeaders() })

  if (!response.ok) {
    // Rate limiting is the failure worth naming explicitly, since the fix is
    // a token rather than a retry.
    const exhausted = response.headers.get('x-ratelimit-remaining') === '0'
    const hint = exhausted
      ? ' — rate limit exhausted, set GITHUB_TOKEN to raise it from 60/h'
      : ''
    throw new Error(`GitHub search returned ${response.status} ${response.statusText}${hint}`)
  }

  return (await response.json()) as SearchResponse
}

/** Pulls `{ owner, name }` out of `https://api.github.com/repos/owner/name`. */
function splitRepositoryUrl(repositoryUrl: string): { owner: string; name: string } | null {
  const match = /\/repos\/([^/]+)\/([^/]+)\/?$/.exec(repositoryUrl)
  return match ? { owner: match[1], name: match[2] } : null
}

function toPullRequest(item: SearchItem): OpenSourcePullRequest | null {
  const repo = splitRepositoryUrl(item.repository_url)

  // Drop anything we cannot attribute to a repository, and everything under our
  // own account: the section is about contributions to other people's code, so
  // our own repos would be padding.
  if (!repo || repo.owner.toLowerCase() === GITHUB_USER.toLowerCase()) return null

  // `is:merged` guarantees a merge happened, but the merge date only shows up
  // in the nested pull_request object. closed_at is the same instant for a
  // merged PR, so it is a safe fallback rather than an approximation.
  const mergedAt = item.pull_request?.merged_at ?? item.closed_at
  if (!mergedAt) return null

  return {
    organization: repo.owner,
    repository: repo.name,
    title: item.title,
    url: item.html_url,
    mergedAt,
  }
}

async function collectPullRequests(): Promise<OpenSourcePullRequest[]> {
  const collected: OpenSourcePullRequest[] = []
  let expected = Number.POSITIVE_INFINITY
  let seen = 0

  for (let page = 1; page <= MAX_PAGES; page += 1) {
    const body = await fetchPage(page)
    if (page === 1) expected = body.total_count
    if (body.items.length === 0) break

    seen += body.items.length
    for (const item of body.items) {
      const pullRequest = toPullRequest(item)
      if (pullRequest) collected.push(pullRequest)
    }

    if (seen >= expected || body.items.length < PER_PAGE) break
  }

  // Most recent merge first. The Search API can sort by creation but not by
  // merge date, so the order the page shows is decided here, not by the query.
  collected.sort((a, b) => b.mergedAt.localeCompare(a.mergedAt))

  return collected
}

async function write(data: OpenSourceData): Promise<void> {
  await writeFile(OUTPUT_PATH, `${JSON.stringify(data, null, 2)}\n`, 'utf8')
}

async function hasExistingData(): Promise<boolean> {
  try {
    JSON.parse(await readFile(OUTPUT_PATH, 'utf8'))
    return true
  } catch {
    return false
  }
}

async function main(): Promise<void> {
  try {
    const pullRequests = await collectPullRequests()

    await write({
      generatedAt: new Date().toISOString(),
      count: pullRequests.length,
      pullRequests,
    })

    const auth = process.env.GITHUB_TOKEN ? 'authenticated' : 'unauthenticated'
    console.log(
      `[fetch-prs] wrote ${pullRequests.length} external merged PR(s) to ${OUTPUT_LABEL} (${auth})`,
    )
  } catch (error) {
    const reason = error instanceof Error ? error.message : String(error)
    console.warn(`[fetch-prs] could not refresh the open source data: ${reason}`)

    if (await hasExistingData()) {
      console.warn(`[fetch-prs] keeping the committed ${OUTPUT_LABEL}; the build continues.`)
      return
    }

    // Nothing usable on disk. Write an empty payload so the import still
    // resolves — a missing module would fail the build, which is the one
    // outcome this script exists to prevent.
    await write({ generatedAt: new Date().toISOString(), count: 0, pullRequests: [] })
    console.warn(`[fetch-prs] no usable ${OUTPUT_LABEL} found; wrote an empty payload instead.`)
  }
}

await main()
