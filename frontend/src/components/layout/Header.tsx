import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Menu, X, Sun, Moon, Globe } from 'lucide-react'
import { useTheme } from '@/hooks/useTheme'

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isLangMenuOpen, setIsLangMenuOpen] = useState(false)
  const { t, i18n } = useTranslation()
  const { theme, toggleTheme } = useTheme()
  const location = useLocation()

  const currentLang = i18n.language

  const navLinks = [
    { href: '/', label: t('nav.home') },
    { href: currentLang === 'en' ? '/about' : '/despre', label: t('nav.about') },
    { href: currentLang === 'en' ? '/services' : '/servicii', label: t('nav.services') },
    { href: currentLang === 'en' ? '/portfolio' : '/portofoliu', label: t('nav.portfolio') },
    { href: '/blog', label: t('nav.blog') },
    { href: '/contact', label: t('nav.contact') },
  ]

  const changeLanguage = (lang: string) => {
    i18n.changeLanguage(lang)
    setIsLangMenuOpen(false)
  }

  const isActive = (href: string) => {
    return location.pathname === href
  }

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-surface-900/80 backdrop-blur-lg border-b border-white/5">
      <div className="container-custom">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <span className="text-xl md:text-2xl font-bold gradient-text">
              Voost Vision
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className={`text-sm font-medium transition-colors ${
                  isActive(link.href)
                    ? 'text-primary-400'
                    : 'text-surface-300 hover:text-white'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Desktop Actions */}
          <div className="hidden lg:flex items-center space-x-4">
            {/* Language Switcher */}
            <div className="relative">
              <button
                onClick={() => setIsLangMenuOpen(!isLangMenuOpen)}
                className="p-2 rounded-lg hover:bg-white/10 transition-colors flex items-center space-x-1"
                aria-label="Change language"
              >
                <Globe className="w-5 h-5" />
                <span className="text-sm uppercase">{currentLang}</span>
              </button>
              {isLangMenuOpen && (
                <div className="absolute right-0 mt-2 w-32 py-2 bg-surface-800 rounded-lg shadow-xl border border-white/10">
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

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg hover:bg-white/10 transition-colors"
              aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {theme === 'dark' ? (
                <Sun className="w-5 h-5" />
              ) : (
                <Moon className="w-5 h-5" />
              )}
            </button>

            {/* CTA Button */}
            <Link
              to={currentLang === 'en' ? '/booking' : '/programare'}
              className="btn-primary text-sm"
            >
              {t('nav.bookCall')}
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="lg:hidden p-2 rounded-lg hover:bg-white/10 transition-colors"
            aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
          >
            {isMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="lg:hidden bg-surface-900 border-b border-white/10">
          <div className="container-custom py-4 space-y-4">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                onClick={() => setIsMenuOpen(false)}
                className={`block py-2 text-lg font-medium ${
                  isActive(link.href)
                    ? 'text-primary-400'
                    : 'text-surface-300'
                }`}
              >
                {link.label}
              </Link>
            ))}
            <div className="flex items-center space-x-4 pt-4 border-t border-white/10">
              <button
                onClick={() => changeLanguage(currentLang === 'en' ? 'ro' : 'en')}
                className="flex items-center space-x-2 text-surface-300"
              >
                <Globe className="w-5 h-5" />
                <span>{currentLang === 'en' ? 'Română' : 'English'}</span>
              </button>
              <button
                onClick={toggleTheme}
                className="p-2 rounded-lg hover:bg-white/10 transition-colors"
              >
                {theme === 'dark' ? (
                  <Sun className="w-5 h-5" />
                ) : (
                  <Moon className="w-5 h-5" />
                )}
              </button>
            </div>
            <Link
              to={currentLang === 'en' ? '/booking' : '/programare'}
              onClick={() => setIsMenuOpen(false)}
              className="btn-primary w-full text-center"
            >
              {t('nav.bookCall')}
            </Link>
          </div>
        </div>
      )}
    </header>
  )
}
