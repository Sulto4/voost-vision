import { Link } from 'react-router-dom'
import { ArrowLeft, Mail, Check, Trash2 } from 'lucide-react'

const messages = [
  {
    id: '1',
    name: 'Ion Georgescu',
    email: 'ion@example.com',
    subject: 'E-commerce Project Inquiry',
    message: 'I\'m interested in developing a new e-commerce platform for my business...',
    read: false,
    date: '2026-01-24',
  },
  {
    id: '2',
    name: 'Ana Dobre',
    email: 'ana@example.com',
    subject: 'Thank you!',
    message: 'Thank you for the quick response regarding our project. I look forward to...',
    read: true,
    date: '2026-01-23',
  },
  {
    id: '3',
    name: 'Mihai Popa',
    email: 'mihai@example.com',
    subject: 'Mobile App Development',
    message: 'We are looking to develop a mobile app for our restaurant chain...',
    read: false,
    date: '2026-01-22',
  },
]

export default function AdminContact() {
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
                    <span className="text-surface-500 text-sm">{message.date}</span>
                  </div>
                  <p className="text-surface-400 text-sm mb-1">{message.email}</p>
                  <p className="font-medium text-primary-400 mb-2">{message.subject}</p>
                  <p className="text-surface-300 line-clamp-2">{message.message}</p>
                </div>
                <div className="flex items-center gap-2 ml-4">
                  {!message.read && (
                    <button className="p-2 rounded-lg bg-primary-500/20 text-primary-400 hover:bg-primary-500/30 transition-colors">
                      <Check className="w-4 h-4" />
                    </button>
                  )}
                  <a
                    href={`mailto:${message.email}`}
                    className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
                  >
                    <Mail className="w-4 h-4" />
                  </a>
                  <button className="p-2 rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-colors">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  )
}
