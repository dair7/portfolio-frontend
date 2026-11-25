import { gsap } from "gsap";

import { motionDistance, motionTiming } from "../../data/motion";
import type { TintoMood } from "../../data/tinto";
import { animatedProps, type TintoParts } from "./tinto-parts";

const happyMood: TintoMood = "happy";

export function buildHappy(parts: TintoParts): gsap.core.Timeline {
  const { root, figure, sparkles } = parts;
  const { jump, land, sparkles: burst } = motionTiming.tintoHappy;
  const previousMood = root.dataset.mood;
  root.dataset.mood = happyMood;
  return gsap
    .timeline({
      onComplete: () => {
        root.dataset.mood = previousMood;
        gsap.set([figure, sparkles, ...sparkles.children], {
          clearProps: animatedProps,
        });
      },
    })
    .to(figure, {
      y: -motionDistance.tintoJump,
      duration: jump,
      ease: "power2.out",
    })
    .to(figure, { y: 0, duration: land, ease: "bounce.out" })
    .fromTo(sparkles, { opacity: 1 }, { opacity: 0, duration: burst }, 0)
    .fromTo(
      sparkles.children,
      { scale: 0, transformOrigin: "50% 50%" },
      {
        scale: motionDistance.tintoSparkleScale,
        duration: burst,
        ease: "power2.out",
      },
      0,
    );
}
