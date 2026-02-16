import { useTranslation } from 'react-i18next'
import { useState, useEffect, useRef } from 'react'
import { Calendar, Clock, User, Mail, Building, FileText, Check, AlertCircle } from 'lucide-react'
import { supabase } from '@/lib/supabase'

// Rate limiting configuration
const RATE_LIMIT_MAX_SUBMISSIONS = 3 // Maximum submissions in the time window
const RATE_LIMIT_WINDOW_MS = 300000 // 5 minute window (300000ms)
const RATE_LIMIT_COOLDOWN_MS = 10000 // 10 second cooldown after hitting limit

const allTimeSlots = ['09:00', '10:00', '11:00', '14:00', '15:00', '16:00', '17:00']

export default function Booking() {
  const { t } = useTranslation()
  const [selectedDate, setSelectedDate] = useState('')
  const [selectedTime, setSelectedTime] = useState('')
  const [bookedSlots, setBookedSlots] = useState<string[]>([])
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    description: '',
  })
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error' | 'rate_limited'>('idle')

  // Rate limiting state
  const submissionTimestamps = useRef<number[]>([])
  const [rateLimitCooldown, setRateLimitCooldown] = useState<number>(0)
  const cooldownIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  // Check if rate limited
  const checkRateLimit = (): boolean => {
    const now = Date.now()
    // Filter out timestamps older than the window
    submissionTimestamps.current = submissionTimestamps.current.filter(
      (ts) => now - ts < RATE_LIMIT_WINDOW_MS
    )
    // Check if we've exceeded the max submissions
    if (submissionTimestamps.current.length >= RATE_LIMIT_MAX_SUBMISSIONS) {
      return true // Rate limited
    }
    return false
  }

  // Start cooldown timer
  const startCooldown = () => {
    setRateLimitCooldown(Math.ceil(RATE_LIMIT_COOLDOWN_MS / 1000))
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
          return 0
        }
        return prev - 1
      })
    }, 1000)
  }

  // Cleanup interval on unmount
  useEffect(() => {
    return () => {
      if (cooldownIntervalRef.current) {
        clearInterval(cooldownIntervalRef.current)
      }
    }
  }, [])

  // Fetch booked slots for selected date
  useEffect(() => {
    async function fetchBookedSlots() {
      if (!selectedDate) {
        setBookedSlots([])
        return
      }

      try {
        const { data, error } = await supabase
          .from('bookings')
          .select('booking_time')
          .eq('booking_date', selectedDate)
          .in('status', ['pending', 'confirmed'])

        if (!error && data) {
          setBookedSlots(data.map((b) => b.booking_time))
        }
      } catch (err) {
        console.error('Error fetching booked slots:', err)
      }
    }

    fetchBookedSlots()
    // Clear selected time when date changes
    setSelectedTime('')
  }, [selectedDate])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Check rate limit before processing
    if (checkRateLimit()) {
      startCooldown()
      return
    }

    setStatus('submitting')

    try {
      // Record this submission timestamp
      submissionTimestamps.current.push(Date.now())

      const { data: bookingData, error } = await supabase.from('bookings').insert({
        client_name: formData.name,
        client_email: formData.email,
        company: formData.company || null,
        description: formData.description,
        booking_date: selectedDate,
        booking_time: selectedTime,
        status: 'pending',
      }).select().single()

      if (error) {
        console.error('Error creating booking:', error)
        setStatus('error')
      } else {
        // Send confirmation email via Edge Function
        try {
          const emailResponse = await supabase.functions.invoke('send-booking-confirmation', {
            body: {
              id: bookingData.id,
              client_name: formData.name,
              client_email: formData.email,
              company: formData.company || null,
              description: formData.description,
              booking_date: selectedDate,
              booking_time: selectedTime,
            }
          })

          if (emailResponse.error) {
            console.warn('Email notification failed:', emailResponse.error)
            // Don't fail the booking - just log the error
          } else {
            console.log('Confirmation email sent:', emailResponse.data)
          }
        } catch (emailErr) {
          console.warn('Email notification error:', emailErr)
          // Don't fail the booking - email is secondary
        }

        setStatus('success')
      }
    } catch (err) {
      console.error('Error:', err)
      setStatus('error')
    }
  }

  const handleBookAnother = () => {
    setStatus('idle')
    setSelectedDate('')
    setSelectedTime('')
    setFormData({ name: '', email: '', company: '', description: '' })
  }

  if (status === 'success') {
    return (
      <div className="page-shell">
        <section className="section flex min-h-[60vh] items-center">
          <div className="container-custom">
            <div className="glass-card mx-auto max-w-xl p-12 text-center">
              <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-green-500/20">
                <Check className="h-10 w-10 text-green-400" />
              </div>
              <h2 className="heading-3 mb-4">{t('booking.success')}</h2>
              <p className="text-surface-400 mb-6">
                {selectedDate} at {selectedTime}
              </p>
              <button
                onClick={handleBookAnother}
                className="btn-secondary"
              >
                {t('booking.bookAnother')}
              </button>
            </div>
          </div>
        </section>
      </div>
    )
  }

  return (
    <div className="page-shell">
      <section className="section relative overflow-hidden pb-16 pt-28 md:pt-32">
        <div className="hero-backdrop" />
        <div className="container-custom">
          <div className="mx-auto mb-14 max-w-3xl text-center">
            <span className="section-kicker">Book A Call</span>
            <h1 className="heading-1 mt-3 mb-6">
              <span className="gradient-text">{t('booking.pageTitle')}</span>
            </h1>
            <p className="text-xl text-surface-300">
              {t('booking.pageSubtitle')}
            </p>
          </div>

          <div className="mx-auto max-w-2xl">
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Date Selection */}
              <div className="glass-card p-6">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-primary-300" />
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
                  <Clock className="h-5 w-5 text-primary-300" />
                  {t('booking.selectTime')}
                </h3>
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                  {allTimeSlots.map((time) => {
                    const isBooked = bookedSlots.includes(time)
                    const isSelected = selectedTime === time
                    return (
                      <button
                        key={time}
                        type="button"
                        onClick={() => !isBooked && setSelectedTime(time)}
                        disabled={isBooked}
                        className={`py-3 rounded-xl transition-colors ${
                          isBooked
                            ? 'bg-surface-700/50 text-surface-500 cursor-not-allowed line-through'
                            : isSelected
                            ? 'bg-primary-500 text-white'
                            : 'bg-white/5 text-surface-300 hover:bg-white/10'
                        }`}
                      >
                        {time}
                      </button>
                    )
                  })}
                </div>
                {bookedSlots.length > 0 && (
                  <p className="text-xs text-surface-500 mt-3">
                    {t('booking.bookedSlotsNote') || 'Crossed out times are already booked'}
                  </p>
                )}
              </div>

              {/* Contact Details */}
              <div className="glass-card p-6">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <User className="h-5 w-5 text-primary-300" />
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

              {/* Rate Limit Alert */}
              {status === 'rate_limited' && (
                <div className="flex items-start gap-3 p-4 bg-amber-500/10 border border-amber-500/30 rounded-xl">
                  <AlertCircle className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-amber-200">
                      {t('booking.rateLimitError')} ({rateLimitCooldown}s)
                    </p>
                  </div>
                </div>
              )}

              {/* Error Alert */}
              {status === 'error' && (
                <div className="flex items-start gap-3 p-4 bg-red-500/10 border border-red-500/30 rounded-xl">
                  <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                  <p className="text-red-200">{t('booking.error')}</p>
                </div>
              )}

              <button
                type="submit"
                disabled={status === 'submitting' || status === 'rate_limited' || !selectedDate || !selectedTime}
                className="btn-primary w-full text-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {status === 'submitting'
                  ? t('booking.booking')
                  : status === 'rate_limited'
                  ? `${t('booking.waitMessage')} (${rateLimitCooldown}s)`
                  : t('booking.book')}
              </button>
            </form>
          </div>
        </div>
      </section>
    </div>
  )
}
