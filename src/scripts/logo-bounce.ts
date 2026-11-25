import { activeSectionChangeEvent } from "../data/motion";
import { prefersReducedMotion } from "./motion/preferences";

const bouncingAttribute = "data-bouncing";

export function bounceLogoDotOnSectionChange(signal: AbortSignal): void {
  const dot = document.querySelector<HTMLElement>("[data-logo-dot]");
  if (!dot) return;
  const finishBounce = ({ target }: AnimationEvent): void => {
    if (target === dot) dot.removeAttribute(bouncingAttribute);
  };
  document.addEventListener(
    activeSectionChangeEvent,
    () => {
      if (prefersReducedMotion() || dot.hasAttribute(bouncingAttribute)) return;
      dot.setAttribute(bouncingAttribute, "");
    },
    { signal },
  );
  dot.addEventListener("animationend", finishBounce, { signal });
  dot.addEventListener("animationcancel", finishBounce, { signal });
}
