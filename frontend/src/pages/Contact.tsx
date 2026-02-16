import { useTranslation } from 'react-i18next'
import { useState, useEffect, useRef } from 'react'
import { Mail, Phone, MapPin, Send, Check, User, MessageSquare, AlertCircle, ShieldCheck, Clock } from 'lucide-react'
import { supabase } from '../lib/supabase'
import Turnstile from '../components/ui/Turnstile'

interface FormErrors {
  name?: string
  email?: string
  subject?: string
  message?: string
  captcha?: string
  rateLimit?: string
}

// Rate limiting configuration
const RATE_LIMIT_MAX_SUBMISSIONS = 3 // Maximum submissions
const RATE_LIMIT_WINDOW_MS = 300000 // 5 minute window
const RATE_LIMIT_COOLDOWN_MS = 10000 // 10 second cooldown after hitting limit (shorter for better UX)

export default function Contact() {
  const { t } = useTranslation()
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  })
  const [errors, setErrors] = useState<FormErrors>({})
  const [touched, setTouched] = useState<Record<string, boolean>>({})
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error' | 'rate_limited'>('idle')
  const [captchaToken, setCaptchaToken] = useState<string | null>(null)
  const [captchaError, setCaptchaError] = useState<string | null>(null)

  // Rate limiting state
  const submissionTimestamps = useRef<number[]>([])
  const [rateLimitCooldown, setRateLimitCooldown] = useState<number>(0)
  const cooldownIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  // Warn user about unsaved data on page refresh/close
  useEffect(() => {
    const hasUnsavedData = formData.name || formData.email || formData.subject || formData.message

    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (hasUnsavedData && status !== 'success') {
        e.preventDefault()
        e.returnValue = ''
      }
    }

    window.addEventListener('beforeunload', handleBeforeUnload)
    return () => window.removeEventListener('beforeunload', handleBeforeUnload)
  }, [formData, status])

  // Cleanup cooldown interval on unmount
  useEffect(() => {
    return () => {
      if (cooldownIntervalRef.current) {
        clearInterval(cooldownIntervalRef.current)
      }
    }
  }, [])

  // Check if rate limited
  const checkRateLimit = (): boolean => {
    const now = Date.now()
    // Remove timestamps older than the window
    submissionTimestamps.current = submissionTimestamps.current.filter(
      (ts) => now - ts < RATE_LIMIT_WINDOW_MS
    )

    if (submissionTimestamps.current.length >= RATE_LIMIT_MAX_SUBMISSIONS) {
      return true // Rate limited
    }
    return false
  }

  // Start cooldown timer
  const startCooldown = () => {
    const cooldownSeconds = Math.ceil(RATE_LIMIT_COOLDOWN_MS / 1000)
    setRateLimitCooldown(cooldownSeconds)
    setStatus('rate_limited')

    if (cooldownIntervalRef.current) {
      clearInterval(cooldownIntervalRef.current)
    }

    cooldownIntervalRef.current = setInterval(() => {
      setRateLimitCooldown((prev) => {
        if (prev <= 1) {
          if (cooldownIntervalRef.current) {
            clearInterval(cooldownIntervalRef.current)
            cooldownIntervalRef.current = null
          }
          setStatus('idle')
          // Clear old timestamps to allow new submissions
          submissionTimestamps.current = []
          return 0
        }
        return prev - 1
      })
    }, 1000)
  }

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {}

    if (!formData.name.trim()) {
      newErrors.name = 'Numele este obligatoriu'
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email-ul este obligatoriu'
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'Format email invalid'
    }

    if (!formData.message.trim()) {
      newErrors.message = 'Mesajul este obligatoriu'
    }

    if (!captchaToken) {
      newErrors.captcha = t('contact.captchaRequired')
      setCaptchaError(t('contact.captchaRequired'))
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleCaptchaVerify = (token: string) => {
    setCaptchaToken(token)
    setCaptchaError(null)
    // Clear captcha error from errors state
    setErrors(prev => {
      const { captcha, ...rest } = prev
      return rest
    })
  }

  const handleCaptchaExpire = () => {
    setCaptchaToken(null)
    setCaptchaError(t('contact.captchaExpired'))
  }

  const handleCaptchaError = () => {
    setCaptchaToken(null)
    setCaptchaError(t('contact.captchaError'))
  }

  const handleBlur = (field: string) => {
    setTouched({ ...touched, [field]: true })
    // Validate on blur
    const newErrors: FormErrors = { ...errors }

    if (field === 'name' && !formData.name.trim()) {
      newErrors.name = t('contact.nameRequired')
    } else if (field === 'name') {
      delete newErrors.name
    }

    if (field === 'email') {
      if (!formData.email.trim()) {
        newErrors.email = t('contact.emailRequired')
      } else if (!validateEmail(formData.email)) {
        newErrors.email = t('contact.emailInvalid')
      } else {
        delete newErrors.email
      }
    }

    if (field === 'message' && !formData.message.trim()) {
      newErrors.message = t('contact.messageRequired')
    } else if (field === 'message') {
      delete newErrors.message
    }

    setErrors(newErrors)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Check rate limiting first
    if (checkRateLimit()) {
      setErrors((prev) => ({
        ...prev,
        rateLimit: t('contact.rateLimitError') || 'Too many submissions. Please wait before trying again.',
      }))
      startCooldown()
      return
    }

    // Mark all fields as touched
    setTouched({ name: true, email: true, subject: true, message: true })

    if (!validateForm()) {
      return
    }

    setStatus('submitting')

    try {
      // Save to Supabase database
      const { error } = await supabase
        .from('contact_submissions')
        .insert([
          {
            name: formData.name.trim(),
            email: formData.email.trim(),
            subject: formData.subject.trim() || null,
            message: formData.message.trim(),
          }
        ])

      if (error) {
        console.error('Error submitting contact form:', error)
        setStatus('error')
        return
      }

      // Send admin notification email via Edge Function
      try {
        const notificationResponse = await supabase.functions.invoke('send-contact-notification', {
          body: {
            name: formData.name.trim(),
            email: formData.email.trim(),
            subject: formData.subject.trim() || null,
            message: formData.message.trim(),
          }
        })

        if (notificationResponse.error) {
          console.warn('Admin notification failed:', notificationResponse.error)
          // Don't fail the submission - just log the error
        } else {
          console.log('Admin notification sent:', notificationResponse.data)
        }
      } catch (notifyErr) {
        console.warn('Admin notification error:', notifyErr)
        // Don't fail the submission - notification is secondary
      }

      // Record successful submission for rate limiting
      submissionTimestamps.current.push(Date.now())

      setStatus('success')
      setFormData({ name: '', email: '', subject: '', message: '' })
      setErrors({})
      setTouched({})
      setCaptchaToken(null)
      setCaptchaError(null)
    } catch (err) {
      console.error('Error submitting contact form:', err)
      setStatus('error')
    }
  }

  return (
    <div className="page-shell">
      <section className="section relative overflow-hidden pb-16 pt-28 md:pt-32">
        <div className="hero-backdrop" />
        <div className="container-custom">
          <div className="mx-auto mb-14 max-w-3xl text-center">
            <span className="section-kicker">Contact</span>
            <h1 className="heading-1 mt-3 mb-6">
              <span className="gradient-text">{t('contact.pageTitle')}</span>
            </h1>
            <p className="text-xl text-surface-300">{t('contact.pageSubtitle')}</p>
          </div>

          <div className="grid gap-6 lg:grid-cols-3 lg:gap-10">
            <div className="space-y-6 lg:col-span-1">
              <div className="glass-card p-6">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl border border-primary-500/30 bg-primary-500/[0.12]">
                  <Mail className="h-6 w-6 text-primary-300" />
                </div>
                <h3 className="mb-2 font-semibold">Email</h3>
                <a href="mailto:contact@voostvision.ro" className="text-surface-400 transition-colors hover:text-primary-300">
                  contact@voostvision.ro
                </a>
              </div>

              <div className="glass-card p-6">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl border border-primary-500/30 bg-primary-500/[0.12]">
                  <Phone className="h-6 w-6 text-primary-300" />
                </div>
                <h3 className="mb-2 font-semibold">Telefon</h3>
                <a href="tel:+40700000000" className="text-surface-400 transition-colors hover:text-primary-300">
                  +40 700 000 000
                </a>
              </div>

              <div className="glass-card p-6">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl border border-primary-500/30 bg-primary-500/[0.12]">
                  <MapPin className="h-6 w-6 text-primary-300" />
                </div>
                <h3 className="mb-2 font-semibold">Adresa</h3>
                <p className="text-surface-400">Bucuresti, Romania</p>
              </div>

              <div className="glass-card overflow-hidden p-4">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d182639.17912975995!2d25.952819499999998!3d44.437713!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x40b1f93abf3cad4f%3A0xac0632e37c9ca628!2sBucharest%2C%20Romania!5e0!3m2!1sen!2sus!4v1706200000000!5m2!1sen!2sus"
                  width="100%"
                  height="250"
                  style={{ border: 0, borderRadius: '0.75rem' }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Voost Vision Location - Bucharest, Romania"
                  className="google-map-embed"
                ></iframe>
              </div>
            </div>

            <div className="lg:col-span-2">
              {status === 'success' ? (
                <div className="glass-card p-12 text-center">
                  <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-green-500/20">
                    <Check className="h-10 w-10 text-green-400" />
                  </div>
                  <h2 className="heading-3 mb-4">{t('contact.success')}</h2>
                  <button
                    type="button"
                    onClick={() => setStatus('idle')}
                    className="btn-secondary mt-4"
                  >
                    {t('contact.sendAnother') || 'Send another message'}
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="glass-card space-y-6 p-8" noValidate>
                  {status === 'error' && (
                    <div role="alert" aria-live="assertive" className="p-4 rounded-lg bg-red-500/20 text-red-400 border border-red-500/30 flex items-center gap-3">
                      <AlertCircle className="w-5 h-5 flex-shrink-0" aria-hidden="true" />
                      <span>{t('contact.error')}</span>
                    </div>
                  )}
                  {status === 'rate_limited' && (
                    <div role="alert" aria-live="assertive" className="p-4 rounded-lg bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center gap-3">
                      <Clock className="w-5 h-5 flex-shrink-0" aria-hidden="true" />
                      <span>
                        {t('contact.rateLimitError') || 'Too many submissions. Please wait'} {rateLimitCooldown > 0 && `(${rateLimitCooldown}s)`}
                      </span>
                    </div>
                  )}
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="contact-name" className="block text-sm font-medium mb-2">{t('contact.name')} <span className="text-red-400">*</span></label>
                      <div className="relative">
                        <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-surface-500" />
                        <input
                          id="contact-name"
                          type="text"
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          onBlur={() => handleBlur('name')}
                          className={`input pl-12 ${touched.name && errors.name ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' : ''}`}
                          aria-invalid={touched.name && !!errors.name}
                          aria-describedby={errors.name ? 'name-error' : undefined}
                        />
                      </div>
                      {touched.name && errors.name && (
                        <div id="name-error" role="alert" aria-live="polite" className="flex items-center gap-1 mt-2 text-red-400 text-sm">
                          <AlertCircle className="w-4 h-4" aria-hidden="true" />
                          <span>{errors.name}</span>
                        </div>
                      )}
                    </div>
                    <div>
                      <label htmlFor="contact-email" className="block text-sm font-medium mb-2">{t('contact.email')} <span className="text-red-400">*</span></label>
                      <div className="relative">
                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-surface-500" />
                        <input
                          id="contact-email"
                          type="email"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          onBlur={() => handleBlur('email')}
                          className={`input pl-12 ${touched.email && errors.email ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' : ''}`}
                          aria-invalid={touched.email && !!errors.email}
                          aria-describedby={errors.email ? 'email-error' : undefined}
                        />
                      </div>
                      {touched.email && errors.email && (
                        <div id="email-error" role="alert" aria-live="polite" className="flex items-center gap-1 mt-2 text-red-400 text-sm">
                          <AlertCircle className="w-4 h-4" aria-hidden="true" />
                          <span>{errors.email}</span>
                        </div>
                      )}
                    </div>
                  </div>
                  <div>
                    <label htmlFor="contact-subject" className="block text-sm font-medium mb-2">{t('contact.subject')}</label>
                    <input
                      id="contact-subject"
                      type="text"
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      className="input"
                    />
                  </div>
                  <div>
                    <label htmlFor="contact-message" className="block text-sm font-medium mb-2">{t('contact.message')} <span className="text-red-400">*</span></label>
                    <div className="relative">
                      <MessageSquare className="absolute left-4 top-4 w-5 h-5 text-surface-500" />
                      <textarea
                        id="contact-message"
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        onBlur={() => handleBlur('message')}
                        className={`input pl-12 min-h-[150px] ${touched.message && errors.message ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' : ''}`}
                        aria-invalid={touched.message && !!errors.message}
                        aria-describedby={errors.message ? 'message-error' : undefined}
                      />
                    </div>
                    {touched.message && errors.message && (
                      <div id="message-error" role="alert" aria-live="polite" className="flex items-center gap-1 mt-2 text-red-400 text-sm">
                        <AlertCircle className="w-4 h-4" aria-hidden="true" />
                        <span>{errors.message}</span>
                      </div>
                    )}
                  </div>

                  {/* CAPTCHA Verification */}
                  <div>
                    <label className="block text-sm font-medium mb-2 flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4 text-primary-400" />
                      {t('contact.captcha') || 'Verificare de securitate'} <span className="text-red-400">*</span>
                    </label>
                    <Turnstile
                      onVerify={handleCaptchaVerify}
                      onExpire={handleCaptchaExpire}
                      onError={handleCaptchaError}
                      theme="dark"
                      className="mb-2"
                    />
                    {captchaToken && (
                      <div className="flex items-center gap-1 text-green-400 text-sm">
                        <Check className="w-4 h-4" />
                        <span>{t('contact.captchaVerified') || 'Verificare reusita'}</span>
                      </div>
                    )}
                    {(captchaError || errors.captcha) && (
                      <div id="captcha-error" role="alert" aria-live="polite" className="flex items-center gap-1 text-red-400 text-sm">
                        <AlertCircle className="w-4 h-4" aria-hidden="true" />
                        <span>{captchaError || errors.captcha}</span>
                      </div>
                    )}
                  </div>

                  <button
                    type="submit"
                    disabled={status === 'submitting' || status === 'rate_limited' || !captchaToken}
                    className="btn-primary w-full text-lg disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {status === 'submitting' ? (
                      t('contact.sending')
                    ) : status === 'rate_limited' ? (
                      <>
                        <Clock className="w-5 h-5 mr-2" />
                        {t('contact.waitMessage') || 'Please wait'} ({rateLimitCooldown}s)
                      </>
                    ) : (
                      <>
                        {t('contact.send')}
                        <Send className="w-5 h-5 ml-2" />
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
