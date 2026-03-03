/**
 * Voost Vision Local Dev Proxy
 * Mapează Supabase JS client requests → PostgREST local
 * FIX: CORS headers injectate pe proxyRes (nu pe req)
 */

const http = require('http');
const httpProxy = require('http-proxy');
const fs = require('fs');
const path = require('path');

const PROXY_PORT = 54320;
const POSTGREST_URL = 'http://localhost:54321';

const proxy = httpProxy.createProxyServer({ selfHandleResponse: false });

// Injectează CORS headers pe orice răspuns proxiat
proxy.on('proxyRes', (proxyRes, req, res) => {
  proxyRes.headers['access-control-allow-origin'] = '*';
  proxyRes.headers['access-control-allow-methods'] = 'GET, POST, PATCH, PUT, DELETE, OPTIONS';
  proxyRes.headers['access-control-allow-headers'] = 'Content-Type, Authorization, apikey, Prefer, Range, X-Client-Info, Accept-Profile, Content-Profile';
  proxyRes.headers['access-control-expose-headers'] = 'Content-Range, Range-Unit, X-Total-Count';
});

const server = http.createServer((req, res) => {
  // Preflight OPTIONS — răspuns direct
  if (req.method === 'OPTIONS') {
    res.writeHead(204, {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PATCH, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization, apikey, Prefer, Range, X-Client-Info, Accept-Profile, Content-Profile',
      'Access-Control-Max-Age': '86400',
    });
    res.end();
    return;
  }

  // /static/* → serve local images
  if (req.url.startsWith('/static/')) {
    const filePath = path.join(__dirname, req.url);
    if (fs.existsSync(filePath)) {
      const ext = path.extname(filePath).toLowerCase();
      const mime = ext === '.jpg' || ext === '.jpeg' ? 'image/jpeg' : ext === '.png' ? 'image/png' : 'application/octet-stream';
      res.writeHead(200, { 'Content-Type': mime, 'Access-Control-Allow-Origin': '*', 'Cache-Control': 'public, max-age=86400' });
      fs.createReadStream(filePath).pipe(res);
    } else {
      res.writeHead(404); res.end('Not found');
    }
    return;
  }

  // /rest/v1/* → PostgREST (strip /rest/v1 prefix)
  if (req.url.startsWith('/rest/v1')) {
    req.url = req.url.replace('/rest/v1', '') || '/';
    proxy.web(req, res, { target: POSTGREST_URL }, (err) => {
      res.writeHead(502, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'PostgREST unavailable: ' + err.message }));
    });
    return;
  }

  // /auth/v1/* → mock (no auth în local dev)
  if (req.url.startsWith('/auth/v1')) {
    res.writeHead(200, {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
    });
    res.end(JSON.stringify({ user: null, session: null }));
    return;
  }

  // Root → status
  if (req.url === '/' || req.url === '') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ status: 'ok', service: 'voost-vision-local-proxy', postgrest: POSTGREST_URL }));
    return;
  }

  res.writeHead(404, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ error: 'Not found' }));
});

server.listen(PROXY_PORT, () => {
  console.log(`✅ Voost Vision Local Proxy — port ${PROXY_PORT}`);
  console.log(`   /rest/v1/* → PostgREST (${POSTGREST_URL})`);
  console.log(`   /auth/v1/* → mock`);
});
