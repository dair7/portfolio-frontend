import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";

import { motionDistance, motionTiming, scrollStart } from "../../data/motion";
import type { MotionFeature } from "./types";

gsap.registerPlugin(ScrollTrigger, SplitText);

function flipWhenSeen(heading: HTMLElement): void {
  const split = SplitText.create(heading, {
    type: "words,chars",
    aria: "auto",
  });
  gsap.to(split.chars, {
    rotationX: 360,
    transformPerspective: motionDistance.flipPerspectivePx,
    duration: motionTiming.flip.duration,
    ease: "power2.inOut",
    stagger: { amount: motionTiming.flip.stagger },
    scrollTrigger: { trigger: heading, start: scrollStart, once: true },
    onComplete: () => split.revert(),
  });
}

export const headingFlip: MotionFeature = (elements) => {
  elements
    .filter((heading) => !ScrollTrigger.isInViewport(heading))
    .forEach(flipWhenSeen);
};
