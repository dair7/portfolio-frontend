import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import {
  motionDistance,
  motionTiming,
  revealStart,
  revealStartOpacity,
} from "../../data/motion";
import type { MotionFeature } from "./types";

gsap.registerPlugin(ScrollTrigger);

export const reveal: MotionFeature = (elements) => {
  for (const element of elements) {
    if (ScrollTrigger.isInViewport(element)) continue;
    gsap.from(element, {
      y: motionDistance.revealOffsetPx,
      opacity: revealStartOpacity,
      duration: motionTiming.reveal.duration,
      ease: "power2.out",
      clearProps: "transform,opacity",
      immediateRender: false,
      scrollTrigger: { trigger: element, start: revealStart, once: true },
    });
  }
};
