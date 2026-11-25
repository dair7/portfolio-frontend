import { readFile } from "node:fs/promises";

import { listDistFiles, toDistPath, type DistCheck } from "./dist-check";

const marker = "TODO(dair)";
const excerptLength = 90;
const textExtensions = new Set([
  ".html",
  ".xml",
  ".txt",
  ".js",
  ".css",
  ".json",
  ".svg",
]);

function extractExcerpt(text: string): string {
  const start = text.indexOf(marker);
  return text
    .slice(start, start + excerptLength)
    .replace(/\s+/g, " ")
    .trim();
}

function findMarkers(file: string, content: string): string[] {
  return content
    .split("\n")
    .flatMap((text, index) =>
      text.includes(marker)
        ? [`${toDistPath(file)}:${index + 1}  ${extractExcerpt(text)}`]
        : [],
    );
}

export const todoCheck: DistCheck = {
  tag: "check:todos",
  run: async () => {
    const files = await listDistFiles(textExtensions);
    const markersPerFile = await Promise.all(
      files.map(async (file) =>
        findMarkers(file, await readFile(file, "utf8")),
      ),
    );
    const findings = markersPerFile.flat();
    return {
      findings,
      emptyMessage: `no ${marker} markers in dist`,
      heading: `${findings.length} ${marker} markers in dist`,
    };
  },
};
