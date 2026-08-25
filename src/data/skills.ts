import type { Skill, SkillCategoryValue } from '../types'

/**
 * The skills shown in the "My stack" section.
 *
 * The section groups them by category and prints one row per group, following
 * the order of SKILL_CATEGORIES in `src/types/index.ts`. Empty categories are
 * hidden automatically, so only fill the ones that apply.
 *
 *  name      As it should read on screen ('Spring Boot', not 'springboot').
 *  category  LANGUAGE | FRAMEWORK | TOOL | DATABASE
 *
 * There is deliberately no `level` field, and none should be added back. A
 * self-assigned 'Java 80%' is not a measurement: nobody can verify it, it costs
 * nothing to inflate, and it cannot be defended when someone asks about it in
 * an interview. The same applies to stars, dots and advanced/intermediate
 * labels — they are the same claim wearing a different shape. The section shows
 * what is actually true, which is the list of names.
 */
const ENTRIES: Omit<Skill, 'id'>[] = [
  { name: 'Java', category: 'LANGUAGE' },
  { name: 'TypeScript', category: 'LANGUAGE' },
  { name: 'JavaScript', category: 'LANGUAGE' },
  { name: 'Spring Boot', category: 'FRAMEWORK' },
  { name: 'React', category: 'FRAMEWORK' },
  { name: 'Flutter', category: 'FRAMEWORK' },
  { name: 'Git', category: 'TOOL' },
  { name: 'Postman', category: 'TOOL' },
  { name: 'Maven', category: 'TOOL' },
  { name: 'Cloudflare R2', category: 'TOOL' },
  { name: 'PostgreSQL', category: 'DATABASE' },
  { name: 'MySQL', category: 'DATABASE' },
]

/**
 * One short line of context per category, printed under the tags of its row.
 *
 * Written by Dair, in his own words — this is the one place on the page that
 * speaks in first person about the stack, so leave the wording alone.
 *
 * These are the honest replacement for the progress bars, so they must not read
 * as a rating in disguise. Write something you could say out loud in an
 * interview and then keep talking about — 'what I reach for first', 'what I'm
 * learning right now', 'where most of my backend time goes'. Never a grade.
 *
 * An empty string prints no line at all, which is the correct state for an
 * unwritten note — placeholder text does not belong here, since whatever is in
 * this map renders verbatim on the live page.
 */
export const CATEGORY_NOTES: Record<SkillCategoryValue, string> = {
  LANGUAGE:
    'Java es donde más escribo; TypeScript cuando el proyecto tiene frontend.',
  FRAMEWORK:
    'Spring Boot para las APIs REST, React para web y Flutter para móvil — ambos consumiendo el mismo backend.',
  TOOL: 'Postman para probar mis endpoints mientras los construyo, Maven para el build.',
  DATABASE:
    'PostgreSQL por defecto, casi siempre a través de JPA/Hibernate desde Spring.',
}

// Ids are derived from position — only used as React keys.
export const SKILLS: Skill[] = ENTRIES.map((entry, index) => ({
  ...entry,
  id: index + 1,
}))
