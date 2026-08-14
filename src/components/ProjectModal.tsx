import { useEffect } from 'react'
import { createPortal } from 'react-dom'
import type { Project } from '../types'
import { projectCategoryLabel } from '../types'
import TechBadge from './TechBadge'

interface Props {
  project: Project
  onClose: () => void
}

export default function ProjectModal({ project, onClose }: Props) {
  useEffect(() => {
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    function handleKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handleKey)

    return () => {
      document.body.style.overflow = prev
      document.removeEventListener('keydown', handleKey)
    }
  }, [onClose])

  return createPortal(
    <div
      className="fixed inset-0 z-[200] overflow-y-auto bg-black/70 backdrop-blur-sm"
      onClick={onClose}
    >
      <div className="flex min-h-full items-start justify-center p-6 py-12">
        {/* The card pattern at panel scale: raised surface, hairline border,
            12px radius. */}
        <div
          role="dialog"
          aria-modal="true"
          aria-label={project.name}
          className="relative w-full max-w-2xl rounded-xl border border-line bg-raised shadow-2xl"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close */}
          <button
            onClick={onClose}
            aria-label="Close"
            className="absolute top-3 right-3 z-10 rounded-md p-1.5 text-muted transition-colors hover:bg-line hover:text-cream"
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {/* Image well */}
          {project.imageUrl ? (
            <div className="relative overflow-hidden rounded-t-xl bg-bg">
              <img
                src={project.imageUrl}
                alt={project.name}
                className="max-h-80 w-full object-contain"
              />
              <span className="absolute top-3 left-3 rounded-md border border-line bg-bg/80 px-2 py-1 font-terminal text-[10px] tracking-[0.14em] text-amber-dim uppercase backdrop-blur-sm">
                {projectCategoryLabel(project.category)}
              </span>
            </div>
          ) : (
            <div className="relative flex h-32 items-center justify-center overflow-hidden rounded-t-xl bg-bg">
              <svg className="h-12 w-12 text-amber-faint" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
              </svg>
              <span className="absolute top-3 left-3 rounded-md border border-line bg-bg/80 px-2 py-1 font-terminal text-[10px] tracking-[0.14em] text-amber-dim uppercase backdrop-blur-sm">
                {projectCategoryLabel(project.category)}
              </span>
            </div>
          )}

          {/* Content */}
          <div className="space-y-5 p-6">
            <h2 className="pr-8 text-xl font-semibold tracking-[-0.01em] text-cream">
              {project.name}
            </h2>

            {/* Reading text, so it is cream — the card teaser is muted because
                it is a two-line summary, this is the actual copy. */}
            {project.description && (
              <p className="text-[15px] leading-[1.7] text-cream">
                {project.description}
              </p>
            )}

            <div>
              <p className="mb-3 font-terminal text-xs tracking-[0.18em] text-muted uppercase">
                Technologies
              </p>
              <div className="flex flex-wrap gap-2">
                {project.technologies.map((tech) => (
                  <TechBadge key={tech.id} name={tech.name} iconUrl={tech.iconUrl} size="md" />
                ))}
              </div>
            </div>

            {/* One primary (amber, filled) and one secondary (bordered) — the
                same pairing About uses for "Let's talk". */}
            <div className="flex flex-wrap gap-3 pt-1">
              {project.githubUrl && (
                <a
                  href={project.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="flex items-center gap-2 rounded-md border border-line px-4 py-2.5 text-sm font-medium text-cream transition-colors duration-200 hover:border-amber hover:text-amber"
                >
                  <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
                  </svg>
                  View code
                </a>
              )}
              {project.demoUrl && (
                <a
                  href={project.demoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="flex items-center gap-2 rounded-md bg-amber px-4 py-2.5 text-sm font-semibold text-bg transition-colors duration-200 hover:bg-amber-bright"
                >
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                  Live demo
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>,
    document.body
  )
}
