import { useEffect, useState, type FormEvent } from 'react'
import api from '../../api/axios'
import type { Technology } from '../../types'

interface EditState {
  id: number
  name: string
  iconUrl: string
}

export default function Technologies() {
  const [technologies, setTechnologies] = useState<Technology[]>([])
  const [loading, setLoading] = useState(true)
  const [name, setName] = useState('')
  const [iconUrl, setIconUrl] = useState('')
  const [saving, setSaving] = useState(false)
  const [deletingId, setDeletingId] = useState<number | null>(null)
  const [error, setError] = useState('')
  const [deleteError, setDeleteError] = useState('')
  const [editing, setEditing] = useState<EditState | null>(null)
  const [editSaving, setEditSaving] = useState(false)
  const [editError, setEditError] = useState('')

  useEffect(() => { fetchTechnologies() }, [])

  async function fetchTechnologies() {
    try {
      const res = await api.get<Technology[]>('/technologies')
      setTechnologies(res.data)
    } finally {
      setLoading(false)
    }
  }

  async function handleCreate(e: FormEvent) {
    e.preventDefault()
    if (!name.trim()) return
    setError('')
    setSaving(true)
    try {
      const res = await api.post<Technology>('/technologies', {
        name: name.trim(),
        iconUrl: iconUrl.trim() || null,
      })
      setTechnologies((prev) => [...prev, res.data])
      setName('')
      setIconUrl('')
    } catch (err: unknown) {
      const status = (err as { response?: { status?: number } })?.response?.status
      setError(status === 409 ? 'Esa tecnología ya existe.' : 'Error al crear la tecnología.')
    } finally {
      setSaving(false)
    }
  }

  function startEdit(tech: Technology) {
    setEditing({ id: tech.id, name: tech.name, iconUrl: tech.iconUrl ?? '' })
    setEditError('')
    setDeleteError('')
  }

  function cancelEdit() {
    setEditing(null)
    setEditError('')
  }

  async function handleUpdate(e: FormEvent) {
    e.preventDefault()
    if (!editing || !editing.name.trim()) return
    setEditError('')
    setEditSaving(true)
    try {
      const res = await api.put<Technology>(`/technologies/${editing.id}`, {
        name: editing.name.trim(),
        iconUrl: editing.iconUrl.trim() || null,
      })
      setTechnologies((prev) => prev.map((t) => (t.id === editing.id ? res.data : t)))
      setEditing(null)
    } catch (err: unknown) {
      const status = (err as { response?: { status?: number } })?.response?.status
      setEditError(status === 409 ? 'Ese nombre ya existe.' : 'Error al guardar.')
    } finally {
      setEditSaving(false)
    }
  }

  async function handleDelete(id: number) {
    if (!confirm('¿Eliminar esta tecnología?')) return
    setDeletingId(id)
    setDeleteError('')
    try {
      await api.delete(`/technologies/${id}`)
      setTechnologies((prev) => prev.filter((t) => t.id !== id))
    } catch (err: unknown) {
      const status = (err as { response?: { status?: number } })?.response?.status
      setDeleteError(
        status === 409
          ? 'No se puede eliminar: está en uso por uno o más proyectos.'
          : 'Error al eliminar.'
      )
    } finally {
      setDeletingId(null)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white">Tecnologías</h1>
        <p className="text-gray-500 text-sm mt-1">
          {technologies.length} tecnología{technologies.length !== 1 ? 's' : ''} registrada{technologies.length !== 1 ? 's' : ''}
        </p>
      </div>

      {/* Add form */}
      <div className="bg-gray-900/60 rounded-2xl p-6 space-y-4">
        <h2 className="text-sm font-semibold text-white">Nueva tecnología</h2>
        <form onSubmit={handleCreate} className="space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs text-gray-500 font-medium uppercase tracking-wider">Nombre *</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ej: Spring Boot, React, Docker..."
                className="bg-gray-950 text-white placeholder-gray-600 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-violet-500 transition-all"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs text-gray-500 font-medium uppercase tracking-wider">URL del ícono</label>
              <div className="flex gap-2 items-center">
                <input
                  type="text"
                  value={iconUrl}
                  onChange={(e) => setIconUrl(e.target.value)}
                  placeholder="https://cdn.jsdelivr.net/gh/devicons/..."
                  className="flex-1 bg-gray-950 text-white placeholder-gray-600 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-violet-500 transition-all"
                />
                {iconUrl.trim() && (
                  <img
                    src={iconUrl.trim()} alt="preview"
                    className="w-8 h-8 object-contain flex-shrink-0"
                    onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }}
                    onLoad={(e) => { (e.target as HTMLImageElement).style.display = 'block' }}
                  />
                )}
              </div>
            </div>
          </div>

          {error && <p className="text-red-400 text-sm">{error}</p>}
          {deleteError && <p className="text-red-400 text-sm">{deleteError}</p>}

          <button
            type="submit"
            disabled={saving || !name.trim()}
            className="flex items-center gap-2 bg-violet-600 hover:bg-violet-500 disabled:opacity-40 disabled:cursor-not-allowed text-white text-sm font-medium px-5 py-2.5 rounded-xl transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            {saving ? 'Agregando...' : 'Agregar'}
          </button>
        </form>
      </div>

      {/* Loading */}
      {loading && (
        <div className="space-y-2">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-14 bg-gray-900/60 rounded-2xl animate-pulse" />
          ))}
        </div>
      )}

      {/* Empty */}
      {!loading && technologies.length === 0 && (
        <div className="text-center py-16 bg-gray-900/60 rounded-2xl">
          <p className="text-gray-500 text-sm">No hay tecnologías todavía.</p>
        </div>
      )}

      {/* List */}
      {!loading && technologies.length > 0 && (
        <div className="bg-gray-900/60 rounded-2xl overflow-hidden">
          <ul>
            {technologies.map((tech, i) =>
              editing?.id === tech.id ? (
                <li key={tech.id} className={`px-5 py-4 bg-violet-600/5 ${i !== 0 ? 'border-t border-white/5' : ''}`}>
                  <form onSubmit={handleUpdate} className="space-y-3">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <input
                        type="text"
                        value={editing.name}
                        onChange={(e) => setEditing({ ...editing, name: e.target.value })}
                        placeholder="Nombre"
                        autoFocus
                        className="bg-gray-950 text-white placeholder-gray-600 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-violet-500"
                      />
                      <div className="flex gap-2 items-center">
                        <input
                          type="text"
                          value={editing.iconUrl}
                          onChange={(e) => setEditing({ ...editing, iconUrl: e.target.value })}
                          placeholder="URL del ícono"
                          className="flex-1 bg-gray-950 text-white placeholder-gray-600 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-violet-500"
                        />
                        {editing.iconUrl.trim() && (
                          <img
                            src={editing.iconUrl.trim()} alt="preview"
                            className="w-7 h-7 object-contain flex-shrink-0"
                            onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }}
                            onLoad={(e) => { (e.target as HTMLImageElement).style.display = 'block' }}
                          />
                        )}
                      </div>
                    </div>
                    {editError && <p className="text-red-400 text-xs">{editError}</p>}
                    <div className="flex gap-2">
                      <button type="submit" disabled={editSaving || !editing.name.trim()}
                        className="px-4 py-1.5 text-sm bg-violet-600 hover:bg-violet-500 disabled:opacity-40 text-white rounded-lg transition-colors">
                        {editSaving ? 'Guardando...' : 'Guardar'}
                      </button>
                      <button type="button" onClick={cancelEdit}
                        className="px-4 py-1.5 text-sm text-gray-400 hover:text-white rounded-lg hover:bg-white/5 transition-colors">
                        Cancelar
                      </button>
                    </div>
                  </form>
                </li>
              ) : (
                <li key={tech.id} className={`flex items-center justify-between px-5 py-3.5 hover:bg-white/[0.03] transition-colors ${i !== 0 ? 'border-t border-white/5' : ''}`}>
                  <div className="flex items-center gap-3">
                    {tech.iconUrl ? (
                      <img src={tech.iconUrl} alt={tech.name} className="w-5 h-5 object-contain flex-shrink-0" />
                    ) : (
                      <div className="w-5 h-5 rounded bg-gray-800 flex-shrink-0" />
                    )}
                    <span className="text-sm text-white">{tech.name}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <button onClick={() => startEdit(tech)}
                      className="p-1.5 text-gray-600 hover:text-violet-400 hover:bg-violet-400/10 rounded-lg transition-colors" title="Editar">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </button>
                    <button onClick={() => handleDelete(tech.id)} disabled={deletingId === tech.id}
                      className="p-1.5 text-gray-600 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-colors disabled:opacity-40" title="Eliminar">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </li>
              )
            )}
          </ul>
        </div>
      )}
    </div>
  )
}
