import { STATIC_ARTICLES } from '@/data/static-articles'
import { isSupabaseConfigured, supabase } from '@/lib/supabase'
import type { Article, Project, Testimonial } from '@/lib/supabase'

const STATIC_PUBLISHED_AT = '2026-02-28T12:00:00Z'

const STATIC_FEATURED_PROJECTS: Project[] = [
  {
    id: '80b4ef13-7c78-4bc0-84cb-852847a9e145',
    title_ro: 'vreaumagnet.ro',
    title_en: 'vreaumagnet.ro',
    description_ro: 'Magazin eCommerce pe Shopify cu focus pe conversii, checkout simplificat si tracking complet pentru reclame.',
    description_en: 'Shopify ecommerce store focused on conversions, simplified checkout, and full ads tracking.',
    category: 'ecommerce',
    tech_stack: ['Shopify', 'Liquid', 'GA4', 'Meta Pixel'],
    thumbnail_url: null,
    images: null,
    live_url: 'https://vreaumagnet.ro',
    featured: true,
    created_at: STATIC_PUBLISHED_AT,
    published: true,
  },
  {
    id: '15f77f30-c9a3-4472-a9ec-28a757682f4d',
    title_ro: 'frizerultau.com',
    title_en: 'frizerultau.com',
    description_ro: 'Aplicatie web pentru programari online, reminder-e automate si administrare clienti.',
    description_en: 'Web app for online bookings, automated reminders, and customer management.',
    category: 'web-app',
    tech_stack: ['React', 'Supabase', 'TypeScript'],
    thumbnail_url: null,
    images: null,
    live_url: 'https://frizerultau.com',
    featured: true,
    created_at: STATIC_PUBLISHED_AT,
    published: true,
  },
  {
    id: 'f08c1c3c-becf-4858-9dd5-af4ca2de31f4',
    title_ro: 'Voost Control',
    title_en: 'Voost Control',
    description_ro: 'Tool intern pentru management operational, rapoarte si automatizari de flux.',
    description_en: 'Internal operations tool for management workflows, reporting, and automation.',
    category: 'internal tool',
    tech_stack: ['Next.js', 'PostgreSQL', 'TypeScript'],
    thumbnail_url: null,
    images: null,
    live_url: null,
    featured: true,
    created_at: STATIC_PUBLISHED_AT,
    published: true,
  },
]

export interface FetchArticlesOptions {
  page: number
  limit: number
  category?: string
  tag?: string
  search?: string
}

interface FetchArticlesResult {
  data: Article[]
  count: number
}

function normalizePagination(page: number, limit: number): { page: number; limit: number } {
  const safePage = Number.isFinite(page) && page > 0 ? Math.floor(page) : 1
  const safeLimit = Number.isFinite(limit) && limit > 0 ? Math.floor(limit) : 10
  return { page: safePage, limit: safeLimit }
}

function sortArticlesByPublishedDate(articles: Article[]): Article[] {
  return [...articles].sort((a, b) => {
    const aDate = a.published_at || a.created_at
    const bDate = b.published_at || b.created_at
    return new Date(bDate).getTime() - new Date(aDate).getTime()
  })
}

function filterStaticArticles(options: FetchArticlesOptions): Article[] {
  const category = options.category?.trim()
  const tag = options.tag?.trim()
  const search = options.search?.trim().toLowerCase()

  let filtered = STATIC_ARTICLES.filter((article) => article.published)

  if (category && category !== 'all') {
    filtered = filtered.filter((article) => article.category === category)
  }

  if (tag) {
    filtered = filtered.filter((article) => article.tags?.includes(tag))
  }

  if (search) {
    filtered = filtered.filter((article) => {
      const searchableText = [
        article.title_ro,
        article.title_en,
        article.excerpt_ro || '',
        article.excerpt_en || '',
      ]
        .join(' ')
        .toLowerCase()

      return searchableText.includes(search)
    })
  }

  return sortArticlesByPublishedDate(filtered)
}

