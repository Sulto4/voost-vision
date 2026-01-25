import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Plus, Edit, Trash2, ArrowLeft, X, Save } from 'lucide-react'
import { supabase, Article } from '../../lib/supabase'
import AdminLayout from '../../components/admin/AdminLayout'
import RichTextEditor from '../../components/ui/RichTextEditor'

interface ArticleFormData {
  slug: string
  title_ro: string
  title_en: string
  excerpt_ro: string
  excerpt_en: string
  content_ro: string
  content_en: string
  cover_image: string
  category: string
  tags: string[]
  author: string
  published: boolean
}

const emptyFormData: ArticleFormData = {
  slug: '',
  title_ro: '',
  title_en: '',
  excerpt_ro: '',
  excerpt_en: '',
  content_ro: '',
  content_en: '',
  cover_image: '',
  category: 'Development',
  tags: [],
  author: 'Voost Vision',
  published: false
}

export default function AdminBlog() {
  const [articles, setArticles] = useState<Article[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingArticle, setEditingArticle] = useState<Article | null>(null)
  const [formData, setFormData] = useState<ArticleFormData>(emptyFormData)
  const [tagInput, setTagInput] = useState('')
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState<string | null>(null)
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)

  useEffect(() => {
    fetchArticles()
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

  async function fetchArticles() {
    try {
      const { data, error } = await supabase
        .from('articles')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      setArticles(data || [])
    } catch (error) {
      console.error('Error fetching articles:', error)
    } finally {
      setLoading(false)
    }
  }

  function generateSlug(title: string): string {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim()
  }

  function openCreateModal() {
    setEditingArticle(null)
    setFormData(emptyFormData)
    setTagInput('')
    setShowModal(true)
  }

  function openEditModal(article: Article) {
    setEditingArticle(article)
    setFormData({
      slug: article.slug,
      title_ro: article.title_ro,
      title_en: article.title_en,
      excerpt_ro: article.excerpt_ro || '',
      excerpt_en: article.excerpt_en || '',
      content_ro: article.content_ro,
      content_en: article.content_en,
      cover_image: article.cover_image || '',
      category: article.category || 'Development',
      tags: article.tags || [],
      author: article.author,
      published: article.published
    })
    setTagInput('')
    setShowModal(true)
  }

  function closeModal() {
    setShowModal(false)
    setEditingArticle(null)
    setFormData(emptyFormData)
    setMessage(null)
  }

  function addTag() {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData({
        ...formData,
        tags: [...formData.tags, tagInput.trim()]
      })
      setTagInput('')
    }
  }

  function removeTag(tag: string) {
    setFormData({
      ...formData,
      tags: formData.tags.filter(t => t !== tag)
    })
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    setMessage(null)

    const slug = formData.slug || generateSlug(formData.title_en)

    try {
      if (editingArticle) {
        const { error } = await supabase
          .from('articles')
          .update({
            slug,
            title_ro: formData.title_ro,
            title_en: formData.title_en,
            excerpt_ro: formData.excerpt_ro || null,
            excerpt_en: formData.excerpt_en || null,
            content_ro: formData.content_ro,
            content_en: formData.content_en,
            cover_image: formData.cover_image || null,
            category: formData.category || null,
            tags: formData.tags,
            author: formData.author,
            published: formData.published,
            updated_at: new Date().toISOString()
          })
          .eq('id', editingArticle.id)

        if (error) throw error
        setMessage({ type: 'success', text: 'Article updated successfully!' })
      } else {
        const { error } = await supabase
          .from('articles')
          .insert({
            slug,
            title_ro: formData.title_ro,
            title_en: formData.title_en,
            excerpt_ro: formData.excerpt_ro || null,
            excerpt_en: formData.excerpt_en || null,
            content_ro: formData.content_ro,
            content_en: formData.content_en,
            cover_image: formData.cover_image || null,
            category: formData.category || null,
            tags: formData.tags,
            author: formData.author,
            published: formData.published,
            published_at: formData.published ? new Date().toISOString() : null
          })

        if (error) throw error
        setMessage({ type: 'success', text: 'Article created successfully!' })
      }

      await fetchArticles()
      setTimeout(() => closeModal(), 1500)
    } catch (error: unknown) {
      console.error('Error saving article:', error)

      // Check for duplicate slug error (Postgres unique constraint violation)
      const errorMessage = error instanceof Error ? error.message : String(error)
      const errorObj = error as { code?: string; message?: string }

      if (errorObj?.code === '23505' || errorMessage.includes('duplicate') || errorMessage.includes('unique')) {
        setMessage({ type: 'error', text: 'An article with this slug already exists. Please use a different slug.' })
      } else {
        setMessage({ type: 'error', text: 'Failed to save article. Please try again.' })
      }
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete(article: Article) {
    // Prevent rapid clicking
    if (deleting === article.id) return

    if (!confirm(`Are you sure you want to delete "${article.title_en}"?`)) {
      return
    }

    setDeleting(article.id)
    try {
      const { error } = await supabase
        .from('articles')
        .delete()
        .eq('id', article.id)

      if (error) throw error
      await fetchArticles()
    } catch (error) {
      console.error('Error deleting article:', error)
      alert('Failed to delete article. Please try again.')
    } finally {
      setDeleting(null)
    }
  }

  function formatDate(dateString: string | null): string {
    if (!dateString) return 'Not published'
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
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
          <h1 className="heading-2">Blog Management</h1>
        </div>
        <button onClick={openCreateModal} className="btn-primary">
          <Plus className="w-5 h-5 mr-2" />
          New Article
        </button>
      </div>

        <div className="glass-card overflow-hidden">
          {loading ? (
            <div className="p-8 text-center text-surface-400">Loading articles...</div>
          ) : articles.length === 0 ? (
            <div className="p-8 text-center text-surface-400">No articles yet. Click "New Article" to create one.</div>
          ) : (
            <div className="overflow-x-auto">
            <table className="w-full min-w-[700px]">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="text-left py-4 px-6 text-surface-400 font-medium">Title</th>
                  <th className="text-left py-4 px-6 text-surface-400 font-medium">Category</th>
                  <th className="text-left py-4 px-6 text-surface-400 font-medium">Status</th>
                  <th className="text-left py-4 px-6 text-surface-400 font-medium">Date</th>
                  <th className="text-right py-4 px-6 text-surface-400 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {articles.map((article) => (
                  <tr key={article.id} className="border-b border-white/5 last:border-0">
                    <td className="py-4 px-6 font-medium">{article.title_en}</td>
                    <td className="py-4 px-6">
                      <span className="px-3 py-1 text-xs bg-primary-500/20 text-primary-300 rounded-full">
                        {article.category || 'Uncategorized'}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <span className={`px-3 py-1 text-xs rounded-full ${
                        article.published
                          ? 'bg-green-500/20 text-green-400'
                          : 'bg-yellow-500/20 text-yellow-400'
                      }`}>
                        {article.published ? 'Published' : 'Draft'}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-surface-400 text-sm">
                      {formatDate(article.published_at)}
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => openEditModal(article)}
                          className="p-2 rounded-lg hover:bg-white/10 transition-colors"
                          aria-label={`Edit ${article.title_en}`}
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(article)}
                          disabled={deleting === article.id}
                          className="p-2 rounded-lg hover:bg-red-500/20 text-red-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                          aria-label={`Delete ${article.title_en}`}
                        >
                          <Trash2 className={`w-4 h-4 ${deleting === article.id ? 'animate-pulse' : ''}`} />
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
          <div className="bg-surface-800 rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-surface-800 px-6 py-4 border-b border-white/10 flex items-center justify-between">
              <h2 className="text-xl font-semibold">
                {editingArticle ? 'Edit Article' : 'New Article'}
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
                    placeholder="Titlu articol"
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
                    placeholder="Article title"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Slug (URL)</label>
                <input
                  type="text"
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                  className="input"
                  placeholder="article-url-slug (auto-generated if empty)"
                />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Excerpt (Romanian)</label>
                  <textarea
                    value={formData.excerpt_ro}
                    onChange={(e) => setFormData({ ...formData, excerpt_ro: e.target.value })}
                    className="input min-h-[80px]"
                    placeholder="Scurt rezumat..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Excerpt (English)</label>
                  <textarea
                    value={formData.excerpt_en}
                    onChange={(e) => setFormData({ ...formData, excerpt_en: e.target.value })}
                    className="input min-h-[80px]"
                    placeholder="Short summary..."
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Content (Romanian)</label>
                <RichTextEditor
                  content={formData.content_ro}
                  onChange={(content) => setFormData({ ...formData, content_ro: content })}
                  placeholder="Continutul articolului..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Content (English)</label>
                <RichTextEditor
                  content={formData.content_en}
                  onChange={(content) => setFormData({ ...formData, content_en: content })}
                  placeholder="Article content..."
                />
              </div>

              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="input"
                  >
                    <option value="Development">Development</option>
                    <option value="Design">Design</option>
                    <option value="Strategy">Strategy</option>
                    <option value="Business">Business</option>
                    <option value="Technology">Technology</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Author</label>
                  <input
                    type="text"
                    value={formData.author}
                    onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                    className="input"
                    placeholder="Author name"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Cover Image URL</label>
                  <input
                    type="url"
                    value={formData.cover_image}
                    onChange={(e) => setFormData({ ...formData, cover_image: e.target.value })}
                    className="input"
                    placeholder="https://..."
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Tags</label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                    className="input flex-1"
                    placeholder="Add tag..."
                  />
                  <button type="button" onClick={addTag} className="btn-secondary px-4">
                    Add
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {formData.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-3 py-1 bg-primary-500/20 text-primary-300 rounded-full text-sm flex items-center gap-1"
                    >
                      {tag}
                      <button type="button" onClick={() => removeTag(tag)} className="hover:text-white">
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              <div>
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
                  {saving ? 'Saving...' : (editingArticle ? 'Update Article' : 'Create Article')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  )
}
