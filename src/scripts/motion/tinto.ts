import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import {
  copyEmailCopiedEvent,
  motionDistance,
  motionTiming,
} from "../../data/motion";
import { tintoEyeGeometry } from "../../data/tinto";
import { followPointer } from "./tinto-gaze";
import { buildHappy } from "./tinto-happy";
import { animatedProps, findParts, type TintoParts } from "./tinto-parts";
import type { MotionFeature, MotionScope } from "./types";

gsap.registerPlugin(ScrollTrigger);

function isShown(element: Element): boolean {
  return getComputedStyle(element).opacity !== "0";
}

const steamProps = "strokeDasharray,strokeDashoffset";

function riseSteam(timeline: gsap.core.Timeline, steam: Element[]): void {
  const { dash, gap } = motionDistance.tintoSteam;
  timeline.fromTo(
    steam,
    { strokeDasharray: `${dash} ${gap}`, strokeDashoffset: 0 },
    {
      strokeDashoffset: -(dash + gap),
      duration: motionTiming.tintoIdle.steam,
      ease: "none",
      repeat: motionTiming.tintoIdle.steamLegs - 1,
      onComplete: () => gsap.set(steam, { clearProps: steamProps }),
    },
    0,
  );
}

function buildIdle({
  figure,
  blinks,
  zzz,
  steam,
}: TintoParts): gsap.core.Timeline {
  const {
    float,
    floatLegs,
    blinkAt,
    blink,
    zzz: zzzLeg,
    zzzLegs,
  } = motionTiming.tintoIdle;
  const timeline = gsap.timeline({
    onComplete: () => gsap.set([figure, zzz], { clearProps: animatedProps }),
  });
  timeline.to(
    figure,
    {
      y: -motionDistance.tintoFloat,
      duration: float,
      ease: "sine.inOut",
      yoyo: true,
      repeat: floatLegs - 1,
    },
    0,
  );
  for (const at of blinkAt) {
    timeline.to(
      blinks,
      {
        attr: { height: tintoEyeGeometry.lidHeight },
        duration: blink,
        yoyo: true,
        repeat: 1,
      },
      at,
    );
  }
  riseSteam(timeline, steam);
  if (isShown(zzz)) {
    timeline.to(
      zzz,
      {
        y: -motionDistance.tintoZzzRise,
        duration: zzzLeg,
        ease: "sine.inOut",
        yoyo: true,
        repeat: zzzLegs - 1,
      },
      0,
    );
  }
  return timeline;
}

function setupTinto(parts: TintoParts, { context, signal }: MotionScope): void {
  let current: gsap.core.Timeline | undefined;
  const run = (build: (parts: TintoParts) => gsap.core.Timeline): void => {
    current?.progress(1);
    current = context.add(() => build(parts));
  };
  const playIdle = (): void => {
    if (!current?.isActive()) run(buildIdle);
  };
  const stop = (): void => {
    current?.progress(1);
  };
  const visibility = ScrollTrigger.create({
    trigger: parts.root,
    start: "top bottom",
    end: "bottom top",
    onEnter: playIdle,
    onEnterBack: playIdle,
    onLeave: stop,
    onLeaveBack: stop,
  });
  parts.root.addEventListener("pointerenter", playIdle, { signal });
  document.addEventListener(copyEmailCopiedEvent, () => run(buildHappy), {
    signal,
  });
  followPointer(parts.root, () => visibility.isActive, signal);
}

export const tinto: MotionFeature = (elements, scope) => {
  for (const element of elements) {
    const parts = findParts(element);
    if (parts) setupTinto(parts, scope);
  }
};
