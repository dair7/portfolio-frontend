import { statSync } from "node:fs";
import { readFile } from "node:fs/promises";
import path from "node:path";

import {
  distDirectory,
  listDistFiles,
  toDistPath,
  type DistCheck,
} from "./dist-check";
import {
  collectIds,
  extractReferences,
  findCanonicalUrl,
  referenceExtensions,
} from "./link-references";

interface InternalReference {
  source: string;
  value: string;
  url: URL;
}

const skippedSchemes = /^(?:mailto|tel|javascript|data|blob):/i;
const idsByFile = new Map<string, Promise<Set<string>>>();

function decodePath(value: string): string {
  try {
    return decodeURIComponent(value);
  } catch {
    return value;
  }
}

function servedPath(file: string): string {
  const distPath = `/${toDistPath(file)}`;
  return distPath.endsWith("/index.html")
    ? distPath.slice(0, -"index.html".length)
    : distPath;
}

function findServedFile(pathname: string): string | undefined {
  const relativePath = decodePath(pathname).replace(/^\/+/, "");
  const candidates = pathname.endsWith("/")
    ? [path.join(relativePath, "index.html")]
    : [
        relativePath,
        `${relativePath}.html`,
        path.join(relativePath, "index.html"),
      ];
  return candidates
    .map((candidate) => path.join(distDirectory, candidate))
    .find((candidate) =>
      statSync(candidate, { throwIfNoEntry: false })?.isFile(),
    );
}

function idsIn(file: string): Promise<Set<string>> {
  let ids = idsByFile.get(file);
  if (!ids) {
    ids = readFile(file, "utf8").then(collectIds);
    idsByFile.set(file, ids);
  }
  return ids;
}

async function readSiteOrigin(): Promise<string> {
  const home = await readFile(path.join(distDirectory, "index.html"), "utf8");
  const canonical = findCanonicalUrl(home);
  if (!canonical) {
    throw new Error("dist/index.html has no canonical link to read the origin");
  }
  return new URL(canonical).origin;
}

async function collectInternalReferences(
  origin: string,
): Promise<InternalReference[]> {
  const files = await listDistFiles(referenceExtensions);
  const referencesPerFile = await Promise.all(
    files.map(async (file) => {
      const base = new URL(servedPath(file), origin);
      const source = toDistPath(file);
      return extractReferences(file, await readFile(file, "utf8"))
        .filter((value) => value !== "" && !skippedSchemes.test(value))
        .map((value) => ({ source, value, url: new URL(value, base) }))
        .filter(({ url }) => url.origin === origin);
    }),
  );
  return referencesPerFile.flat();
}

async function findProblem({
  source,
  value,
  url,
}: InternalReference): Promise<string | undefined> {
  const label = `${source} → ${value}`;
  const target = findServedFile(url.pathname);
  if (!target) return `${label}  (missing file)`;
  const fragment = decodePath(url.hash.slice(1));
  const isMissingAnchor =
    fragment !== "" &&
    target.endsWith(".html") &&
    !(await idsIn(target)).has(fragment);
  return isMissingAnchor ? `${label}  (missing #${fragment})` : undefined;
}

export const linkCheck: DistCheck = {
  tag: "check:links",
  run: async () => {
    const references = await collectInternalReferences(await readSiteOrigin());
    const problems = await Promise.all(references.map(findProblem));
    const findings = [
      ...new Set(problems.filter((problem) => problem !== undefined)),
    ];
    return {
      findings,
      emptyMessage: `all ${references.length} internal references in dist resolve`,
      heading: `${findings.length} broken internal references in dist`,
    };
  },
};
