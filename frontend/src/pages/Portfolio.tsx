import { useTranslation } from 'react-i18next'
import { Link, useSearchParams } from 'react-router-dom'
import { useState, useEffect, useCallback } from 'react'
import { supabase, Project } from '@/lib/supabase'
import { X, ChevronLeft, ChevronRight, ArrowUpDown } from 'lucide-react'
import ErrorMessage from '@/components/ui/ErrorMessage'

const categories = [
  { id: 'all', label_ro: 'Toate', label_en: 'All' },
  { id: 'web', label_ro: 'Web', label_en: 'Web' },
  { id: 'app', label_ro: 'Aplicatii', label_en: 'Apps' },
  { id: 'ecommerce', label_ro: 'eCommerce', label_en: 'eCommerce' },
  { id: 'mobile', label_ro: 'Mobile', label_en: 'Mobile' },
  { id: 'design', label_ro: 'Design', label_en: 'Design' },
]

const sortOptions = [
  { id: 'newest', label_ro: 'Cele mai noi', label_en: 'Newest' },
  { id: 'oldest', label_ro: 'Cele mai vechi', label_en: 'Oldest' },
]

export default function Portfolio() {
  const { t, i18n } = useTranslation()
  const currentLang = i18n.language
  const [searchParams, setSearchParams] = useSearchParams()
  const filterFromUrl = searchParams.get('filter') || 'all'
  const sortFromUrl = searchParams.get('sort') || 'newest'
  const [filter, setFilterState] = useState(filterFromUrl)
  const [sort, setSortState] = useState(sortFromUrl)
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isNetworkError, setIsNetworkError] = useState(false)
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [lightboxProject, setLightboxProject] = useState<Project | null>(null)
  const [lightboxIndex, setLightboxIndex] = useState(0)

  // Sync filter state with URL
  const setFilter = (newFilter: string) => {
    setFilterState(newFilter)
    const params: Record<string, string> = {}
    if (newFilter !== 'all') params.filter = newFilter
    if (sort !== 'newest') params.sort = sort
    setSearchParams(params)
  }

  // Sync sort state with URL
  const setSort = (newSort: string) => {
    setSortState(newSort)
    const params: Record<string, string> = {}
    if (filter !== 'all') params.filter = filter
    if (newSort !== 'newest') params.sort = newSort
    setSearchParams(params)
  }

  // Sync from URL on mount/change
  useEffect(() => {
    setFilterState(filterFromUrl)
    setSortState(sortFromUrl)
  }, [filterFromUrl, sortFromUrl])

  const fetchProjects = useCallback(async () => {
    setLoading(true)
    setError(null)
    setIsNetworkError(false)

    try {
      const { data, error: fetchError } = await supabase
        .from('projects')
        .select('*')
        .eq('published', true)
        .order('created_at', { ascending: sort === 'oldest' })

      if (fetchError) {
        // Check if it's a network error
        const isNetwork = !navigator.onLine ||
          fetchError.message?.includes('fetch') ||
          fetchError.message?.includes('network') ||
          fetchError.message?.includes('Failed to fetch')

        setIsNetworkError(isNetwork)
        setError(fetchError.message)
        console.error('Error fetching projects:', fetchError.message)
      } else {
        setProjects(data || [])
      }
    } catch (err) {
      // Handle network/connection errors
      const isNetwork = !navigator.onLine ||
        (err instanceof TypeError && err.message?.includes('fetch'))

      setIsNetworkError(isNetwork)
      setError(err instanceof Error ? err.message : 'Unknown error')
      console.error('Error fetching projects:', err instanceof Error ? err.message : 'Unknown error')
    } finally {
      setLoading(false)
    }
  }, [sort])

  useEffect(() => {
    fetchProjects()
  }, [fetchProjects])

  const getLocalizedPath = (enPath: string, roPath: string) => {
    return currentLang === 'en' ? enPath : roPath
  }

  const filteredProjects = filter === 'all'
    ? projects
    : projects.filter((p) => p.category === filter)

  // Lightbox functions
  const openLightbox = (project: Project, e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setLightboxProject(project)
    setLightboxIndex(0)
    setLightboxOpen(true)
  }

  const closeLightbox = () => {
    setLightboxOpen(false)
    setLightboxProject(null)
  }

  const getLightboxImages = (project: Project) => {
    return [project.thumbnail_url, ...(project.images || [])].filter(Boolean) as string[]
  }

  const nextImage = () => {
    if (!lightboxProject) return
    const images = getLightboxImages(lightboxProject)
    setLightboxIndex((prev) => (prev + 1) % images.length)
  }

  const prevImage = () => {
    if (!lightboxProject) return
    const images = getLightboxImages(lightboxProject)
    setLightboxIndex((prev) => (prev - 1 + images.length) % images.length)
  }

  return (
    <div className="page-shell">
      <section className="section relative overflow-hidden pb-16 pt-28 md:pt-32">
        <div className="hero-backdrop" />
        <div className="container-custom">
          <div className="mx-auto mb-14 max-w-3xl text-center">
            <span className="section-kicker">Portfolio</span>
            <h1 className="heading-1 mt-3 mb-6">
              <span className="gradient-text">{t('portfolio.title')}</span>
            </h1>
            <p className="text-xl text-surface-300">{t('portfolio.subtitle')}</p>
          </div>

          <div className="glass-card mb-8 flex flex-col gap-5 p-5 md:flex-row md:items-center md:justify-between">
            <div className="flex flex-wrap gap-3">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setFilter(cat.id)}
                  className={`rounded-full px-5 py-2 text-sm font-semibold transition-colors ${
                    filter === cat.id
                      ? 'bg-primary-500 text-white'
                      : 'border border-white/10 bg-white/5 text-surface-300 hover:bg-white/10'
                  }`}
                >
                  {currentLang === 'en' ? cat.label_en : cat.label_ro}
                </button>
              ))}
            </div>
            <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2">
              <ArrowUpDown className="h-4 w-4 text-surface-400" />
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                className="bg-transparent text-sm text-surface-300 focus:outline-none"
              >
                {sortOptions.map((option) => (
                  <option key={option.id} value={option.id} className="bg-surface-900">
                    {currentLang === 'en' ? option.label_en : option.label_ro}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-t-2 border-primary-500" />
            </div>
          ) : error ? (
            <ErrorMessage
              error={error}
              isNetworkError={isNetworkError}
              onRetry={fetchProjects}
            />
          ) : filteredProjects.length === 0 ? (
            <div className="panel-shell flex flex-col items-center justify-center py-20 text-center">
              <div className="mb-4 text-6xl">📂</div>
              <h3 className="mb-2 text-xl font-semibold">
                {currentLang === 'en' ? 'No projects found' : 'Nu am găsit proiecte'}
              </h3>
              <p className="text-surface-400">
                {currentLang === 'en'
                  ? 'Try selecting a different category'
                  : 'Încercați să selectați o altă categorie'}
              </p>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2">
              {filteredProjects.map((project) => (
                <div
                  key={project.id}
                  className="glass-card group overflow-hidden"
                >
                  <div
                    className="relative aspect-video cursor-pointer overflow-hidden border-b border-white/10"
                    onClick={(e) => openLightbox(project, e)}
                  >
                    <img
                      src={project.thumbnail_url || ''}
                      alt={currentLang === 'en' ? project.title_en : project.title_ro}
                      loading="lazy"
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 flex items-center justify-center bg-black/0 transition-colors group-hover:bg-black/[0.35]">
                      <span className="rounded-full border border-white/20 bg-black/[0.55] px-3 py-1 text-sm text-white opacity-0 transition-opacity group-hover:opacity-100">
                        {currentLang === 'en' ? 'View Image' : 'Vezi Imaginea'}
                      </span>
                    </div>
                  </div>
                  <Link
                    to={`${getLocalizedPath('/portfolio', '/portofoliu')}/${project.id}`}
                    className="block p-6"
                  >
                    <h3 className="mb-2 text-xl font-semibold">
                      {currentLang === 'en' ? project.title_en : project.title_ro}
                    </h3>
                    <p className="mb-4 text-surface-400">
                      {currentLang === 'en' ? project.description_en : project.description_ro}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {(project.tech_stack || []).map((tech) => (
                        <span key={tech} className="pill-chip">
                          {tech}
                        </span>
                      ))}
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {lightboxOpen && lightboxProject && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/95"
          onClick={closeLightbox}
        >
          <button
            onClick={closeLightbox}
            className="absolute right-4 top-4 z-10 rounded-full border border-white/15 bg-black/50 p-2 text-white/70 transition-colors hover:text-white"
            aria-label="Close lightbox"
          >
            <X className="h-8 w-8" />
          </button>

          {getLightboxImages(lightboxProject).length > 1 && (
            <button
              onClick={(e) => { e.stopPropagation(); prevImage() }}
              className="absolute left-4 z-10 rounded-full border border-white/15 bg-black/50 p-2 text-white/70 transition-colors hover:text-white"
              aria-label="Previous image"
            >
              <ChevronLeft className="h-10 w-10" />
            </button>
          )}

          <img
            src={getLightboxImages(lightboxProject)[lightboxIndex]}
            alt={currentLang === 'en' ? lightboxProject.title_en : lightboxProject.title_ro}
            className="max-h-[90vh] max-w-[90vw] object-contain"
            onClick={(e) => e.stopPropagation()}
          />

          {getLightboxImages(lightboxProject).length > 1 && (
            <button
              onClick={(e) => { e.stopPropagation(); nextImage() }}
              className="absolute right-4 z-10 rounded-full border border-white/15 bg-black/50 p-2 text-white/70 transition-colors hover:text-white"
              aria-label="Next image"
            >
              <ChevronRight className="h-10 w-10" />
            </button>
          )}

          {getLightboxImages(lightboxProject).length > 1 && (
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 rounded-full border border-white/15 bg-black/60 px-3 py-1 text-sm text-white/80">
              {lightboxIndex + 1} / {getLightboxImages(lightboxProject).length}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
