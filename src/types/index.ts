// Matches AuthResponseDTO.java
export interface AuthResponse {
  token: string
  id: number
  username: string
  email: string
  role: string
}

// Matches LoginRequestDTO.java
export interface LoginRequest {
  username: string
  password: string
}

// Matches TechnologyResponseDTO.java
export interface Technology {
  id: number
  name: string
  iconUrl?: string | null
}

// Matches ProjectResponseDTO.java
export interface Project {
  id: number
  name: string
  description: string
  githubUrl: string
  demoUrl: string | null
  imageUrl: string | null
  category: string
  technologies: Technology[]
  createdAt: string
  updatedAt: string
}

// Matches ProjectRequestDTO.java
export interface ProjectRequest {
  name: string
  description: string
  githubUrl: string
  demoUrl?: string
  imageUrl?: string
  category: string
  technologyIds: number[]
}

// Matches SkillCategory.java enum
export const SKILL_CATEGORIES = [
  { value: 'LANGUAGE', label: 'Lenguaje' },
  { value: 'FRAMEWORK', label: 'Framework' },
  { value: 'TOOL', label: 'Herramienta' },
  { value: 'DATABASE', label: 'Base de datos' },
] as const

export type SkillCategoryValue = typeof SKILL_CATEGORIES[number]['value']

// Matches SkillResponseDTO.java
export interface Skill {
  id: number
  name: string
  level: number
  category: SkillCategoryValue
}

// Matches SkillRequestDTO.java
export interface SkillRequest {
  name: string
  level: number
  category: SkillCategoryValue
}

// Matches ProjectCategory.java enum
export const PROJECT_CATEGORIES = [
  { value: 'FRONTEND', label: 'Frontend' },
  { value: 'BACKEND', label: 'Backend' },
  { value: 'FULL_STACK', label: 'Full Stack' },
  { value: 'API_REST', label: 'API REST' },
  { value: 'MOBILE', label: 'Mobile' },
] as const
