import { Link, useLocation } from 'react-router-dom'
import { ChevronRight, Home } from 'lucide-react'
import { useTranslation } from 'react-i18next'

interface BreadcrumbItem {
  label: string
  href?: string
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[]
  className?: string
}

export default function Breadcrumbs({ items, className = '' }: BreadcrumbsProps) {
  const { i18n } = useTranslation()
  const currentLang = i18n.language
  const location = useLocation()

  // Determine home path based on current language prefix
  const getHomePath = () => {
    if (location.pathname.startsWith('/en/')) return '/en'
    if (location.pathname.startsWith('/ro/')) return '/ro'
    return '/'
  }

  const homeLabel = currentLang === 'en' ? 'Home' : 'Acasă'

  return (
    <nav aria-label="Breadcrumb" className={`flex items-center gap-2 text-sm ${className}`}>
      <Link
        to={getHomePath()}
        className="flex items-center gap-1 text-surface-400 hover:text-white transition-colors"
      >
        <Home className="w-4 h-4" />
        <span className="hidden sm:inline">{homeLabel}</span>
      </Link>

      {items.map((item, index) => (
        <div key={index} className="flex items-center gap-2">
          <ChevronRight className="w-4 h-4 text-surface-500" />
          {item.href ? (
            <Link
              to={item.href}
              className="text-surface-400 hover:text-white transition-colors"
            >
              {item.label}
            </Link>
          ) : (
            <span className="text-white font-medium">{item.label}</span>
          )}
        </div>
      ))}
    </nav>
  )
}
