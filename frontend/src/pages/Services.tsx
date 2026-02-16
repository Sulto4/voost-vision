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
    <div className="page-shell">
      <section className="section relative overflow-hidden pb-14 pt-28 md:pt-32">
        <div className="hero-backdrop" />
        <div className="container-custom">
          <div className="mx-auto mb-14 max-w-3xl text-center">
            <span className="section-kicker">Capabilities</span>
            <h1 className="heading-1 mt-3 mb-6">
              <span className="gradient-text">{t('services.title')}</span>
            </h1>
            <p className="text-xl text-surface-300">
              {t('services.subtitle')}
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {services.map((service) => (
              <Link
                key={service.href}
                to={service.href}
                className="glass-card group p-8"
              >
                <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl border border-primary-500/[0.35] bg-primary-500/[0.12]">
                  <service.icon className="h-7 w-7 text-primary-300" />
                </div>
                <h3 className="mb-4 text-2xl font-semibold">{service.title}</h3>
                <p className="mb-6 text-surface-400">{service.description}</p>
                <span className="inline-flex items-center font-semibold text-primary-300 transition-colors group-hover:text-primary-200">
                  {t('services.learnMore')}
                  <ArrowRight className="ml-2 h-5 w-5 transform transition-transform group-hover:translate-x-1" />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
