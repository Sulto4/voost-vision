import { useTranslation } from 'react-i18next'
import { Link, useSearchParams } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { supabase, Article } from '@/lib/supabase'
import { ChevronLeft, ChevronRight } from 'lucide-react'

const ARTICLES_PER_PAGE = 6

const categories = [
  { id: 'all', label_ro: 'Toate', label_en: 'All' },
  { id: 'Development', label_ro: 'Development', label_en: 'Development' },
  { id: 'Design', label_ro: 'Design', label_en: 'Design' },
  { id: 'Strategy', label_ro: 'Strategy', label_en: 'Strategy' },
  { id: 'SEO', label_ro: 'SEO', label_en: 'SEO' },
  { id: 'Security', label_ro: 'Security', label_en: 'Security' },
  { id: 'AI', label_ro: 'AI', label_en: 'AI' },
  { id: 'Performance', label_ro: 'Performance', label_en: 'Performance' },
]

export default function Blog() {
  const { t, i18n } = useTranslation()
  const currentLang = i18n.language
  const [searchParams, setSearchParams] = useSearchParams()
  const [articles, setArticles] = useState<Article[]>([])
  const [totalCount, setTotalCount] = useState(0)
  const [loading, setLoading] = useState(true)

  const currentPage = parseInt(searchParams.get('page') || '1', 10)
  const currentCategory = searchParams.get('category') || 'all'
  const totalPages = Math.ceil(totalCount / ARTICLES_PER_PAGE)

  useEffect(() => {
    async function fetchArticles() {
      setLoading(true)
      const from = (currentPage - 1) * ARTICLES_PER_PAGE
      const to = from + ARTICLES_PER_PAGE - 1

      // Build query for count
      let countQuery = supabase
        .from('articles')
        .select('*', { count: 'exact', head: true })
        .eq('published', true)

      if (currentCategory !== 'all') {
        countQuery = countQuery.eq('category', currentCategory)
      }

      const { count } = await countQuery
      setTotalCount(count || 0)

      // Build query for articles
      let articlesQuery = supabase
        .from('articles')
        .select('*')
        .eq('published', true)
        .order('published_at', { ascending: false })

      if (currentCategory !== 'all') {
        articlesQuery = articlesQuery.eq('category', currentCategory)
      }

      const { data, error } = await articlesQuery.range(from, to)

      if (error) {
        console.error('Error fetching articles:', error)
      } else {
        setArticles(data || [])
      }
      setLoading(false)
    }

    fetchArticles()
  }, [currentPage, currentCategory])

  const goToPage = (page: number) => {
    const params: Record<string, string> = { page: page.toString() }
    if (currentCategory !== 'all') {
      params.category = currentCategory
    }
    setSearchParams(params)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const setCategory = (category: string) => {
    const params: Record<string, string> = { page: '1' }
    if (category !== 'all') {
      params.category = category
    }
    setSearchParams(params)
  }

  return (
    <div className="pt-16 md:pt-20">
      <section className="section">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h1 className="heading-1 mb-6">
              <span className="gradient-text">{t('blogPreview.title')}</span>
            </h1>
            <p className="text-xl text-surface-300">
              {t('blogPreview.subtitle')}
            </p>
          </div>

          {/* Category Filter */}
          <div className="flex flex-wrap justify-center gap-3 mb-12">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setCategory(cat.id)}
                className={`px-5 py-2 rounded-full text-sm transition-colors ${
                  currentCategory === cat.id
                    ? 'bg-primary-500 text-white'
                    : 'bg-white/5 text-surface-300 hover:bg-white/10'
                }`}
              >
                {currentLang === 'en' ? cat.label_en : cat.label_ro}
              </button>
            ))}
          </div>

          {loading ? (
            <div className="flex justify-center items-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {articles.map((article) => (
                <Link
                  key={article.id}
                  to={`/blog/${article.slug}`}
                  className="glass-card overflow-hidden group"
                >
                  <div className="aspect-video overflow-hidden">
                    <img
                      src={article.cover_image || ''}
                      alt={currentLang === 'en' ? article.title_en : article.title_ro}
                      className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xs text-primary-400 font-medium uppercase tracking-wide">
                        {article.category || ''}
                      </span>
                      <span className="text-xs text-surface-500">
                        {article.published_at ? new Date(article.published_at).toLocaleDateString(currentLang === 'en' ? 'en-US' : 'ro-RO') : ''}
                      </span>
                    </div>
                    <h3 className="text-xl font-semibold mb-3">
                      {currentLang === 'en' ? article.title_en : article.title_ro}
                    </h3>
                    <p className="text-surface-400">
                      {currentLang === 'en' ? article.excerpt_en : article.excerpt_ro}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          )}

          {/* Pagination */}
          {!loading && totalPages > 1 && (
            <div className="flex justify-center items-center gap-2 mt-12">
              <button
                onClick={() => goToPage(currentPage - 1)}
                disabled={currentPage === 1}
                className="p-2 rounded-lg bg-white/5 hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                aria-label="Previous page"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => goToPage(page)}
                  className={`px-4 py-2 rounded-lg transition-colors ${
                    currentPage === page
                      ? 'bg-primary-500 text-white'
                      : 'bg-white/5 hover:bg-white/10'
                  }`}
                >
                  {page}
                </button>
              ))}

              <button
                onClick={() => goToPage(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="p-2 rounded-lg bg-white/5 hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                aria-label="Next page"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
