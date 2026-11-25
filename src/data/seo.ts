import { site } from "./site";

export interface SocialImage {
  path: string;
  alt: string;
}

export interface OgCardContent {
  heading: string;
  summary: string;
}

export const ogImageSize = { width: 1200, height: 630 } as const;

export const sitemapPath = "/sitemap-index.xml";

export const appleTouchIconPath = "/apple-touch-icon.png";

export const homeOgCard: OgCardContent = {
  heading: site.name,
  summary: site.role,
};

function describeOgCard({ heading, summary }: OgCardContent): string {
  return `${heading} — ${summary}`;
}

export const homeSocialImage: SocialImage = {
  path: "/og/home.png",
  alt: describeOgCard(homeOgCard),
};

export function projectOgCard(project: {
  title: string;
  summary: string;
}): OgCardContent {
  return { heading: project.title, summary: project.summary };
}

export function projectSocialImage(
  slug: string,
  card: OgCardContent,
): SocialImage {
  return { path: `/og/projects/${slug}.png`, alt: describeOgCard(card) };
}
