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

const repositorySchema = z.object({
  label: z.string().min(1),
  url: z.url(),
});

const projects = defineCollection({
  loader: glob({ pattern: "*.mdx", base: "./src/content/projects" }),
  schema: ({ image }) => {
    const screenSchema = z.object({
      image: image(),
      alt: z.string().min(1),
    });
    const coverSchema = z.discriminatedUnion("kind", [
      screenSchema.extend({ kind: z.literal("screenshot") }),
      z.object({
        kind: z.literal("phone"),
        label: z.string().min(1),
        screen: screenSchema.optional(),
      }),
      z.object({ kind: z.literal("diagram") }),
    ]);
    return z
      .object({
        title: z.string().min(1),
        summary: z.string().min(1),
        role: z.string().min(1),
        year: z.number().int(),
        scope: z.string().min(1),
        stack: z.array(z.string().min(1)).min(1),
        repositories: z.array(repositorySchema).min(1),
        demoUrl: z.url().optional(),
        cover: coverSchema,
        order: z.number().int(),
        status: z.enum(["complete", "in-progress"]),
        draft: z.boolean().default(false),
        problem: z.string().min(1),
        decisions: z.array(decisionSchema).min(2),
        differently: z.array(z.string().min(1)).min(1),
        flow: z.array(flowStepSchema).optional(),
      })
      .refine((project) => project.cover.kind !== "diagram" || project.flow, {
        message: "A diagram cover needs the flow steps",
        path: ["flow"],
      });
  },
});

export const collections = { projects };
