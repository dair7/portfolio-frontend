import type { APIRoute, GetStaticPaths, InferGetStaticPropsType } from "astro";

import { projectOgCard } from "../../../data/seo";
import { renderOgImage } from "../../../lib/og-image";
import { getPublishedProjects } from "../../../lib/projects";

export const getStaticPaths = (async () => {
  const projects = await getPublishedProjects();
  return projects.map((project) => ({
    params: { slug: project.id },
    props: { card: projectOgCard(project.data) },
  }));
}) satisfies GetStaticPaths;

type Props = InferGetStaticPropsType<typeof getStaticPaths>;

export const GET: APIRoute<Props> = ({ props }) => renderOgImage(props.card);
