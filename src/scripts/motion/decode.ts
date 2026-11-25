import { gsap } from "gsap";
import { ScrambleTextPlugin } from "gsap/ScrambleTextPlugin";

import { motionTiming, scrambleCharacters } from "../../data/motion";
import type { MotionCleanup, MotionFeature } from "./types";

gsap.registerPlugin(ScrambleTextPlugin);

function decodeText(element: HTMLElement): MotionCleanup {
  const markup = element.innerHTML;
  const restore = (): void => {
    element.innerHTML = markup;
    gsap.set(element, { clearProps: "display,width,whiteSpace" });
  };
  gsap.set(element, {
    display: "inline-block",
    width: element.getBoundingClientRect().width,
    whiteSpace: "nowrap",
  });
  gsap.to(element, {
    duration: motionTiming.decode.duration,
    ease: "none",
    scrambleText: {
      text: element.textContent?.trim() ?? "",
      chars: scrambleCharacters,
      oldClass: element.dataset.motionAccent,
      revealDelay: motionTiming.decode.revealDelay,
    },
    onComplete: restore,
  });
  return restore;
}

export const decode: MotionFeature = (elements) => {
  const restorers = elements.map(decodeText);
  return () => restorers.forEach((restore) => restore());
};
