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
    <div className="pt-16 md:pt-20">
      <section className="section">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <div className="w-20 h-20 rounded-2xl bg-primary-500/20 flex items-center justify-center mx-auto mb-8">
              <Palette className="w-10 h-10 text-primary-400" />
            </div>
            <h1 className="heading-1 mb-6">
              <span className="gradient-text">{t('services.design')}</span>
            </h1>
            <p className="text-xl text-surface-300">
              {t('services.designDesc')}
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 items-start">
            <div className="glass-card p-8">
              <h2 className="heading-3 mb-6">Our process</h2>
              <ul className="space-y-4">
                {features.map((feature) => (
                  <li key={feature} className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-primary-400 mt-1 flex-shrink-0" />
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
                    className="px-4 py-2 bg-primary-500/20 text-primary-300 rounded-full text-sm"
                  >
                    {tool}
                  </span>
                ))}
              </div>

              <div className="mt-8 pt-8 border-t border-white/10">
                <h3 className="font-semibold mb-4">What you get</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center gap-2 text-surface-400">
                    <Eye className="w-4 h-4 text-primary-400" />
                    User-focused
                  </div>
                  <div className="flex items-center gap-2 text-surface-400">
                    <Layers className="w-4 h-4 text-primary-400" />
                    Consistent
                  </div>
                  <div className="flex items-center gap-2 text-surface-400">
                    <Sparkles className="w-4 h-4 text-primary-400" />
                    Modern
                  </div>
                  <div className="flex items-center gap-2 text-surface-400">
                    <Palette className="w-4 h-4 text-primary-400" />
                    Beautiful
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="text-center mt-12">
            <Link
              to={currentLang === 'en' ? '/booking' : '/programare'}
              className="btn-primary text-lg"
            >
              {t('hero.cta')}
              <ArrowRight className="w-5 h-5 ml-2" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
