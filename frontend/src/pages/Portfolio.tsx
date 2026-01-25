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
    <div className="pt-16 md:pt-20">
      <section className="section">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h1 className="heading-1 mb-6">
              <span className="gradient-text">{t('portfolio.title')}</span>
            </h1>
            <p className="text-xl text-surface-300">
              {t('portfolio.subtitle')}
            </p>
          </div>

          {/* Filter and Sort */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-12">
            <div className="flex flex-wrap justify-center gap-4">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setFilter(cat.id)}
                  className={`px-6 py-2 rounded-full transition-colors ${
                    filter === cat.id
                      ? 'bg-primary-500 text-white'
                      : 'bg-white/5 text-surface-300 hover:bg-white/10'
                  }`}
                >
                  {currentLang === 'en' ? cat.label_en : cat.label_ro}
                </button>
              ))}
            </div>
            <div className="flex items-center gap-2">
              <ArrowUpDown className="w-4 h-4 text-surface-400" />
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                className="bg-white/5 border border-white/10 text-surface-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                {sortOptions.map((option) => (
                  <option key={option.id} value={option.id} className="bg-surface-900">
                    {currentLang === 'en' ? option.label_en : option.label_ro}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Projects Grid */}
          {loading ? (
            <div className="flex justify-center items-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
            </div>
          ) : error ? (
            <ErrorMessage
              error={error}
              isNetworkError={isNetworkError}
              onRetry={fetchProjects}
            />
          ) : filteredProjects.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="text-6xl mb-4">📂</div>
              <h3 className="text-xl font-semibold mb-2">
                {currentLang === 'en' ? 'No projects found' : 'Nu am găsit proiecte'}
              </h3>
              <p className="text-surface-400">
                {currentLang === 'en'
                  ? 'Try selecting a different category'
                  : 'Încercați să selectați o altă categorie'}
              </p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 gap-8">
              {filteredProjects.map((project) => (
                <div
                  key={project.id}
                  className="glass-card overflow-hidden group"
                >
                  <div
                    className="aspect-video overflow-hidden cursor-pointer relative"
                    onClick={(e) => openLightbox(project, e)}
                  >
                    <img
                      src={project.thumbnail_url || ''}
                      alt={currentLang === 'en' ? project.title_en : project.title_ro}
                      loading="lazy"
                      className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                      <span className="opacity-0 group-hover:opacity-100 transition-opacity text-white text-sm bg-black/50 px-3 py-1 rounded-full">
                        {currentLang === 'en' ? 'View Image' : 'Vezi Imaginea'}
                      </span>
                    </div>
                  </div>
                  <Link
                    to={`${getLocalizedPath('/portfolio', '/portofoliu')}/${project.id}`}
                    className="block p-6 hover:bg-white/5 transition-colors"
                  >
                    <h3 className="text-xl font-semibold mb-2">
                      {currentLang === 'en' ? project.title_en : project.title_ro}
                    </h3>
                    <p className="text-surface-400 mb-4">
                      {currentLang === 'en' ? project.description_en : project.description_ro}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {(project.tech_stack || []).map((tech) => (
                        <span
                          key={tech}
                          className="px-3 py-1 text-xs bg-primary-500/20 text-primary-300 rounded-full"
                        >
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

      {/* Lightbox Modal */}
      {lightboxOpen && lightboxProject && (
        <div
          className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center"
          onClick={closeLightbox}
        >
          {/* Close button */}
          <button
            onClick={closeLightbox}
            className="absolute top-4 right-4 p-2 text-white/70 hover:text-white transition-colors z-10"
            aria-label="Close lightbox"
          >
            <X className="w-8 h-8" />
          </button>

          {/* Previous button */}
          {getLightboxImages(lightboxProject).length > 1 && (
            <button
              onClick={(e) => { e.stopPropagation(); prevImage(); }}
              className="absolute left-4 p-2 text-white/70 hover:text-white transition-colors z-10"
              aria-label="Previous image"
            >
              <ChevronLeft className="w-10 h-10" />
            </button>
          )}

          {/* Image */}
          <img
            src={getLightboxImages(lightboxProject)[lightboxIndex]}
            alt={currentLang === 'en' ? lightboxProject.title_en : lightboxProject.title_ro}
            className="max-h-[90vh] max-w-[90vw] object-contain"
            onClick={(e) => e.stopPropagation()}
          />

          {/* Next button */}
          {getLightboxImages(lightboxProject).length > 1 && (
            <button
              onClick={(e) => { e.stopPropagation(); nextImage(); }}
              className="absolute right-4 p-2 text-white/70 hover:text-white transition-colors z-10"
              aria-label="Next image"
            >
              <ChevronRight className="w-10 h-10" />
            </button>
          )}

          {/* Image counter */}
          {getLightboxImages(lightboxProject).length > 1 && (
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white/70 text-sm">
              {lightboxIndex + 1} / {getLightboxImages(lightboxProject).length}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
