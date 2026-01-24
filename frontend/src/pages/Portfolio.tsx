import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { useState } from 'react'

const projects = [
  {
    id: '1',
    title_ro: 'E-commerce Platform',
    title_en: 'E-commerce Platform',
    description_ro: 'Platforma de comert electronic pentru brand de moda',
    description_en: 'E-commerce platform for fashion brand',
    category: 'web',
    tech_stack: ['React', 'Node.js', 'Stripe'],
    thumbnail_url: 'https://images.unsplash.com/photo-1661956602116-aa6865609028?w=800&auto=format&fit=crop&q=60',
  },
  {
    id: '2',
    title_ro: 'Aplicatie de Fitness',
    title_en: 'Fitness Application',
    description_ro: 'Aplicatie mobila pentru tracking fitness si nutritie',
    description_en: 'Mobile app for fitness and nutrition tracking',
    category: 'mobile',
    tech_stack: ['React Native', 'Firebase', 'Redux'],
    thumbnail_url: 'https://images.unsplash.com/photo-1526628953301-3e589a6a8b74?w=800&auto=format&fit=crop&q=60',
  },
  {
    id: '3',
    title_ro: 'Dashboard Analytics',
    title_en: 'Analytics Dashboard',
    description_ro: 'Dashboard pentru analiza datelor de business',
    description_en: 'Business data analytics dashboard',
    category: 'app',
    tech_stack: ['Vue.js', 'D3.js', 'PostgreSQL'],
    thumbnail_url: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&auto=format&fit=crop&q=60',
  },
  {
    id: '4',
    title_ro: 'Brand Identity Design',
    title_en: 'Brand Identity Design',
    description_ro: 'Design complet de brand pentru startup tech',
    description_en: 'Complete brand design for tech startup',
    category: 'design',
    tech_stack: ['Figma', 'Adobe CC'],
    thumbnail_url: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800&auto=format&fit=crop&q=60',
  },
]

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
          <div className="grid md:grid-cols-2 gap-8">
            {filteredProjects.map((project) => (
              <Link
                key={project.id}
                to={`${getLocalizedPath('/portfolio', '/portofoliu')}/${project.id}`}
                className="glass-card overflow-hidden group"
              >
                <div className="aspect-video overflow-hidden">
                  <img
                    src={project.thumbnail_url}
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
                    {project.tech_stack.map((tech) => (
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
        </div>
      </section>
    </div>
  )
}
