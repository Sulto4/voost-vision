import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'

const articles = [
  {
    id: '1',
    slug: 'tendinte-web-2026',
    title_ro: 'Tendinte in Dezvoltare Web pentru 2026',
    title_en: 'Web Development Trends for 2026',
    excerpt_ro: 'Descopera cele mai noi tehnologii si practici care vor domina industria web in anul urmator.',
    excerpt_en: 'Discover the latest technologies and practices that will dominate the web industry next year.',
    cover_image: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&auto=format&fit=crop&q=60',
    category: 'Development',
    published_at: '2026-01-15',
  },
  {
    id: '2',
    slug: 'importanta-ux-design',
    title_ro: 'Importanta UX Design pentru Conversii',
    title_en: 'The Importance of UX Design for Conversions',
    excerpt_ro: 'Cum un design centrat pe utilizator poate creste semnificativ rata de conversie a site-ului tau.',
    excerpt_en: 'How user-centered design can significantly increase your website conversion rate.',
    cover_image: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800&auto=format&fit=crop&q=60',
    category: 'Design',
    published_at: '2026-01-10',
  },
  {
    id: '3',
    slug: 'mobile-first-strategy',
    title_ro: 'Strategia Mobile-First in 2026',
    title_en: 'Mobile-First Strategy in 2026',
    excerpt_ro: 'De ce abordarea mobile-first este mai importanta ca niciodata pentru succesul afacerii tale.',
    excerpt_en: 'Why the mobile-first approach is more important than ever for your business success.',
    cover_image: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=800&auto=format&fit=crop&q=60',
    category: 'Strategy',
    published_at: '2026-01-05',
  },
]

export default function Blog() {
  const { t, i18n } = useTranslation()
  const currentLang = i18n.language

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

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {articles.map((article) => (
              <Link
                key={article.id}
                to={`/blog/${article.slug}`}
                className="glass-card overflow-hidden group"
              >
                <div className="aspect-video overflow-hidden">
                  <img
                    src={article.cover_image}
                    alt={currentLang === 'en' ? article.title_en : article.title_ro}
                    className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="p-6">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs text-primary-400 font-medium uppercase tracking-wide">
                      {article.category}
                    </span>
                    <span className="text-xs text-surface-500">
                      {new Date(article.published_at).toLocaleDateString(currentLang === 'en' ? 'en-US' : 'ro-RO')}
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
        </div>
      </section>
    </div>
  )
}
