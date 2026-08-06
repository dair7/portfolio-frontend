import type { Technology } from '../types'

/**
 * Central catalog of technologies used across projects.
 *
 * Projects reference entries by key (see `projects.ts`), so a misspelled key is
 * a compile error instead of a badge that silently disappears from the site.
 *
 * Badges are text-only — no icons, no external CDN. Add or remove entries
 * freely; nothing else needs to change.
 */
const CATALOG = {
  react: 'React',
  typescript: 'TypeScript',
  tailwind: 'Tailwind CSS',
  vite: 'Vite',
  java: 'Java',
  spring: 'Spring Boot',
  postgresql: 'PostgreSQL',
  docker: 'Docker',
  git: 'Git',
} as const satisfies Record<string, string>

export type TechKey = keyof typeof CATALOG

// Numeric ids are derived from declaration order so they never have to be
// maintained by hand. They are only used as React keys.
export const TECHNOLOGIES = Object.fromEntries(
  Object.entries(CATALOG).map(([key, name], index) => [key, { id: index + 1, name, iconUrl: null }])
) as Record<TechKey, Technology>
