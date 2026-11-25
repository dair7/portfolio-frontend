import { motionTiming } from "../data/motion";
import { prefersReducedMotion } from "./motion/preferences";

const transitionAttribute = "data-theme-transition";

function circleFrom(origin: Element): [string, string] {
  const { left, top, width, height } = origin.getBoundingClientRect();
  const x = left + width / 2;
  const y = top + height / 2;
  const radius = Math.hypot(
    Math.max(x, window.innerWidth - x),
    Math.max(y, window.innerHeight - y),
  );
  const center = `at ${x}px ${y}px`;
  return [`circle(0px ${center})`, `circle(${radius}px ${center})`];
}

async function expandCircle(
  transition: ViewTransition,
  origin: Element,
): Promise<void> {
  const clipPath = circleFrom(origin);
  // A transition skipped by a page navigation rejects `ready`; the theme is already applied.
  try {
    await transition.ready;
  } catch {
    return;
  }
  document.documentElement.animate(
    { clipPath },
    {
      duration: motionTiming.themeTransitionMs,
      easing: "ease-out",
      pseudoElement: "::view-transition-new(root)",
    },
  );
}

export function transitionTheme(origin: Element, applyTheme: () => void): void {
  if (
    typeof document.startViewTransition !== "function" ||
    prefersReducedMotion()
  ) {
    applyTheme();
    return;
  }
  const root = document.documentElement;
  root.setAttribute(transitionAttribute, "");
  const transition = document.startViewTransition(applyTheme);
  void expandCircle(transition, origin);
  void transition.finished.finally(() =>
    root.removeAttribute(transitionAttribute),
  );
}
