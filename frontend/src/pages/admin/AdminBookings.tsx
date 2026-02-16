import { Link } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { ArrowLeft, Check, X, Calendar, Filter, CalendarCheck, Loader2 } from 'lucide-react'
import { supabase, Booking } from '@/lib/supabase'
import AdminLayout from '../../components/admin/AdminLayout'
import { useToast } from '../../components/ui/Toast'

type DateFilter = 'all' | 'today' | 'this-week'

export default function AdminBookings() {
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)
  const [dateFilter, setDateFilter] = useState<DateFilter>('all')
  const [syncingBookingId, setSyncingBookingId] = useState<string | null>(null)
  const { addToast } = useToast()

  useEffect(() => {
    fetchBookings()
  }, [dateFilter])

  async function fetchBookings() {
    const today = new Date().toISOString().split('T')[0]

    // Calculate start of week (Monday)
    const now = new Date()
    const dayOfWeek = now.getDay()
    const diffToMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1
    const monday = new Date(now)
    monday.setDate(now.getDate() - diffToMonday)
    const startOfWeek = monday.toISOString().split('T')[0]

    // Calculate end of week (Sunday)
    const sunday = new Date(monday)
    sunday.setDate(monday.getDate() + 6)
    const endOfWeek = sunday.toISOString().split('T')[0]

    let query = supabase
      .from('bookings')
      .select('*')
      .order('booking_date', { ascending: false })

    if (dateFilter === 'today') {
      query = query.eq('booking_date', today)
    } else if (dateFilter === 'this-week') {
      query = query.gte('booking_date', startOfWeek).lte('booking_date', endOfWeek)
    }

    const { data, error } = await query

    if (error) {
      console.error('Error fetching bookings:', error)
    } else {
      setBookings(data || [])
    }
    setLoading(false)
  }

  async function syncWithGoogleCalendar(booking: Booking, action: 'create' | 'delete'): Promise<string | null> {
    try {
      const response = await supabase.functions.invoke('sync-google-calendar', {
        body: {
          action,
          booking: action === 'create' ? {
            id: booking.id,
            client_name: booking.client_name,
            client_email: booking.client_email,
            company: booking.company,
            description: booking.description,
            booking_date: booking.booking_date,
            booking_time: booking.booking_time,
            duration: booking.duration,
          } : undefined,
          eventId: action === 'delete' ? booking.google_calendar_event_id : undefined,
        },
      })

      if (response.error) {
        console.warn('Google Calendar sync warning:', response.error)
        return null
      }

      console.log('Google Calendar sync result:', response.data)
      return response.data?.eventId || null
    } catch (err) {
      console.warn('Google Calendar sync error:', err)
      return null
    }
  }

  async function updateBookingStatus(id: string, status: 'confirmed' | 'cancelled') {
    setSyncingBookingId(id)

    try {
      // Find the booking to get full details
      const booking = bookings.find(b => b.id === id)

      // Update the status first
      const { error } = await supabase
        .from('bookings')
        .update({ status })
        .eq('id', id)

      if (error) {
        console.error('Error updating booking:', error)
        addToast('error', 'Failed to update booking status.')
        return
      }

      // Sync with Google Calendar
      if (booking) {
        if (status === 'confirmed') {
          // Create calendar event when confirmed
          const eventId = await syncWithGoogleCalendar(booking, 'create')
          if (eventId) {
            addToast('success', 'Booking confirmed and synced to Google Calendar!')
          } else {
            addToast('success', 'Booking confirmed! (Calendar sync pending - credentials not configured)')
          }
        } else if (status === 'cancelled' && booking.google_calendar_event_id) {
          // Delete calendar event when cancelled
          await syncWithGoogleCalendar(booking, 'delete')

          // Clear the event ID in database
          await supabase
            .from('bookings')
            .update({ google_calendar_event_id: null })
            .eq('id', id)

          addToast('success', 'Booking cancelled and removed from Google Calendar!')
        } else if (status === 'cancelled') {
          addToast('success', 'Booking cancelled successfully!')
        }
      }

      fetchBookings()
    } finally {
      setSyncingBookingId(null)
    }
  }

  return (
    <AdminLayout>
      <div className="mb-8">
        <Link
          to="/admin/dashboard"
          className="mb-2 inline-flex items-center text-surface-400 transition-colors hover:text-white"
        >
          <ArrowLeft className="mr-1 h-4 w-4" />
          Back to Dashboard
        </Link>
        <h1 className="heading-2">Booking Management</h1>
      </div>

      {/* Date Filters */}
      <div className="mb-6 flex items-center gap-4 rounded-xl border border-white/10 bg-white/5 p-4">
        <div className="flex items-center gap-2 text-surface-400">
          <Filter className="w-4 h-4" />
          <span className="text-sm">Filter:</span>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setDateFilter('all')}
            className={`px-4 py-2 text-sm rounded-lg transition-colors ${
              dateFilter === 'all'
                ? 'bg-primary-500 text-white'
                : 'border border-white/10 bg-white/5 text-surface-300 hover:bg-white/10'
            }`}
          >
            All
          </button>
          <button
            onClick={() => setDateFilter('today')}
            className={`px-4 py-2 text-sm rounded-lg transition-colors ${
              dateFilter === 'today'
                ? 'bg-primary-500 text-white'
                : 'border border-white/10 bg-white/5 text-surface-300 hover:bg-white/10'
            }`}
          >
            Today
          </button>
          <button
            onClick={() => setDateFilter('this-week')}
            className={`px-4 py-2 text-sm rounded-lg transition-colors ${
              dateFilter === 'this-week'
                ? 'bg-primary-500 text-white'
                : 'border border-white/10 bg-white/5 text-surface-300 hover:bg-white/10'
            }`}
          >
            This Week
          </button>
        </div>
      </div>

        <div className="glass-card overflow-hidden">
          {loading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary-500"></div>
            </div>
          ) : (
            <div className="overflow-x-auto">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Client</th>
                  <th>Email</th>
                  <th>Date & Time</th>
                  <th>Status</th>
                  <th className="text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {bookings.map((booking) => (
                  <tr key={booking.id}>
                    <td className="font-medium">{booking.client_name}</td>
                    <td className="text-surface-400">{booking.client_email}</td>
                    <td>
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-primary-400" />
                        {booking.booking_date} at {booking.booking_time}
                      </div>
                    </td>
                    <td>
                      <div className="flex items-center gap-2">
                        <span className={`px-3 py-1 text-xs rounded-full ${
                          booking.status === 'confirmed'
                            ? 'bg-green-500/20 text-green-400'
                            : booking.status === 'cancelled'
                            ? 'bg-red-500/20 text-red-400'
                            : 'bg-yellow-500/20 text-yellow-400'
                        }`}>
                          {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                        </span>
                        {booking.google_calendar_event_id && (
                          <span className="flex items-center gap-1 text-xs text-blue-400" title="Synced to Google Calendar">
                            <CalendarCheck className="w-3 h-3" />
                          </span>
                        )}
                      </div>
                    </td>
                    <td>
                      <div className="flex items-center justify-end gap-2">
                        {syncingBookingId === booking.id ? (
                          <div className="flex items-center gap-2 text-surface-400">
                            <Loader2 className="w-4 h-4 animate-spin" />
                            <span className="text-xs">Syncing...</span>
                          </div>
                        ) : booking.status === 'pending' && (
                          <>
                            <button
                              onClick={() => updateBookingStatus(booking.id, 'confirmed')}
                              className="p-2 rounded-lg bg-green-500/20 text-green-400 hover:bg-green-500/30 transition-colors"
                              aria-label={`Confirm booking for ${booking.client_name}`}
                            >
                              <Check className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => updateBookingStatus(booking.id, 'cancelled')}
                              className="p-2 rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-colors"
                              aria-label={`Cancel booking for ${booking.client_name}`}
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            </div>
          )}
        </div>
    </AdminLayout>
  )
}
