import { useMemo, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Menu, X, Sun, Moon, Globe, ArrowRight } from 'lucide-react'
import { useTheme } from '@/hooks/useTheme'

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isLangMenuOpen, setIsLangMenuOpen] = useState(false)
  const { t, i18n } = useTranslation()
  const { theme, toggleTheme } = useTheme()
  const location = useLocation()
  const navigate = useNavigate()

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

  const navLinks = [
    { href: withPrefix('/'), label: t('nav.home') },
    { href: withPrefix(currentLang === 'en' ? '/about' : '/despre'), label: t('nav.about') },
    { href: withPrefix(currentLang === 'en' ? '/services' : '/servicii'), label: t('nav.services') },
    { href: withPrefix(currentLang === 'en' ? '/portfolio' : '/portofoliu'), label: t('nav.portfolio') },
    { href: withPrefix('/blog'), label: t('nav.blog') },
    { href: withPrefix('/contact'), label: t('nav.contact') },
  ]

  const changeLanguage = (lang: string) => {
    i18n.changeLanguage(lang)
    setIsLangMenuOpen(false)
    setIsMenuOpen(false)

    if (urlPrefix) {
      const pathWithoutPrefix = location.pathname.replace(/^\/(en|ro)/, '') || '/'
      const newPrefix = lang === 'en' ? '/en' : '/ro'
      navigate(pathWithoutPrefix === '/' ? newPrefix : `${newPrefix}${pathWithoutPrefix}`)
    }
  }

  const isActive = (href: string) => {
    if (href === '/' || href === '/en' || href === '/ro') {
      return location.pathname === href
    }
    return location.pathname === href || location.pathname.startsWith(`${href}/`)
  }

  return (
    <header className="fixed inset-x-0 top-0 z-50">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary-500/60 to-transparent" />
      <div className="mx-auto mt-3 w-[calc(100%-1.25rem)] max-w-7xl rounded-2xl border border-white/10 bg-surface-950/[0.82] shadow-card backdrop-blur-xl">
        <div className="container-custom">
          <div className="flex h-14 items-center justify-between md:h-[4.25rem]">
            <Link to={withPrefix('/')} className="group inline-flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-primary-500 shadow-glow" />
              <span className="font-display text-lg font-semibold tracking-tight text-white md:text-xl">
                Voost <span className="text-primary-300">Vision</span>
              </span>
            </Link>

            <nav className="hidden items-center gap-1 lg:flex">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  to={link.href}
                  className={`rounded-lg px-4 py-2 text-sm font-semibold transition-colors ${
                    isActive(link.href)
                      ? 'bg-primary-500/[0.14] text-primary-200'
                      : 'text-surface-300 hover:bg-white/[0.06] hover:text-white'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            <div className="hidden items-center gap-2 lg:flex">
              <div className="relative">
                <button
                  onClick={() => setIsLangMenuOpen((prev) => !prev)}
                  className="inline-flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-xs font-semibold uppercase tracking-wide text-surface-300 transition-colors hover:text-white"
                  aria-label="Change language"
                >
                  <Globe className="h-4 w-4" />
                  {currentLang}
                </button>
                {isLangMenuOpen && (
                  <div className="absolute right-0 top-[calc(100%+0.5rem)] w-32 rounded-xl border border-white/10 bg-surface-900/[0.96] p-1 shadow-card backdrop-blur-xl">
                    <button
                      onClick={() => changeLanguage('ro')}
                      className={`w-full rounded-lg px-3 py-2 text-left text-sm transition-colors ${
                        currentLang === 'ro' ? 'bg-primary-500/[0.18] text-primary-200' : 'text-surface-300 hover:bg-white/5 hover:text-white'
                      }`}
                    >
                      Română
                    </button>
                    <button
                      onClick={() => changeLanguage('en')}
                      className={`w-full rounded-lg px-3 py-2 text-left text-sm transition-colors ${
                        currentLang === 'en' ? 'bg-primary-500/[0.18] text-primary-200' : 'text-surface-300 hover:bg-white/5 hover:text-white'
                      }`}
                    >
                      English
                    </button>
                  </div>
                )}
              </div>

              <button
                onClick={toggleTheme}
                className="inline-flex items-center justify-center rounded-lg border border-white/10 bg-white/5 p-2 text-surface-300 transition-colors hover:text-white"
                aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
              >
                {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
              </button>

              <Link
                to={withPrefix(currentLang === 'en' ? '/booking' : '/programare')}
                className="btn-primary px-4 py-2 text-xs uppercase tracking-[0.1em]"
              >
                {t('nav.bookCall')}
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            <button
              onClick={() => setIsMenuOpen((prev) => !prev)}
              className="inline-flex items-center justify-center rounded-lg border border-white/10 bg-white/5 p-2 text-surface-200 lg:hidden"
              aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
            >
              {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </div>

      {isMenuOpen && (
        <div className="mx-auto mt-2 w-[calc(100%-1.25rem)] max-w-7xl rounded-2xl border border-white/10 bg-surface-950/95 p-4 shadow-card backdrop-blur-xl lg:hidden">
          <div className="space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                onClick={() => setIsMenuOpen(false)}
                className={`block rounded-xl px-4 py-3 text-sm font-semibold transition-colors ${
                  isActive(link.href) ? 'bg-primary-500/[0.14] text-primary-200' : 'text-surface-300 hover:bg-white/5 hover:text-white'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="mt-4 grid grid-cols-2 gap-2">
            <button
              onClick={() => changeLanguage(currentLang === 'en' ? 'ro' : 'en')}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/[0.12] bg-white/5 px-3 py-2 text-sm font-medium text-surface-300"
            >
              <Globe className="h-4 w-4" />
              {currentLang === 'en' ? 'Română' : 'English'}
            </button>
            <button
              onClick={toggleTheme}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/[0.12] bg-white/5 px-3 py-2 text-sm font-medium text-surface-300"
            >
              {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
              {theme === 'dark' ? 'Light' : 'Dark'}
            </button>
          </div>

          <Link
            to={withPrefix(currentLang === 'en' ? '/booking' : '/programare')}
            onClick={() => setIsMenuOpen(false)}
            className="btn-primary mt-4 w-full"
          >
            {t('nav.bookCall')}
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      )}
    </header>
  )
}
