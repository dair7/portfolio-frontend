let lastId = 0;

export function createUniqueId(prefix: string): string {
  lastId += 1;
  return `${prefix}-${lastId}`;
}
