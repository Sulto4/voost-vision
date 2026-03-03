import { useParams, Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useState, useEffect } from 'react'
import { Helmet } from 'react-helmet-async'
import { ArrowLeft, Calendar, User, Facebook, Twitter, Linkedin } from 'lucide-react'
import { fetchArticleBySlug, fetchArticles } from '@/lib/data-layer'
import type { Article } from '@/lib/supabase'

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
        const data = await fetchArticleBySlug(slug)
        if (!data) {
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
        const { data } = await fetchArticles({
          page: 1,
          limit: 12,
          category: article.category || undefined,
        })
        setRelatedArticles(data.filter((item) => item.slug !== article.slug).slice(0, 3))
      } catch (err) {
        console.error('Error fetching related articles:', err)
      }
    }

    fetchRelatedArticles()
  }, [article])

  if (loading) {
    return (
      <div className="page-shell">
        <section className="section flex min-h-[60vh] items-center justify-center">
          <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-t-2 border-primary-500" />
        </section>
      </div>
    )
  }

  if (error || !article) {
    return (
      <div className="page-shell">
        <section className="section flex min-h-[60vh] items-center">
          <div className="container-custom text-center">
            <h1 className="heading-2 mb-4">Article not found</h1>
            <Link to="/blog" className="btn-primary">
              <ArrowLeft className="mr-2 h-5 w-5" />
              Back to Blog
            </Link>
          </div>
        </section>
      </div>
    )
  }

  const shareUrl = encodeURIComponent(window.location.href)
  const shareTitle = encodeURIComponent(currentLang === 'en' ? article.title_en : article.title_ro)

  // SEO data
  const title = currentLang === 'en' ? article.title_en : article.title_ro
  const description = currentLang === 'en' ? article.excerpt_en : article.excerpt_ro
  const canonicalUrl = `https://voostvision.ro/blog/${article.slug}`
  const publishedDate = article.published_at ? new Date(article.published_at).toISOString() : new Date().toISOString()
  const renderedContent = currentLang === 'en' && article.content_en ? article.content_en : article.content_ro

  // Article structured data (JSON-LD)
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": title,
    "description": description,
    "image": article.cover_image,
    "author": {
      "@type": "Person",
      "name": article.author || "Voost Vision"
    },
    "publisher": {
      "@type": "Organization",
      "name": "Voost Vision",
      "logo": {
        "@type": "ImageObject",
        "url": "https://voostvision.ro/logo.png"
      }
    },
    "datePublished": publishedDate,
    "dateModified": publishedDate,
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": canonicalUrl
    }
  }

  return (
    <div className="page-shell">
      <Helmet>
        <title>{title} | Voost Vision</title>
        <meta name="description" content={description || ''} />
        <link rel="canonical" href={canonicalUrl} />

        {/* Open Graph */}
        <meta property="og:type" content="article" />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description || ''} />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:image" content={article.cover_image || ''} />
        <meta property="article:published_time" content={publishedDate} />
        <meta property="article:author" content={article.author || 'Voost Vision'} />
        {article.tags?.map(tag => (
          <meta key={tag} property="article:tag" content={tag} />
        ))}

        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={title} />
        <meta name="twitter:description" content={description || ''} />
        <meta name="twitter:image" content={article.cover_image || ''} />

        {/* Structured Data */}
        <script type="application/ld+json">
          {JSON.stringify(articleSchema)}
        </script>
      </Helmet>

      <article className="section relative overflow-hidden pb-20 pt-28 md:pt-32">
        <div className="hero-backdrop" />
        <div className="container-custom">
          <div className="mx-auto max-w-3xl">
            <Link
              to="/blog"
              className="mb-8 inline-flex items-center text-surface-400 transition-colors hover:text-white"
            >
              <ArrowLeft className="mr-2 h-5 w-5" />
              Back to Blog
            </Link>

            <div className="mb-6 flex flex-wrap items-center gap-4">
              <span className="rounded-full border border-primary-500/30 bg-primary-500/[0.12] px-3 py-1 text-xs font-semibold uppercase tracking-wide text-primary-200">
                {article.category}
              </span>
              <div className="flex items-center text-sm text-surface-400">
                <Calendar className="mr-1 h-4 w-4" />
                {new Date(article.published_at || article.created_at).toLocaleDateString(currentLang === 'en' ? 'en-US' : 'ro-RO', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </div>
              <div className="flex items-center text-sm text-surface-400">
                <User className="mr-1 h-4 w-4" />
                {article.author}
              </div>
            </div>

            <h1 className="heading-1 mb-8">
              {currentLang === 'en' ? article.title_en : article.title_ro}
            </h1>

            {article.cover_image && (
              <img
                src={article.cover_image}
                alt={currentLang === 'en' ? article.title_en : article.title_ro}
                loading="lazy"
                className="mb-12 w-full rounded-2xl border border-white/10"
              />
            )}

            <div
              className="prose prose-invert prose-lg max-w-none"
              dangerouslySetInnerHTML={{
                __html: renderedContent,
              }}
            />

            {article.tags && article.tags.length > 0 && (
              <div className="mt-8 flex flex-wrap gap-2">
                {article.tags.map((tag) => (
                  <Link
                    key={tag}
                    to={`/blog?tag=${encodeURIComponent(tag)}`}
                    className="rounded-full border border-accent-500/[0.35] bg-accent-500/[0.15] px-3 py-1 text-sm text-accent-100 transition-colors hover:border-accent-500/[0.45]"
                  >
                    #{tag}
                  </Link>
                ))}
              </div>
            )}

            <div className="mt-12 border-t border-white/10 pt-8">
              <p className="mb-4 text-surface-400">Share this article:</p>
              <div className="flex gap-4">
                <a
                  href={`https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-xl border border-white/10 bg-white/5 p-3 transition-colors hover:bg-white/10"
                >
                  <Facebook className="h-5 w-5" />
                </a>
                <a
                  href={`https://twitter.com/intent/tweet?url=${shareUrl}&text=${shareTitle}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-xl border border-white/10 bg-white/5 p-3 transition-colors hover:bg-white/10"
                >
                  <Twitter className="h-5 w-5" />
                </a>
                <a
                  href={`https://www.linkedin.com/shareArticle?mini=true&url=${shareUrl}&title=${shareTitle}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-xl border border-white/10 bg-white/5 p-3 transition-colors hover:bg-white/10"
                >
                  <Linkedin className="h-5 w-5" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </article>

      {relatedArticles.length > 0 && (
        <section className="section border-t border-white/[0.08] pt-0">
          <div className="container-custom">
            <h2 className="heading-2 mb-8 text-center">
              {currentLang === 'en' ? 'Related Articles' : 'Articole similare'}
            </h2>
            <div className="grid gap-6 md:grid-cols-3">
              {relatedArticles.map((relatedArticle) => (
                <Link
                  key={relatedArticle.id}
                  to={`/blog/${relatedArticle.slug}`}
                  className="glass-card group overflow-hidden"
                >
                  <div className="aspect-video overflow-hidden border-b border-white/10">
                    <img
                      src={relatedArticle.cover_image || ''}
                      alt={currentLang === 'en' ? relatedArticle.title_en : relatedArticle.title_ro}
                      loading="lazy"
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                  <div className="p-5">
                    <div className="mb-2 flex items-center justify-between">
                      <span className="text-xs font-semibold uppercase tracking-[0.12em] text-primary-300">
                        {relatedArticle.category || ''}
                      </span>
                      <span className="text-xs text-surface-500">
                        {relatedArticle.published_at ? new Date(relatedArticle.published_at).toLocaleDateString(currentLang === 'en' ? 'en-US' : 'ro-RO') : ''}
                      </span>
                    </div>
                    <h3 className="line-clamp-2 text-lg font-semibold">
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
