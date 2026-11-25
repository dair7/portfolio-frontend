import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import { flowViewport, motionTiming } from "../../data/motion";
import type { MotionFeature, MotionScope } from "./types";

gsap.registerPlugin(ScrollTrigger);

interface Point {
  x: number;
  y: number;
}

const activeAttribute = "data-flow-active";
const dotClasses =
  "pointer-events-none absolute top-0 left-0 size-2.5 rounded-full bg-feature-accent opacity-0";

function createDot(diagram: HTMLElement): HTMLSpanElement {
  const dot = document.createElement("span");
  dot.className = dotClasses;
  dot.setAttribute("aria-hidden", "true");
  diagram.append(dot);
  return dot;
}

function edgePoints(diagram: HTMLElement, steps: HTMLElement[]): Point[] {
  const origin = diagram.getBoundingClientRect();
  const boxes = steps.map((step) => step.getBoundingClientRect());
  const isHorizontal = boxes.length > 1 && boxes[1].top < boxes[0].bottom;
  return boxes.map((box) => ({
    x: (isHorizontal ? box.left + box.width / 2 : box.left) - origin.left,
    y: (isHorizontal ? box.top : box.top + box.height / 2) - origin.top,
  }));
}

function markActive(elements: HTMLElement[], active?: HTMLElement): void {
  for (const element of elements) {
    element.toggleAttribute(activeAttribute, element === active);
  }
}

function buildPass(
  diagram: HTMLElement,
  steps: HTMLElement[],
  status: HTMLElement,
  dot: HTMLSpanElement,
): gsap.core.Timeline {
  const { hop, hold, status: statusDuration } = motionTiming.requestFlow;
  const marked = [...steps, status];
  const points = edgePoints(diagram, steps);
  const route = [...steps.keys(), ...[...steps.keys()].reverse().slice(1)];
  const timeline = gsap.timeline();
  timeline.set(dot, { ...points[0], xPercent: -50, yPercent: -50, opacity: 1 });
  route.forEach((stepIndex, order) => {
    timeline
      .to(dot, { ...points[stepIndex], duration: order === 0 ? 0 : hop })
      .call(() => markActive(marked, steps[stepIndex]));
    if (stepIndex === steps.length - 1) timeline.to({}, { duration: hold });
  });
  return timeline
    .to(dot, { opacity: 0, duration: statusDuration })
    .call(() => markActive(marked, status), [], "<");
}

function setupDiagram(diagram: HTMLElement, { context }: MotionScope) {
  const steps = [...diagram.querySelectorAll<HTMLElement>("[data-flow-step]")];
  const status = diagram.querySelector<HTMLElement>("[data-flow-status]");
  if (steps.length === 0 || !status) return () => undefined;
  const dot = createDot(diagram);
  let pass: gsap.core.Timeline | undefined;
  const play = (): void => {
    if (pass?.isActive()) return;
    pass?.kill();
    pass = context.add(() => buildPass(diagram, steps, status, dot));
  };
  ScrollTrigger.create({
    trigger: diagram,
    ...flowViewport,
    onEnter: play,
    onEnterBack: play,
  });
  return () => {
    markActive([...steps, status]);
    dot.remove();
  };
}

export const requestFlow: MotionFeature = (elements, scope) => {
  const cleanups = elements.map((diagram) => setupDiagram(diagram, scope));
  return () => cleanups.forEach((cleanup) => cleanup());
};
