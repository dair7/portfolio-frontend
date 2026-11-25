import { readdir } from "node:fs/promises";
import path from "node:path";

interface CheckResult {
  findings: string[];
  emptyMessage: string;
  heading: string;
}

export interface DistCheck {
  tag: string;
  run: () => Promise<CheckResult>;
}

export const distDirectory = path.resolve("dist");

const isStrict = process.env.STRICT_TODOS === "1";

export async function listDistFiles(
  extensions: ReadonlySet<string>,
): Promise<string[]> {
  const entries = await readdir(distDirectory, {
    recursive: true,
    withFileTypes: true,
  });
  return entries
    .filter((entry) => entry.isFile())
    .filter((entry) => extensions.has(path.extname(entry.name)))
    .map((entry) => path.join(entry.parentPath, entry.name))
    .sort();
}

export function toDistPath(file: string): string {
  return path.relative(distDirectory, file).replaceAll("\\", "/");
}

function report(tag: string, result: CheckResult): void {
  if (result.findings.length === 0) {
    console.log(`[${tag}] ${result.emptyMessage}`);
    return;
  }
  const log = isStrict ? console.error : console.warn;
  log(`[${tag}] ${result.heading}:`);
  for (const finding of result.findings) {
    log(`  ${finding}`);
  }
  if (isStrict) {
    log(`[${tag}] failing because STRICT_TODOS=1`);
    process.exitCode = 1;
  }
}

export async function runDistCheck({ tag, run }: DistCheck): Promise<void> {
  try {
    report(tag, await run());
  } catch (error) {
    const reason = error instanceof Error ? error.message : String(error);
    console.error(`[${tag}] could not read dist: ${reason}`);
    process.exitCode = 1;
  }
}
