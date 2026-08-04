import { useEffect, useState, type FormEvent } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import api from '../../api/axios'
import type { Project, ProjectRequest, Technology } from '../../types'
import { PROJECT_CATEGORIES } from '../../types'

export default function ProjectForm() {
  const { id } = useParams()
  const navigate = useNavigate()
  const isEdit = Boolean(id)

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [availableTechs, setAvailableTechs] = useState<Technology[]>([])

  const [form, setForm] = useState<ProjectRequest>({
    name: '',
    description: '',
    githubUrl: '',
    demoUrl: '',
    imageUrl: '',
    category: '',
    technologyIds: [],
  })

  useEffect(() => {
    async function load() {
      try {
        const techsRes = await api.get<Technology[]>('/technologies')
        setAvailableTechs(techsRes.data)
        if (isEdit) {
          const projRes = await api.get<Project>(`/projects/${id}`)
          const proj = projRes.data
          setForm({
            name: proj.name,
            description: proj.description ?? '',
            githubUrl: proj.githubUrl,
            demoUrl: proj.demoUrl ?? '',
            imageUrl: proj.imageUrl ?? '',
            category: proj.category,
            technologyIds: proj.technologies.map((t) => t.id),
          })
        }
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [id, isEdit])

  function toggleTech(techId: number) {
    setForm((prev) => ({
      ...prev,
      technologyIds: prev.technologyIds.includes(techId)
        ? prev.technologyIds.filter((t) => t !== techId)
        : [...prev.technologyIds, techId],
    }))
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError('')
    if (!form.category) { setError('Selecciona una categoría.'); return }
    if (form.technologyIds.length === 0) { setError('Selecciona al menos una tecnología.'); return }
    setSaving(true)
    try {
      if (isEdit) {
        await api.put(`/projects/${id}`, form)
      } else {
        await api.post('/projects', form)
      }
      navigate('/admin')
    } catch {
      setError('Error al guardar el proyecto. Revisá los datos.')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-12 bg-gray-900/60 rounded-2xl animate-pulse" />
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => navigate('/admin')}
          className="p-2 text-gray-500 hover:text-white hover:bg-white/5 rounded-xl transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <div>
          <h1 className="text-2xl font-bold text-white">
            {isEdit ? 'Editar proyecto' : 'Nuevo proyecto'}
          </h1>
          <p className="text-gray-500 text-sm mt-0.5">
            {isEdit ? 'Modificá los datos del proyecto' : 'Completá los datos del nuevo proyecto'}
          </p>
        </div>
      </div>

      {/* Form */}
      <div className="bg-gray-900/60 rounded-2xl p-6">
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Name */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs text-gray-500 font-medium uppercase tracking-wider">
              Nombre <span className="text-violet-500">*</span>
            </label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
              placeholder="Mi proyecto"
              className="bg-gray-950 text-white placeholder-gray-600 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-violet-500 transition-all"
            />
          </div>

          {/* Description */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs text-gray-500 font-medium uppercase tracking-wider">Descripción</label>
            <textarea
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              rows={3}
              placeholder="Descripción breve del proyecto..."
              className="bg-gray-950 text-white placeholder-gray-600 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-violet-500 transition-all resize-none"
            />
          </div>

          {/* GitHub URL */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs text-gray-500 font-medium uppercase tracking-wider">
              URL de GitHub <span className="text-violet-500">*</span>
            </label>
            <input
              type="url"
              value={form.githubUrl}
              onChange={(e) => setForm({ ...form, githubUrl: e.target.value })}
              required
              placeholder="https://github.com/usuario/repo"
              className="bg-gray-950 text-white placeholder-gray-600 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-violet-500 transition-all"
            />
          </div>

          {/* Demo + Image */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs text-gray-500 font-medium uppercase tracking-wider">URL de Demo</label>
              <input
                type="url"
                value={form.demoUrl}
                onChange={(e) => setForm({ ...form, demoUrl: e.target.value })}
                placeholder="https://miproyecto.com"
                className="bg-gray-950 text-white placeholder-gray-600 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-violet-500 transition-all"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs text-gray-500 font-medium uppercase tracking-wider">URL de Imagen</label>
              <input
                type="url"
                value={form.imageUrl}
                onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
                placeholder="https://i.imgur.com/..."
                className="bg-gray-950 text-white placeholder-gray-600 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-violet-500 transition-all"
              />
            </div>
          </div>

          {/* Category */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs text-gray-500 font-medium uppercase tracking-wider">
              Categoría <span className="text-violet-500">*</span>
            </label>
            <select
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
              className="bg-gray-950 text-white rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-violet-500 transition-all"
            >
              <option value="">Selecciona una categoría</option>
              {PROJECT_CATEGORIES.map((cat) => (
                <option key={cat.value} value={cat.value}>{cat.label}</option>
              ))}
            </select>
          </div>

          {/* Technologies */}
          <div className="flex flex-col gap-2">
            <label className="text-xs text-gray-500 font-medium uppercase tracking-wider">
              Tecnologías <span className="text-violet-500">*</span>
            </label>
            {availableTechs.length === 0 ? (
              <p className="text-sm text-gray-500">
                No hay tecnologías disponibles.{' '}
                <a href="/admin/technologies" className="text-violet-400 hover:text-violet-300">
                  Agregar desde el catálogo →
                </a>
              </p>
            ) : (
              <div className="flex flex-wrap gap-2">
                {availableTechs.map((tech) => {
                  const selected = form.technologyIds.includes(tech.id)
                  return (
                    <button
                      key={tech.id}
                      type="button"
                      onClick={() => toggleTech(tech.id)}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm transition-all duration-150 ${
                        selected
                          ? 'bg-violet-600/20 text-violet-400 ring-1 ring-violet-500/50'
                          : 'bg-gray-800/60 text-gray-400 hover:text-white hover:bg-gray-800'
                      }`}
                    >
                      {tech.iconUrl && (
                        <img src={tech.iconUrl} alt="" className="w-3.5 h-3.5 object-contain" />
                      )}
                      {tech.name}
                    </button>
                  )
                })}
              </div>
            )}
          </div>

          {error && <p className="text-red-400 text-sm">{error}</p>}

          {/* Actions */}
          <div className="flex items-center gap-3 pt-1">
            <button
              type="submit"
              disabled={saving}
              className="bg-violet-600 hover:bg-violet-500 disabled:opacity-40 disabled:cursor-not-allowed text-white font-medium text-sm px-6 py-2.5 rounded-xl transition-colors"
            >
              {saving ? 'Guardando...' : isEdit ? 'Guardar cambios' : 'Crear proyecto'}
            </button>
            <button
              type="button"
              onClick={() => navigate('/admin')}
              className="text-gray-400 hover:text-white text-sm px-4 py-2.5 rounded-xl hover:bg-white/5 transition-colors"
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
