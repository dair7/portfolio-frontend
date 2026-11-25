const finePointerQuery = "(hover: hover) and (pointer: fine)";
const glassShineSelector = ".glass-shine";

interface ShineTarget {
  card: HTMLElement;
  clientX: number;
  clientY: number;
}

function moveShine({ card, clientX, clientY }: ShineTarget): void {
  const bounds = card.getBoundingClientRect();
  card.style.setProperty("--shine-x", `${clientX - bounds.left}px`);
  card.style.setProperty("--shine-y", `${clientY - bounds.top}px`);
}

export function setupGlassShine(): void {
  const finePointer = window.matchMedia(finePointerQuery);
  let pending: ShineTarget | undefined;

  const paint = (): void => {
    if (pending) moveShine(pending);
    pending = undefined;
  };

  document.addEventListener(
    "pointermove",
    ({ target, clientX, clientY }) => {
      if (!finePointer.matches || !(target instanceof Element)) return;
      const card = target.closest<HTMLElement>(glassShineSelector);
      if (!card) return;
      if (!pending) requestAnimationFrame(paint);
      pending = { card, clientX, clientY };
    },
    { passive: true },
  );
}
