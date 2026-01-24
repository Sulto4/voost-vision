import { Link } from 'react-router-dom'
import { Plus, Edit, Trash2, ArrowLeft } from 'lucide-react'

const articles = [
  { id: '1', title: 'Web Development Trends for 2026', category: 'Development', published: true },
  { id: '2', title: 'The Importance of UX Design', category: 'Design', published: true },
  { id: '3', title: 'Mobile-First Strategy in 2026', category: 'Strategy', published: true },
]

export default function AdminBlog() {
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
        <div className="flex items-center justify-between mb-8">
          <div>
            <Link
              to="/admin/dashboard"
              className="inline-flex items-center text-surface-400 hover:text-white transition-colors mb-2"
            >
              <ArrowLeft className="w-4 h-4 mr-1" />
              Back to Dashboard
            </Link>
            <h1 className="heading-2">Blog Management</h1>
          </div>
          <button className="btn-primary">
            <Plus className="w-5 h-5 mr-2" />
            New Article
          </button>
        </div>

        <div className="glass-card overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/10">
                <th className="text-left py-4 px-6 text-surface-400 font-medium">Title</th>
                <th className="text-left py-4 px-6 text-surface-400 font-medium">Category</th>
                <th className="text-left py-4 px-6 text-surface-400 font-medium">Status</th>
                <th className="text-right py-4 px-6 text-surface-400 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {articles.map((article) => (
                <tr key={article.id} className="border-b border-white/5 last:border-0">
                  <td className="py-4 px-6 font-medium">{article.title}</td>
                  <td className="py-4 px-6">
                    <span className="px-3 py-1 text-xs bg-primary-500/20 text-primary-300 rounded-full">
                      {article.category}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <span className={`px-3 py-1 text-xs rounded-full ${
                      article.published
                        ? 'bg-green-500/20 text-green-400'
                        : 'bg-yellow-500/20 text-yellow-400'
                    }`}>
                      {article.published ? 'Published' : 'Draft'}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center justify-end gap-2">
                      <button className="p-2 rounded-lg hover:bg-white/10 transition-colors">
                        <Edit className="w-4 h-4" />
                      </button>
                      <button className="p-2 rounded-lg hover:bg-red-500/20 text-red-400 transition-colors">
                        <Trash2 className="w-4 h-4" />
                      </button>
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
