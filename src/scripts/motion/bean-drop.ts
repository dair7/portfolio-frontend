import { gsap } from "gsap";

import { motionDistance, motionTiming } from "../../data/motion";
import type { MotionFeature } from "./types";

export const beanDrop: MotionFeature = (elements) => {
  for (const bean of elements) {
    const fontSize = Number.parseFloat(getComputedStyle(bean).fontSize);
    gsap
      .timeline({ delay: motionTiming.decode.duration })
      .to(bean, {
        y: -fontSize * motionDistance.beanHopEm,
        duration: motionTiming.beanDrop.hop,
        ease: "power2.out",
      })
      .to(bean, {
        y: 0,
        duration: motionTiming.beanDrop.land,
        ease: "bounce.out",
        clearProps: "transform",
      });
  }
};
