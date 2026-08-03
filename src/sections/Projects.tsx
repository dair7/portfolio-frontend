import { useEffect, useRef, useState } from 'react'
import api from '../api/axios'
import type { Project } from '../types'
import { PROJECT_CATEGORIES } from '../types'
import ProjectCard from '../components/ProjectCard'
import ProjectModal from '../components/ProjectModal'
import { useInView } from '../hooks/useInView'

const PAGE_SIZE = 6

export default function Projects() {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [activeFilter, setActiveFilter] = useState<string | null>(null)
  const [page, setPage] = useState(0)
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)
  const { ref, inView } = useInView()

  useEffect(() => {
    api
      .get<Project[]>('/projects')
      .then((res) => setProjects(res.data))
      .catch(() => setError(true))
      .finally(() => setLoading(false))
  }, [])

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

  const availableCategories = PROJECT_CATEGORIES.filter((cat) =>
    projects.some((p) => p.category === cat.value)
  )

  const filtered =
    activeFilter === null
      ? projects
      : projects.filter((p) => p.category === activeFilter)

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE)
  const paginated = filtered.slice(page * PAGE_SIZE, page * PAGE_SIZE + PAGE_SIZE)

  return (
    <section ref={ref} id="projects" className={`py-24 bg-gray-950 fade-up ${inView ? 'visible' : ''}`}>
      <div className="max-w-6xl mx-auto px-6">
        {/* Header */}
        <div className="mb-10">
          <p className="text-violet-400 text-sm font-medium tracking-widest uppercase mb-2">
            Portafolio
          </p>
          <h2 className="text-3xl md:text-4xl font-bold text-white">
            Proyectos destacados
          </h2>
        </div>

        {/* Filters */}
        {!loading && !error && availableCategories.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-10">
            <button
              onClick={() => handleFilter(null)}
              className={`px-4 py-1.5 rounded-full text-sm border transition-all duration-150 ${
                activeFilter === null
                  ? 'bg-violet-600 border-violet-500 text-white'
                  : 'bg-transparent border-gray-700 text-gray-400 hover:border-gray-500 hover:text-white'
              }`}
            >
              Todos
            </button>
            {availableCategories.map((cat) => (
              <button
                key={cat.value}
                onClick={() => handleFilter(cat.value)}
                className={`px-4 py-1.5 rounded-full text-sm border transition-all duration-150 ${
                  activeFilter === cat.value
                    ? 'bg-violet-600 border-violet-500 text-white'
                    : 'bg-transparent border-gray-700 text-gray-400 hover:border-gray-500 hover:text-white'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-80 bg-gray-900 rounded-2xl animate-pulse border border-gray-800" />
            ))}
          </div>
        )}

        {/* Error */}
        {error && (
          <p className="text-gray-500 text-center py-16">No se pudieron cargar los proyectos.</p>
        )}

        {/* Empty global */}
        {!loading && !error && projects.length === 0 && (
          <p className="text-gray-500 text-center py-16">Aún no hay proyectos publicados.</p>
        )}

        {/* Empty filter */}
        {!loading && !error && projects.length > 0 && filtered.length === 0 && (
          <p className="text-gray-500 text-center py-16">No hay proyectos en esta categoría.</p>
        )}

        {/* Grid */}
        {!loading && !error && paginated.length > 0 && (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {paginated.map((project) => (
              <ProjectCard
                key={project.id}
                project={project}
                onClick={() => setSelectedProject(project)}
              />
            ))}
          </div>
        )}

        {/* Pagination */}
        {!loading && !error && totalPages > 1 && (
          <div className="flex items-center justify-center gap-3 mt-10">
            <button
              onClick={() => handlePage(page - 1)}
              disabled={page === 0}
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm border border-gray-700 text-gray-400 hover:text-white hover:border-gray-500 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Anterior
            </button>

            <div className="flex items-center gap-1">
              {[...Array(totalPages)].map((_, i) => (
                <button
                  key={i}
                  onClick={() => handlePage(i)}
                  className={`w-8 h-8 rounded-lg text-sm transition-all ${
                    page === i
                      ? 'bg-violet-600 text-white'
                      : 'text-gray-500 hover:text-white hover:bg-gray-800'
                  }`}
                >
                  {i + 1}
                </button>
              ))}
            </div>

            <button
              onClick={() => handlePage(page + 1)}
              disabled={page === totalPages - 1}
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm border border-gray-700 text-gray-400 hover:text-white hover:border-gray-500 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
            >
              Siguiente
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
