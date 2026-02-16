import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { ArrowRight, Check, Palette, Layers, Eye, Sparkles } from 'lucide-react'

export default function Design() {
  const { t, i18n } = useTranslation()
  const currentLang = i18n.language

  const features = [
    'User research & personas',
    'Wireframes & prototypes',
    'Visual design',
    'Design systems',
    'Usability testing',
    'Brand identity',
  ]

  const tools = ['Figma', 'Adobe XD', 'Sketch', 'Adobe Creative Cloud', 'Principle', 'InVision']

  return (
    <div className="page-shell">
      <section className="section relative overflow-hidden pb-16 pt-28 md:pt-32">
        <div className="hero-backdrop" />
        <div className="container-custom">
          <div className="mx-auto mb-14 max-w-3xl text-center">
            <div className="mx-auto mb-8 flex h-20 w-20 items-center justify-center rounded-2xl border border-primary-500/[0.35] bg-primary-500/[0.12]">
              <Palette className="h-10 w-10 text-primary-300" />
            </div>
            <h1 className="heading-1 mb-6">
              <span className="gradient-text">{t('services.design')}</span>
            </h1>
            <p className="text-xl text-surface-300">
              {t('services.designDesc')}
            </p>
          </div>

          <div className="grid items-start gap-6 lg:grid-cols-2">
            <div className="glass-card p-8">
              <h2 className="heading-3 mb-6">Our process</h2>
              <ul className="space-y-4">
                {features.map((feature) => (
                  <li key={feature} className="flex items-start gap-3">
                    <Check className="mt-1 h-5 w-5 flex-shrink-0 text-primary-300" />
                    <span className="text-surface-300">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="glass-card p-8">
              <h2 className="heading-3 mb-6">Tools we use</h2>
              <div className="flex flex-wrap gap-3">
                {tools.map((tool) => (
                  <span
                    key={tool}
                    className="pill-chip border-primary-500/[0.25] bg-primary-500/[0.12] text-primary-200"
                  >
                    {tool}
                  </span>
                ))}
              </div>

              <div className="mt-8 border-t border-white/10 pt-8">
                <h3 className="font-semibold mb-4">What you get</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center gap-2 text-surface-400">
                    <Eye className="h-4 w-4 text-primary-300" />
                    User-focused
                  </div>
                  <div className="flex items-center gap-2 text-surface-400">
                    <Layers className="h-4 w-4 text-primary-300" />
                    Consistent
                  </div>
                  <div className="flex items-center gap-2 text-surface-400">
                    <Sparkles className="h-4 w-4 text-primary-300" />
                    Modern
                  </div>
                  <div className="flex items-center gap-2 text-surface-400">
                    <Palette className="h-4 w-4 text-primary-300" />
                    Beautiful
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-12 text-center">
            <Link
              to={currentLang === 'en' ? '/booking' : '/programare'}
              className="btn-primary text-lg"
            >
              {t('hero.cta')}
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
