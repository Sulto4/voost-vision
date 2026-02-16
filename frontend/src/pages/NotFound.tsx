import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Home, ArrowLeft } from 'lucide-react'

export default function NotFound() {
  const { t } = useTranslation()

  return (
    <div className="page-shell">
      <section className="section flex min-h-[70vh] items-center">
        <div className="container-custom">
          <div className="glass-card mx-auto max-w-xl p-10 text-center md:p-14">
            <h1 className="text-9xl font-bold gradient-text mb-6">404</h1>
            <h2 className="heading-3 mb-4">Page Not Found</h2>
            <p className="text-surface-400 text-lg mb-8">
              The page you're looking for doesn't exist or has been moved.
            </p>
            <div className="flex flex-col justify-center gap-4 sm:flex-row">
              <Link to="/" className="btn-primary">
                <Home className="mr-2 h-5 w-5" />
                {t('nav.home')}
              </Link>
              <button
                onClick={() => window.history.back()}
                className="btn-secondary"
              >
                <ArrowLeft className="mr-2 h-5 w-5" />
                Go Back
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
