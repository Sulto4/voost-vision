import { useTranslation } from 'react-i18next'
import { Link, useSearchParams } from 'react-router-dom'
import { useState, useEffect, useCallback } from 'react'
import { supabase, Article } from '@/lib/supabase'
import { ChevronLeft, ChevronRight, X, Search } from 'lucide-react'
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

  const parsedPage = parseInt(searchParams.get('page') || '1', 10)
  const currentPage = isNaN(parsedPage) || parsedPage < 1 ? 1 : parsedPage
  const currentCategory = searchParams.get('category') || 'all'
  const currentTag = searchParams.get('tag') || ''
  const searchQuery = searchParams.get('q') || ''
  const [searchInput, setSearchInput] = useState(searchQuery)
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

      if (searchQuery) {
        countQuery = countQuery.or(`title_en.ilike.%${searchQuery}%,title_ro.ilike.%${searchQuery}%,excerpt_en.ilike.%${searchQuery}%,excerpt_ro.ilike.%${searchQuery}%`)
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

      if (searchQuery) {
        articlesQuery = articlesQuery.or(`title_en.ilike.%${searchQuery}%,title_ro.ilike.%${searchQuery}%,excerpt_en.ilike.%${searchQuery}%,excerpt_ro.ilike.%${searchQuery}%`)
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
  }, [currentPage, currentCategory, currentTag, searchQuery])

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
    if (searchQuery) {
      params.q = searchQuery
    }
    setSearchParams(params)
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    const params: Record<string, string> = { page: '1' }
    if (currentCategory !== 'all') {
      params.category = currentCategory
    }
    if (currentTag) {
      params.tag = currentTag
    }
    if (searchInput.trim()) {
      params.q = searchInput.trim()
    }
    setSearchParams(params)
  }

  const clearSearch = () => {
    setSearchInput('')
    const params: Record<string, string> = { page: '1' }
    if (currentCategory !== 'all') {
      params.category = currentCategory
    }
    if (currentTag) {
      params.tag = currentTag
    }
    setSearchParams(params)
  }

  return (
    <div className="page-shell">
      <section className="section relative overflow-hidden pb-16 pt-28 md:pt-32">
        <div className="hero-backdrop" />
        <div className="container-custom">
          <div className="mx-auto mb-12 max-w-3xl text-center">
            <span className="section-kicker">Insights</span>
            <h1 className="heading-1 mt-3 mb-6">
              <span className="gradient-text">{t('blogPreview.title')}</span>
            </h1>
            <p className="text-xl text-surface-300">{t('blogPreview.subtitle')}</p>
          </div>

          <div className="glass-card mx-auto mb-8 max-w-2xl p-4">
            <form onSubmit={handleSearch}>
              <div className="relative">
                <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-surface-400" />
                <input
                  type="text"
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  placeholder={currentLang === 'en' ? 'Search articles...' : 'Caută articole...'}
                  className="input pl-12 pr-12"
                />
                {searchInput && (
                  <button
                    type="button"
                    onClick={clearSearch}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-surface-400 transition-colors hover:text-white"
                  >
                    <X className="h-5 w-5" />
                  </button>
                )}
              </div>
            </form>
          </div>

          {searchQuery && (
            <div className="mb-4 flex items-center justify-center gap-2">
              <span className="text-sm text-surface-400">
                {currentLang === 'en' ? 'Search results for:' : 'Rezultate pentru:'}
              </span>
              <span className="inline-flex items-center gap-1 rounded-full border border-primary-500/[0.35] bg-primary-500/[0.12] px-3 py-1 text-sm text-primary-200">
                "{searchQuery}"
                <button
                  onClick={clearSearch}
                  className="ml-1 transition-colors hover:text-white"
                  aria-label="Clear search"
                >
                  <X className="h-4 w-4" />
                </button>
              </span>
            </div>
          )}

          <div className="mb-8 flex flex-wrap justify-center gap-3">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setCategory(cat.id)}
                className={`rounded-full px-5 py-2 text-sm font-semibold transition-colors ${
                  currentCategory === cat.id
                    ? 'bg-primary-500 text-white'
                    : 'border border-white/10 bg-white/5 text-surface-300 hover:bg-white/10'
                }`}
              >
                {currentLang === 'en' ? cat.label_en : cat.label_ro}
              </button>
            ))}
          </div>

          {currentTag && (
            <div className="mb-8 flex items-center justify-center gap-2">
              <span className="text-sm text-surface-400">
                {currentLang === 'en' ? 'Filtered by tag:' : 'Filtrat dupa tag:'}
              </span>
              <span className="inline-flex items-center gap-1 rounded-full border border-accent-500/[0.35] bg-accent-500/[0.15] px-3 py-1 text-sm text-accent-100">
                #{currentTag}
                <button
                  onClick={clearTag}
                  className="ml-1 transition-colors hover:text-white"
                  aria-label="Clear tag filter"
                >
                  <X className="h-4 w-4" />
                </button>
              </span>
            </div>
          )}

          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-t-2 border-primary-500" />
            </div>
          ) : error ? (
            <ErrorMessage
              error={error}
              isNetworkError={isNetworkError}
              onRetry={fetchArticles}
            />
          ) : articles.length === 0 ? (
            <div className="panel-shell flex flex-col items-center justify-center py-20 text-center">
              <div className="mb-4 text-6xl">📝</div>
              <h3 className="mb-2 text-xl font-semibold">
                {currentLang === 'en' ? 'No articles found' : 'Nu am găsit articole'}
              </h3>
              <p className="mb-6 text-surface-400">
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
                  className="btn-primary"
                >
                  <X className="h-4 w-4" />
                  {currentLang === 'en' ? 'Clear filter' : 'Șterge filtrul'}
                </button>
              )}
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {articles.map((article) => (
                <Link
                  key={article.id}
                  to={`/blog/${article.slug}`}
                  className="glass-card group overflow-hidden"
                >
                  <div className="aspect-video overflow-hidden border-b border-white/10">
                    <img
                      src={article.cover_image || ''}
                      alt={currentLang === 'en' ? article.title_en : article.title_ro}
                      loading="lazy"
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                  <div className="p-6">
                    <div className="mb-3 flex items-center justify-between">
                      <span className="text-xs font-semibold uppercase tracking-[0.12em] text-primary-300">
                        {article.category || ''}
                      </span>
                      <span className="text-xs text-surface-500">
                        {article.published_at ? new Date(article.published_at).toLocaleDateString(currentLang === 'en' ? 'en-US' : 'ro-RO') : ''}
                      </span>
                    </div>
                    <h3 className="mb-3 text-xl font-semibold">
                      {currentLang === 'en' ? article.title_en : article.title_ro}
                    </h3>
                    <p className="mb-4 text-surface-400">
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
                            className="rounded-full border border-white/10 bg-white/5 px-2 py-1 text-xs text-surface-400 transition-colors hover:border-accent-500/40 hover:bg-accent-500/[0.15] hover:text-accent-100"
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

          {!loading && totalPages > 1 && (
            <div className="mt-12 flex items-center justify-center gap-2">
              <button
                onClick={() => goToPage(currentPage - 1)}
                disabled={currentPage === 1}
                className="rounded-xl border border-white/10 bg-white/5 p-2 transition-colors hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-50"
                aria-label="Previous page"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => goToPage(page)}
                  className={`rounded-xl px-4 py-2 text-sm font-semibold transition-colors ${
                    currentPage === page
                      ? 'bg-primary-500 text-white'
                      : 'border border-white/10 bg-white/5 hover:bg-white/10'
                  }`}
                >
                  {page}
                </button>
              ))}

              <button
                onClick={() => goToPage(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="rounded-xl border border-white/10 bg-white/5 p-2 transition-colors hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-50"
                aria-label="Next page"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