function getStaticArticles(options: FetchArticlesOptions): FetchArticlesResult {
  const { page, limit } = normalizePagination(options.page, options.limit)
  const filtered = filterStaticArticles(options)
  const from = (page - 1) * limit
  const data = filtered.slice(from, from + limit)

  return {
    data,
    count: filtered.length,
  }
}

function buildSupabaseSearchValue(search: string): string {
  return search
    .replace(/%/g, ' ')
    .replace(/,/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

export async function fetchArticles(options: FetchArticlesOptions): Promise<FetchArticlesResult> {
  const { page, limit } = normalizePagination(options.page, options.limit)
  const category = options.category?.trim()
  const tag = options.tag?.trim()
  const search = options.search?.trim()
  const from = (page - 1) * limit
  const to = from + limit - 1

  if (isSupabaseConfigured) {
    try {
      let countQuery = supabase
        .from('articles')
        .select('*', { count: 'exact', head: true })
        .eq('published', true)

      if (category && category !== 'all') {
        countQuery = countQuery.eq('category', category)
      }

      if (tag) {
        countQuery = countQuery.contains('tags', [tag])
      }

      if (search) {
        const searchValue = buildSupabaseSearchValue(search)
        if (searchValue) {
          countQuery = countQuery.or(
            `title_en.ilike.%${searchValue}%,title_ro.ilike.%${searchValue}%,excerpt_en.ilike.%${searchValue}%,excerpt_ro.ilike.%${searchValue}%`
          )
        }
      }

      const { count, error: countError } = await countQuery

      if (countError) {
        throw countError
      }

      let articlesQuery = supabase
        .from('articles')
        .select('*')
        .eq('published', true)
        .order('published_at', { ascending: false, nullsFirst: false })

      if (category && category !== 'all') {
        articlesQuery = articlesQuery.eq('category', category)
      }

      if (tag) {
        articlesQuery = articlesQuery.contains('tags', [tag])
      }

      if (search) {
        const searchValue = buildSupabaseSearchValue(search)
        if (searchValue) {
          articlesQuery = articlesQuery.or(
            `title_en.ilike.%${searchValue}%,title_ro.ilike.%${searchValue}%,excerpt_en.ilike.%${searchValue}%,excerpt_ro.ilike.%${searchValue}%`
          )
        }
      }

      const { data, error } = await articlesQuery.range(from, to)

      if (error) {
        throw error
      }

      return {
        data: data || [],
        count: count || 0,
      }
    } catch (error) {
      console.warn('Falling back to static articles:', error)
    }
  }

  return getStaticArticles({ page, limit, category, tag, search })
}

export async function fetchArticleBySlug(slug: string): Promise<Article | null> {
  const normalizedSlug = slug.trim()

  if (!normalizedSlug) {
    return null
  }

  if (isSupabaseConfigured) {
    try {
      const { data, error } = await supabase
        .from('articles')
        .select('*')
        .eq('slug', normalizedSlug)
        .eq('published', true)
        .maybeSingle()

      if (error) {
        throw error
      }

      if (data) {
        return data
      }
    } catch (error) {
      console.warn(`Falling back to static article for slug "${normalizedSlug}":`, error)
    }
  }

  return STATIC_ARTICLES.find((article) => article.slug === normalizedSlug && article.published) || null
}

export async function fetchFeaturedProjects(): Promise<Project[]> {
  if (isSupabaseConfigured) {
    try {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .eq('featured', true)
        .eq('published', true)
        .order('created_at', { ascending: false })
        .limit(4)

      if (error) {
        throw error
      }

      if (data && data.length > 0) {
        return data
      }
    } catch (error) {
      console.warn('Falling back to static featured projects:', error)
    }
  }

  return STATIC_FEATURED_PROJECTS
}

export async function fetchTestimonials(): Promise<Testimonial[]> {
  if (isSupabaseConfigured) {
    try {
      const { data, error } = await supabase
        .from('testimonials')
        .select('*')
        .eq('published', true)
        .order('display_order', { ascending: true })

      if (error) {
        throw error
      }

      return data || []
    } catch (error) {
      console.warn('Falling back to static testimonials:', error)
    }
  }

  return []
}
