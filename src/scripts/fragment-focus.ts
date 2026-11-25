function focusFragmentTarget(hash: string): void {
  if (hash.length <= 1) return;
  const target = document.getElementById(decodeURIComponent(hash.slice(1)));
  if (target?.hasAttribute("tabindex")) target.focus({ preventScroll: true });
}

function isSamePageFragmentLink(link: HTMLAnchorElement): boolean {
  return (
    link.hash.length > 1 &&
    link.origin === location.origin &&
    link.pathname === location.pathname
  );
}

export function setupFragmentFocus(): void {
  document.addEventListener("click", (event) => {
    if (!(event.target instanceof Element)) return;
    const link = event.target.closest<HTMLAnchorElement>("a[href*='#']");
    if (link && isSamePageFragmentLink(link)) {
      requestAnimationFrame(() => focusFragmentTarget(link.hash));
    }
  });

  document.addEventListener("astro:page-load", () =>
    focusFragmentTarget(location.hash),
  );
}
