import path from "node:path";

const tagPattern = /<(?:a|link|img|script|source|meta|video|audio)\b[^>]*>/gi;
const attributePattern = /\s([\w:-]+)\s*=\s*"([^"]*)"/g;
const cssUrlPattern = /url\(\s*['"]?([^'")]+)['"]?\s*\)/g;
const sitemapLocationPattern = /<loc>([^<]+)<\/loc>/g;
const robotsSitemapPattern = /^Sitemap:\s*(\S+)/gim;
const idPattern = /\sid="([^"]+)"/g;
const urlAttributes = ["href", "src", "poster"];
const urlMetaProperties = new Set(["og:image", "og:url", "twitter:image"]);

export const referenceExtensions = new Set([".html", ".css", ".xml", ".txt"]);

function captures(content: string, pattern: RegExp): string[] {
  return [...content.matchAll(pattern)].map(([, value]) => value);
}

function readAttributes(tag: string): Map<string, string> {
  return new Map(
    [...tag.matchAll(attributePattern)].map(([, name, value]) => [
      name.toLowerCase(),
      value.replaceAll("&amp;", "&"),
    ]),
  );
}

function referencesInTag(tag: string): string[] {
  const attributes = readAttributes(tag);
  const values = urlAttributes.flatMap((name) => attributes.get(name) ?? []);
  const srcset = attributes.get("srcset");
  if (srcset) {
    values.push(
      ...srcset.split(",").map((entry) => entry.trim().split(/\s+/)[0]),
    );
  }
  const metaName = attributes.get("property") ?? attributes.get("name");
  const content = attributes.get("content");
  if (metaName && content && urlMetaProperties.has(metaName)) {
    values.push(content);
  }
  return values;
}

export function extractReferences(file: string, content: string): string[] {
  switch (path.extname(file)) {
    case ".html":
      return (content.match(tagPattern) ?? [])
        .flatMap(referencesInTag)
        .concat(captures(content, cssUrlPattern));
    case ".css":
      return captures(content, cssUrlPattern);
    case ".xml":
      return captures(content, sitemapLocationPattern);
    default:
      return captures(content, robotsSitemapPattern);
  }
}

export function findCanonicalUrl(html: string): string | undefined {
  return (html.match(tagPattern) ?? [])
    .map(readAttributes)
    .find((attributes) => attributes.get("rel") === "canonical")
    ?.get("href");
}

export function collectIds(html: string): Set<string> {
  return new Set(captures(html, idPattern));
}
