import { useEffect, useRef, useCallback } from 'react'

declare global {
  interface Window {
    turnstile?: {
      render: (element: HTMLElement | string, options: TurnstileOptions) => string
      reset: (widgetId: string) => void
      remove: (widgetId: string) => void
      getResponse: (widgetId: string) => string | undefined
    }
    onTurnstileLoad?: () => void
  }
}

interface TurnstileOptions {
  sitekey: string
  callback?: (token: string) => void
  'expired-callback'?: () => void
  'error-callback'?: () => void
  theme?: 'light' | 'dark' | 'auto'
  size?: 'normal' | 'compact'
  language?: string
}

interface TurnstileProps {
  onVerify: (token: string) => void
  onExpire?: () => void
  onError?: () => void
  theme?: 'light' | 'dark' | 'auto'
  className?: string
}

// Cloudflare Turnstile test keys for development
// Visible pass: 1x00000000000000000000AA
// Visible block: 2x00000000000000000000AB
// Invisible pass: 1x00000000000000000000BB
// Invisible block: 2x00000000000000000000BB
const TURNSTILE_SITE_KEY = import.meta.env.VITE_TURNSTILE_SITE_KEY || '1x00000000000000000000AA'

let scriptLoaded = false
let scriptLoading = false
const loadCallbacks: (() => void)[] = []

function loadTurnstileScript(): Promise<void> {
  return new Promise((resolve) => {
    if (scriptLoaded && window.turnstile) {
      resolve()
      return
    }

    loadCallbacks.push(resolve)

    if (scriptLoading) {
      return
    }

    scriptLoading = true

    // Check if script already exists
    const existingScript = document.querySelector('script[src*="turnstile"]')
    if (existingScript) {
      scriptLoading = false
      return
    }

    window.onTurnstileLoad = () => {
      scriptLoaded = true
      scriptLoading = false
      loadCallbacks.forEach(cb => cb())
      loadCallbacks.length = 0
    }

    const script = document.createElement('script')
    script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js?onload=onTurnstileLoad'
    script.async = true
    script.defer = true
    document.head.appendChild(script)
  })
}

export default function Turnstile({ onVerify, onExpire, onError, theme = 'dark', className = '' }: TurnstileProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const widgetIdRef = useRef<string | null>(null)

  const handleVerify = useCallback((token: string) => {
    onVerify(token)
  }, [onVerify])

  const handleExpire = useCallback(() => {
    onExpire?.()
  }, [onExpire])

  const handleError = useCallback(() => {
    onError?.()
  }, [onError])

  useEffect(() => {
    let mounted = true

    const initTurnstile = async () => {
      await loadTurnstileScript()

      if (!mounted || !containerRef.current || !window.turnstile) return

      // Clear any existing widget
      if (widgetIdRef.current) {
        try {
          window.turnstile.remove(widgetIdRef.current)
        } catch (e) {
          // Widget may already be removed
        }
      }

      // Render the widget
      widgetIdRef.current = window.turnstile.render(containerRef.current, {
        sitekey: TURNSTILE_SITE_KEY,
        callback: handleVerify,
        'expired-callback': handleExpire,
        'error-callback': handleError,
        theme,
      })
    }

    initTurnstile()

    return () => {
      mounted = false
      if (widgetIdRef.current && window.turnstile) {
        try {
          window.turnstile.remove(widgetIdRef.current)
        } catch (e) {
          // Widget may already be removed
        }
      }
    }
  }, [handleVerify, handleExpire, handleError, theme])

  return <div ref={containerRef} className={className} />
}

export function useTurnstileReset() {
  return useCallback((widgetId: string) => {
    if (window.turnstile) {
      window.turnstile.reset(widgetId)
    }
  }, [])
}
