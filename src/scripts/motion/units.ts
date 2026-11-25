export function remToPx(rem: number): number {
  const rootSize = getComputedStyle(document.documentElement).fontSize;
  return rem * Number.parseFloat(rootSize);
}
