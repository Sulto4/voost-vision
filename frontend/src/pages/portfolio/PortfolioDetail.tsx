import { useParams, Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { ArrowLeft, ExternalLink, X, ChevronLeft, ChevronRight } from 'lucide-react'
import { useState, useEffect } from 'react'
import { supabase, Project } from '@/lib/supabase'

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
      <div className="pt-16 md:pt-20">
        <section className="section min-h-[60vh] flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
        </section>
      </div>
    )
  }

  if (error || !project) {
    return (
      <div className="pt-16 md:pt-20">
        <section className="section min-h-[60vh] flex items-center">
          <div className="container-custom text-center">
            <h1 className="heading-2 mb-4">Project not found</h1>
            <Link
              to={currentLang === 'en' ? '/portfolio' : '/portofoliu'}
              className="btn-primary"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Back to Portfolio
            </Link>
          </div>
        </section>
      </div>
    )
  }

  const defaultImage = 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200&auto=format&fit=crop&q=80'

  return (
    <div className="pt-16 md:pt-20">
      <section className="section">
        <div className="container-custom">
          <Link
            to={currentLang === 'en' ? '/portfolio' : '/portofoliu'}
            className="inline-flex items-center text-surface-400 hover:text-white transition-colors mb-8"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Portfolio
          </Link>

          <div className="grid lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2">
              <img
                src={project.thumbnail_url || defaultImage}
                alt={currentLang === 'en' ? project.title_en : project.title_ro}
                className="w-full rounded-2xl mb-8 cursor-pointer hover:opacity-90 transition-opacity"
                onClick={() => openLightbox(0)}
              />

              {project.images && project.images.length > 0 && (
                <div className="grid grid-cols-2 gap-4">
                  {project.images.map((img, idx) => (
                    <img
                      key={idx}
                      src={img}
                      alt=""
                      className="w-full rounded-xl cursor-pointer hover:opacity-90 transition-opacity"
                      onClick={() => openLightbox(idx + 1)}
                    />
                  ))}
                </div>
              )}
            </div>

            <div>
              <div className="glass-card p-8 sticky top-28">
                <h1 className="heading-3 mb-4">
                  {currentLang === 'en' ? project.title_en : project.title_ro}
                </h1>
                <p className="text-surface-300 mb-6">
                  {currentLang === 'en' ? project.description_en : project.description_ro}
                </p>

                {project.tech_stack && project.tech_stack.length > 0 && (
                  <div className="mb-6">
                    <h3 className="text-sm font-semibold text-surface-400 uppercase tracking-wide mb-3">
                      Tech Stack
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {project.tech_stack.map((tech) => (
                        <span
                          key={tech}
                          className="px-3 py-1 text-sm bg-primary-500/20 text-primary-300 rounded-full"
                        >
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
                    <ExternalLink className="w-4 h-4 ml-2" />
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Lightbox Modal */}
      {lightboxOpen && allImages.length > 0 && (
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
          {allImages.length > 1 && (
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
            src={allImages[lightboxIndex]}
            alt=""
            className="max-h-[90vh] max-w-[90vw] object-contain"
            onClick={(e) => e.stopPropagation()}
          />

          {/* Next button */}
          {allImages.length > 1 && (
            <button
              onClick={(e) => { e.stopPropagation(); nextImage(); }}
              className="absolute right-4 p-2 text-white/70 hover:text-white transition-colors z-10"
              aria-label="Next image"
            >
              <ChevronRight className="w-10 h-10" />
            </button>
          )}

          {/* Image counter */}
          {allImages.length > 1 && (
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white/70 text-sm">
              {lightboxIndex + 1} / {allImages.length}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
