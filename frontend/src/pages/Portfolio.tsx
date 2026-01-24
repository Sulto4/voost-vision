import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { supabase, Project } from '@/lib/supabase'

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
  const [filter, setFilter] = useState('all')
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)

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
                <Link
                  key={project.id}
                  to={`${getLocalizedPath('/portfolio', '/portofoliu')}/${project.id}`}
                  className="glass-card overflow-hidden group"
                >
                  <div className="aspect-video overflow-hidden">
                    <img
                      src={project.thumbnail_url || ''}
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
                      {(project.tech_stack || []).map((tech) => (
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
        </div>
      </section>
    </div>
  )
}
