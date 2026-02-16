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
    <div className={`glass-card flex flex-col items-center justify-center px-6 py-14 text-center ${className}`}>
      <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-red-500/[0.14]">
        <Icon className="w-8 h-8 text-red-400" />
      </div>
      <h3 className="mb-2 text-xl font-semibold text-white">
        {title}
      </h3>
      <p className="mb-6 max-w-md text-surface-400">
        {description}
      </p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="btn-primary"
        >
          <RefreshCw className="w-4 h-4" />
          {t('common.retry')}
        </button>
      )}
    </div>
  )
}
