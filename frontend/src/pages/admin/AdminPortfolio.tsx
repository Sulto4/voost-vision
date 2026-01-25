import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Plus, Edit, Trash2, ArrowLeft, X, Save } from 'lucide-react'
import { supabase, Project } from '../../lib/supabase'
import AdminLayout from '../../components/admin/AdminLayout'

interface ProjectFormData {
  title_ro: string
  title_en: string
  description_ro: string
  description_en: string
  category: string
  tech_stack: string[]
  thumbnail_url: string
  live_url: string
  featured: boolean
  published: boolean
}

const emptyFormData: ProjectFormData = {
  title_ro: '',
  title_en: '',
  description_ro: '',
  description_en: '',
  category: 'web',
  tech_stack: [],
  thumbnail_url: '',
  live_url: '',
  featured: false,
  published: true
}

export default function AdminPortfolio() {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingProject, setEditingProject] = useState<Project | null>(null)
  const [formData, setFormData] = useState<ProjectFormData>(emptyFormData)
  const [techInput, setTechInput] = useState('')
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState<string | null>(null)
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)

  useEffect(() => {
    fetchProjects()
  }, [])

  // Warn user about unsaved changes when modal is open
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (showModal) {
        e.preventDefault()
        e.returnValue = ''
      }
    }

    window.addEventListener('beforeunload', handleBeforeUnload)
    return () => window.removeEventListener('beforeunload', handleBeforeUnload)
  }, [showModal])

  async function fetchProjects() {
    try {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      setProjects(data || [])
    } catch (error) {
      console.error('Error fetching projects:', error)
    } finally {
      setLoading(false)
    }
  }

  function openCreateModal() {
    setEditingProject(null)
    setFormData(emptyFormData)
    setTechInput('')
    setShowModal(true)
  }

  function openEditModal(project: Project) {
    setEditingProject(project)
    setFormData({
      title_ro: project.title_ro,
      title_en: project.title_en,
      description_ro: project.description_ro || '',
      description_en: project.description_en || '',
      category: project.category,
      tech_stack: project.tech_stack || [],
      thumbnail_url: project.thumbnail_url || '',
      live_url: project.live_url || '',
      featured: project.featured,
      published: project.published
    })
    setTechInput('')
    setShowModal(true)
  }

  function closeModal() {
    setShowModal(false)
    setEditingProject(null)
    setFormData(emptyFormData)
    setMessage(null)
  }

  function addTechTag() {
    if (techInput.trim() && !formData.tech_stack.includes(techInput.trim())) {
      setFormData({
        ...formData,
        tech_stack: [...formData.tech_stack, techInput.trim()]
      })
      setTechInput('')
    }
  }

  function removeTechTag(tag: string) {
    setFormData({
      ...formData,
      tech_stack: formData.tech_stack.filter(t => t !== tag)
    })
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    setMessage(null)

    try {
      if (editingProject) {
        // Update existing project
        const { error } = await supabase
          .from('projects')
          .update({
            title_ro: formData.title_ro,
            title_en: formData.title_en,
            description_ro: formData.description_ro || null,
            description_en: formData.description_en || null,
            category: formData.category,
            tech_stack: formData.tech_stack,
            thumbnail_url: formData.thumbnail_url || null,
            live_url: formData.live_url || null,
            featured: formData.featured,
            published: formData.published
          })
          .eq('id', editingProject.id)

        if (error) throw error
        setMessage({ type: 'success', text: 'Project updated successfully!' })
      } else {
        // Create new project
        const { error } = await supabase
          .from('projects')
          .insert({
            title_ro: formData.title_ro,
            title_en: formData.title_en,
            description_ro: formData.description_ro || null,
            description_en: formData.description_en || null,
            category: formData.category,
            tech_stack: formData.tech_stack,
            thumbnail_url: formData.thumbnail_url || null,
            live_url: formData.live_url || null,
            featured: formData.featured,
            published: formData.published
          })

        if (error) throw error
        setMessage({ type: 'success', text: 'Project created successfully!' })
      }

      // Refresh the projects list
      await fetchProjects()

      // Close modal after a brief delay to show success message
      setTimeout(() => {
        closeModal()
      }, 1500)
    } catch (error: unknown) {
      console.error('Error saving project:', error)

      // Check for duplicate entry error (Postgres unique constraint violation)
      const errorMessage = error instanceof Error ? error.message : String(error)
      const errorObj = error as { code?: string; message?: string }

      if (errorObj?.code === '23505' || errorMessage.includes('duplicate') || errorMessage.includes('unique')) {
        setMessage({ type: 'error', text: 'A project with this title already exists. Please use a different title.' })
      } else {
        setMessage({ type: 'error', text: 'Failed to save project. Please try again.' })
      }
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete(project: Project) {
    // Prevent rapid clicking
    if (deleting === project.id) return

    if (!confirm(`Are you sure you want to delete "${project.title_en}"?`)) {
      return
    }

    setDeleting(project.id)
    try {
      const { error } = await supabase
        .from('projects')
        .delete()
        .eq('id', project.id)

      if (error) throw error
      await fetchProjects()
    } catch (error) {
      console.error('Error deleting project:', error)
      alert('Failed to delete project. Please try again.')
    } finally {
      setDeleting(null)
    }
  }

  return (
    <AdminLayout>
      <div className="flex items-center justify-between mb-8">
        <div>
          <Link
            to="/admin/dashboard"
            className="inline-flex items-center text-surface-400 hover:text-white transition-colors mb-2"
          >
            <ArrowLeft className="w-4 h-4 mr-1" />
            Back to Dashboard
          </Link>
          <h1 className="heading-2">Portfolio Management</h1>
        </div>
        <button onClick={openCreateModal} className="btn-primary">
          <Plus className="w-5 h-5 mr-2" />
          Add Project
        </button>
      </div>

        <div className="glass-card overflow-hidden">
          {loading ? (
            <div className="p-8 text-center text-surface-400">Loading projects...</div>
          ) : projects.length === 0 ? (
            <div className="p-8 text-center text-surface-400">No projects yet. Click "Add Project" to create one.</div>
          ) : (
            <div className="overflow-x-auto">
            <table className="w-full min-w-[600px]">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="text-left py-4 px-6 text-surface-400 font-medium">Title</th>
                  <th className="text-left py-4 px-6 text-surface-400 font-medium">Category</th>
                  <th className="text-left py-4 px-6 text-surface-400 font-medium">Status</th>
                  <th className="text-right py-4 px-6 text-surface-400 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {projects.map((project) => (
                  <tr key={project.id} className="border-b border-white/5 last:border-0">
                    <td className="py-4 px-6 font-medium">{project.title_en}</td>
                    <td className="py-4 px-6">
                      <span className="px-3 py-1 text-xs bg-primary-500/20 text-primary-300 rounded-full capitalize">
                        {project.category}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <span className={`px-3 py-1 text-xs rounded-full ${
                        project.published
                          ? 'bg-green-500/20 text-green-400'
                          : 'bg-yellow-500/20 text-yellow-400'
                      }`}>
                        {project.published ? 'Published' : 'Draft'}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => openEditModal(project)}
                          className="p-2 rounded-lg hover:bg-white/10 transition-colors"
                          aria-label={`Edit ${project.title_en}`}
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(project)}
                          disabled={deleting === project.id}
                          className="p-2 rounded-lg hover:bg-red-500/20 text-red-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                          aria-label={`Delete ${project.title_en}`}
                        >
                          <Trash2 className={`w-4 h-4 ${deleting === project.id ? 'animate-pulse' : ''}`} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            </div>
          )}
        </div>

      {/* Create/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-surface-800 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-surface-800 px-6 py-4 border-b border-white/10 flex items-center justify-between">
              <h2 className="text-xl font-semibold">
                {editingProject ? 'Edit Project' : 'Add New Project'}
              </h2>
              <button onClick={closeModal} className="p-2 hover:bg-white/10 rounded-lg transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              {message && (
                <div className={`p-4 rounded-lg ${
                  message.type === 'success'
                    ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                    : 'bg-red-500/20 text-red-400 border border-red-500/30'
                }`}>
                  {message.text}
                </div>
              )}

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Title (Romanian)</label>
                  <input
                    type="text"
                    value={formData.title_ro}
                    onChange={(e) => setFormData({ ...formData, title_ro: e.target.value })}
                    className="input"
                    placeholder="Titlu proiect"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Title (English)</label>
                  <input
                    type="text"
                    value={formData.title_en}
                    onChange={(e) => setFormData({ ...formData, title_en: e.target.value })}
                    className="input"
                    placeholder="Project title"
                    required
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Description (Romanian)</label>
                  <textarea
                    value={formData.description_ro}
                    onChange={(e) => setFormData({ ...formData, description_ro: e.target.value })}
                    className="input min-h-[100px]"
                    placeholder="Descriere proiect"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Description (English)</label>
                  <textarea
                    value={formData.description_en}
                    onChange={(e) => setFormData({ ...formData, description_en: e.target.value })}
                    className="input min-h-[100px]"
                    placeholder="Project description"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="input"
                  >
                    <option value="web">Web Development</option>
                    <option value="app">Web Application</option>
                    <option value="mobile">Mobile App</option>
                    <option value="design">Design</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Thumbnail URL</label>
                  <input
                    type="url"
                    value={formData.thumbnail_url}
                    onChange={(e) => setFormData({ ...formData, thumbnail_url: e.target.value })}
                    className="input"
                    placeholder="https://..."
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Tech Stack</label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={techInput}
                    onChange={(e) => setTechInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTechTag())}
                    className="input flex-1"
                    placeholder="Add technology (e.g., React, Node.js)"
                  />
                  <button
                    type="button"
                    onClick={addTechTag}
                    className="btn-secondary px-4"
                  >
                    Add
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {formData.tech_stack.map((tech) => (
                    <span
                      key={tech}
                      className="px-3 py-1 bg-primary-500/20 text-primary-300 rounded-full text-sm flex items-center gap-1"
                    >
                      {tech}
                      <button
                        type="button"
                        onClick={() => removeTechTag(tech)}
                        className="hover:text-white"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Live URL (optional)</label>
                <input
                  type="url"
                  value={formData.live_url}
                  onChange={(e) => setFormData({ ...formData, live_url: e.target.value })}
                  className="input"
                  placeholder="https://..."
                />
              </div>

              <div className="flex gap-6">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.featured}
                    onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                    className="w-4 h-4 rounded border-white/20 bg-white/5 text-primary-500 focus:ring-primary-500"
                  />
                  <span className="text-sm">Featured project</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.published}
                    onChange={(e) => setFormData({ ...formData, published: e.target.checked })}
                    className="w-4 h-4 rounded border-white/20 bg-white/5 text-primary-500 focus:ring-primary-500"
                  />
                  <span className="text-sm">Published</span>
                </label>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-white/10">
                <button type="button" onClick={closeModal} className="btn-secondary">
                  Cancel
                </button>
                <button type="submit" disabled={saving} className="btn-primary">
                  <Save className="w-4 h-4 mr-2" />
                  {saving ? 'Saving...' : (editingProject ? 'Update Project' : 'Create Project')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  )
}
