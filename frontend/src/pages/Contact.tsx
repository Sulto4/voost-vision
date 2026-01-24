import { useTranslation } from 'react-i18next'
import { useState } from 'react'
import { Mail, Phone, MapPin, Send, Check, User, MessageSquare } from 'lucide-react'

export default function Contact() {
  const { t } = useTranslation()
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  })
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('submitting')

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500))
    setStatus('success')
    setFormData({ name: '', email: '', subject: '', message: '' })
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
                <form onSubmit={handleSubmit} className="glass-card p-8 space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium mb-2">{t('contact.name')}</label>
                      <div className="relative">
                        <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-surface-500" />
                        <input
                          type="text"
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          className="input pl-12"
                          required
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">{t('contact.email')}</label>
                      <div className="relative">
                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-surface-500" />
                        <input
                          type="email"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          className="input pl-12"
                          required
                        />
                      </div>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">{t('contact.subject')}</label>
                    <input
                      type="text"
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      className="input"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">{t('contact.message')}</label>
                    <div className="relative">
                      <MessageSquare className="absolute left-4 top-4 w-5 h-5 text-surface-500" />
                      <textarea
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        className="input pl-12 min-h-[150px]"
                        required
                      />
                    </div>
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
