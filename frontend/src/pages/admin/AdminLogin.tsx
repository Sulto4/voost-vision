import { useState, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { Lock, Mail, Eye, EyeOff } from 'lucide-react'
import { useAuth } from '../../hooks/useAuth'
import { supabase } from '../../lib/supabase'

export default function AdminLogin() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [googleLoading, setGoogleLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const { user, isAdmin, signInWithGoogle, signOut } = useAuth()

  // Check for unauthorized error from redirect
  useEffect(() => {
    if (searchParams.get('error') === 'unauthorized') {
      setError('Access denied. You do not have admin privileges.')
    }
  }, [searchParams])

  // Redirect if already logged in AND is admin
  useEffect(() => {
    if (user && isAdmin) {
      navigate('/admin/dashboard')
    }
  }, [user, isAdmin, navigate])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      // Sign in with Supabase auth
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      })

      if (error) {
        if (error.message.includes('Invalid login credentials')) {
          setError('Invalid email or password. Please try again.')
        } else {
          setError(error.message)
        }
        return
      }

      // Check if user has admin privileges (using the same logic as useAuth)
      const ADMIN_EMAILS = ['admin@voostvision.ro', 'contact@voostvision.ro']
      if (data.user && !ADMIN_EMAILS.includes(data.user.email || '')) {
        setError('Access denied. You do not have admin privileges.')
        await signOut()
        return
      }

      // Successful login - redirect will happen via useEffect when user state updates
    } catch (err) {
      setError('An unexpected error occurred. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleSignIn = async () => {
    setGoogleLoading(true)
    setError(null)
    try {
      await signInWithGoogle()
    } catch (err) {
      setError('Failed to sign in with Google. Please try again.')
      setGoogleLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-surface-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold gradient-text mb-2">Voost Vision</h1>
          <p className="text-surface-400">Admin Panel</p>
        </div>

        <div className="glass-card p-8 space-y-6">
          {/* Google Sign In Button */}
          <button
            type="button"
            onClick={handleGoogleSignIn}
            disabled={googleLoading}
            className="w-full flex items-center justify-center gap-3 px-4 py-3 bg-white text-gray-800 rounded-xl font-medium hover:bg-gray-100 transition-colors disabled:opacity-50"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            {googleLoading ? 'Signing in...' : 'Sign in with Google'}
          </button>

          {/* Divider */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/10"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-surface-900/80 text-surface-400">or continue with email</span>
            </div>
          </div>

          {/* Error message */}
          {error && (
            <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm">
              {error}
            </div>
          )}

          {/* Email/Password Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-2">Email</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-surface-500" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="input pl-12"
                  placeholder="admin@voostvision.ro"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-surface-500" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="input pl-12 pr-12"
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-surface-500 hover:text-white"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full disabled:opacity-50"
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
