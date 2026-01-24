import { useTranslation } from 'react-i18next'
import { Link, useSearchParams } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { supabase, Project } from '@/lib/supabase'
import { X, ChevronLeft, ChevronRight } from 'lucide-react'

const categories = [
  { id: 'all', label_ro: 'Toate', label_en: 'All' },
  { id: 'web', label_ro: 'Web', label_en: 'Web' },
  { id: 'app', label_ro: 'Aplicatii', label_en: 'Apps' },
  { id: 'mobile', label_ro: 'Mobile', label_en: 'Mobile' },
  { id: 'design', label_ro: 'Design', label_en: 'Design' },
]

export default function Portfolio() {
  const { t, i18n } = useTranslation()
  const currentLang = i18n.language
  const [searchParams, setSearchParams] = useSearchParams()
  const filterFromUrl = searchParams.get('filter') || 'all'
  const [filter, setFilterState] = useState(filterFromUrl)
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [lightboxProject, setLightboxProject] = useState<Project | null>(null)
  const [lightboxIndex, setLightboxIndex] = useState(0)

  // Sync filter state with URL
  const setFilter = (newFilter: string) => {
    setFilterState(newFilter)
    if (newFilter === 'all') {
      setSearchParams({})
    } else {
      setSearchParams({ filter: newFilter })
    }
  }

  // Sync from URL on mount/change
  useEffect(() => {
    setFilterState(filterFromUrl)
  }, [filterFromUrl])

  useEffect(() => {
    async function fetchProjects() {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .eq('published', true)
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Error fetching projects:', error)
      } else {
        setProjects(data || [])
      }
      setLoading(false)
    }

    fetchProjects()
  }, [])

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

          {/* Filter */}
          <div className="flex flex-wrap justify-center gap-4 mb-12">
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

          {/* Projects Grid */}
          {loading ? (
            <div className="flex justify-center items-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
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
