import { useParams, Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { ArrowLeft, ExternalLink, X, ChevronLeft, ChevronRight } from 'lucide-react'
import { useState, useEffect } from 'react'
import { supabase, Project } from '@/lib/supabase'
import Breadcrumbs from '@/components/ui/Breadcrumbs'

export default function PortfolioDetail() {
  const { id } = useParams()
  const { i18n } = useTranslation()
  const currentLang = i18n.language
  const [project, setProject] = useState<Project | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [lightboxIndex, setLightboxIndex] = useState(0)

  const allImages = project ? [project.thumbnail_url, ...(project.images || [])].filter(Boolean) as string[] : []

  const openLightbox = (index: number) => {
    setLightboxIndex(index)
    setLightboxOpen(true)
  }

  const closeLightbox = () => {
    setLightboxOpen(false)
  }

  const nextImage = () => {
    setLightboxIndex((prev) => (prev + 1) % allImages.length)
  }

  const prevImage = () => {
    setLightboxIndex((prev) => (prev - 1 + allImages.length) % allImages.length)
  }

  useEffect(() => {
    async function fetchProject() {
      if (!id) {
        setError('No project ID provided')
        setLoading(false)
        return
      }

      try {
        const { data, error: fetchError } = await supabase
          .from('projects')
          .select('*')
          .eq('id', id)
          .eq('published', true)
          .single()

        if (fetchError) {
          console.error('Error fetching project:', fetchError)
          setError('Project not found')
        } else {
          setProject(data)
        }
      } catch (err) {
        console.error('Error:', err)
        setError('An error occurred')
      } finally {
        setLoading(false)
      }
    }

    fetchProject()
  }, [id])

  if (loading) {
    return (
      <div className="page-shell">
        <section className="section flex min-h-[60vh] items-center justify-center">
          <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-t-2 border-primary-500" />
        </section>
      </div>
    )
  }

  if (error || !project) {
    return (
      <div className="page-shell">
        <section className="section flex min-h-[60vh] items-center">
          <div className="container-custom text-center">
            <h1 className="heading-2 mb-4">Project not found</h1>
            <Link
              to={currentLang === 'en' ? '/portfolio' : '/portofoliu'}
              className="btn-primary"
            >
              <ArrowLeft className="mr-2 h-5 w-5" />
              Back to Portfolio
            </Link>
          </div>
        </section>
      </div>
    )
  }

  const defaultImage = 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200&auto=format&fit=crop&q=80'

  const breadcrumbItems = [
    { label: currentLang === 'en' ? 'Portfolio' : 'Portofoliu', href: currentLang === 'en' ? '/portfolio' : '/portofoliu' },
    { label: currentLang === 'en' ? project.title_en : project.title_ro }
  ]

  return (
    <div className="page-shell">
      <section className="section relative overflow-hidden pb-16 pt-28 md:pt-32">
        <div className="hero-backdrop" />
        <div className="container-custom">
          <Breadcrumbs items={breadcrumbItems} className="mb-8" />

          <div className="grid gap-8 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <img
                src={project.thumbnail_url || defaultImage}
                alt={currentLang === 'en' ? project.title_en : project.title_ro}
                loading="lazy"
                className="mb-8 w-full cursor-pointer rounded-2xl border border-white/10 transition-opacity hover:opacity-90"
                onClick={() => openLightbox(0)}
              />

              {project.images && project.images.length > 0 && (
                <div className="grid grid-cols-2 gap-4">
                  {project.images.map((img, idx) => (
                    <img
                      key={idx}
                      src={img}
                      alt=""
                      loading="lazy"
                      className="w-full cursor-pointer rounded-xl border border-white/10 transition-opacity hover:opacity-90"
                      onClick={() => openLightbox(idx + 1)}
                    />
                  ))}
                </div>
              )}
            </div>

            <div>
              <div className="glass-card sticky top-28 p-8">
                <h1 className="heading-3 mb-4">
                  {currentLang === 'en' ? project.title_en : project.title_ro}
                </h1>
                <p className="text-surface-300 mb-6">
                  {currentLang === 'en' ? project.description_en : project.description_ro}
                </p>

                {project.tech_stack && project.tech_stack.length > 0 && (
                  <div className="mb-6">
                    <h3 className="mb-3 text-sm font-semibold uppercase tracking-[0.12em] text-surface-400">
                      Tech Stack
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {project.tech_stack.map((tech) => (
                        <span key={tech} className="pill-chip">
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {project.live_url && (
                  <a
                    href={project.live_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-primary w-full"
                  >
                    View Live Site
                    <ExternalLink className="ml-2 h-4 w-4" />
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {lightboxOpen && allImages.length > 0 && (
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

          {allImages.length > 1 && (
            <button
              onClick={(e) => { e.stopPropagation(); prevImage() }}
              className="absolute left-4 z-10 rounded-full border border-white/15 bg-black/50 p-2 text-white/70 transition-colors hover:text-white"
              aria-label="Previous image"
            >
              <ChevronLeft className="h-10 w-10" />
            </button>
          )}

          <img
            src={allImages[lightboxIndex]}
            alt=""
            className="max-h-[90vh] max-w-[90vw] object-contain"
            onClick={(e) => e.stopPropagation()}
          />

          {allImages.length > 1 && (
            <button
              onClick={(e) => { e.stopPropagation(); nextImage() }}
              className="absolute right-4 z-10 rounded-full border border-white/15 bg-black/50 p-2 text-white/70 transition-colors hover:text-white"
              aria-label="Next image"
            >
              <ChevronRight className="h-10 w-10" />
            </button>
          )}

          {allImages.length > 1 && (
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 rounded-full border border-white/15 bg-black/60 px-3 py-1 text-sm text-white/80">
              {lightboxIndex + 1} / {allImages.length}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
