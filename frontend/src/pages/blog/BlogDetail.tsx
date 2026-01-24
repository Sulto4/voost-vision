import { useParams, Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useState, useEffect } from 'react'
import { ArrowLeft, Calendar, User, Facebook, Twitter, Linkedin } from 'lucide-react'
import { supabase, Article } from '@/lib/supabase'

export default function BlogDetail() {
  const { slug } = useParams()
  const { i18n } = useTranslation()
  const currentLang = i18n.language
  const [article, setArticle] = useState<Article | null>(null)
  const [relatedArticles, setRelatedArticles] = useState<Article[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchArticle() {
      if (!slug) {
        setError('No article slug provided')
        setLoading(false)
        return
      }

      try {
        const { data, error: fetchError } = await supabase
          .from('articles')
          .select('*')
          .eq('slug', slug)
          .eq('published', true)
          .single()

        if (fetchError) {
          console.error('Error fetching article:', fetchError)
          setError('Article not found')
        } else {
          setArticle(data)
        }
      } catch (err) {
        console.error('Error:', err)
        setError('An error occurred')
      } finally {
        setLoading(false)
      }
    }

    fetchArticle()
  }, [slug])

  // Fetch related articles based on category
  useEffect(() => {
    async function fetchRelatedArticles() {
      if (!article) return

      try {
        const { data, error: fetchError } = await supabase
          .from('articles')
          .select('*')
          .eq('published', true)
          .eq('category', article.category)
          .neq('slug', article.slug)
          .order('published_at', { ascending: false })
          .limit(3)

        if (!fetchError && data) {
          setRelatedArticles(data)
        }
      } catch (err) {
        console.error('Error fetching related articles:', err)
      }
    }

    fetchRelatedArticles()
  }, [article])

  if (loading) {
    return (
      <div className="pt-16 md:pt-20">
        <section className="section min-h-[60vh] flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
        </section>
      </div>
    )
  }

  if (error || !article) {
    return (
      <div className="pt-16 md:pt-20">
        <section className="section min-h-[60vh] flex items-center">
          <div className="container-custom text-center">
            <h1 className="heading-2 mb-4">Article not found</h1>
            <Link to="/blog" className="btn-primary">
              <ArrowLeft className="w-5 h-5 mr-2" />
              Back to Blog
            </Link>
          </div>
        </section>
      </div>
    )
  }

  const shareUrl = encodeURIComponent(window.location.href)
  const shareTitle = encodeURIComponent(currentLang === 'en' ? article.title_en : article.title_ro)

  return (
    <div className="pt-16 md:pt-20">
      <article className="section">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto">
            <Link
              to="/blog"
              className="inline-flex items-center text-surface-400 hover:text-white transition-colors mb-8"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Back to Blog
            </Link>

            <div className="flex items-center gap-4 mb-6">
              <span className="text-xs text-primary-400 font-medium uppercase tracking-wide px-3 py-1 bg-primary-500/20 rounded-full">
                {article.category}
              </span>
              <div className="flex items-center text-surface-400 text-sm">
                <Calendar className="w-4 h-4 mr-1" />
                {new Date(article.published_at).toLocaleDateString(currentLang === 'en' ? 'en-US' : 'ro-RO', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </div>
              <div className="flex items-center text-surface-400 text-sm">
                <User className="w-4 h-4 mr-1" />
                {article.author}
              </div>
            </div>

            <h1 className="heading-1 mb-8">
              {currentLang === 'en' ? article.title_en : article.title_ro}
            </h1>

            <img
              src={article.cover_image}
              alt={currentLang === 'en' ? article.title_en : article.title_ro}
              className="w-full rounded-2xl mb-12"
            />

            <div
              className="prose prose-invert prose-lg max-w-none"
              dangerouslySetInnerHTML={{
                __html: currentLang === 'en' ? article.content_en : article.content_ro,
              }}
            />

            {/* Tags */}
            {article.tags && article.tags.length > 0 && (
              <div className="mt-8 flex flex-wrap gap-2">
                {article.tags.map((tag) => (
                  <Link
                    key={tag}
                    to={`/blog?tag=${encodeURIComponent(tag)}`}
                    className="text-sm px-3 py-1 bg-accent-500/20 text-accent-300 rounded-full hover:bg-accent-500/30 transition-colors"
                  >
                    #{tag}
                  </Link>
                ))}
              </div>
            )}

            {/* Share buttons */}
            <div className="mt-12 pt-8 border-t border-white/10">
              <p className="text-surface-400 mb-4">Share this article:</p>
              <div className="flex gap-4">
                <a
                  href={`https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors"
                >
                  <Facebook className="w-5 h-5" />
                </a>
                <a
                  href={`https://twitter.com/intent/tweet?url=${shareUrl}&text=${shareTitle}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors"
                >
                  <Twitter className="w-5 h-5" />
                </a>
                <a
                  href={`https://www.linkedin.com/shareArticle?mini=true&url=${shareUrl}&title=${shareTitle}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors"
                >
                  <Linkedin className="w-5 h-5" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </article>

      {/* Related Articles */}
      {relatedArticles.length > 0 && (
        <section className="section pt-0">
          <div className="container-custom">
            <h2 className="heading-2 mb-8 text-center">
              {currentLang === 'en' ? 'Related Articles' : 'Articole similare'}
            </h2>
            <div className="grid md:grid-cols-3 gap-6">
              {relatedArticles.map((relatedArticle) => (
                <Link
                  key={relatedArticle.id}
                  to={`/blog/${relatedArticle.slug}`}
                  className="glass-card overflow-hidden group"
                >
                  <div className="aspect-video overflow-hidden">
                    <img
                      src={relatedArticle.cover_image || ''}
                      alt={currentLang === 'en' ? relatedArticle.title_en : relatedArticle.title_ro}
                      className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div className="p-5">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs text-primary-400 font-medium uppercase tracking-wide">
                        {relatedArticle.category || ''}
                      </span>
                      <span className="text-xs text-surface-500">
                        {relatedArticle.published_at ? new Date(relatedArticle.published_at).toLocaleDateString(currentLang === 'en' ? 'en-US' : 'ro-RO') : ''}
                      </span>
                    </div>
                    <h3 className="text-lg font-semibold line-clamp-2">
                      {currentLang === 'en' ? relatedArticle.title_en : relatedArticle.title_ro}
                    </h3>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  )
}
