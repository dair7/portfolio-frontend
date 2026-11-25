export type TintoMood = "idle" | "sleepy" | "happy" | "confused";

export const tintoViewBox = { x: 0, y: -16, width: 220, height: 256 } as const;

export const tintoLabels = {
  notFound: "Tinto, a coffee bean mascot, looking confused",
} as const;

export const tintoEyes = [
  { side: "left", centerX: 90 },
  { side: "right", centerX: 132 },
] as const;

export const tintoEyeGeometry = {
  centerY: 118,
  radius: 12,
  pupilRadius: 6,
  lidTop: 104,
  lidHeight: 28,
} as const;

export const tintoSparkles = [
  { x: 40, y: 80, radius: 4 },
  { x: 182, y: 90, radius: 5 },
  { x: 56, y: 40, radius: 3 },
  { x: 170, y: 36, radius: 4 },
  { x: 30, y: 140, radius: 3 },
  { x: 192, y: 150, radius: 3 },
] as const;
