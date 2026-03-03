-- Voost Vision — Local PostgreSQL Schema
-- Mirrors the Supabase cloud schema exactly

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Projects (portofoliu)
CREATE TABLE IF NOT EXISTS projects (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title_ro TEXT NOT NULL,
  title_en TEXT NOT NULL,
  description_ro TEXT,
  description_en TEXT,
  category TEXT NOT NULL DEFAULT 'web',
  tech_stack TEXT[],
  thumbnail_url TEXT,
  images TEXT[],
  live_url TEXT,
  featured BOOLEAN DEFAULT false,
  published BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Articles (blog)
CREATE TABLE IF NOT EXISTS articles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug TEXT UNIQUE NOT NULL,
  title_ro TEXT NOT NULL,
  title_en TEXT NOT NULL,
  excerpt_ro TEXT,
  excerpt_en TEXT,
  content_ro TEXT NOT NULL DEFAULT '',
  content_en TEXT NOT NULL DEFAULT '',
  cover_image TEXT,
  category TEXT,
  tags TEXT[],
  author TEXT NOT NULL DEFAULT 'Voost Vision',
  published BOOLEAN DEFAULT false,
  published_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Bookings (programari)
CREATE TABLE IF NOT EXISTS bookings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  client_name TEXT NOT NULL,
  client_email TEXT NOT NULL,
  company TEXT,
  description TEXT,
  booking_date DATE NOT NULL,
  booking_time TIME NOT NULL,
  duration INTEGER DEFAULT 60,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'cancelled')),
  google_calendar_event_id TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Contact submissions
CREATE TABLE IF NOT EXISTS contact_submissions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  subject TEXT,
  message TEXT NOT NULL,
  read BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Testimonials
CREATE TABLE IF NOT EXISTS testimonials (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  company TEXT NOT NULL,
  text_ro TEXT NOT NULL,
  text_en TEXT NOT NULL,
  avatar TEXT,
  published BOOLEAN DEFAULT false,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Seed: 3 proiecte demo
INSERT INTO projects (title_ro, title_en, description_ro, description_en, category, tech_stack, live_url, featured, published) VALUES
  ('Frizerul Tău', 'Your Barber', 'Platformă de programări online pentru frizerie. React + Supabase.', 'Online booking platform for barbershop. React + Supabase.', 'web', ARRAY['React','Supabase','Netlify'], 'https://frizerultau.com', true, true),
  ('VreauMagnet', 'VreauMagnet', 'Magazin online Shopify pentru magneți personalizați. Grace theme, full branding.', 'Shopify store for custom magnets. Grace theme, full branding.', 'ecommerce', ARRAY['Shopify','Liquid','Cloudflare'], 'https://vreaumagnet.ro', true, true),
  ('AI Agents Agency', 'AI Agents Agency', 'Landing page pentru agenție de automatizare AI.', 'Landing page for AI automation agency.', 'web', ARRAY['HTML','CSS','Netlify'], 'https://agency-ai-accelerator.netlify.app', false, true);

-- Seed: 2 testimoniale demo
INSERT INTO testimonials (name, company, text_ro, text_en, published, display_order) VALUES
  ('Adrian', 'Frizerul Tău', 'Neo a construit platforma în timp record. Funcționează perfect.', 'Neo built the platform in record time. Works perfectly.', true, 1),
  ('Ioana', 'Magnetique', 'Site-ul arată exact cum mi-am dorit. Recomand cu încredere.', 'The site looks exactly as I wanted. Highly recommend.', true, 2);
