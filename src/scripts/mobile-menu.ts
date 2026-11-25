// Matches Tailwind's md breakpoint, where the desktop links take over.
const desktopMediaQuery = "(min-width: 48rem)";

interface MenuElements {
  container: HTMLElement;
  button: HTMLButtonElement;
  panel: HTMLElement;
}

function findMenuElements(): MenuElements | null {
  const container = document.querySelector<HTMLElement>("[data-navbar]");
  const button =
    container?.querySelector<HTMLButtonElement>("[data-menu-button]");
  const panelId = button?.getAttribute("aria-controls");
  const panel = panelId ? document.getElementById(panelId) : null;
  if (!container || !button || !panel) return null;
  return { container, button, panel };
}

export function setupMobileMenu(signal: AbortSignal): void {
  const elements = findMenuElements();
  if (!elements) return;
  const { container, button, panel } = elements;

  const isOpen = () => button.getAttribute("aria-expanded") === "true";

  const setOpen = (open: boolean) => {
    button.setAttribute("aria-expanded", String(open));
    panel.hidden = !open;
  };

  const close = ({ restoreFocus }: { restoreFocus: boolean }) => {
    if (!isOpen()) return;
    setOpen(false);
    if (restoreFocus) button.focus();
  };

  button.addEventListener(
    "click",
    () => (isOpen() ? close({ restoreFocus: true }) : setOpen(true)),
    { signal },
  );

  panel.addEventListener(
    "click",
    (event) => {
      if (event.target instanceof Element && event.target.closest("a")) {
        close({ restoreFocus: false });
      }
    },
    { signal },
  );

  document.addEventListener(
    "keydown",
    (event) => {
      if (event.key === "Escape") close({ restoreFocus: true });
    },
    { signal },
  );

  document.addEventListener(
    "pointerdown",
    (event) => {
      if (event.target instanceof Node && !container.contains(event.target)) {
        close({ restoreFocus: false });
      }
    },
    { signal },
  );

  matchMedia(desktopMediaQuery).addEventListener(
    "change",
    (event) => {
      if (event.matches) close({ restoreFocus: false });
    },
    { signal },
  );
}
