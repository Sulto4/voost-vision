#!/bin/bash
# Voost Vision — Safe Deploy Script
# Usage: ./deploy.sh [message]
set -e

cd "$(dirname "$0")/frontend"
MSG="${1:-Manual deploy $(date '+%Y-%m-%d %H:%M')}"

echo "🔨 Building..."
# Temporary remove .env.local so .env.production is used
[ -f .env.local ] && mv .env.local .env.local.bak
rm -rf dist node_modules/.vite
npm run build
[ -f .env.local.bak ] && mv .env.local.bak .env.local

# Verify — abort if wrong URL
if grep -q 'montgomery\|trycloudflare' dist/assets/index-*.js 2>/dev/null; then
  echo "❌ ABORT: Build contains old tunnel URL!"
  exit 1
fi

echo "✅ Build OK — $(grep -o 'index-[A-Za-z0-9_-]*\.js' dist/index.html)"

echo "🚀 Deploying via API..."
AUTH_TOKEN=$(cat ~/Library/Preferences/netlify/config.json | python3 -c "import json,sys;c=json.load(sys.stdin);print(list(c['users'].values())[0]['auth']['token'])")
SITE_ID="7a59e757-2b3d-47cd-b1a2-287409facacc"

python3 -c "
import hashlib, os, json, warnings, requests
warnings.filterwarnings('ignore')

dist, auth, site = 'dist', '$AUTH_TOKEN', '$SITE_ID'
files = {}
for root, _, fnames in os.walk(dist):
    for f in fnames:
        fp = os.path.join(root, f)
        rel = '/' + os.path.relpath(fp, dist)
        with open(fp, 'rb') as fh:
            files[rel] = hashlib.sha1(fh.read()).hexdigest()

resp = requests.post(f'https://api.netlify.com/api/v1/sites/{site}/deploys',
    headers={'Authorization': f'Bearer {auth}', 'Content-Type': 'application/json'},
    json={'title': '$MSG', 'files': files, 'draft': False})
deploy = resp.json()
deploy_id = deploy.get('id')
required = deploy.get('required', [])
print(f'Uploading {len(required)}/{len(files)} files...')

for sha in required:
    for path, h in files.items():
        if h == sha:
            with open(os.path.join(dist, path.lstrip('/')), 'rb') as fh:
                requests.put(f'https://api.netlify.com/api/v1/deploys/{deploy_id}/files{path}',
                    headers={'Authorization': f'Bearer {auth}', 'Content-Type': 'application/octet-stream'},
                    data=fh.read())
            break
print(f'✅ Live: https://voostvision.ro')
print(f'   Deploy: https://{deploy_id}--voost-vision.netlify.app')
"

# Purge Cloudflare cache
CF_TOKEN="cfut_YGCl7x3XseGzga3paFBP4aMcUtftB5pze0gwEQ4w260a9579"
ZONE_ID="cf6251b7bdc183c906eb98614dfb738c"
curl -fsS -X POST "https://api.cloudflare.com/client/v4/zones/$ZONE_ID/purge_cache" \
  -H "Authorization: Bearer $CF_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"purge_everything":true}' > /dev/null 2>&1
echo "🧹 Cloudflare cache purged"
echo ""
echo "✅ Done! Site live in ~30 seconds."
