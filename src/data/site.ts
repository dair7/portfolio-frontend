interface StackGroups {
  everyDay: string[];
  workedWith: string[];
  learning: string[];
}

interface Availability {
  isAvailable: boolean;
  label: string;
  workMode: string;
  utcOffset: string;
}

export const site = {
  name: "Dair González",
  locale: "en",
  role: "Full stack developer",
  description:
    "Portfolio of Dair González, full stack developer working with Java, Spring Boot, React and TypeScript.",
  tagline: "If it runs between the database and the screen, I can build it.",
  location: "Colombia",
  countryCode: "CO",
  timezone: "America/Bogota",
  city: "Bogotá",
  // TODO(dair): review this provisional bio.
  bio: "I'm a full stack developer from Colombia. Most of my time goes into Java and Spring Boot: designing the API, the data model and the security around it. On the front end I work with React and TypeScript so the interface does justice to what the backend can do.",
  availability: {
    isAvailable: true,
    label: "Available for work",
    workMode: "Remote",
    utcOffset: "UTC-5",
  } satisfies Availability,
  email: "TODO(dair): contact email",
  linkedinUrl: "TODO(dair): LinkedIn profile URL",
  githubUrl: "https://github.com/dair7",
  // TODO(dair): add the résumé PDF at public/resume.pdf.
  resumeHref: "/resume.pdf",
  stack: {
    everyDay: [
      "Java",
      "Spring Boot",
      "JPA/Hibernate",
      "PostgreSQL",
      "React",
      "TypeScript",
      "Git",
    ],
    workedWith: [
      "JavaScript",
      "Spring Security",
      "JWT",
      "MySQL",
      "Flutter",
      "Maven",
      "Postman",
      "Cloudflare R2",
    ],
    // TODO(dair): what you are learning now.
    learning: [],
  } satisfies StackGroups,
} as const;
