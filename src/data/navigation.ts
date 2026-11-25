import { site } from "./site";

interface NavigationLink {
  label: string;
  sectionId: string;
}

export const sectionIds = {
  work: "work",
  openSource: "oss",
  about: "about",
  contact: "contact",
} as const;

export const navigationLinks: NavigationLink[] = [
  { label: "Work", sectionId: sectionIds.work },
  { label: "Open source", sectionId: sectionIds.openSource },
  { label: "About", sectionId: sectionIds.about },
  { label: "Contact", sectionId: sectionIds.contact },
];

export const resumeHref = site.resumeHref;

export const homePath = "/";

export function sectionHref(sectionId: string, currentPath: string): string {
  const hash = `#${sectionId}`;
  return currentPath === homePath ? hash : `${homePath}${hash}`;
}
