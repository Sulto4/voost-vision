import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { FolderKanban, FileText, Calendar, Mail, ArrowRight } from 'lucide-react'
import { supabase } from '../../lib/supabase'
import AdminLayout from '../../components/admin/AdminLayout'

interface DashboardStats {
  projects: number
  articles: number
  bookings: number
  contacts: number
}

interface RecentBooking {
  id: string
  client_name: string
  description: string | null
  status: string
}

interface RecentMessage {
  id: string
  name: string
  message: string
  read: boolean
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    projects: 0,
    articles: 0,
    bookings: 0,
    contacts: 0
  })
  const [recentBookings, setRecentBookings] = useState<RecentBooking[]>([])
  const [recentMessages, setRecentMessages] = useState<RecentMessage[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchDashboardData() {
      try {
        // Fetch counts in parallel
        const [
          { count: projectsCount },
          { count: articlesCount },
          { count: bookingsCount },
          { count: contactsCount },
          { data: bookingsData },
          { data: messagesData }
        ] = await Promise.all([
          supabase.from('projects').select('*', { count: 'exact', head: true }),
          supabase.from('articles').select('*', { count: 'exact', head: true }),
          supabase.from('bookings').select('*', { count: 'exact', head: true }),
          supabase.from('contact_submissions').select('*', { count: 'exact', head: true }),
          supabase.from('bookings').select('id, client_name, description, status').order('created_at', { ascending: false }).limit(3),
          supabase.from('contact_submissions').select('id, name, message, read').order('created_at', { ascending: false }).limit(3)
        ])

        setStats({
          projects: projectsCount || 0,
          articles: articlesCount || 0,
          bookings: bookingsCount || 0,
          contacts: contactsCount || 0
        })

        setRecentBookings(bookingsData || [])
        setRecentMessages(messagesData || [])
      } catch (error) {
        console.error('Error fetching dashboard data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchDashboardData()
  }, [])

  const statCards = [
    { label: 'Portfolio Projects', value: stats.projects, icon: FolderKanban, href: '/admin/portfolio' },
    { label: 'Blog Articles', value: stats.articles, icon: FileText, href: '/admin/blog' },
    { label: 'Bookings', value: stats.bookings, icon: Calendar, href: '/admin/bookings' },
    { label: 'Contact Messages', value: stats.contacts, icon: Mail, href: '/admin/contact' },
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-500/20 text-green-400'
      case 'cancelled':
        return 'bg-red-500/20 text-red-400'
      default:
        return 'bg-yellow-500/20 text-yellow-400'
    }
  }

  return (
    <AdminLayout>
      <h1 className="heading-2 mb-8">Dashboard</h1>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {statCards.map((stat) => (
            <Link
              key={stat.label}
              to={stat.href}
              className="glass-card p-6 hover:border-primary-500/50 transition-all group"
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-surface-400 text-sm">{stat.label}</p>
                  <p className="text-3xl font-bold mt-1">
                    {loading ? '...' : stat.value}
                  </p>
                </div>
                <div className="w-12 h-12 rounded-xl bg-primary-500/20 flex items-center justify-center">
                  <stat.icon className="w-6 h-6 text-primary-400" />
                </div>
              </div>
              <div className="mt-4 flex items-center text-primary-400 text-sm group-hover:text-primary-300">
                View all
                <ArrowRight className="w-4 h-4 ml-1 transform group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          ))}
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          <div className="glass-card p-6">
            <h2 className="text-xl font-semibold mb-4">Recent Bookings</h2>
            <div className="space-y-4">
              {loading ? (
                <p className="text-surface-400">Loading...</p>
              ) : recentBookings.length === 0 ? (
                <p className="text-surface-400">No bookings yet</p>
              ) : (
                recentBookings.map((booking) => (
                  <div key={booking.id} className="flex items-center justify-between py-3 border-b border-white/5">
                    <div>
                      <p className="font-medium">{booking.client_name}</p>
                      <p className="text-surface-400 text-sm">{booking.description || 'Consultation'}</p>
                    </div>
                    <span className={`px-3 py-1 text-xs rounded-full capitalize ${getStatusColor(booking.status)}`}>
                      {booking.status}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="glass-card p-6">
            <h2 className="text-xl font-semibold mb-4">Recent Messages</h2>
            <div className="space-y-4">
              {loading ? (
                <p className="text-surface-400">Loading...</p>
              ) : recentMessages.length === 0 ? (
                <p className="text-surface-400">No messages yet</p>
              ) : (
                recentMessages.map((message) => (
                  <div key={message.id} className="py-3 border-b border-white/5">
                    <div className="flex items-center justify-between mb-1">
                      <p className="font-medium">{message.name}</p>
                      {!message.read ? (
                        <span className="w-2 h-2 rounded-full bg-primary-400"></span>
                      ) : (
                        <span className="text-surface-500 text-xs">Read</span>
                      )}
                    </div>
                    <p className="text-surface-400 text-sm line-clamp-1">
                      {message.message}
                    </p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
    </AdminLayout>
  )
}
