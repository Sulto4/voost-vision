import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { ArrowRight, Check, Globe, Zap, Shield, Smartphone } from 'lucide-react'

export default function WebDevelopment() {
  const { t, i18n } = useTranslation()
  const currentLang = i18n.language

  const features = [
    'Landing pages & corporate sites',
    'E-commerce platforms',
    'Content management systems',
    'Progressive Web Apps (PWA)',
    'Performance optimization',
    'SEO-friendly architecture',
  ]

  const technologies = ['React', 'Next.js', 'TypeScript', 'Tailwind CSS', 'Node.js', 'WordPress', 'Shopify']

  return (
    <div className="pt-16 md:pt-20">
      <section className="section">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <div className="w-20 h-20 rounded-2xl bg-primary-500/20 flex items-center justify-center mx-auto mb-8">
              <Globe className="w-10 h-10 text-primary-400" />
            </div>
            <h1 className="heading-1 mb-6">
              <span className="gradient-text">{t('services.webDev')}</span>
            </h1>
            <p className="text-xl text-surface-300">
              {t('services.webDevDesc')}
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 items-start">
            {/* Features */}
            <div className="glass-card p-8">
              <h2 className="heading-3 mb-6">What we offer</h2>
              <ul className="space-y-4">
                {features.map((feature) => (
                  <li key={feature} className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-primary-400 mt-1 flex-shrink-0" />
                    <span className="text-surface-300">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Technologies */}
            <div className="glass-card p-8">
              <h2 className="heading-3 mb-6">Technologies</h2>
              <div className="flex flex-wrap gap-3">
                {technologies.map((tech) => (
                  <span
                    key={tech}
                    className="px-4 py-2 bg-primary-500/20 text-primary-300 rounded-full text-sm"
                  >
                    {tech}
                  </span>
                ))}
              </div>

              <div className="mt-8 pt-8 border-t border-white/10">
                <h3 className="font-semibold mb-4">Key benefits</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center gap-2 text-surface-400">
                    <Zap className="w-4 h-4 text-primary-400" />
                    Fast loading
                  </div>
                  <div className="flex items-center gap-2 text-surface-400">
                    <Shield className="w-4 h-4 text-primary-400" />
                    Secure
                  </div>
                  <div className="flex items-center gap-2 text-surface-400">
                    <Smartphone className="w-4 h-4 text-primary-400" />
                    Responsive
                  </div>
                  <div className="flex items-center gap-2 text-surface-400">
                    <Globe className="w-4 h-4 text-primary-400" />
                    SEO ready
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
