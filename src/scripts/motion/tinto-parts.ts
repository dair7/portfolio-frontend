export interface TintoParts {
  root: HTMLElement;
  figure: Element;
  blinks: Element[];
  zzz: Element;
  sparkles: Element;
}

export const animatedProps = "transform,opacity";

export function findParts(root: HTMLElement): TintoParts | undefined {
  const figure = root.querySelector(".tinto-figure");
  const zzz = root.querySelector(".tinto-zzz");
  const sparkles = root.querySelector(".tinto-sparkles");
  if (!figure || !zzz || !sparkles) return undefined;
  const blinks = [...root.querySelectorAll(".tinto-blink")];
  return { root, figure, blinks, zzz, sparkles };
}
