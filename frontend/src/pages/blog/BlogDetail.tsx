import { useParams, Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { ArrowLeft, Calendar, User, Facebook, Twitter, Linkedin } from 'lucide-react'

const articles = [
  {
    id: '1',
    slug: 'tendinte-web-2026',
    title_ro: 'Tendinte in Dezvoltare Web pentru 2026',
    title_en: 'Web Development Trends for 2026',
    content_ro: `
      <p>Anul 2026 aduce noi provocari si oportunitati in lumea dezvoltarii web. Vom explora cele mai importante tendinte care vor modela industria.</p>

      <h2>1. AI-Powered Development</h2>
      <p>Inteligenta artificiala devine un partener esential in procesul de dezvoltare. De la generarea de cod la optimizarea performantei, AI transforma modul in care construim aplicatii web.</p>

      <h2>2. Edge Computing</h2>
      <p>Procesarea datelor mai aproape de utilizator devine standardul. Edge functions si CDN-uri inteligente permit experiente ultra-rapide.</p>

      <h2>3. Web Components Maturity</h2>
      <p>Componentele web native devin din ce in ce mai populare, oferind interoperabilitate intre framework-uri.</p>

      <h2>Concluzie</h2>
      <p>Adaptarea la aceste tendinte va fi esentiala pentru succesul proiectelor web in 2026 si dincolo.</p>
    `,
    content_en: `
      <p>2026 brings new challenges and opportunities in the web development world. We'll explore the most important trends shaping the industry.</p>

      <h2>1. AI-Powered Development</h2>
      <p>Artificial intelligence becomes an essential partner in the development process. From code generation to performance optimization, AI is transforming how we build web applications.</p>

      <h2>2. Edge Computing</h2>
      <p>Processing data closer to the user becomes the standard. Edge functions and intelligent CDNs enable ultra-fast experiences.</p>

      <h2>3. Web Components Maturity</h2>
      <p>Native web components are becoming increasingly popular, offering interoperability between frameworks.</p>

      <h2>Conclusion</h2>
      <p>Adapting to these trends will be essential for web project success in 2026 and beyond.</p>
    `,
    cover_image: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=1200&auto=format&fit=crop&q=80',
    category: 'Development',
    published_at: '2026-01-15',
    author: 'Voost Vision',
  },
  {
    id: '2',
    slug: 'importanta-ux-design',
    title_ro: 'Importanta UX Design pentru Conversii',
    title_en: 'The Importance of UX Design for Conversions',
    content_ro: `
      <p>Un design bun nu inseamna doar estetica. UX-ul impacteaza direct rata de conversie a site-ului tau.</p>

      <h2>Ce este UX Design?</h2>
      <p>User Experience Design se concentreaza pe crearea de experiente digitale intuitive si placute pentru utilizatori.</p>

      <h2>Impactul asupra conversiilor</h2>
      <p>Studiile arata ca un UX imbunatatit poate creste conversiile cu pana la 400%. Investitia in design se intoarce mereu.</p>

      <h2>Principii esentiale</h2>
      <ul>
        <li>Simplitate si claritate</li>
        <li>Consistenta vizuala</li>
        <li>Feedback instant</li>
        <li>Accesibilitate</li>
      </ul>
    `,
    content_en: `
      <p>Good design isn't just about aesthetics. UX directly impacts your website's conversion rate.</p>

      <h2>What is UX Design?</h2>
      <p>User Experience Design focuses on creating intuitive and enjoyable digital experiences for users.</p>

      <h2>Impact on conversions</h2>
      <p>Studies show that improved UX can increase conversions by up to 400%. Investment in design always pays off.</p>

      <h2>Essential principles</h2>
      <ul>
        <li>Simplicity and clarity</li>
        <li>Visual consistency</li>
        <li>Instant feedback</li>
        <li>Accessibility</li>
      </ul>
    `,
    cover_image: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=1200&auto=format&fit=crop&q=80',
    category: 'Design',
    published_at: '2026-01-10',
    author: 'Voost Vision',
  },
  {
    id: '3',
    slug: 'mobile-first-strategy',
    title_ro: 'Strategia Mobile-First in 2026',
    title_en: 'Mobile-First Strategy in 2026',
    content_ro: `
      <p>Cu peste 60% din traficul web venind de pe dispozitive mobile, abordarea mobile-first nu mai este optionala.</p>

      <h2>De ce Mobile-First?</h2>
      <p>Designul mobile-first te forteaza sa prioritizezi continutul si functionalitatea esentiala.</p>

      <h2>Beneficii cheie</h2>
      <p>Performance imbunatatit, UX mai bun pe toate dispozitivele si SEO optimizat sunt doar cateva dintre avantaje.</p>

      <h2>Cum sa implementezi</h2>
      <p>Incepe cu designul pentru ecrane mici si adauga progresiv complexitate pentru ecrane mai mari.</p>
    `,
    content_en: `
      <p>With over 60% of web traffic coming from mobile devices, the mobile-first approach is no longer optional.</p>

      <h2>Why Mobile-First?</h2>
      <p>Mobile-first design forces you to prioritize essential content and functionality.</p>

      <h2>Key benefits</h2>
      <p>Improved performance, better UX across all devices, and optimized SEO are just some of the advantages.</p>

      <h2>How to implement</h2>
      <p>Start with design for small screens and progressively add complexity for larger screens.</p>
    `,
    cover_image: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=1200&auto=format&fit=crop&q=80',
    category: 'Strategy',
    published_at: '2026-01-05',
    author: 'Voost Vision',
  },
]

export default function BlogDetail() {
  const { slug } = useParams()
  const { i18n } = useTranslation()
  const currentLang = i18n.language

  const article = articles.find((a) => a.slug === slug)

  if (!article) {
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
    </div>
  )
}
