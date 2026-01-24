import { useTranslation } from 'react-i18next'
import { useState } from 'react'
import { Calendar, Clock, User, Mail, Building, FileText, Check } from 'lucide-react'

const availableTimes = ['09:00', '10:00', '11:00', '14:00', '15:00', '16:00', '17:00']

export default function Booking() {
  const { t } = useTranslation()
  const [selectedDate, setSelectedDate] = useState('')
  const [selectedTime, setSelectedTime] = useState('')
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    description: '',
  })
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('submitting')

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500))
    setStatus('success')
  }

  if (status === 'success') {
    return (
      <div className="pt-16 md:pt-20">
        <section className="section min-h-[60vh] flex items-center">
          <div className="container-custom">
            <div className="max-w-xl mx-auto text-center glass-card p-12">
              <div className="w-20 h-20 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-6">
                <Check className="w-10 h-10 text-green-400" />
              </div>
              <h2 className="heading-3 mb-4">{t('booking.success')}</h2>
              <p className="text-surface-400">
                {selectedDate} at {selectedTime}
              </p>
            </div>
          </div>
        </section>
      </div>
    )
  }

  return (
    <div className="pt-16 md:pt-20">
      <section className="section">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h1 className="heading-1 mb-6">
              <span className="gradient-text">{t('booking.pageTitle')}</span>
            </h1>
            <p className="text-xl text-surface-300">
              {t('booking.pageSubtitle')}
            </p>
          </div>

          <div className="max-w-2xl mx-auto">
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Date Selection */}
              <div className="glass-card p-6">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-primary-400" />
                  {t('booking.selectDate')}
                </h3>
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                  className="input"
                  required
                />
              </div>

              {/* Time Selection */}
              <div className="glass-card p-6">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <Clock className="w-5 h-5 text-primary-400" />
                  {t('booking.selectTime')}
                </h3>
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                  {availableTimes.map((time) => (
                    <button
                      key={time}
                      type="button"
                      onClick={() => setSelectedTime(time)}
                      className={`py-3 rounded-xl transition-colors ${
                        selectedTime === time
                          ? 'bg-primary-500 text-white'
                          : 'bg-white/5 text-surface-300 hover:bg-white/10'
                      }`}
                    >
                      {time}
                    </button>
                  ))}
                </div>
              </div>

              {/* Contact Details */}
              <div className="glass-card p-6">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <User className="w-5 h-5 text-primary-400" />
                  {t('booking.yourDetails')}
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">{t('booking.name')}</label>
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
                    <label className="block text-sm font-medium mb-2">{t('booking.email')}</label>
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
                  <div>
                    <label className="block text-sm font-medium mb-2">{t('booking.company')}</label>
                    <div className="relative">
                      <Building className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-surface-500" />
                      <input
                        type="text"
                        value={formData.company}
                        onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                        className="input pl-12"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">{t('booking.description')}</label>
                    <div className="relative">
                      <FileText className="absolute left-4 top-4 w-5 h-5 text-surface-500" />
                      <textarea
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        className="input pl-12 min-h-[120px]"
                        required
                      />
                    </div>
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={status === 'submitting' || !selectedDate || !selectedTime}
                className="btn-primary w-full text-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {status === 'submitting' ? t('booking.booking') : t('booking.book')}
              </button>
            </form>
          </div>
        </div>
      </section>
    </div>
  )
}
