import { Link } from 'react-router-dom'
import { ArrowLeft, Mail, Check, Trash2, Loader2 } from 'lucide-react'
import { useState, useEffect } from 'react'
import { supabase, ContactSubmission } from '../../lib/supabase'

export default function AdminContact() {
  const [messages, setMessages] = useState<ContactSubmission[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchMessages()
  }, [])

  const fetchMessages = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('contact_submissions')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      setMessages(data || [])
    } catch (err) {
      console.error('Error fetching messages:', err)
      setError('Failed to load messages')
    } finally {
      setLoading(false)
    }
  }

  const markAsRead = async (id: string) => {
    try {
      const { error } = await supabase
        .from('contact_submissions')
        .update({ read: true })
        .eq('id', id)

      if (error) throw error
      setMessages(messages.map(m => m.id === id ? { ...m, read: true } : m))
    } catch (err) {
      console.error('Error marking as read:', err)
    }
  }

  const deleteMessage = async (id: string) => {
    if (!confirm('Are you sure you want to delete this message?')) return

    try {
      const { error } = await supabase
        .from('contact_submissions')
        .delete()
        .eq('id', id)

      if (error) throw error
      setMessages(messages.filter(m => m.id !== id))
    } catch (err) {
      console.error('Error deleting message:', err)
    }
  }

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('ro-RO', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  }
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
          <h1 className="heading-2">Contact Messages</h1>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-primary-400" />
          </div>
        ) : error ? (
          <div className="glass-card p-8 text-center">
            <p className="text-red-400">{error}</p>
            <button
              onClick={fetchMessages}
              className="btn-primary mt-4"
            >
              Try Again
            </button>
          </div>
        ) : messages.length === 0 ? (
          <div className="glass-card p-8 text-center">
            <Mail className="w-12 h-12 text-surface-500 mx-auto mb-4" />
            <p className="text-surface-400">No contact messages yet</p>
          </div>
        ) : (
          <div className="space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`glass-card p-6 ${!message.read ? 'border-l-4 border-l-primary-500' : ''}`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-semibold">{message.name}</h3>
                      {!message.read && (
                        <span className="w-2 h-2 rounded-full bg-primary-400"></span>
                      )}
                      <span className="text-surface-500 text-sm">{formatDate(message.created_at)}</span>
                    </div>
                    <p className="text-surface-400 text-sm mb-1">{message.email}</p>
                    {message.subject && (
                      <p className="font-medium text-primary-400 mb-2">{message.subject}</p>
                    )}
                    <p className="text-surface-300">{message.message}</p>
                  </div>
                  <div className="flex items-center gap-2 ml-4">
                    {!message.read && (
                      <button
                        onClick={() => markAsRead(message.id)}
                        className="p-2 rounded-lg bg-primary-500/20 text-primary-400 hover:bg-primary-500/30 transition-colors"
                        title="Mark as read"
                      >
                        <Check className="w-4 h-4" />
                      </button>
                    )}
                    <a
                      href={`mailto:${message.email}`}
                      className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
                      title="Reply via email"
                    >
                      <Mail className="w-4 h-4" />
                    </a>
                    <button
                      onClick={() => deleteMessage(message.id)}
                      className="p-2 rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-colors"
                      title="Delete message"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
