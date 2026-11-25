import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";

const decisionSchema = z.object({
  title: z.string().min(1),
  body: z.string().min(1),
});

const flowStepSchema = z.object({
  layer: z.string().min(1),
  label: z.string().min(1),
  emphasis: z.boolean().default(false),
});

const projects = defineCollection({
  loader: glob({ pattern: "*.mdx", base: "./src/content/projects" }),
  schema: ({ image }) =>
    z
      .object({
        title: z.string().min(1),
        summary: z.string().min(1),
        role: z.string().min(1),
        year: z.number().int(),
        scope: z.string().min(1),
        stack: z.array(z.string().min(1)).min(1),
        repoUrl: z.url(),
        demoUrl: z.url().optional(),
        cover: image().optional(),
        coverAlt: z.string().min(1).optional(),
        order: z.number().int(),
        status: z.enum(["complete", "in-progress"]),
        draft: z.boolean().default(false),
        problem: z.string().min(1),
        decisions: z.array(decisionSchema).min(2),
        differently: z.array(z.string().min(1)).min(1),
        flow: z.array(flowStepSchema).optional(),
      })
      .refine((project) => !project.cover || project.coverAlt, {
        message: "coverAlt is required when a cover image is set",
        path: ["coverAlt"],
      }),
});

export const collections = { projects };
