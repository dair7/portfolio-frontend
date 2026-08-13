export interface Technology {
  id: number
  name: string
  iconUrl?: string | null
}

export interface Project {
  id: number
  name: string
  description: string
  githubUrl: string
  demoUrl: string | null
  imageUrl: string | null
  category: string
  technologies: Technology[]
}

export const SKILL_CATEGORIES = [
  { value: 'LANGUAGE', label: 'Languages' },
  { value: 'FRAMEWORK', label: 'Frameworks' },
  { value: 'TOOL', label: 'Tools' },
  { value: 'DATABASE', label: 'Databases' },
] as const

export type SkillCategoryValue = typeof SKILL_CATEGORIES[number]['value']

// No `level` field on purpose — see the note in `src/data/skills.ts`.
export interface Skill {
  id: number
  name: string
  category: SkillCategoryValue
}

export const PROJECT_CATEGORIES = [
  { value: 'FRONTEND', label: 'Frontend' },
  { value: 'BACKEND', label: 'Backend' },
  { value: 'FULL_STACK', label: 'Full Stack' },
  { value: 'API_REST', label: 'REST API' },
  { value: 'MOBILE', label: 'Mobile' },
] as const

// Turns a raw category value ('FULL_STACK') into its display label ('Full Stack').
// Falls back to the raw value so an unknown category is visible rather than blank.
export function projectCategoryLabel(value: string): string {
  return PROJECT_CATEGORIES.find((cat) => cat.value === value)?.label ?? value
}
