export interface MotionScope {
  context: gsap.Context;
  signal: AbortSignal;
}

export type MotionCleanup = () => void;

export type MotionFeature = (
  elements: HTMLElement[],
  scope: MotionScope,
) => MotionCleanup | undefined;
