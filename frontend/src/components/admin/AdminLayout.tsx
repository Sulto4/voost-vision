import { useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { LogOut, FolderKanban, FileText, Calendar, Mail, LayoutDashboard } from 'lucide-react'
import { useAuth } from '../../hooks/useAuth'

interface AdminLayoutProps {
  children: React.ReactNode
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const { user, loading, isAdmin, signOut } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    // Redirect to login if not authenticated and not loading
    if (!loading && !user) {
      navigate('/admin', { replace: true })
    }
    // Redirect if authenticated but not an admin
    if (!loading && user && !isAdmin) {
      navigate('/admin?error=unauthorized', { replace: true })
    }
  }, [user, loading, isAdmin, navigate])

  const handleLogout = async () => {
    try {
      await signOut()
      // Clear any additional localStorage items
      localStorage.removeItem('voost-admin-session')
      // Navigate to login page
      navigate('/admin', { replace: true })
    } catch (error) {
      console.error('Logout error:', error)
      // Force redirect even on error
      navigate('/admin', { replace: true })
    }
  }

  const navItems = [
    { label: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
    { label: 'Portfolio', href: '/admin/portfolio', icon: FolderKanban },
    { label: 'Blog', href: '/admin/blog', icon: FileText },
    { label: 'Bookings', href: '/admin/bookings', icon: Calendar },
    { label: 'Contact', href: '/admin/contact', icon: Mail },
  ]

  const isActive = (href: string) => location.pathname === href

  // Show loading state while checking auth
  if (loading) {
    return (
      <div className="min-h-screen bg-surface-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
      </div>
    )
  }

  // Don't render content if not authenticated or not admin
  if (!user || !isAdmin) {
    return null
  }

  return (
    <div className="min-h-screen bg-surface-900">
      <header className="bg-surface-950 border-b border-white/5 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link to="/admin/dashboard" className="text-xl font-bold gradient-text">
              Voost Vision Admin
            </Link>
            <nav className="hidden md:flex items-center space-x-1">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  to={item.href}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                    isActive(item.href)
                      ? 'bg-primary-500/20 text-primary-400'
                      : 'text-surface-300 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <item.icon className="w-4 h-4" />
                  {item.label}
                </Link>
              ))}
            </nav>
            <div className="flex items-center gap-4">
              <Link to="/" className="text-surface-400 hover:text-white text-sm">
                View Site
              </Link>
              <div className="flex items-center gap-3 pl-4 border-l border-white/10">
                <span className="text-surface-400 text-sm hidden sm:block">
                  {user.email}
                </span>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 px-3 py-2 text-surface-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                  title="Sign out"
                >
                  <LogOut className="w-4 h-4" />
                  <span className="hidden sm:block text-sm">Logout</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {children}
      </main>
    </div>
  )
}
