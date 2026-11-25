const indent = "  ";

function formatValue(value: unknown): string {
  return Array.isArray(value)
    ? `[${value.map((item) => JSON.stringify(item)).join(", ")}]`
    : JSON.stringify(value);
}

export function toCompactJsonLines(object: Record<string, unknown>): string[] {
  const entries = Object.entries(object);
  const lines = entries.map(([key, value], index) => {
    const separator = index < entries.length - 1 ? "," : "";
    return `${indent}${JSON.stringify(key)}: ${formatValue(value)}${separator}`;
  });
  return ["{", ...lines, "}"];
}
