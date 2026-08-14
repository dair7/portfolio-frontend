import { useEffect, useRef, useState } from 'react'
import type { Project } from '../types'
import { PROJECT_CATEGORIES } from '../types'
import { PROJECTS } from '../data/projects'
import ProjectCard from '../components/ProjectCard'
import ProjectModal from '../components/ProjectModal'
import { useSectionReveal } from '../hooks/useSectionReveal'

const PAGE_SIZE = 6

// Only the categories that actually have projects get a filter button.
// Computed once at module level — the catalog is static.
const AVAILABLE_CATEGORIES = PROJECT_CATEGORIES.filter((cat) =>
  PROJECTS.some((p) => p.category === cat.value)
)

// One rule for both filter rows, so "All" and a category cannot drift apart.
// The active state is a tinted amber outline rather than a filled pill: amber
// is the accent of the page system, not a surface color.
function filterClass(active: boolean) {
  return `rounded-md border px-4 py-1.5 text-sm transition-colors duration-200 ${
    active
      ? 'border-amber/60 bg-amber/10 text-amber'
      : 'border-line text-muted hover:border-amber/40 hover:text-cream'
  }`
}

export default function Projects() {
  const [activeFilter, setActiveFilter] = useState<string | null>(null)
  const [page, setPage] = useState(0)
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)
  const ref = useSectionReveal<HTMLElement>()

  const prevPage = useRef(0)

  useEffect(() => {
    if (page === prevPage.current) return
    prevPage.current = page
    document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }, [page])

  function handleFilter(value: string | null) {
    setActiveFilter(value)
    setPage(0)
  }

  function handlePage(newPage: number) {
    setPage(newPage)
  }

  const filtered =
    activeFilter === null
      ? PROJECTS
      : PROJECTS.filter((p) => p.category === activeFilter)

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE)
  const paginated = filtered.slice(page * PAGE_SIZE, page * PAGE_SIZE + PAGE_SIZE)

  return (
    /* No background of its own: it inherits the page. */
    <section ref={ref} id="projects" className="py-28 md:py-36">
      <div className="mx-auto max-w-6xl px-6">
        {/* Header */}
        <div className="mb-10">
          <p className="reveal-item font-terminal text-xs tracking-[0.18em] text-amber uppercase">
            Portfolio
          </p>
          <h2 className="reveal-item mt-3 text-[clamp(30px,4vw,44px)] leading-tight font-semibold tracking-[-0.02em] text-cream">
            Featured projects
          </h2>
        </div>

        {/* Filters. One reveal item, not one per button — a row of chips
            staggering in one by one reads as a loading state. */}
        {AVAILABLE_CATEGORIES.length > 0 && (
          <div className="reveal-item mb-12 flex flex-wrap gap-2">
            <button onClick={() => handleFilter(null)} className={filterClass(activeFilter === null)}>
              All
            </button>
            {AVAILABLE_CATEGORIES.map((cat) => (
              <button
                key={cat.value}
                onClick={() => handleFilter(cat.value)}
                className={filterClass(activeFilter === cat.value)}
              >
                {cat.label}
              </button>
            ))}
          </div>
        )}

        {/* Empty global */}
        {PROJECTS.length === 0 && (
          <p className="reveal-item py-16 text-center text-muted">No projects published yet.</p>
        )}

        {/* Empty filter */}
        {PROJECTS.length > 0 && filtered.length === 0 && (
          <p className="py-16 text-center text-muted">No projects in this category.</p>
        )}

        {/* Grid */}
        {paginated.length > 0 && (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {paginated.map((project) => (
              <ProjectCard
                key={project.id}
                project={project}
                className="reveal-item"
                onClick={() => setSelectedProject(project)}
              />
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-12 flex items-center justify-center gap-3">
            <button
              onClick={() => handlePage(page - 1)}
              disabled={page === 0}
              className="flex items-center gap-2 rounded-md border border-line px-4 py-2 text-sm text-muted transition-colors duration-200 hover:border-amber/40 hover:text-cream disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:border-line disabled:hover:text-muted"
            >
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Previous
            </button>

            <div className="flex items-center gap-1">
              {[...Array(totalPages)].map((_, i) => (
                <button
                  key={i}
                  onClick={() => handlePage(i)}
                  aria-current={page === i ? 'page' : undefined}
                  className={`h-8 w-8 rounded-md text-sm transition-colors duration-200 ${
                    page === i
                      ? 'bg-amber/10 text-amber'
                      : 'text-muted hover:bg-raised hover:text-cream'
                  }`}
                >
                  {i + 1}
                </button>
              ))}
            </div>

            <button
              onClick={() => handlePage(page + 1)}
              disabled={page === totalPages - 1}
              className="flex items-center gap-2 rounded-md border border-line px-4 py-2 text-sm text-muted transition-colors duration-200 hover:border-amber/40 hover:text-cream disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:border-line disabled:hover:text-muted"
            >
              Next
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        )}
      </div>

      {selectedProject && (
        <ProjectModal
          project={selectedProject}
          onClose={() => setSelectedProject(null)}
        />
      )}
    </section>
  )
}
