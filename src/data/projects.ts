import type { Project } from '../types'
import { TECHNOLOGIES, type TechKey } from './technologies'

/**
 * The project catalog shown on the public site.
 *
 * How to add a project: copy the entry below, fill every field, done.
 * Order matters — the first entry is the first card on the site.
 *
 *  name         Short title. Fits on one line of a card.
 *  description  2-4 sentences. The card clamps it; the modal shows it whole.
 *               Say what it does and what problem it solves, not the stack —
 *               the badges already show the stack.
 *  githubUrl    Full repository URL. Required.
 *  demoUrl      Live URL, or null if there is none.
 *  imageUrl     `/projects/<file>.png` for an image in `public/projects/`,
 *               or null to render the placeholder icon.
 *  category     One of: FRONTEND | BACKEND | FULL_STACK | API_REST | MOBILE
 *               (see PROJECT_CATEGORIES in `src/types/index.ts`)
 *  technologies Keys from `technologies.ts`. Order is respected. Keep it to
 *               4-6 so the badge row does not wrap awkwardly.
 */
interface ProjectEntry extends Omit<Project, 'id' | 'technologies'> {
  technologies: TechKey[]
}

const ENTRIES: ProjectEntry[] = [
  {
    name: 'Portfolio Manager',
    description:
      'REST API to manage the project, skill and technology catalog behind this portfolio. JWT authentication, a custom admin panel and Swagger documentation.',
    githubUrl: 'https://github.com/dair7/portfolio-manager',
    demoUrl: null,
    imageUrl: null,
    category: 'FULL_STACK',
    technologies: ['java', 'spring', 'postgresql', 'react', 'typescript'],
  },

  // ⚠️ PLACEHOLDER — the three entries below are invented sample data, kept only
  // to exercise the layout (filters, card grid, modal) until the real catalog is
  // written. Replace or delete them before deploying.
  {
    name: 'TaskFlow API',
    description:
      'REST API for task management in small teams, with boards, labels and assignees. Includes role-based access control and a change history per task.',
    githubUrl: 'https://github.com/dair7/taskflow-api',
    demoUrl: null,
    imageUrl: null,
    category: 'API_REST',
    technologies: ['java', 'spring', 'postgresql', 'docker'],
  },
  {
    name: 'Weather Now',
    description:
      'Weather dashboard that consumes a public API and shows the forecast for the next seven days. Saves favorite cities in the browser and adapts to mobile.',
    githubUrl: 'https://github.com/dair7/weather-now',
    demoUrl: 'https://weather-now-dair.vercel.app',
    imageUrl: null,
    category: 'FRONTEND',
    technologies: ['react', 'typescript', 'tailwind', 'vite'],
  },
  {
    name: 'Simple Inventory',
    description:
      'Inventory system for a small shop: stock in and out, low-stock alerts and monthly reports exportable to CSV.',
    githubUrl: 'https://github.com/dair7/simple-inventory',
    demoUrl: null,
    imageUrl: null,
    category: 'BACKEND',
    technologies: ['java', 'spring', 'postgresql'],
  },
]

// Numeric ids are derived from position so they never have to be maintained by
// hand, and tech keys are resolved into the objects the components expect.
export const PROJECTS: Project[] = ENTRIES.map((entry, index) => ({
  ...entry,
  id: index + 1,
  technologies: entry.technologies.map((key) => TECHNOLOGIES[key]),
}))
