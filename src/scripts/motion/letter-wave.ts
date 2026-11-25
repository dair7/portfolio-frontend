import { gsap } from "gsap";
import { SplitText } from "gsap/SplitText";

import { motionDistance, motionTiming } from "../../data/motion";
import type { MotionFeature, MotionScope } from "./types";

gsap.registerPlugin(SplitText);

function setupWave(
  element: HTMLElement,
  { context, signal }: MotionScope,
): void {
  const { chars } = SplitText.create(element, { type: "chars", aria: "auto" });
  let wave: gsap.core.Tween | undefined;
  const play = (): void => {
    if (wave?.isActive()) return;
    wave = context.add(() =>
      gsap.to(chars, {
        y: -motionDistance.waveLiftPx,
        duration: motionTiming.wave.half,
        ease: "sine.out",
        stagger: { amount: motionTiming.wave.stagger, yoyo: true, repeat: 1 },
      }),
    );
  };
  const playOnKeyboardFocus = (): void => {
    if (element.matches(":focus-visible")) play();
  };
  element.addEventListener("pointerenter", play, { signal });
  element.addEventListener("focus", playOnKeyboardFocus, { signal });
}

export const letterWave: MotionFeature = (elements, scope) => {
  for (const element of elements) setupWave(element, scope);
};
