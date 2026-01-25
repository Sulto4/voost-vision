import { useTranslation } from 'react-i18next'
import { RefreshCw, WifiOff, AlertCircle } from 'lucide-react'

interface ErrorMessageProps {
  error?: string | null
  isNetworkError?: boolean
  onRetry?: () => void
  className?: string
}

export default function ErrorMessage({
  error,
  isNetworkError = false,
  onRetry,
  className = ''
}: ErrorMessageProps) {
  const { t } = useTranslation()

  const Icon = isNetworkError ? WifiOff : AlertCircle
  const title = isNetworkError ? t('common.networkError') : t('common.somethingWentWrong')
  const description = isNetworkError
    ? t('common.networkErrorDesc')
    : error || t('common.tryAgainLater')

  return (
    <div className={`flex flex-col items-center justify-center py-16 px-4 text-center ${className}`}>
      <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center mb-6">
        <Icon className="w-8 h-8 text-red-400" />
      </div>
      <h3 className="text-xl font-semibold mb-2 text-white">
        {title}
      </h3>
      <p className="text-surface-400 mb-6 max-w-md">
        {description}
      </p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="inline-flex items-center gap-2 px-6 py-3 bg-primary-500 hover:bg-primary-600 text-white rounded-lg transition-colors"
        >
          <RefreshCw className="w-4 h-4" />
          {t('common.retry')}
        </button>
      )}
    </div>
  )
}
