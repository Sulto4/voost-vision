import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Home, ArrowLeft } from 'lucide-react'

export default function NotFound() {
  const { t } = useTranslation()

  return (
    <div className="pt-16 md:pt-20">
      <section className="section min-h-[70vh] flex items-center">
        <div className="container-custom">
          <div className="max-w-xl mx-auto text-center">
            <h1 className="text-9xl font-bold gradient-text mb-6">404</h1>
            <h2 className="heading-3 mb-4">Page Not Found</h2>
            <p className="text-surface-400 text-lg mb-8">
              The page you're looking for doesn't exist or has been moved.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/" className="btn-primary">
                <Home className="w-5 h-5 mr-2" />
                {t('nav.home')}
              </Link>
              <button
                onClick={() => window.history.back()}
                className="btn-secondary"
              >
                <ArrowLeft className="w-5 h-5 mr-2" />
                Go Back
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
