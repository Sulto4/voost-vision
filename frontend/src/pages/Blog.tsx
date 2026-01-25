import { useTranslation } from 'react-i18next'
import { Link, useSearchParams } from 'react-router-dom'
import { useState, useEffect, useCallback } from 'react'
import { supabase, Article } from '@/lib/supabase'
import { ChevronLeft, ChevronRight, X } from 'lucide-react'
import ErrorMessage from '@/components/ui/ErrorMessage'

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
  const [error, setError] = useState<string | null>(null)
  const [isNetworkError, setIsNetworkError] = useState(false)

  const currentPage = parseInt(searchParams.get('page') || '1', 10)
  const currentCategory = searchParams.get('category') || 'all'
  const currentTag = searchParams.get('tag') || ''
  const totalPages = Math.ceil(totalCount / ARTICLES_PER_PAGE)

  const fetchArticles = useCallback(async () => {
    setLoading(true)
    setError(null)
    setIsNetworkError(false)

    try {
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

      if (currentTag) {
        countQuery = countQuery.contains('tags', [currentTag])
      }

      const { count, error: countError } = await countQuery

      if (countError) {
        const isNetwork = !navigator.onLine ||
          countError.message?.includes('fetch') ||
          countError.message?.includes('network') ||
          countError.message?.includes('Failed to fetch')
        setIsNetworkError(isNetwork)
        setError(countError.message)
        console.error('Error fetching articles count:', countError.message)
        setLoading(false)
        return
      }

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

      if (currentTag) {
        articlesQuery = articlesQuery.contains('tags', [currentTag])
      }

      const { data, error: fetchError } = await articlesQuery.range(from, to)

      if (fetchError) {
        const isNetwork = !navigator.onLine ||
          fetchError.message?.includes('fetch') ||
          fetchError.message?.includes('network') ||
          fetchError.message?.includes('Failed to fetch')

        setIsNetworkError(isNetwork)
        setError(fetchError.message)
        console.error('Error fetching articles:', fetchError.message)
      } else {
        setArticles(data || [])
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error'
      const isNetwork = !navigator.onLine ||
        (err instanceof TypeError && errorMessage?.includes('fetch')) ||
        errorMessage?.includes('Failed to fetch') ||
        errorMessage?.includes('network') ||
        errorMessage?.includes('NetworkError')

      setIsNetworkError(isNetwork)
      setError(errorMessage)
      console.error('Error fetching articles:', errorMessage)
    } finally {
      setLoading(false)
    }
  }, [currentPage, currentCategory, currentTag])

  useEffect(() => {
    fetchArticles()
  }, [fetchArticles])

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
    if (currentTag) {
      params.tag = currentTag
    }
    setSearchParams(params)
  }

  const setTag = (tag: string) => {
    const params: Record<string, string> = { page: '1' }
    if (currentCategory !== 'all') {
      params.category = currentCategory
    }
    if (tag) {
      params.tag = tag
    }
    setSearchParams(params)
  }

  const clearTag = () => {
    const params: Record<string, string> = { page: '1' }
    if (currentCategory !== 'all') {
      params.category = currentCategory
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
          <div className="flex flex-wrap justify-center gap-3 mb-8">
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

          {/* Active Tag Filter Indicator */}
          {currentTag && (
            <div className="flex justify-center items-center gap-2 mb-8">
              <span className="text-surface-400 text-sm">
                {currentLang === 'en' ? 'Filtered by tag:' : 'Filtrat dupa tag:'}
              </span>
              <span className="inline-flex items-center gap-1 px-3 py-1 bg-accent-500/20 text-accent-300 rounded-full text-sm">
                #{currentTag}
                <button
                  onClick={clearTag}
                  className="ml-1 hover:text-white transition-colors"
                  aria-label="Clear tag filter"
                >
                  <X className="w-4 h-4" />
                </button>
              </span>
            </div>
          )}

          {loading ? (
            <div className="flex justify-center items-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
            </div>
          ) : error ? (
            <ErrorMessage
              error={error}
              isNetworkError={isNetworkError}
              onRetry={fetchArticles}
            />
          ) : articles.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="text-6xl mb-4">📝</div>
              <h3 className="text-xl font-semibold mb-2">
                {currentLang === 'en' ? 'No articles found' : 'Nu am găsit articole'}
              </h3>
              <p className="text-surface-400 mb-6">
                {currentTag
                  ? (currentLang === 'en'
                    ? `No articles with the tag "${currentTag}"`
                    : `Nu există articole cu tag-ul "${currentTag}"`)
                  : (currentLang === 'en'
                    ? 'Try selecting a different category'
                    : 'Încercați să selectați o altă categorie')}
              </p>
              {currentTag && (
                <button
                  onClick={clearTag}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-primary-500 hover:bg-primary-600 text-white rounded-lg transition-colors"
                >
                  <X className="w-4 h-4" />
                  {currentLang === 'en' ? 'Clear filter' : 'Șterge filtrul'}
                </button>
              )}
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
                    <p className="text-surface-400 mb-4">
                      {currentLang === 'en' ? article.excerpt_en : article.excerpt_ro}
                    </p>
                    {article.tags && article.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {article.tags.slice(0, 3).map((tag) => (
                          <button
                            key={tag}
                            onClick={(e) => {
                              e.preventDefault()
                              e.stopPropagation()
                              setTag(tag)
                            }}
                            className="text-xs px-2 py-1 bg-white/5 hover:bg-accent-500/20 text-surface-400 hover:text-accent-300 rounded transition-colors"
                          >
                            #{tag}
                          </button>
                        ))}
                      </div>
                    )}
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
