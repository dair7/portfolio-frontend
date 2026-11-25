export type TintoMood = "idle" | "sleepy" | "happy" | "confused";

export const tintoViewBox = { x: 0, y: 0, width: 220, height: 240 } as const;

export const tintoLabels = {
  notFound: "Tinto, a coffee cup mascot, looking confused",
} as const;

export const tintoEyes = [
  { side: "left", centerX: 92 },
  { side: "right", centerX: 128 },
] as const;

export const tintoEyeGeometry = {
  centerY: 138,
  radius: 10,
  pupilRadius: 5,
  lidTop: 127,
  lidHeight: 22,
} as const;

export const tintoSteamPaths = [
  "M88 76 c-9 -10 9 -18 0 -28 c-9 -10 9 -18 0 -28",
  "M110 70 c-9 -10 9 -18 0 -28 c-9 -10 9 -18 0 -28",
  "M132 76 c-9 -10 9 -18 0 -28 c-9 -10 9 -18 0 -28",
] as const;

export const tintoSparkles = [
  { x: 34, y: 90, radius: 4 },
  { x: 196, y: 96, radius: 5 },
  { x: 50, y: 44, radius: 3 },
  { x: 180, y: 40, radius: 4 },
  { x: 24, y: 150, radius: 3 },
  { x: 204, y: 160, radius: 3 },
] as const;
