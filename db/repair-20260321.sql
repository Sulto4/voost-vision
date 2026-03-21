BEGIN;

\i /Users/radumeleru/Projects/voost-vision-local/db/schema.sql

-- Clean up obsolete records and normalize older seed rows by id.
DELETE FROM testimonials
WHERE id NOT IN (
  '3495eba4-3a20-4ed5-87db-ee84bb8f1395',
  '007cf6e7-1683-4462-9bf2-4838af3c3b2b',
  'afbe9be1-13e1-48b3-821a-52899293fd03',
  '0e9cf21a-96d6-4da9-877d-cdf0cf70e404',
  '2084668c-d7ca-4a3d-a0e6-a6404b9f6505'
) AND company IN ('Frizerul Tău', 'Magnetique', 'Frizerul Tau', 'Vreau Magnet', 'Voost Voice', 'Voost Level CRM', 'AI Agents Agency');

DELETE FROM projects
WHERE id NOT IN (
  '23bf707c-5239-44ba-b42f-d8bea15a4348',
  '7464cb1f-36cd-4cfd-b38f-acb66001a547',
  '5a4eb601-d98d-4d30-a077-419311148179',
  '4dfc25fa-ebea-4bfd-87cb-aed4c3baf101',
  '7ec414ec-1192-4a37-88fb-11578d17eb02'
) AND (
  live_url IN ('https://frizerultau.com', 'https://vreaumagnet.ro', 'https://agency-ai-accelerator.netlify.app')
  OR title_en IN ('Your Barber', 'Frizerul Tau', 'vreaumagnet.ro', 'VreauMagnet', 'AI Agents Agency', 'Voost Voice', 'Voost Level CRM')
);

UPDATE articles
SET cover_image = CASE slug
  WHEN 'cum-sa-lansezi-magazin-online-romania-2026' THEN '/blog-covers/cum-sa-lansezi-magazin-online-romania-2026.svg'
  WHEN 'cloudflare-tunnels-backend-local' THEN '/blog-covers/cloudflare-tunnels-backend-local.svg'
  WHEN 'react-supabase-pentru-startup-uri' THEN '/blog-covers/react-supabase-pentru-startup-uri.svg'
  WHEN 'ai-agents-automatizare-afacere-2026' THEN '/blog-covers/ai-agents-automatizare-afacere-2026.svg'
  WHEN 'cum-sa-lansezi-magazin-shopify' THEN '/blog-covers/cum-sa-lansezi-magazin-shopify.svg'
  ELSE cover_image
END
WHERE slug IN (
  'cum-sa-lansezi-magazin-online-romania-2026',
  'cloudflare-tunnels-backend-local',
  'react-supabase-pentru-startup-uri',
  'ai-agents-automatizare-afacere-2026',
  'cum-sa-lansezi-magazin-shopify'
);

NOTIFY pgrst, 'reload schema';

COMMIT;
