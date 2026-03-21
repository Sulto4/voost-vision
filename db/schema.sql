-- Voost Vision — Local PostgreSQL Schema
-- Bootstrap schema for the public website and local PostgREST proxy

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Projects (portfolio)
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

-- Bookings
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

-- Services
CREATE TABLE IF NOT EXISTS services (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  title_ro TEXT NOT NULL,
  title_en TEXT NOT NULL,
  description TEXT NOT NULL,
  description_ro TEXT NOT NULL,
  description_en TEXT NOT NULL,
  icon TEXT,
  display_order INTEGER DEFAULT 0,
  published BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Compatibility view for older frontend builds that still query blog_posts
CREATE OR REPLACE VIEW blog_posts AS
SELECT
  id,
  slug,
  COALESCE(NULLIF(title_ro, ''), title_en) AS title,
  COALESCE(NULLIF(excerpt_ro, ''), excerpt_en) AS excerpt,
  COALESCE(NULLIF(content_ro, ''), content_en) AS content,
  cover_image AS image_url,
  title_ro,
  title_en,
  excerpt_ro,
  excerpt_en,
  content_ro,
  content_en,
  cover_image,
  category,
  tags,
  author,
  published,
  published_at,
  created_at,
  updated_at
FROM articles;

GRANT USAGE ON SCHEMA public TO web_anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE projects, articles, bookings, contact_submissions, testimonials, services TO web_anon;
GRANT SELECT ON TABLE blog_posts TO web_anon;

INSERT INTO services (
  id,
  slug,
  name,
  title_ro,
  title_en,
  description,
  description_ro,
  description_en,
  icon,
  display_order,
  published,
  created_at
) VALUES
  (
    'b6bc1788-94bf-4ca7-8e2d-5b7c4d8c4d01',
    'web-development',
    'Dezvoltare Web',
    'Dezvoltare Web',
    'Web Development',
    'Site-uri de prezentare si landing page-uri optimizate pentru conversii.',
    'Site-uri de prezentare, landing page-uri si experiente web rapide, optimizate pentru conversii.',
    'Presentation sites, landing pages, and fast web experiences optimized for conversions.',
    'Globe',
    1,
    true,
    '2026-03-21T10:00:00Z'
  ),
  (
    'f1ff29c4-d245-4d0c-b8c9-20a2204d0e02',
    'ecommerce',
    'Magazine Online',
    'Magazine Online',
    'eCommerce',
    'Magazine online cu checkout clar, tracking complet si focus pe vanzari.',
    'Magazine online cu checkout clar, tracking complet si focus pe cresterea vanzarilor.',
    'Online stores with streamlined checkout, full analytics, and a sales-focused setup.',
    'ShoppingCart',
    2,
    true,
    '2026-03-21T10:05:00Z'
  ),
  (
    'f315a423-3dc7-488b-87ec-2160b96a6603',
    'consultanta',
    'Consultanta Digitala',
    'Consultanta Digitala',
    'Digital Consulting',
    'Audit, strategie si recomandari tehnice pentru crestere digitala.',
    'Audit, strategie si recomandari tehnice pentru crestere digitala sustenabila.',
    'Audits, strategy, and technical recommendations for sustainable digital growth.',
    'MessagesSquare',
    3,
    true,
    '2026-03-21T10:10:00Z'
  ),
  (
    '7df6eff9-ff8b-4710-b16b-afef2f07b204',
    'mentenanta',
    'Mentenanta si Suport',
    'Mentenanta si Suport',
    'Maintenance and Support',
    'Actualizari, monitorizare si interventii rapide dupa lansare.',
    'Actualizari, monitorizare si interventii rapide dupa lansare pentru stabilitate pe termen lung.',
    'Updates, monitoring, and fast post-launch interventions for long-term stability.',
    'ShieldCheck',
    4,
    true,
    '2026-03-21T10:15:00Z'
  )
ON CONFLICT (id) DO UPDATE
SET
  slug = EXCLUDED.slug,
  name = EXCLUDED.name,
  title_ro = EXCLUDED.title_ro,
  title_en = EXCLUDED.title_en,
  description = EXCLUDED.description,
  description_ro = EXCLUDED.description_ro,
  description_en = EXCLUDED.description_en,
  icon = EXCLUDED.icon,
  display_order = EXCLUDED.display_order,
  published = EXCLUDED.published;

INSERT INTO projects (
  id,
  title_ro,
  title_en,
  description_ro,
  description_en,
  category,
  tech_stack,
  thumbnail_url,
  images,
  live_url,
  featured,
  published,
  created_at
) VALUES
  (
    '23bf707c-5239-44ba-b42f-d8bea15a4348',
    'Frizerul Tau',
    'Frizerul Tau',
    'Aplicatie pentru programari online, reminder-e automate si organizarea clientilor.',
    'Booking app for online appointments, automated reminders, and customer management.',
    'app',
    ARRAY['React', 'Supabase', 'TypeScript'],
    '/thumbnails/thumb-frizerul-tau-hero.jpg',
    ARRAY['/thumbnails/thumb-frizerul-tau.jpg'],
    'https://frizerultau.com',
    true,
    true,
    '2026-02-22T12:00:00Z'
  ),
  (
    '7464cb1f-36cd-4cfd-b38f-acb66001a547',
    'vreaumagnet.ro',
    'vreaumagnet.ro',
    'Magazin eCommerce construit pentru conversii, upsell-uri si urmarire completa a campaniilor.',
    'eCommerce store built for conversions, upsells, and full campaign tracking.',
    'ecommerce',
    ARRAY['Shopify', 'Liquid', 'GA4', 'Meta Pixel'],
    '/thumbnails/thumb-vreaumagnet.svg',
    NULL,
    'https://vreaumagnet.ro',
    true,
    true,
    '2026-02-23T12:00:00Z'
  ),
  (
    '5a4eb601-d98d-4d30-a077-419311148179',
    'AI Agents Agency',
    'AI Agents Agency',
    'Landing page pentru servicii de automatizare AI si generare de lead-uri.',
    'Landing page for AI automation services and lead generation.',
    'web',
    ARRAY['HTML', 'CSS', 'Netlify'],
    '/thumbnails/thumb-ai-agents.jpg',
    NULL,
    'https://agency-ai-accelerator.netlify.app',
    false,
    true,
    '2026-02-20T12:00:00Z'
  ),
  (
    '4dfc25fa-ebea-4bfd-87cb-aed4c3baf101',
    'Voost Voice',
    'Voost Voice',
    'Platforma pentru fluxuri voice AI, lead qualification si programari automate.',
    'Platform for AI voice workflows, lead qualification, and automated bookings.',
    'app',
    ARRAY['Next.js', 'Node.js', 'PostgreSQL', 'Twilio'],
    '/thumbnails/thumb-voost-voice.svg',
    NULL,
    NULL,
    true,
    true,
    '2026-03-21T10:20:00Z'
  ),
  (
    '7ec414ec-1192-4a37-88fb-11578d17eb02',
    'Voost Level CRM',
    'Voost Level CRM',
    'CRM pentru pipeline, follow-up automat si vizibilitate completa asupra vanzarilor.',
    'CRM for pipeline management, automated follow-up, and full sales visibility.',
    'app',
    ARRAY['React', 'Node.js', 'PostgreSQL'],
    '/thumbnails/thumb-voost-level-crm.svg',
    NULL,
    NULL,
    true,
    true,
    '2026-03-21T10:30:00Z'
  )
ON CONFLICT (id) DO UPDATE
SET
  title_ro = EXCLUDED.title_ro,
  title_en = EXCLUDED.title_en,
  description_ro = EXCLUDED.description_ro,
  description_en = EXCLUDED.description_en,
  category = EXCLUDED.category,
  tech_stack = EXCLUDED.tech_stack,
  thumbnail_url = EXCLUDED.thumbnail_url,
  images = EXCLUDED.images,
  live_url = EXCLUDED.live_url,
  featured = EXCLUDED.featured,
  published = EXCLUDED.published,
  created_at = EXCLUDED.created_at;

INSERT INTO testimonials (
  id,
  name,
  company,
  text_ro,
  text_en,
  avatar,
  published,
  display_order,
  created_at
) VALUES
  (
    '3495eba4-3a20-4ed5-87db-ee84bb8f1395',
    'Adrian',
    'Frizerul Tau',
    'Platforma merge rapid, programarile sunt clare, iar clientii primesc reminder-ele automat.',
    'The platform is fast, bookings are clear, and customers get their reminders automatically.',
    NULL,
    true,
    1,
    '2026-02-21T10:00:00Z'
  ),
  (
    '007cf6e7-1683-4462-9bf2-4838af3c3b2b',
    'Ioana',
    'Vreau Magnet',
    'Am trecut la un magazin care se misca bine si arata profesionist pe mobil si desktop.',
    'We moved to a store that performs well and looks polished on both mobile and desktop.',
    NULL,
    true,
    2,
    '2026-02-22T10:00:00Z'
  ),
  (
    'afbe9be1-13e1-48b3-821a-52899293fd03',
    'Mihai',
    'Voost Voice',
    'Automatizarile voice au redus timpul de raspuns si ne-au filtrat lead-urile mult mai bine.',
    'The voice automations reduced response time and filtered our leads much better.',
    NULL,
    true,
    3,
    '2026-03-01T10:00:00Z'
  ),
  (
    '0e9cf21a-96d6-4da9-877d-cdf0cf70e404',
    'Cristina',
    'Voost Level CRM',
    'Acum vedem clar unde se blocheaza pipeline-ul si putem urmari fiecare oportunitate.',
    'We can now see exactly where the pipeline gets stuck and track every opportunity.',
    NULL,
    true,
    4,
    '2026-03-05T10:00:00Z'
  ),
  (
    '2084668c-d7ca-4a3d-a0e6-a6404b9f6505',
    'Bianca',
    'AI Agents Agency',
    'Site-ul prezinta oferta clar si a crescut numarul de lead-uri calificate din campanii.',
    'The site presents the offer clearly and increased the number of qualified leads from campaigns.',
    NULL,
    true,
    5,
    '2026-03-10T10:00:00Z'
  )
ON CONFLICT (id) DO UPDATE
SET
  name = EXCLUDED.name,
  company = EXCLUDED.company,
  text_ro = EXCLUDED.text_ro,
  text_en = EXCLUDED.text_en,
  avatar = EXCLUDED.avatar,
  published = EXCLUDED.published,
  display_order = EXCLUDED.display_order;
