export const motionNames = {
  rise: "rise",
  decode: "decode",
  typing: "typing",
  wave: "wave",
  flip: "flip",
  reveal: "reveal",
  requestFlow: "request-flow",
  tinto: "tinto",
  beanDrop: "bean-drop",
} as const;

export type MotionName = (typeof motionNames)[keyof typeof motionNames];

export const motionSessions = {
  hero: "hero",
  navLogo: "nav-logo",
} as const;

export const scrambleCharacters = "{}<>/;=_ABCDEFGHIJKLMNOPQRSTUVWXYZ";

export const scrollStart = "top 85%";

export const revealStart = "top bottom";

export const flowViewport = { start: "top 80%", end: "bottom 20%" } as const;

export const motionTiming = {
  rise: { duration: 0.5, stagger: 0.2 },
  decode: { duration: 0.8, revealDelay: 0.25 },
  typing: { sweep: 0.55, fade: 0.2 },
  wave: { half: 0.1, stagger: 0.1 },
  flip: { duration: 0.5, stagger: 0.3 },
  reveal: { duration: 0.5 },
  requestFlow: { hop: 0.25, hold: 0.3, status: 0.4 },
  beanDrop: { hop: 0.25, land: 0.5 },
  tintoIdle: {
    float: 1.2,
    floatLegs: 4,
    blinkAt: [1.4, 3.6],
    blink: 0.08,
    zzz: 1.1,
    zzzLegs: 4,
  },
  tintoHappy: { jump: 0.25, land: 0.45, sparkles: 0.6 },
  tintoGaze: 0.3,
  themeTransitionMs: 300,
} as const;

export const motionDistance = {
  riseMaskBleedEm: 0.2,
  waveLiftPx: 4,
  revealOffsetPx: 16,
  flipPerspectivePx: 400,
  beanHopEm: 0.45,
  tintoFloat: 6,
  tintoZzzRise: 8,
  tintoJump: 24,
  tintoGazeReach: 5,
  tintoSparkleScale: 1.6,
} as const;

export const copyEmailCopiedEvent = "copy-email:copied";

export const revealStartOpacity = 0.5;
