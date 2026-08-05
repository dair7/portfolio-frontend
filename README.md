# portfolio-frontend

Personal portfolio site with a private admin panel to manage its content. Built with React 19,
TypeScript and Vite, styled with Tailwind CSS 4.

The public page is a single scrolling landing (hero, about, projects, skills, contact). The admin
panel behind `/admin` is a JWT-protected CRUD for the projects, technologies and skills shown on
that page.

This is the frontend only. It talks to a Spring Boot + PostgreSQL API that lives in a separate
repository: [dev-portfolio-manager](https://github.com/dair7/dev-portfolio-manager).

## Requirements

- Node.js 20.19+ (or 22.12+) — required by Vite 8
- [pnpm](https://pnpm.io/) 10.28.2 — pinned in `package.json` via `packageManager`
- The backend API running and reachable

## Getting started

```bash
pnpm install
cp .env.example .env    # then edit VITE_API_URL if your API is elsewhere
pnpm dev
```

The dev server starts on http://localhost:5173.

## Environment variables

| Variable | Description | Example |
|---|---|---|
| `VITE_API_URL` | Base URL of the backend API | `http://localhost:8080/api` |

Vite only exposes variables prefixed with `VITE_`, and it inlines them into the bundle at build
time — never put a secret in one.

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
├── api/         axios instance — attaches the JWT, logs out on 401
├── components/  Navbar, Footer, ProjectCard, ProjectModal, TechBadge
├── context/     AuthContext — token persistence, login/logout
├── hooks/       useInView — scroll-reveal animations
├── layouts/     MainLayout (public), AdminLayout (panel)
├── pages/       Home + pages/admin/ (Login, Dashboard, ProjectForm, Technologies, Skills)
├── router/      AppRouter and PrivateRoute guard
├── sections/    Hero, About, Projects, Skills, Contact
└── types/       Shared domain types (Project, Technology, Skill, …)
```

## Routes

| Route | Access | View |
|---|---|---|
| `/` | Public | Landing page |
| `/admin/login` | Public | Admin login |
| `/admin` | Protected | Dashboard |
| `/admin/projects/new` | Protected | Create a project |
| `/admin/projects/:id` | Protected | Edit a project |
| `/admin/technologies` | Protected | Manage technologies |
| `/admin/skills` | Protected | Manage skills |

Anything else redirects to `/`.

## Authentication

`AuthContext` holds the JWT and persists it, so a reload keeps the session. The axios instance in
`src/api/axios.ts` adds `Authorization: Bearer <token>` to every request and clears the session on
a `401`, sending the user back to the login page. `PrivateRoute` blocks the admin routes when there
is no token.

## Contact form

The contact section sends messages through [EmailJS](https://www.emailjs.com/). The credentials in
`src/sections/Contact.tsx` are placeholders — replace `SERVICE_ID`, `TEMPLATE_ID` and `PUBLIC_KEY`
with your own EmailJS values for the form to work.
