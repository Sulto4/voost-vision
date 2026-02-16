import { useMemo, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Mail, Phone, MapPin, Instagram, Linkedin, Facebook, Twitter, Globe, ArrowRight } from 'lucide-react'

export default function Footer() {
  const { t, i18n } = useTranslation()
  const [isLangMenuOpen, setIsLangMenuOpen] = useState(false)
  const location = useLocation()
  const currentLang = i18n.language

  const urlPrefix = useMemo(() => {
    if (location.pathname.startsWith('/en/') || location.pathname === '/en') return '/en'
    if (location.pathname.startsWith('/ro/') || location.pathname === '/ro') return '/ro'
    return ''
  }, [location.pathname])

  const withPrefix = (path: string) => {
    if (!urlPrefix) return path
    if (path === '/') return urlPrefix
    return `${urlPrefix}${path}`
  }

  const changeLanguage = (lang: string) => {
    i18n.changeLanguage(lang)
    setIsLangMenuOpen(false)
  }

  const getLocalizedPath = (enPath: string, roPath: string) => {
    return currentLang === 'en' ? enPath : roPath
  }

  const socialLinks = [
    { icon: Facebook, href: 'https://facebook.com/voostvision', label: 'Facebook' },
    { icon: Instagram, href: 'https://instagram.com/voostvision', label: 'Instagram' },
    { icon: Linkedin, href: 'https://linkedin.com/company/voostvision', label: 'LinkedIn' },
    { icon: Twitter, href: 'https://twitter.com/voostvision', label: 'Twitter' },
  ]

  const services = [
    { href: withPrefix(getLocalizedPath('/services/web-development', '/servicii/dezvoltare-web')), label: t('services.webDev') },
    { href: withPrefix(getLocalizedPath('/services/web-apps', '/servicii/aplicatii-web')), label: t('services.webApps') },
    { href: withPrefix(getLocalizedPath('/services/mobile', '/servicii/mobile')), label: t('services.mobile') },
    { href: withPrefix(getLocalizedPath('/services/design', '/servicii/design')), label: t('services.design') },
  ]

  const quickLinks = [
    { href: withPrefix(getLocalizedPath('/about', '/despre')), label: t('nav.about') },
    { href: withPrefix(getLocalizedPath('/portfolio', '/portofoliu')), label: t('nav.portfolio') },
    { href: withPrefix('/blog'), label: t('nav.blog') },
    { href: withPrefix('/contact'), label: t('nav.contact') },
  ]

  return (
    <footer className="relative mt-16 border-t border-white/10 bg-surface-950">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary-500/70 to-transparent" />
      <div className="container-custom py-16 md:py-20">
        <div className="grid gap-10 lg:grid-cols-12">
          <div className="panel-shell p-6 lg:col-span-5">
            <div className="inline-flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-primary-500 shadow-glow" />
              <span className="font-display text-2xl font-semibold text-white">
                Voost <span className="text-primary-300">Vision</span>
              </span>
            </div>
            <p className="mt-4 max-w-md text-surface-300">{t('footer.tagline')}</p>
            <div className="mt-6 flex flex-wrap gap-3">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-white/[0.12] bg-white/5 text-surface-300 transition-colors hover:border-primary-400/[0.50] hover:text-primary-200"
                  aria-label={social.label}
                >
                  <social.icon className="h-4 w-4" />
                </a>
              ))}
            </div>
            <Link
              to={withPrefix(getLocalizedPath('/booking', '/programare'))}
              className="btn-outline mt-8"
            >
              {t('nav.bookCall')}
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="lg:col-span-7">
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              <div className="glass-card p-6">
                <h3 className="font-display text-sm font-semibold uppercase tracking-[0.12em] text-surface-200">
                  {t('footer.services')}
                </h3>
                <ul className="mt-4 space-y-3">
                  {services.map((service) => (
                    <li key={service.href}>
                      <Link to={service.href} className="text-sm text-surface-300 transition-colors hover:text-white">
                        {service.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="glass-card p-6">
                <h3 className="font-display text-sm font-semibold uppercase tracking-[0.12em] text-surface-200">
                  {t('footer.quickLinks')}
                </h3>
                <ul className="mt-4 space-y-3">
                  {quickLinks.map((link) => (
                    <li key={link.href}>
                      <Link to={link.href} className="text-sm text-surface-300 transition-colors hover:text-white">
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="glass-card p-6">
                <h3 className="font-display text-sm font-semibold uppercase tracking-[0.12em] text-surface-200">
                  {t('footer.contact')}
                </h3>
                <ul className="mt-4 space-y-3 text-sm text-surface-300">
                  <li>
                    <a href="mailto:contact@voostvision.ro" className="inline-flex items-center gap-2 transition-colors hover:text-white">
                      <Mail className="h-4 w-4 text-primary-300" />
                      contact@voostvision.ro
                    </a>
                  </li>
                  <li>
                    <a href="tel:+40700000000" className="inline-flex items-center gap-2 transition-colors hover:text-white">
                      <Phone className="h-4 w-4 text-primary-300" />
                      +40 700 000 000
                    </a>
                  </li>
                  <li className="inline-flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-primary-300" />
                    București, România
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-10 flex flex-col items-start justify-between gap-4 border-t border-white/10 pt-6 text-sm text-surface-500 md:flex-row md:items-center">
          <p>© {new Date().getFullYear()} Voost Vision. {t('footer.rights')}</p>
          <div className="flex flex-wrap items-center gap-5">
            <div className="relative">
              <button
                onClick={() => setIsLangMenuOpen((prev) => !prev)}
                className="inline-flex items-center gap-2 text-surface-400 transition-colors hover:text-white"
              >
                <Globe className="h-4 w-4" />
                <span className="uppercase">{currentLang}</span>
              </button>
              {isLangMenuOpen && (
                <div className="absolute bottom-[calc(100%+0.5rem)] right-0 w-32 rounded-xl border border-white/[0.12] bg-surface-900/[0.97] p-1 backdrop-blur-xl">
                  <button
                    onClick={() => changeLanguage('ro')}
                    className={`w-full rounded-lg px-3 py-2 text-left text-sm ${
                      currentLang === 'ro' ? 'bg-primary-500/20 text-primary-200' : 'text-surface-300 hover:bg-white/[0.08]'
                    }`}
                  >
                    Română
                  </button>
                  <button
                    onClick={() => changeLanguage('en')}
                    className={`w-full rounded-lg px-3 py-2 text-left text-sm ${
                      currentLang === 'en' ? 'bg-primary-500/20 text-primary-200' : 'text-surface-300 hover:bg-white/[0.08]'
                    }`}
                  >
                    English
                  </button>
                </div>
              )}
            </div>
            <Link to={withPrefix('/privacy')} className="transition-colors hover:text-white">
              {t('footer.privacy')}
            </Link>
            <Link to={withPrefix('/terms')} className="transition-colors hover:text-white">
              {t('footer.terms')}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
