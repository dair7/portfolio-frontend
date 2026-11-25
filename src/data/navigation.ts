export interface NavigationLink {
  label: string;
  sectionId: string;
}

export const navigationLinks: NavigationLink[] = [
  { label: "Work", sectionId: "work" },
  { label: "Open source", sectionId: "oss" },
  { label: "About", sectionId: "about" },
  { label: "Contact", sectionId: "contact" },
];

// TODO(dair): add the résumé PDF at public/resume.pdf.
export const resumeHref = "/resume.pdf";

export const homePath = "/";

export function sectionHref(sectionId: string, currentPath: string): string {
  const hash = `#${sectionId}`;
  return currentPath === homePath ? hash : `${homePath}${hash}`;
}
