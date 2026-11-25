import type { PendingNote } from "../lib/pending";
import type { ProjectStatus } from "../lib/projects";

export interface MoreProject {
  title: string;
  summary: string;
  stack: string[];
  status: ProjectStatus | PendingNote;
  repoUrl: string;
  demoUrl?: string;
}

export const moreProjects: MoreProject[] = [
  {
    title: "CitaSegura",
    summary:
      "An appointment scheduler built security-first: object-level access checks, server-side validation and parameterized SQL with no ORM.",
    stack: ["Next.js", "TypeScript", "PostgreSQL", "node-postgres", "Zod"],
    status: "in-progress",
    repoUrl: "https://github.com/dair7/citasegura",
  },
  {
    title: "Hotel CostaCode",
    summary:
      "The front end of a hotel booking app: room search and booking, guest profiles and an admin area for rooms, bookings and users.",
    stack: ["React", "React Router", "Bootstrap", "Axios"],
    status: "TODO(dair): status of Hotel CostaCode.",
    repoUrl: "https://github.com/dair7/Hotel-Costacode-react",
  },
];
