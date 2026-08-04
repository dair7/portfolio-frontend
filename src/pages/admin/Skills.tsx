import { useEffect, useState, type FormEvent } from 'react'
import api from '../../api/axios'
import type { Skill, SkillRequest, SkillCategoryValue } from '../../types'
import { SKILL_CATEGORIES } from '../../types'

const EMPTY_FORM: SkillRequest = { name: '', level: 50, category: 'LANGUAGE' }

export default function Skills() {
  const [skills, setSkills] = useState<Skill[]>([])
  const [loading, setLoading] = useState(true)
  const [form, setForm] = useState<SkillRequest>(EMPTY_FORM)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [saving, setSaving] = useState(false)
  const [deletingId, setDeletingId] = useState<number | null>(null)
  const [error, setError] = useState('')

  useEffect(() => { fetchSkills() }, [])

  async function fetchSkills() {
    try {
      const res = await api.get<Skill[]>('/skills')
      setSkills(res.data)
    } finally {
      setLoading(false)
    }
  }

  function startEdit(skill: Skill) {
    setEditingId(skill.id)
    setForm({ name: skill.name, level: skill.level, category: skill.category })
    setError('')
  }

  function cancelEdit() {
    setEditingId(null)
    setForm(EMPTY_FORM)
    setError('')
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError('')
    setSaving(true)
    try {
      if (editingId !== null) {
        const res = await api.put<Skill>(`/skills/${editingId}`, form)
        setSkills((prev) => prev.map((s) => (s.id === editingId ? res.data : s)))
        setEditingId(null)
      } else {
        const res = await api.post<Skill>('/skills', form)
        setSkills((prev) => [...prev, res.data])
      }
      setForm(EMPTY_FORM)
    } catch (err: unknown) {
      const status = (err as { response?: { status?: number } })?.response?.status
      setError(status === 409 ? 'Esa skill ya existe.' : 'Error al guardar la skill.')
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete(id: number) {
    if (!confirm('¿Eliminar esta skill?')) return
    setDeletingId(id)
    try {
      await api.delete(`/skills/${id}`)
      setSkills((prev) => prev.filter((s) => s.id !== id))
      if (editingId === id) cancelEdit()
    } finally {
      setDeletingId(null)
    }
  }

  const grouped = SKILL_CATEGORIES.map((cat) => ({
    ...cat,
    items: skills.filter((s) => s.category === cat.value),
  })).filter((g) => g.items.length > 0)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white">Skills</h1>
        <p className="text-gray-500 text-sm mt-1">
          {skills.length} skill{skills.length !== 1 ? 's' : ''} registrada{skills.length !== 1 ? 's' : ''}
        </p>
      </div>

      {/* Form */}
      <div className="bg-gray-900/60 rounded-2xl p-6">
        <h2 className="text-sm font-semibold text-white mb-4">
          {editingId !== null ? 'Editar skill' : 'Nueva skill'}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs text-gray-500 font-medium uppercase tracking-wider">
                Nombre <span className="text-violet-500">*</span>
              </label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                required
                placeholder="Ej: React, Java, Docker..."
                className="bg-gray-950 text-white placeholder-gray-600 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-violet-500 transition-all"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs text-gray-500 font-medium uppercase tracking-wider">
                Categoría <span className="text-violet-500">*</span>
              </label>
              <select
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value as SkillCategoryValue })}
                className="bg-gray-950 text-white rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-violet-500 transition-all"
              >
                {SKILL_CATEGORIES.map((cat) => (
                  <option key={cat.value} value={cat.value}>{cat.label}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <label className="text-xs text-gray-500 font-medium uppercase tracking-wider">Nivel</label>
              <span className="text-sm font-semibold text-violet-400">{form.level}%</span>
            </div>
            <input
              type="range" min={0} max={100} step={5}
              value={form.level}
              onChange={(e) => setForm({ ...form, level: Number(e.target.value) })}
              className="w-full accent-violet-500"
            />
            <div className="flex justify-between text-xs text-gray-600">
              <span>Básico</span><span>Intermedio</span><span>Avanzado</span>
            </div>
          </div>

          {error && <p className="text-red-400 text-sm">{error}</p>}

          <div className="flex items-center gap-3">
            <button type="submit" disabled={saving}
              className="bg-violet-600 hover:bg-violet-500 disabled:opacity-40 disabled:cursor-not-allowed text-white font-medium text-sm px-5 py-2.5 rounded-xl transition-colors">
              {saving ? 'Guardando...' : editingId !== null ? 'Guardar cambios' : 'Agregar skill'}
            </button>
            {editingId !== null && (
              <button type="button" onClick={cancelEdit}
                className="text-gray-400 hover:text-white text-sm px-4 py-2.5 rounded-xl hover:bg-white/5 transition-colors">
                Cancelar
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Loading */}
      {loading && (
        <div className="space-y-2">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-14 bg-gray-900/60 rounded-2xl animate-pulse" />
          ))}
        </div>
      )}

      {/* Empty */}
      {!loading && skills.length === 0 && (
        <div className="text-center py-16 bg-gray-900/60 rounded-2xl">
          <p className="text-gray-500 text-sm">No hay skills todavía.</p>
        </div>
      )}

      {/* Grouped list */}
      {!loading && grouped.length > 0 && (
        <div className="space-y-4">
          {grouped.map((group) => (
            <div key={group.value}>
              <p className="text-xs text-gray-600 font-semibold uppercase tracking-widest mb-2 px-1">
                {group.label}
              </p>
              <div className="bg-gray-900/60 rounded-2xl overflow-hidden">
                <ul>
                  {group.items.map((skill, i) => (
                    <li
                      key={skill.id}
                      className={`px-5 py-4 transition-colors ${
                        editingId === skill.id ? 'bg-violet-600/5' : 'hover:bg-white/[0.03]'
                      } ${i !== 0 ? 'border-t border-white/5' : ''}`}
                    >
                      <div className="flex items-center justify-between mb-2.5">
                        <span className="text-sm text-white font-medium">{skill.name}</span>
                        <div className="flex items-center gap-1">
                          <span className="text-xs text-violet-400 font-semibold mr-2">{skill.level}%</span>
                          <button onClick={() => startEdit(skill)}
                            className="p-1.5 text-gray-600 hover:text-violet-400 hover:bg-violet-400/10 rounded-lg transition-colors" title="Editar">
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                          </button>
                          <button onClick={() => handleDelete(skill.id)} disabled={deletingId === skill.id}
                            className="p-1.5 text-gray-600 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-colors disabled:opacity-40" title="Eliminar">
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                      </div>
                      <div className="w-full bg-gray-800/80 rounded-full h-1">
                        <div
                          className="bg-violet-500 h-1 rounded-full transition-all duration-300"
                          style={{ width: `${skill.level}%` }}
                        />
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
