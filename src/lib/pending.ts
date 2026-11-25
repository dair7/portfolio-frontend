const pendingMarker = "TODO(dair)";

export function isPending(value: string): boolean {
  return value.trimStart().startsWith(pendingMarker);
}
