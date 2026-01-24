import { Link } from 'react-router-dom'
import { FolderKanban, FileText, Calendar, Mail, ArrowRight, Users } from 'lucide-react'

const stats = [
  { label: 'Portfolio Projects', value: 4, icon: FolderKanban, href: '/admin/portfolio' },
  { label: 'Blog Articles', value: 3, icon: FileText, href: '/admin/blog' },
  { label: 'Bookings', value: 12, icon: Calendar, href: '/admin/bookings' },
  { label: 'Contact Messages', value: 5, icon: Mail, href: '/admin/contact' },
]

export default function AdminDashboard() {
  return (
    <div className="min-h-screen bg-surface-900">
      <header className="bg-surface-950 border-b border-white/5 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link to="/admin/dashboard" className="text-xl font-bold gradient-text">
              Voost Vision Admin
            </Link>
            <nav className="hidden md:flex items-center space-x-6">
              <Link to="/admin/portfolio" className="text-surface-300 hover:text-white transition-colors">
                Portfolio
              </Link>
              <Link to="/admin/blog" className="text-surface-300 hover:text-white transition-colors">
                Blog
              </Link>
              <Link to="/admin/bookings" className="text-surface-300 hover:text-white transition-colors">
                Bookings
              </Link>
              <Link to="/admin/contact" className="text-surface-300 hover:text-white transition-colors">
                Contact
              </Link>
            </nav>
            <Link to="/" className="text-surface-400 hover:text-white text-sm">
              View Site
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="heading-2 mb-8">Dashboard</h1>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {stats.map((stat) => (
            <Link
              key={stat.label}
              to={stat.href}
              className="glass-card p-6 hover:border-primary-500/50 transition-all group"
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-surface-400 text-sm">{stat.label}</p>
                  <p className="text-3xl font-bold mt-1">{stat.value}</p>
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
              <div className="flex items-center justify-between py-3 border-b border-white/5">
                <div>
                  <p className="font-medium">Maria Popescu</p>
                  <p className="text-surface-400 text-sm">Discovery Call</p>
                </div>
                <span className="px-3 py-1 text-xs bg-yellow-500/20 text-yellow-400 rounded-full">
                  Pending
                </span>
              </div>
              <div className="flex items-center justify-between py-3 border-b border-white/5">
                <div>
                  <p className="font-medium">Andrei Ionescu</p>
                  <p className="text-surface-400 text-sm">Project Discussion</p>
                </div>
                <span className="px-3 py-1 text-xs bg-green-500/20 text-green-400 rounded-full">
                  Confirmed
                </span>
              </div>
            </div>
          </div>

          <div className="glass-card p-6">
            <h2 className="text-xl font-semibold mb-4">Recent Messages</h2>
            <div className="space-y-4">
              <div className="py-3 border-b border-white/5">
                <div className="flex items-center justify-between mb-1">
                  <p className="font-medium">Ion Georgescu</p>
                  <span className="w-2 h-2 rounded-full bg-primary-400"></span>
                </div>
                <p className="text-surface-400 text-sm line-clamp-1">
                  I'm interested in developing a new e-commerce platform...
                </p>
              </div>
              <div className="py-3 border-b border-white/5">
                <div className="flex items-center justify-between mb-1">
                  <p className="font-medium">Ana Dobre</p>
                  <span className="text-surface-500 text-xs">Read</span>
                </div>
                <p className="text-surface-400 text-sm line-clamp-1">
                  Thank you for the quick response regarding our project...
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
