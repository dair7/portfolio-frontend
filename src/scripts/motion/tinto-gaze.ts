import { gsap } from "gsap";

import { motionDistance, motionTiming } from "../../data/motion";

const finePointerQuery = "(pointer: fine)";
const fullReachDistanceInEyes = 4;

interface PupilMover {
  eye: Element;
  moveX: gsap.QuickToFunc;
  moveY: gsap.QuickToFunc;
}

function createMover(pupil: SVGCircleElement): PupilMover | undefined {
  const eye = pupil.previousElementSibling;
  if (!eye) return undefined;
  const settings = { duration: motionTiming.tintoGaze, ease: "power3" };
  return {
    eye,
    moveX: gsap.quickTo(pupil, "x", settings),
    moveY: gsap.quickTo(pupil, "y", settings),
  };
}

function lookAt({ eye, moveX, moveY }: PupilMover, event: PointerEvent): void {
  const box = eye.getBoundingClientRect();
  const deltaX = event.clientX - (box.left + box.width / 2);
  const deltaY = event.clientY - (box.top + box.height / 2);
  const distance = Math.hypot(deltaX, deltaY);
  if (distance === 0) return;
  const pull = Math.min(1, distance / (box.width * fullReachDistanceInEyes));
  const reach = motionDistance.tintoGazeReach * pull;
  moveX((deltaX / distance) * reach);
  moveY((deltaY / distance) * reach);
}

export function followPointer(
  root: Element,
  isVisible: () => boolean,
  signal: AbortSignal,
): void {
  if (!window.matchMedia(finePointerQuery).matches) return;
  const movers = [
    ...root.querySelectorAll<SVGCircleElement>(".tinto-pupil"),
  ].flatMap((pupil) => createMover(pupil) ?? []);
  window.addEventListener(
    "pointermove",
    (event) => {
      if (!isVisible()) return;
      for (const mover of movers) lookAt(mover, event);
    },
    { signal, passive: true },
  );
}
