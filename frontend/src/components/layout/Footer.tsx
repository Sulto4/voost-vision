import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Mail, Phone, MapPin, Facebook, Instagram, Linkedin, Twitter, Globe } from 'lucide-react'

export default function Footer() {
  const { t, i18n } = useTranslation()
  const currentLang = i18n.language
  const [isLangMenuOpen, setIsLangMenuOpen] = useState(false)

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
    { href: getLocalizedPath('/services/web-development', '/servicii/dezvoltare-web'), label: t('services.webDev') },
    { href: getLocalizedPath('/services/web-apps', '/servicii/aplicatii-web'), label: t('services.webApps') },
    { href: getLocalizedPath('/services/mobile', '/servicii/mobile'), label: t('services.mobile') },
    { href: getLocalizedPath('/services/design', '/servicii/design'), label: t('services.design') },
  ]

  const quickLinks = [
    { href: getLocalizedPath('/about', '/despre'), label: t('nav.about') },
    { href: getLocalizedPath('/portfolio', '/portofoliu'), label: t('nav.portfolio') },
    { href: '/blog', label: t('nav.blog') },
    { href: '/contact', label: t('nav.contact') },
    { href: getLocalizedPath('/booking', '/programare'), label: t('nav.bookCall') },
  ]

  return (
    <footer className="bg-surface-950 border-t border-white/5">
      <div className="container-custom py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Company Info */}
          <div className="lg:col-span-1">
            <Link to="/" className="inline-block mb-4">
              <span className="text-2xl font-bold gradient-text">Voost Vision</span>
            </Link>
            <p className="text-surface-400 mb-6">
              {t('footer.tagline')}
            </p>
            <div className="flex space-x-4">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-surface-400 hover:text-white transition-colors"
                  aria-label={social.label}
                >
                  <social.icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-lg font-semibold mb-4">{t('footer.services')}</h3>
            <ul className="space-y-3">
              {services.map((service) => (
                <li key={service.href}>
                  <Link
                    to={service.href}
                    className="text-surface-400 hover:text-white transition-colors"
                  >
                    {service.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">{t('footer.quickLinks')}</h3>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    to={link.href}
                    className="text-surface-400 hover:text-white transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4">{t('footer.contact')}</h3>
            <ul className="space-y-3">
              <li>
                <a
                  href="mailto:contact@voostvision.ro"
                  className="flex items-center space-x-3 text-surface-400 hover:text-white transition-colors"
                >
                  <Mail className="w-5 h-5 flex-shrink-0" />
                  <span>contact@voostvision.ro</span>
                </a>
              </li>
              <li>
                <a
                  href="tel:+40700000000"
                  className="flex items-center space-x-3 text-surface-400 hover:text-white transition-colors"
                >
                  <Phone className="w-5 h-5 flex-shrink-0" />
                  <span>+40 700 000 000</span>
                </a>
              </li>
              <li>
                <div className="flex items-start space-x-3 text-surface-400">
                  <MapPin className="w-5 h-5 flex-shrink-0 mt-0.5" />
                  <span>București, România</span>
                </div>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <p className="text-surface-500 text-sm">
            © {new Date().getFullYear()} Voost Vision. {t('footer.rights')}
          </p>
          <div className="flex items-center space-x-6 text-sm text-surface-500">
            {/* Language Switcher */}
            <div className="relative">
              <button
                onClick={() => setIsLangMenuOpen(!isLangMenuOpen)}
                className="flex items-center space-x-2 hover:text-white transition-colors"
                aria-label="Change language"
              >
                <Globe className="w-4 h-4" />
                <span className="uppercase">{currentLang}</span>
              </button>
              {isLangMenuOpen && (
                <div className="absolute bottom-full right-0 mb-2 w-32 py-2 bg-surface-800 rounded-lg shadow-xl border border-white/10">
                  <button
                    onClick={() => changeLanguage('ro')}
                    className={`w-full px-4 py-2 text-left text-sm hover:bg-white/10 ${
                      currentLang === 'ro' ? 'text-primary-400' : 'text-white'
                    }`}
                  >
                    Română
                  </button>
                  <button
                    onClick={() => changeLanguage('en')}
                    className={`w-full px-4 py-2 text-left text-sm hover:bg-white/10 ${
                      currentLang === 'en' ? 'text-primary-400' : 'text-white'
                    }`}
                  >
                    English
                  </button>
                </div>
              )}
            </div>
            <Link to="/privacy" className="hover:text-white transition-colors">
              {t('footer.privacy')}
            </Link>
            <Link to="/terms" className="hover:text-white transition-colors">
              {t('footer.terms')}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
