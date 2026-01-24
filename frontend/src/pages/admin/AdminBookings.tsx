import { Link } from 'react-router-dom'
import { ArrowLeft, Check, X, Calendar } from 'lucide-react'

const bookings = [
  { id: '1', name: 'Maria Popescu', email: 'maria@example.com', date: '2026-01-25', time: '10:00', status: 'pending' },
  { id: '2', name: 'Andrei Ionescu', email: 'andrei@example.com', date: '2026-01-26', time: '14:00', status: 'confirmed' },
  { id: '3', name: 'Elena Dumitrescu', email: 'elena@example.com', date: '2026-01-27', time: '11:00', status: 'pending' },
]

export default function AdminBookings() {
  return (
    <div className="min-h-screen bg-surface-900">
      <header className="bg-surface-950 border-b border-white/5 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link to="/admin/dashboard" className="text-xl font-bold gradient-text">
              Voost Vision Admin
            </Link>
            <Link to="/" className="text-surface-400 hover:text-white text-sm">
              View Site
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <Link
            to="/admin/dashboard"
            className="inline-flex items-center text-surface-400 hover:text-white transition-colors mb-2"
          >
            <ArrowLeft className="w-4 h-4 mr-1" />
            Back to Dashboard
          </Link>
          <h1 className="heading-2">Booking Management</h1>
        </div>

        <div className="glass-card overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/10">
                <th className="text-left py-4 px-6 text-surface-400 font-medium">Client</th>
                <th className="text-left py-4 px-6 text-surface-400 font-medium">Email</th>
                <th className="text-left py-4 px-6 text-surface-400 font-medium">Date & Time</th>
                <th className="text-left py-4 px-6 text-surface-400 font-medium">Status</th>
                <th className="text-right py-4 px-6 text-surface-400 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((booking) => (
                <tr key={booking.id} className="border-b border-white/5 last:border-0">
                  <td className="py-4 px-6 font-medium">{booking.name}</td>
                  <td className="py-4 px-6 text-surface-400">{booking.email}</td>
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-primary-400" />
                      {booking.date} at {booking.time}
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <span className={`px-3 py-1 text-xs rounded-full ${
                      booking.status === 'confirmed'
                        ? 'bg-green-500/20 text-green-400'
                        : booking.status === 'cancelled'
                        ? 'bg-red-500/20 text-red-400'
                        : 'bg-yellow-500/20 text-yellow-400'
                    }`}>
                      {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center justify-end gap-2">
                      {booking.status === 'pending' && (
                        <>
                          <button className="p-2 rounded-lg bg-green-500/20 text-green-400 hover:bg-green-500/30 transition-colors">
                            <Check className="w-4 h-4" />
                          </button>
                          <button className="p-2 rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-colors">
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
      </main>
    </div>
  )
}
