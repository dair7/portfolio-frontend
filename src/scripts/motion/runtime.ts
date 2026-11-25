import { motionNames, type MotionName } from "../../data/motion";
import { prefersReducedMotion } from "./preferences";
import { claimFirstVisit } from "./session";
import type { MotionFeature } from "./types";

interface PageMotion {
  controller: AbortController;
  context?: gsap.Context;
}

interface PlannedFeature {
  elements: HTMLElement[];
  load: () => Promise<MotionFeature>;
}

const featureLoaders: Record<MotionName, () => Promise<MotionFeature>> = {
  [motionNames.rise]: async () => (await import("./hero-rise")).heroRise,
  [motionNames.decode]: async () => (await import("./decode")).decode,
  [motionNames.typing]: async () => (await import("./typing")).typing,
  [motionNames.wave]: async () => (await import("./letter-wave")).letterWave,
  [motionNames.flip]: async () => (await import("./heading-flip")).headingFlip,
  [motionNames.reveal]: async () => (await import("./reveal")).reveal,
  [motionNames.requestFlow]: async () =>
    (await import("./request-flow")).requestFlow,
  [motionNames.tinto]: async () => (await import("./tinto")).tinto,
};

let activePage: PageMotion | undefined;

function afterNextPaint(): Promise<void> {
  return new Promise((resolve) => {
    requestAnimationFrame(() => setTimeout(resolve));
  });
}

function findElements(
  name: MotionName,
  firstVisits: Map<string, boolean>,
): HTMLElement[] {
  const elements = document.querySelectorAll<HTMLElement>(
    `[data-motion="${name}"]`,
  );
  return [...elements].filter(({ dataset: { motionOnce } }) => {
    if (!motionOnce) return true;
    if (!firstVisits.has(motionOnce)) {
      firstVisits.set(motionOnce, claimFirstVisit(motionOnce));
    }
    return firstVisits.get(motionOnce);
  });
}

function planFeatures(): PlannedFeature[] {
  const firstVisits = new Map<string, boolean>();
  return Object.entries(featureLoaders)
    .map(([name, load]) => ({
      elements: findElements(name as MotionName, firstVisits),
      load,
    }))
    .filter(({ elements }) => elements.length > 0);
}

async function startPage(page: PageMotion): Promise<void> {
  await afterNextPaint();
  await document.fonts.ready;
  if (page.controller.signal.aborted) return;
  const planned = planFeatures();
  if (planned.length === 0) return;
  const features = await Promise.all(planned.map(({ load }) => load()));
  const { gsap } = await import("gsap");
  if (page.controller.signal.aborted) return;
  const context = gsap.context(() => undefined);
  page.context = context;
  const scope = { context, signal: page.controller.signal };
  planned.forEach(({ elements }, index) => {
    context.add(() => features[index](elements, scope));
  });
}

function stopPage(): void {
  activePage?.controller.abort();
  activePage?.context?.revert();
  activePage = undefined;
}

export function startMotion(): void {
  document.addEventListener("astro:page-load", () => {
    stopPage();
    if (prefersReducedMotion()) return;
    activePage = { controller: new AbortController() };
    void startPage(activePage);
  });
  document.addEventListener("astro:before-swap", stopPage);
}
