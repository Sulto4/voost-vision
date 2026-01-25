import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { ArrowRight, Code, Smartphone, Palette, Globe, ChevronLeft, ChevronRight, Quote, Calendar } from 'lucide-react'
import { useState, useEffect, useCallback } from 'react'
import { supabase, Project, Article } from '@/lib/supabase'
import ErrorMessage from '@/components/ui/ErrorMessage'

// Sample testimonials
const testimonials = [
  {
    id: 1,
    name: 'Maria Popescu',
    company: 'TechStart SRL',
    text_ro: 'Voost Vision a transformat complet prezenta noastra online. Site-ul nou ne-a crescut conversiile cu 40%.',
    text_en: 'Voost Vision completely transformed our online presence. The new website increased our conversions by 40%.',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=60',
  },
  {
    id: 2,
    name: 'Andrei Ionescu',
    company: 'Digital Solutions',
    text_ro: 'Profesionalism, creativitate si atentie la detalii. Echipa Voost Vision livreaza rezultate exceptionale.',
    text_en: 'Professionalism, creativity and attention to detail. The Voost Vision team delivers exceptional results.',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=60',
  },
  {
    id: 3,
    name: 'Elena Dumitrescu',
    company: 'Artisan Coffee',
    text_ro: 'Aplicatia mobila dezvoltata de Voost Vision ne-a ajutat sa ne conectam mai bine cu clientii nostri.',
    text_en: 'The mobile app developed by Voost Vision helped us connect better with our customers.',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&auto=format&fit=crop&q=60',
  },
]

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
  const [projectsError, setProjectsError] = useState<string | null>(null)
  const [projectsNetworkError, setProjectsNetworkError] = useState(false)
  const [articlesError, setArticlesError] = useState<string | null>(null)
  const [articlesNetworkError, setArticlesNetworkError] = useState(false)

  const getLocalizedPath = (enPath: string, roPath: string) => {
    return currentLang === 'en' ? enPath : roPath
  }

  // Fetch featured projects from database
  const fetchFeaturedProjects = useCallback(async () => {
    setLoadingProjects(true)
    setProjectsError(null)
    setProjectsNetworkError(false)

    try {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .eq('featured', true)
        .eq('published', true)
        .order('created_at', { ascending: false })
        .limit(4)

      if (error) {
        const isNetwork = !navigator.onLine ||
          error.message?.includes('fetch') ||
          error.message?.includes('network') ||
          error.message?.includes('Failed to fetch')
        setProjectsNetworkError(isNetwork)
        setProjectsError(error.message)
        console.error('Error fetching projects:', error.message)
      } else {
        setFeaturedProjects(data || [])
      }
    } catch (err) {
      const isNetwork = !navigator.onLine ||
        (err instanceof TypeError && err.message?.includes('fetch'))
      setProjectsNetworkError(isNetwork)
      setProjectsError(err instanceof Error ? err.message : 'Unknown error')
      console.error('Error:', err instanceof Error ? err.message : 'Unknown error')
    } finally {
      setLoadingProjects(false)
    }
  }, [])

  useEffect(() => {
    fetchFeaturedProjects()
  }, [fetchFeaturedProjects])

  // Fetch latest blog articles from database
  const fetchLatestArticles = useCallback(async () => {
    setLoadingArticles(true)
    setArticlesError(null)
    setArticlesNetworkError(false)

    try {
      const { data, error } = await supabase
        .from('articles')
        .select('*')
        .eq('published', true)
        .order('published_at', { ascending: false })
        .limit(3)

      if (error) {
        const isNetwork = !navigator.onLine ||
          error.message?.includes('fetch') ||
          error.message?.includes('network') ||
          error.message?.includes('Failed to fetch')
        setArticlesNetworkError(isNetwork)
        setArticlesError(error.message)
        console.error('Error fetching articles:', error.message)
      } else {
        setBlogArticles(data || [])
      }
    } catch (err) {
      const isNetwork = !navigator.onLine ||
        (err instanceof TypeError && err.message?.includes('fetch'))
      setArticlesNetworkError(isNetwork)
      setArticlesError(err instanceof Error ? err.message : 'Unknown error')
      console.error('Error:', err instanceof Error ? err.message : 'Unknown error')
    } finally {
      setLoadingArticles(false)
    }
  }, [])

  useEffect(() => {
    fetchLatestArticles()
  }, [fetchLatestArticles])

  // Auto-rotate testimonials
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length)
    }, 5000)
    return () => clearInterval(interval)
  }, [])

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
    <div className="pt-16 md:pt-20">
      {/* Hero Section */}
      <section className="section min-h-[90vh] flex items-center relative overflow-hidden">
        {/* Background gradient effects */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-primary-500/20 rounded-full blur-3xl -z-10" />
        <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-primary-700/10 rounded-full blur-3xl -z-10" />

        <div className="container-custom">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="heading-1 mb-6 animate-fade-in-up">
              <span className="gradient-text">{t('hero.title')}</span>
            </h1>
            <p className="text-xl md:text-2xl text-surface-300 mb-10 animate-fade-in-up animate-delay-100">
              {t('hero.subtitle')}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in-up animate-delay-200">
              <Link
                to={getLocalizedPath('/booking', '/programare')}
                className="btn-primary text-lg"
              >
                {t('hero.cta')}
                <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
              <Link
                to={getLocalizedPath('/portfolio', '/portofoliu')}
                className="btn-secondary text-lg"
              >
                {t('hero.secondaryCta')}
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="section bg-surface-950/50" id="services">
        <div className="container-custom">
          <div className="text-center mb-16">
            <h2 className="heading-2 mb-4">{t('services.title')}</h2>
            <p className="text-xl text-surface-400">{t('services.subtitle')}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {services.map((service, index) => (
              <Link
                key={service.href}
                to={service.href}
                className="glass-card p-6 hover:border-primary-500/50 transition-all duration-300 group"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="w-12 h-12 rounded-xl bg-primary-500/20 flex items-center justify-center mb-4 group-hover:bg-primary-500/30 transition-colors">
                  <service.icon className="w-6 h-6 text-primary-400" />
                </div>
                <h3 className="text-xl font-semibold mb-2">{service.title}</h3>
                <p className="text-surface-400 mb-4">{service.description}</p>
                <span className="text-primary-400 inline-flex items-center text-sm font-medium group-hover:text-primary-300">
                  {t('services.learnMore')}
                  <ArrowRight className="w-4 h-4 ml-1 transform group-hover:translate-x-1 transition-transform" />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Portfolio Section */}
      <section className="section" id="portfolio">
        <div className="container-custom">
          <div className="text-center mb-16">
            <h2 className="heading-2 mb-4">{t('portfolio.title')}</h2>
            <p className="text-xl text-surface-400">{t('portfolio.subtitle')}</p>
          </div>

          {loadingProjects ? (
            <div className="flex justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
            </div>
          ) : projectsError ? (
            <ErrorMessage
              error={projectsError}
              isNetworkError={projectsNetworkError}
              onRetry={fetchFeaturedProjects}
            />
          ) : featuredProjects.length === 0 ? (
            <div className="text-center text-surface-400">
              <p>{t('portfolio.noProjects', 'No projects available yet.')}</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredProjects.map((project) => (
                <Link
                  key={project.id}
                  to={`${getLocalizedPath('/portfolio', '/portofoliu')}/${project.id}`}
                  className="glass-card overflow-hidden group"
                >
                  <div className="aspect-video overflow-hidden">
                    <img
                      src={project.thumbnail_url || 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&auto=format&fit=crop&q=60'}
                      alt={currentLang === 'en' ? project.title_en : project.title_ro}
                      className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-semibold mb-2">
                      {currentLang === 'en' ? project.title_en : project.title_ro}
                    </h3>
                    <p className="text-surface-400 mb-4">
                      {currentLang === 'en' ? project.description_en : project.description_ro}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {project.tech_stack?.map((tech) => (
                        <span
                          key={tech}
                          className="px-3 py-1 text-xs bg-primary-500/20 text-primary-300 rounded-full"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}

          <div className="text-center mt-12">
            <Link
              to={getLocalizedPath('/portfolio', '/portofoliu')}
              className="btn-outline"
            >
              {t('portfolio.viewAll')}
              <ArrowRight className="w-5 h-5 ml-2" />
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="section bg-surface-950/50" id="testimonials">
        <div className="container-custom">
          <div className="text-center mb-16">
            <h2 className="heading-2 mb-4">{t('testimonials.title')}</h2>
            <p className="text-xl text-surface-400">{t('testimonials.subtitle')}</p>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="glass-card p-8 md:p-12 relative">
              <Quote className="w-12 h-12 text-primary-500/30 absolute top-6 left-6" />

              <div className="text-center">
                <p className="text-xl md:text-2xl text-surface-200 mb-8 relative z-10">
                  "{currentLang === 'en'
                    ? testimonials[currentTestimonial].text_en
                    : testimonials[currentTestimonial].text_ro}"
                </p>

                <div className="flex items-center justify-center gap-4">
                  <img
                    src={testimonials[currentTestimonial].avatar}
                    alt={testimonials[currentTestimonial].name}
                    className="w-14 h-14 rounded-full object-cover"
                  />
                  <div className="text-left">
                    <p className="font-semibold">{testimonials[currentTestimonial].name}</p>
                    <p className="text-surface-400 text-sm">{testimonials[currentTestimonial].company}</p>
                  </div>
                </div>
              </div>

              {/* Navigation dots */}
              <div className="flex justify-center gap-2 mt-8">
                {testimonials.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentTestimonial(index)}
                    className={`w-2 h-2 rounded-full transition-colors ${
                      index === currentTestimonial
                        ? 'bg-primary-500'
                        : 'bg-surface-600 hover:bg-surface-500'
                    }`}
                    aria-label={`Go to testimonial ${index + 1}`}
                  />
                ))}
              </div>

              {/* Arrow navigation */}
              <button
                onClick={() => setCurrentTestimonial((prev) => (prev - 1 + testimonials.length) % testimonials.length)}
                className="absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/5 hover:bg-white/10 transition-colors hidden md:block"
                aria-label="Previous testimonial"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={() => setCurrentTestimonial((prev) => (prev + 1) % testimonials.length)}
                className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/5 hover:bg-white/10 transition-colors hidden md:block"
                aria-label="Next testimonial"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Blog Preview Section */}
      <section className="section" id="blog">
        <div className="container-custom">
          <div className="text-center mb-16">
            <h2 className="heading-2 mb-4">{t('blogPreview.title')}</h2>
            <p className="text-xl text-surface-400">{t('blogPreview.subtitle')}</p>
          </div>

          {loadingArticles ? (
            <div className="flex justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
            </div>
          ) : articlesError ? (
            <ErrorMessage
              error={articlesError}
              isNetworkError={articlesNetworkError}
              onRetry={fetchLatestArticles}
            />
          ) : blogArticles.length === 0 ? (
            <div className="text-center text-surface-400">
              <p>{t('blogPreview.noArticles', 'No articles available yet.')}</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {blogArticles.map((article) => (
                <Link
                  key={article.id}
                  to={`/blog/${article.slug}`}
                  className="glass-card overflow-hidden group"
                >
                  <div className="aspect-video overflow-hidden">
                    <img
                      src={article.cover_image || 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=800&auto=format&fit=crop&q=60'}
                      alt={currentLang === 'en' ? article.title_en : article.title_ro}
                      className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs text-primary-400 font-medium uppercase tracking-wide">
                        {article.category}
                      </span>
                      <span className="text-xs text-surface-500 flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {formatDate(article.published_at, currentLang)}
                      </span>
                    </div>
                    <h3 className="text-xl font-semibold mb-3">
                      {currentLang === 'en' ? article.title_en : article.title_ro}
                    </h3>
                    <p className="text-surface-400">
                      {currentLang === 'en' ? article.excerpt_en : article.excerpt_ro}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          )}

          <div className="text-center mt-12">
            <Link to="/blog" className="btn-outline">
              {t('blogPreview.viewAll')}
              <ArrowRight className="w-5 h-5 ml-2" />
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section bg-gradient-to-b from-surface-950 to-surface-900 relative overflow-hidden" id="cta">
        {/* Background effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-primary-500/10 to-primary-700/10" />

        <div className="container-custom relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="heading-2 mb-6">{t('cta.title')}</h2>
            <p className="text-xl text-surface-300 mb-10">
              {t('cta.subtitle')}
            </p>
            <Link
              to={getLocalizedPath('/booking', '/programare')}
              className="btn-primary text-lg"
            >
              {t('cta.button')}
              <ArrowRight className="w-5 h-5 ml-2" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
