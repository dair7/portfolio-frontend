# portfolio-frontend

Personal portfolio site. A single scrolling landing page — hero, about, projects, skills, contact —
built with React 19, TypeScript and Vite, styled with Tailwind CSS 4.

**Fully static.** The content lives in `src/data/` as typed TypeScript modules, so the site makes no
network requests, has no backend to wake up, and renders on the first frame. Editing the portfolio
means editing a file and redeploying.

> The Spring Boot + PostgreSQL API this project used to consume is a separate portfolio piece and
> lives in its own repository: [dev-portfolio-manager](https://github.com/dair7/dev-portfolio-manager).
> The public site no longer depends on it at runtime.

## Requirements

- Node.js 20.19+ (or 22.12+) — required by Vite 8
- [pnpm](https://pnpm.io/) 10.28.2 — pinned in `package.json` via `packageManager`

## Getting started

```bash
pnpm install
pnpm dev
```

The dev server starts on http://localhost:5173. There is nothing else to configure — no environment
variables, no database, no API.

## Scripts

| Command | What it does |
|---|---|
| `pnpm dev` | Start the dev server with HMR |
| `pnpm build` | Type-check (`tsc -b`) and build to `dist/` |
| `pnpm preview` | Serve the production build locally |
| `pnpm lint` | Run ESLint over the project |

## Project structure

```
src/
├── components/  Navbar, Footer, ProjectCard, ProjectModal, TechBadge
├── data/        The content: projects, skills, technologies
├── hooks/       useInView — scroll-reveal animations
├── pages/       Home — composes the sections
├── sections/    Hero, About, Projects, Skills, Contact
└── types/       Shared domain types (Project, Technology, Skill, …)
```

## Editing the content

Everything shown on the site comes from three files. They are TypeScript, not JSON, on purpose: a
misspelled category or technology key is a compile error instead of a section that silently renders
empty.

| File | Holds |
|---|---|
| `src/data/projects.ts` | The project catalog. Array order is the order on the page |
| `src/data/skills.ts` | Skills and their level, grouped by category |
| `src/data/technologies.ts` | The technology catalog projects reference by key |

Each file documents its own fields at the top. Project images go in `public/projects/` and are
referenced as `/projects/<file>.png`.

## Contact form

The contact section sends messages through [EmailJS](https://www.emailjs.com/), which is what keeps
the site backend-free. The credentials in `src/sections/Contact.tsx` are still placeholders —
replace `SERVICE_ID`, `TEMPLATE_ID` and `PUBLIC_KEY` with real EmailJS values for the form to work.
