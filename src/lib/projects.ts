import { getCollection, type CollectionEntry } from "astro:content";

export type Project = CollectionEntry<"projects">;

export async function getPublishedProjects(): Promise<Project[]> {
  const projects = await getCollection("projects", ({ data }) => !data.draft);
  return projects.sort((first, second) => first.data.order - second.data.order);
}

export async function getNextProject(
  slug: string,
): Promise<Project | undefined> {
  const projects = await getPublishedProjects();
  const currentIndex = projects.findIndex((project) => project.id === slug);
  if (currentIndex === -1) return undefined;
  return projects[(currentIndex + 1) % projects.length];
}

export function formatProjectNumber(index: number): string {
  return String(index + 1).padStart(2, "0");
}

export function projectTitleTransitionName(slug: string): string {
  return `project-title-${slug}`;
}
