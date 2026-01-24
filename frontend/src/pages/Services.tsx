import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { ArrowRight, Code, Smartphone, Palette, Globe } from 'lucide-react'

export default function Services() {
  const { t, i18n } = useTranslation()
  const currentLang = i18n.language

  const getLocalizedPath = (enPath: string, roPath: string) => {
    return currentLang === 'en' ? enPath : roPath
  }

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
      <section className="section">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h1 className="heading-1 mb-6">
              <span className="gradient-text">{t('services.title')}</span>
            </h1>
            <p className="text-xl text-surface-300">
              {t('services.subtitle')}
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {services.map((service) => (
              <Link
                key={service.href}
                to={service.href}
                className="glass-card p-8 hover:border-primary-500/50 transition-all duration-300 group"
              >
                <div className="w-16 h-16 rounded-2xl bg-primary-500/20 flex items-center justify-center mb-6 group-hover:bg-primary-500/30 transition-colors">
                  <service.icon className="w-8 h-8 text-primary-400" />
                </div>
                <h3 className="text-2xl font-semibold mb-4">{service.title}</h3>
                <p className="text-surface-400 mb-6">{service.description}</p>
                <span className="text-primary-400 inline-flex items-center font-medium group-hover:text-primary-300">
                  {t('services.learnMore')}
                  <ArrowRight className="w-5 h-5 ml-2 transform group-hover:translate-x-1 transition-transform" />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
