import { readdir, readFile } from "node:fs/promises";
import path from "node:path";

interface TodoMatch {
  file: string;
  line: number;
  excerpt: string;
}

const marker = "TODO(dair)";
const excerptLength = 90;
const distDirectory = path.resolve("dist");
const textExtensions = new Set([
  ".html",
  ".xml",
  ".txt",
  ".js",
  ".css",
  ".json",
  ".svg",
]);
const isStrict = process.env.STRICT_TODOS === "1";

async function listTextFiles(directory: string): Promise<string[]> {
  const entries = await readdir(directory, {
    recursive: true,
    withFileTypes: true,
  });
  return entries
    .filter((entry) => entry.isFile())
    .filter((entry) => textExtensions.has(path.extname(entry.name)))
    .map((entry) => path.join(entry.parentPath, entry.name))
    .sort();
}

function extractExcerpt(text: string): string {
  const start = text.indexOf(marker);
  return text
    .slice(start, start + excerptLength)
    .replace(/\s+/g, " ")
    .trim();
}

function findMatches(file: string, content: string): TodoMatch[] {
  const relativeFile = path.relative(distDirectory, file).replaceAll("\\", "/");
  return content.split("\n").flatMap((text, index) =>
    text.includes(marker)
      ? [
          {
            file: relativeFile,
            line: index + 1,
            excerpt: extractExcerpt(text),
          },
        ]
      : [],
  );
}

async function collectMatches(): Promise<TodoMatch[]> {
  const files = await listTextFiles(distDirectory);
  const matchesPerFile = await Promise.all(
    files.map(async (file) => findMatches(file, await readFile(file, "utf8"))),
  );
  return matchesPerFile.flat();
}

function report(matches: TodoMatch[]): void {
  if (matches.length === 0) {
    console.log(`[check:todos] no ${marker} markers in dist`);
    return;
  }
  const log = isStrict ? console.error : console.warn;
  log(`[check:todos] ${matches.length} ${marker} markers in dist:`);
  for (const { file, line, excerpt } of matches) {
    log(`  ${file}:${line}  ${excerpt}`);
  }
  if (isStrict) {
    log("[check:todos] failing because STRICT_TODOS=1");
    process.exitCode = 1;
  }
}

try {
  report(await collectMatches());
} catch (error) {
  const reason = error instanceof Error ? error.message : String(error);
  console.error(`[check:todos] could not read dist: ${reason}`);
  process.exitCode = 1;
}
