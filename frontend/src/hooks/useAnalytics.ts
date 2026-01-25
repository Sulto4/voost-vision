import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

declare global {
  interface Window {
    gtag: (...args: unknown[]) => void
    dataLayer: unknown[]
  }
}

const GA_MEASUREMENT_ID = import.meta.env.VITE_GA_MEASUREMENT_ID

// Initialize Google Analytics
export function initGA() {
  if (!GA_MEASUREMENT_ID) {
    console.log('Google Analytics: No measurement ID configured')
    return
  }

  // Add gtag script
  const script = document.createElement('script')
  script.async = true
  script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`
  document.head.appendChild(script)

  // Initialize dataLayer and gtag
  window.dataLayer = window.dataLayer || []
  window.gtag = function gtag(...args: unknown[]) {
    window.dataLayer.push(args)
  }
  window.gtag('js', new Date())
  window.gtag('config', GA_MEASUREMENT_ID, {
    send_page_view: false // We'll handle page views manually
  })

  console.log('Google Analytics initialized:', GA_MEASUREMENT_ID)
}

// Track page views
export function trackPageView(path: string, title?: string) {
  if (!GA_MEASUREMENT_ID || !window.gtag) return

  window.gtag('event', 'page_view', {
    page_path: path,
    page_title: title || document.title,
    page_location: window.location.href
  })
}

// Track custom events
export function trackEvent(
  eventName: string,
  eventParams?: Record<string, unknown>
) {
  if (!GA_MEASUREMENT_ID || !window.gtag) return

  window.gtag('event', eventName, eventParams)
}

// Hook to automatically track page views on route changes
export function usePageTracking() {
  const location = useLocation()

  useEffect(() => {
    trackPageView(location.pathname + location.search)
  }, [location])
}

// Common tracking functions
export const analytics = {
  // Track button clicks
  trackButtonClick: (buttonName: string, location?: string) => {
    trackEvent('button_click', { button_name: buttonName, location })
  },

  // Track form submissions
  trackFormSubmission: (formName: string, success: boolean) => {
    trackEvent('form_submission', { form_name: formName, success })
  },

  // Track booking created
  trackBookingCreated: () => {
    trackEvent('booking_created')
  },

  // Track contact form
  trackContactSubmit: () => {
    trackEvent('contact_form_submit')
  },

  // Track language change
  trackLanguageChange: (newLang: string) => {
    trackEvent('language_change', { new_language: newLang })
  },

  // Track theme change
  trackThemeChange: (newTheme: string) => {
    trackEvent('theme_change', { new_theme: newTheme })
  },

  // Track outbound link clicks
  trackOutboundLink: (url: string) => {
    trackEvent('outbound_link', { url })
  },

  // Track portfolio item view
  trackPortfolioView: (projectId: string, projectName: string) => {
    trackEvent('portfolio_view', { project_id: projectId, project_name: projectName })
  },

  // Track blog article view
  trackArticleView: (articleSlug: string, articleTitle: string) => {
    trackEvent('article_view', { article_slug: articleSlug, article_title: articleTitle })
  }
}
