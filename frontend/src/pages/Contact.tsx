import { useTranslation } from 'react-i18next'
import { useState } from 'react'
import { Mail, Phone, MapPin, Send, Check, User, MessageSquare, AlertCircle } from 'lucide-react'
import { supabase } from '../lib/supabase'

interface FormErrors {
  name?: string
  email?: string
  subject?: string
  message?: string
}

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
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle')

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

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleBlur = (field: string) => {
    setTouched({ ...touched, [field]: true })
    // Validate on blur
    const newErrors: FormErrors = { ...errors }

    if (field === 'name' && !formData.name.trim()) {
      newErrors.name = 'Numele este obligatoriu'
    } else if (field === 'name') {
      delete newErrors.name
    }

    if (field === 'email') {
      if (!formData.email.trim()) {
        newErrors.email = 'Email-ul este obligatoriu'
      } else if (!validateEmail(formData.email)) {
        newErrors.email = 'Format email invalid'
      } else {
        delete newErrors.email
      }
    }

    if (field === 'message' && !formData.message.trim()) {
      newErrors.message = 'Mesajul este obligatoriu'
    } else if (field === 'message') {
      delete newErrors.message
    }

    setErrors(newErrors)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

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

      setStatus('success')
      setFormData({ name: '', email: '', subject: '', message: '' })
      setErrors({})
      setTouched({})
    } catch (err) {
      console.error('Error submitting contact form:', err)
      setStatus('error')
    }
  }

  return (
    <div className="pt-16 md:pt-20">
      <section className="section">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h1 className="heading-1 mb-6">
              <span className="gradient-text">{t('contact.pageTitle')}</span>
            </h1>
            <p className="text-xl text-surface-300">
              {t('contact.pageSubtitle')}
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-12">
            {/* Contact Info */}
            <div className="lg:col-span-1 space-y-6">
              <div className="glass-card p-6">
                <div className="w-12 h-12 rounded-xl bg-primary-500/20 flex items-center justify-center mb-4">
                  <Mail className="w-6 h-6 text-primary-400" />
                </div>
                <h3 className="font-semibold mb-2">Email</h3>
                <a
                  href="mailto:contact@voostvision.ro"
                  className="text-surface-400 hover:text-primary-400 transition-colors"
                >
                  contact@voostvision.ro
                </a>
              </div>

              <div className="glass-card p-6">
                <div className="w-12 h-12 rounded-xl bg-primary-500/20 flex items-center justify-center mb-4">
                  <Phone className="w-6 h-6 text-primary-400" />
                </div>
                <h3 className="font-semibold mb-2">Telefon</h3>
                <a
                  href="tel:+40700000000"
                  className="text-surface-400 hover:text-primary-400 transition-colors"
                >
                  +40 700 000 000
                </a>
              </div>

              <div className="glass-card p-6">
                <div className="w-12 h-12 rounded-xl bg-primary-500/20 flex items-center justify-center mb-4">
                  <MapPin className="w-6 h-6 text-primary-400" />
                </div>
                <h3 className="font-semibold mb-2">Adresa</h3>
                <p className="text-surface-400">
                  Bucuresti, Romania
                </p>
              </div>
            </div>

            {/* Contact Form */}
            <div className="lg:col-span-2">
              {status === 'success' ? (
                <div className="glass-card p-12 text-center">
                  <div className="w-20 h-20 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-6">
                    <Check className="w-10 h-10 text-green-400" />
                  </div>
                  <h2 className="heading-3 mb-4">{t('contact.success')}</h2>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="glass-card p-8 space-y-6" noValidate>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium mb-2">{t('contact.name')} <span className="text-red-400">*</span></label>
                      <div className="relative">
                        <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-surface-500" />
                        <input
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
                        <div id="name-error" className="flex items-center gap-1 mt-2 text-red-400 text-sm">
                          <AlertCircle className="w-4 h-4" />
                          <span>{errors.name}</span>
                        </div>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">{t('contact.email')} <span className="text-red-400">*</span></label>
                      <div className="relative">
                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-surface-500" />
                        <input
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
                        <div id="email-error" className="flex items-center gap-1 mt-2 text-red-400 text-sm">
                          <AlertCircle className="w-4 h-4" />
                          <span>{errors.email}</span>
                        </div>
                      )}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">{t('contact.subject')}</label>
                    <input
                      type="text"
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      className="input"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">{t('contact.message')} <span className="text-red-400">*</span></label>
                    <div className="relative">
                      <MessageSquare className="absolute left-4 top-4 w-5 h-5 text-surface-500" />
                      <textarea
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        onBlur={() => handleBlur('message')}
                        className={`input pl-12 min-h-[150px] ${touched.message && errors.message ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' : ''}`}
                        aria-invalid={touched.message && !!errors.message}
                        aria-describedby={errors.message ? 'message-error' : undefined}
                      />
                    </div>
                    {touched.message && errors.message && (
                      <div id="message-error" className="flex items-center gap-1 mt-2 text-red-400 text-sm">
                        <AlertCircle className="w-4 h-4" />
                        <span>{errors.message}</span>
                      </div>
                    )}
                  </div>
                  <button
                    type="submit"
                    disabled={status === 'submitting'}
                    className="btn-primary w-full text-lg disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {status === 'submitting' ? (
                      t('contact.sending')
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
