// A thin band across the middle of the viewport: the section crossing it is the one being read.
const readingBand = "-45% 0px -50% 0px";

function markActiveLink(
  links: HTMLAnchorElement[],
  sectionId: string | null,
): void {
  for (const link of links) {
    if (link.dataset.navLink === sectionId) {
      link.setAttribute("aria-current", "true");
    } else {
      link.removeAttribute("aria-current");
    }
  }
}

export function observeActiveSection(signal: AbortSignal): void {
  const links = [
    ...document.querySelectorAll<HTMLAnchorElement>("[data-nav-link]"),
  ];
  const sectionIds = new Set(links.map((link) => link.dataset.navLink));
  const sections = [...sectionIds]
    .map((id) => (id ? document.getElementById(id) : null))
    .filter((section): section is HTMLElement => section !== null);
  if (sections.length === 0) return;

  let activeId: string | null = null;

  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          activeId = entry.target.id;
        } else if (activeId === entry.target.id) {
          activeId = null;
        }
      }
      markActiveLink(links, activeId);
    },
    { rootMargin: readingBand },
  );

  sections.forEach((section) => observer.observe(section));
  signal.addEventListener("abort", () => observer.disconnect());
}
