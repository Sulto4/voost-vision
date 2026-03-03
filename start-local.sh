#!/bin/bash
# Voost Vision — Local Dev Stack
# Stack: PostgreSQL 16 + PostgREST 14 + Proxy Node.js + Frontend Vite

set -e
DIR="$(cd "$(dirname "$0")" && pwd)"

echo "🗄️  Pornesc PostgreSQL 16..."
brew services start postgresql@16 2>/dev/null || true
sleep 1

echo "🔌 Pornesc PostgREST (port 54321)..."
pkill -f "postgrest.*postgrest.conf" 2>/dev/null || true
postgrest "$DIR/db/postgrest.conf" > /tmp/postgrest-local.log 2>&1 &
POSTGREST_PID=$!
sleep 2

if curl -s http://localhost:54321/ > /dev/null 2>&1; then
  echo "✅ PostgREST UP — http://localhost:54321"
else
  echo "❌ PostgREST failed. Vezi: /tmp/postgrest-local.log"
  exit 1
fi

echo "🔀 Pornesc Proxy (port 54320)..."
pkill -f "node.*db/proxy/server.js" 2>/dev/null || true
node "$DIR/db/proxy/server.js" > /tmp/voost-proxy.log 2>&1 &
PROXY_PID=$!
sleep 1
echo "✅ Proxy UP — http://localhost:54320"

echo ""
echo "=========================================="
echo "  Voost Vision Local Stack READY"
echo "  DB:      postgresql://localhost/voost_vision"
echo "  API:     http://localhost:54321  (PostgREST)"
echo "  Proxy:   http://localhost:54320  (Supabase-compat)"
echo "  Frontend va porni pe http://localhost:5173"
echo "=========================================="
echo ""

echo "⚛️  Pornesc Frontend (Vite)..."
cd "$DIR/frontend"
[ ! -d node_modules ] && npm install --legacy-peer-deps
npm run dev

# Cleanup la exit
kill $POSTGREST_PID $PROXY_PID 2>/dev/null || true
echo "🛑 Stack oprit."
