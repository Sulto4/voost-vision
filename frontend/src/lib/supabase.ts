import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Supabase credentials not found. Some features may not work.')
}

export const supabase = createClient(
  supabaseUrl || '',
  supabaseAnonKey || ''
)

// Types for database tables
export interface Project {
  id: string
  title_ro: string
  title_en: string
  description_ro: string | null
  description_en: string | null
  category: string
  tech_stack: string[] | null
  thumbnail_url: string | null
  images: string[] | null
  live_url: string | null
  featured: boolean
  created_at: string
  published: boolean
}

export interface Article {
  id: string
  slug: string
  title_ro: string
  title_en: string
  excerpt_ro: string | null
  excerpt_en: string | null
  content_ro: string
  content_en: string
  cover_image: string | null
  category: string | null
  tags: string[] | null
  author: string
  published: boolean
  published_at: string | null
  created_at: string
  updated_at: string
}

export interface Booking {
  id: string
  client_name: string
  client_email: string
  company: string | null
  description: string | null
  booking_date: string
  booking_time: string
  duration: number
  status: 'pending' | 'confirmed' | 'cancelled'
  google_calendar_event_id: string | null
  created_at: string
}

export interface ContactSubmission {
  id: string
  name: string
  email: string
  subject: string | null
  message: string
  read: boolean
  created_at: string
}
