import { useEffect } from 'react'
import { createPortal } from 'react-dom'
import type { Project } from '../types'
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
      <div className="min-h-full flex items-start justify-center p-6 py-12">
      <div
        className="relative w-full max-w-2xl bg-gray-900 border border-gray-800 rounded-2xl shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 z-10 p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-gray-700 transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Image */}
        {project.imageUrl ? (
          <div className="relative bg-gray-800 rounded-t-2xl overflow-hidden">
            <img
              src={project.imageUrl}
              alt={project.name}
              className="w-full object-contain max-h-80"
            />
            <span className="absolute top-3 left-3 text-xs bg-gray-950/80 text-violet-400 border border-violet-500/30 px-2.5 py-1 rounded-full backdrop-blur-sm">
              {project.category}
            </span>
          </div>
        ) : (
          <div className="relative h-32 bg-gray-800 rounded-t-2xl overflow-hidden flex items-center justify-center">
            <svg className="w-12 h-12 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
            </svg>
            <span className="absolute top-3 left-3 text-xs bg-gray-950/80 text-violet-400 border border-violet-500/30 px-2.5 py-1 rounded-full backdrop-blur-sm">
              {project.category}
            </span>
          </div>
        )}

        {/* Content */}
        <div className="p-6 space-y-4">
          <h2 className="text-xl font-bold text-white pr-6">{project.name}</h2>

          {project.description && (
            <p className="text-gray-400 text-sm leading-relaxed">{project.description}</p>
          )}

          <div>
            <p className="text-xs text-gray-500 uppercase tracking-widest font-medium mb-2">Tecnologías</p>
            <div className="flex flex-wrap gap-2">
              {project.technologies.map((tech) => (
                <TechBadge key={tech.id} name={tech.name} iconUrl={tech.iconUrl} size="md" />
              ))}
            </div>
          </div>

          <div className="flex gap-3 pt-1">
            {project.githubUrl && (
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="flex items-center gap-2 bg-gray-800 hover:bg-gray-700 border border-gray-700 text-white text-sm font-medium px-4 py-2.5 rounded-lg transition-colors"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
                </svg>
                Ver código
              </a>
            )}
            {project.demoUrl && (
              <a
                href={project.demoUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="flex items-center gap-2 bg-violet-600 hover:bg-violet-500 text-white text-sm font-medium px-4 py-2.5 rounded-lg transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
                Ver demo
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
