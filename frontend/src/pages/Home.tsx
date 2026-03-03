import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { ArrowRight, Code, Smartphone, Palette, Globe, ChevronLeft, ChevronRight, Quote, Calendar } from 'lucide-react'
import { useState, useEffect, useCallback } from 'react'
import { fetchArticles, fetchFeaturedProjects, fetchTestimonials } from '@/lib/data-layer'
import type { Project, Article, Testimonial } from '@/lib/supabase'
import ResponsiveImage from '@/components/ui/ResponsiveImage'

// Helper function to format date
const formatDate = (dateString: string | null, lang: string): string => {
  if (!dateString) return ''
  const date = new Date(dateString)
  return date.toLocaleDateString(lang === 'en' ? 'en-US' : 'ro-RO', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

export default function Home() {
  const { t, i18n } = useTranslation()
  const currentLang = i18n.language
  const [currentTestimonial, setCurrentTestimonial] = useState(0)
  const [featuredProjects, setFeaturedProjects] = useState<Project[]>([])
  const [blogArticles, setBlogArticles] = useState<Article[]>([])
  const [loadingProjects, setLoadingProjects] = useState(true)
  const [loadingArticles, setLoadingArticles] = useState(true)
  const [testimonials, setTestimonials] = useState<Testimonial[]>([])
  const [loadingTestimonials, setLoadingTestimonials] = useState(true)

  const getLocalizedPath = (enPath: string, roPath: string) => {
    return currentLang === 'en' ? enPath : roPath
  }

  // Fetch featured projects from data layer
  const loadFeaturedProjects = useCallback(async () => {
    setLoadingProjects(true)

    try {
      const data = await fetchFeaturedProjects()
      setFeaturedProjects(data.slice(0, 4))
    } catch (err) {
      console.error('Error fetching featured projects:', err)
      setFeaturedProjects([])
    } finally {
      setLoadingProjects(false)
    }
  }, [])

  useEffect(() => {
    loadFeaturedProjects()
  }, [loadFeaturedProjects])

  // Fetch latest blog articles from data layer
  const fetchLatestArticles = useCallback(async () => {
    setLoadingArticles(true)

    try {
      const { data } = await fetchArticles({ page: 1, limit: 3 })
      setBlogArticles(data)
    } catch (err) {
      console.error('Error fetching blog articles:', err)
      setBlogArticles([])
    } finally {
      setLoadingArticles(false)
    }
  }, [])

  useEffect(() => {
    fetchLatestArticles()
  }, [fetchLatestArticles])

  // Fetch testimonials from data layer
  const loadTestimonials = useCallback(async () => {
    setLoadingTestimonials(true)
    try {
      const data = await fetchTestimonials()
      setTestimonials(data)
    } catch (err) {
      console.error('Error fetching testimonials:', err)
      setTestimonials([])
    } finally {
      setLoadingTestimonials(false)
    }
  }, [])

  useEffect(() => {
    loadTestimonials()
  }, [loadTestimonials])

  // Auto-rotate testimonials
  useEffect(() => {
    if (testimonials.length === 0) return
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length)
    }, 5000)
    return () => clearInterval(interval)
  }, [testimonials.length])

  const services = [
    {
      icon: Globe,
      title: t('services.webDev'),
      description: t('services.webDevDesc'),
      href: getLocalizedPath('/services/web-development', '/servicii/dezvoltare-web'),
    },
    {
      icon: Code,
      title: t('services.webApps'),
      description: t('services.webAppsDesc'),
      href: getLocalizedPath('/services/web-apps', '/servicii/aplicatii-web'),
    },
    {
      icon: Smartphone,
      title: t('services.mobile'),
      description: t('services.mobileDesc'),
      href: getLocalizedPath('/services/mobile', '/servicii/mobile'),
    },
    {
      icon: Palette,
      title: t('services.design'),
      description: t('services.designDesc'),
      href: getLocalizedPath('/services/design', '/servicii/design'),
    },
  ]

  return (
    <div className="page-shell">
      <section className="section relative overflow-hidden pb-24 pt-28 md:pt-36">
        <div className="hero-backdrop" />
        <div className="hero-grid-overlay" />
        <div className="container-custom">
          <div className="mx-auto max-w-4xl text-center">
            <span className="section-kicker animate-fade-in">Premium Digital Agency</span>
            <h1 className="heading-1 animate-fade-in-up">
              <span className="gradient-text">{t('hero.title')}</span>
            </h1>
            <p className="mx-auto mt-6 max-w-3xl text-xl text-surface-300 md:text-2xl">
              {t('hero.subtitle')}
            </p>
            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link
                to={getLocalizedPath('/booking', '/programare')}
                className="btn-primary text-base md:text-lg"
              >
                {t('hero.cta')}
                <ArrowRight className="h-5 w-5" />
              </Link>
              <Link
                to={getLocalizedPath('/portfolio', '/portofoliu')}
                className="btn-secondary text-base md:text-lg"
              >
                {t('hero.secondaryCta')}
              </Link>
            </div>
            <div className="mt-12 grid gap-4 sm:grid-cols-3">
              <div className="glass-card px-5 py-4 text-left">
                <p className="text-sm text-surface-400">Delivery Speed</p>
                <p className="mt-1 font-display text-xl font-semibold text-white">2-6 weeks</p>
              </div>
              <div className="glass-card px-5 py-4 text-left">
                <p className="text-sm text-surface-400">Product Focus</p>
                <p className="mt-1 font-display text-xl font-semibold text-white">Web + Mobile</p>
              </div>
              <div className="glass-card px-5 py-4 text-left">
                <p className="text-sm text-surface-400">Client Support</p>
                <p className="mt-1 font-display text-xl font-semibold text-white">Ongoing</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section border-y border-white/[0.08] bg-surface-950/[0.45]" id="services">
        <div className="container-custom">
          <div className="mb-14 text-center">
            <span className="section-kicker">Services</span>
            <h2 className="heading-2 mt-3">{t('services.title')}</h2>
            <p className="section-subtitle mt-4">{t('services.subtitle')}</p>
          </div>

          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
            {services.map((service, index) => (
              <Link
                key={service.href}
                to={service.href}
                className="glass-card group flex h-full flex-col p-6"
                style={{ animationDelay: `${index * 90}ms` }}
              >
                <div className="mb-5 inline-flex h-12 w-12 items-center justify-center rounded-xl border border-primary-500/[0.35] bg-primary-500/[0.12]">
                  <service.icon className="h-6 w-6 text-primary-300" />
                </div>
                <h3 className="text-xl font-semibold text-white">{service.title}</h3>
                <p className="mt-3 flex-1 text-sm text-surface-400">{service.description}</p>
                <span className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-primary-300 transition-colors group-hover:text-primary-200">
                  {t('services.learnMore')}
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="section" id="portfolio">
        <div className="container-custom">
          <div className="mb-14 text-center">
            <span className="section-kicker">Case Studies</span>
            <h2 className="heading-2 mt-3">{t('portfolio.title')}</h2>
            <p className="section-subtitle mt-4">{t('portfolio.subtitle')}</p>
          </div>

          {loadingProjects ? (
            <div className="flex justify-center">
              <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-t-2 border-primary-500" />
            </div>
          ) : featuredProjects.length === 0 ? (
            <div className="panel-shell px-8 py-16 text-center">
              <p className="text-surface-400">{t('portfolio.noProjects', 'No projects available yet.')}</p>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {featuredProjects.map((project) => (
                <a
                  key={project.id}
                  href={project.live_url || getLocalizedPath('/portfolio', '/portofoliu')}
                  target={project.live_url ? '_blank' : undefined}
                  rel={project.live_url ? 'noopener noreferrer' : undefined}
                  className="glass-card group overflow-hidden"
                >
                  <div className="aspect-video overflow-hidden border-b border-white/10">
                    <ResponsiveImage
                      src={project.thumbnail_url || 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&auto=format&fit=crop&q=60'}
                      alt={currentLang === 'en' ? project.title_en : project.title_ro}
                      sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-semibold text-white">
                      {currentLang === 'en' ? project.title_en : project.title_ro}
                    </h3>
                    <p className="mt-3 text-sm text-surface-400">
                      {currentLang === 'en' ? project.description_en : project.description_ro}
                    </p>
                    <div className="mt-4 flex flex-wrap gap-2">
                      {project.tech_stack?.slice(0, 4).map((tech) => (
                        <span key={tech} className="pill-chip">
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                </a>
              ))}
            </div>
          )}

          <div className="mt-10 text-center">
            <Link
              to={getLocalizedPath('/portfolio', '/portofoliu')}
              className="btn-outline"
            >
              {t('portfolio.viewAll')}
              <ArrowRight className="h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>

      <section className="section border-y border-white/[0.08] bg-surface-950/[0.45]" id="testimonials">
        <div className="container-custom">
          <div className="mb-14 text-center">
            <span className="section-kicker">Client Feedback</span>
            <h2 className="heading-2 mt-3">{t('testimonials.title')}</h2>
            <p className="section-subtitle mt-4">{t('testimonials.subtitle')}</p>
          </div>

          {loadingTestimonials ? (
            <div className="flex justify-center">
              <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-t-2 border-primary-500" />
            </div>
          ) : testimonials.length === 0 ? (
            <div className="panel-shell px-8 py-16 text-center">
              <p className="text-surface-400">{t('testimonials.noTestimonials', 'No testimonials available yet.')}</p>
            </div>
          ) : (
            <div className="mx-auto max-w-4xl">
              <div className="glass-card relative p-8 md:p-12">
                <Quote className="absolute left-6 top-6 h-10 w-10 text-primary-500/30" />
                <div className="text-center">
                  <p className="relative z-10 text-xl text-surface-200 md:text-2xl">
                    "{currentLang === 'en'
                      ? testimonials[currentTestimonial]?.text_en
                      : testimonials[currentTestimonial]?.text_ro}"
                  </p>
                  <div className="mt-8 flex items-center justify-center gap-4">
                    <img
                      src={testimonials[currentTestimonial]?.avatar || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=60'}
                      alt={testimonials[currentTestimonial]?.name}
                      loading="lazy"
                      className="h-14 w-14 rounded-full border border-white/15 object-cover"
                    />
                    <div className="text-left">
                      <p className="font-semibold">{testimonials[currentTestimonial]?.name}</p>
                      <p className="text-sm text-surface-400">{testimonials[currentTestimonial]?.company}</p>
                    </div>
                  </div>
                </div>

                <div className="mt-8 flex justify-center gap-2">
                  {testimonials.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentTestimonial(index)}
                      className={`h-2 rounded-full transition-all ${
                        index === currentTestimonial ? 'w-8 bg-primary-500' : 'w-2 bg-surface-600 hover:bg-surface-500'
                      }`}
                      aria-label={`Go to testimonial ${index + 1}`}
                    />
                  ))}
                </div>

                <button
                  onClick={() => setCurrentTestimonial((prev) => (prev - 1 + testimonials.length) % testimonials.length)}
                  className="absolute left-4 top-1/2 hidden -translate-y-1/2 rounded-full border border-white/10 bg-white/5 p-2 transition-colors hover:bg-white/10 md:block"
                  aria-label="Previous testimonial"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
                <button
                  onClick={() => setCurrentTestimonial((prev) => (prev + 1) % testimonials.length)}
                  className="absolute right-4 top-1/2 hidden -translate-y-1/2 rounded-full border border-white/10 bg-white/5 p-2 transition-colors hover:bg-white/10 md:block"
                  aria-label="Next testimonial"
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
              </div>
            </div>
          )}
        </div>
      </section>

      <section className="section" id="blog">
        <div className="container-custom">
          <div className="mb-14 text-center">
            <span className="section-kicker">Insights</span>
            <h2 className="heading-2 mt-3">{t('blogPreview.title')}</h2>
            <p className="section-subtitle mt-4">{t('blogPreview.subtitle')}</p>
          </div>

          {loadingArticles ? (
            <div className="flex justify-center">
              <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-t-2 border-primary-500" />
            </div>
          ) : blogArticles.length === 0 ? (
            <div className="panel-shell px-8 py-16 text-center">
              <p className="text-surface-400">{t('blogPreview.noArticles', 'No articles available yet.')}</p>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {blogArticles.map((article) => (
                <Link
                  key={article.id}
                  to={`/blog/${article.slug}`}
                  className="glass-card group overflow-hidden"
                >
                  <div className="aspect-video overflow-hidden border-b border-white/10">
                    <ResponsiveImage
                      src={article.cover_image || 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=800&auto=format&fit=crop&q=60'}
                      alt={currentLang === 'en' ? article.title_en : article.title_ro}
                      sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                  <div className="p-6">
                    <div className="mb-3 flex items-center justify-between">
                      <span className="text-xs font-semibold uppercase tracking-[0.12em] text-primary-300">
                        {article.category}
                      </span>
                      <span className="inline-flex items-center gap-1 text-xs text-surface-500">
                        <Calendar className="h-3 w-3" />
                        {formatDate(article.published_at, currentLang)}
                      </span>
                    </div>
                    <h3 className="text-xl font-semibold text-white">
                      {currentLang === 'en' ? article.title_en : article.title_ro}
                    </h3>
                    <p className="mt-3 text-sm text-surface-400">
                      {currentLang === 'en' ? article.excerpt_en : article.excerpt_ro}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          )}

          <div className="mt-10 text-center">
            <Link to="/blog" className="btn-outline">
              {t('blogPreview.viewAll')}
              <ArrowRight className="h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>

      <section className="section relative overflow-hidden pb-24 pt-10" id="cta">
        <div className="container-custom">
          <div className="panel-shell relative overflow-hidden px-8 py-14 text-center md:px-12">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(196,30,58,0.24),transparent_58%)]" />
            <div className="relative z-10 mx-auto max-w-3xl">
              <span className="section-kicker">Let's Build</span>
              <h2 className="heading-2 mt-3">{t('cta.title')}</h2>
              <p className="mt-5 text-xl text-surface-300">{t('cta.subtitle')}</p>
              <Link
                to={getLocalizedPath('/booking', '/programare')}
                className="btn-primary mt-10 text-base md:text-lg"
              >
                {t('cta.button')}
                <ArrowRight className="h-5 w-5" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
