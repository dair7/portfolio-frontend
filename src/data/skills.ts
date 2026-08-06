import type { Skill } from '../types'

/**
 * The skills shown in the "Mi stack" section.
 *
 * The section groups them by category and renders a progress bar per skill,
 * following the order of SKILL_CATEGORIES in `src/types/index.ts`. Empty
 * categories are hidden automatically, so only fill the ones that apply.
 *
 *  name      As it should read on screen ('Spring Boot', not 'springboot').
 *  level     0-100. It drives the width of the bar. Be honest: an all-90s
 *            list reads as noise and says nothing to whoever is reading it.
 *  category  LANGUAGE | FRAMEWORK | TOOL | DATABASE
 */
const ENTRIES: Omit<Skill, 'id'>[] = [
  { name: 'Java', level: 80, category: 'LANGUAGE' },
  { name: 'TypeScript', level: 70, category: 'LANGUAGE' },
  { name: 'Spring Boot', level: 75, category: 'FRAMEWORK' },
  { name: 'React', level: 70, category: 'FRAMEWORK' },
  { name: 'PostgreSQL', level: 65, category: 'DATABASE' },
  { name: 'Git', level: 70, category: 'TOOL' },
]

// Ids are derived from position — only used as React keys.
export const SKILLS: Skill[] = ENTRIES.map((entry, index) => ({
  ...entry,
  id: index + 1,
}))
