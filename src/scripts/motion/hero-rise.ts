import { gsap } from "gsap";
import { SplitText } from "gsap/SplitText";

import { motionDistance, motionTiming } from "../../data/motion";
import type { MotionFeature } from "./types";

gsap.registerPlugin(SplitText);

function bleedFor(element: HTMLElement): number {
  const fontSize = Number.parseFloat(getComputedStyle(element).fontSize);
  return fontSize * motionDistance.riseMaskBleedEm;
}

function rollLetters(element: HTMLElement): void {
  const split = SplitText.create(element, {
    type: "words,chars",
    mask: "chars",
    aria: "auto",
  });
  const bleed = bleedFor(element);
  gsap.set(split.masks, { paddingBlock: bleed, marginBlock: -bleed });
  const [firstMask] = split.masks;
  const travel = firstMask instanceof HTMLElement ? firstMask.offsetHeight : 0;
  // Each letter casts a copy of itself one mask below, which rolls in as the letter rolls out, so the name never disappears.
  gsap.set(split.chars, { textShadow: `0 ${travel}px currentColor` });
  gsap.to(split.chars, {
    y: -travel,
    duration: motionTiming.rise.duration,
    ease: "power3.inOut",
    stagger: { amount: motionTiming.rise.stagger },
    onComplete: () => split.revert(),
  });
}

export const heroRise: MotionFeature = (elements) => {
  elements.forEach(rollLetters);
};
