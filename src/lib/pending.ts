const pendingMarker = "TODO(dair)";

export type PendingNote = `${typeof pendingMarker}${string}`;

export function isPending(value: string): value is PendingNote {
  return value.trimStart().startsWith(pendingMarker);
}
