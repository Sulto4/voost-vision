#!/bin/bash

# Voost Vision - Development Environment Setup Script
# This script sets up the development environment for the Voost Vision website

set -e  # Exit on error

echo "=========================================="
echo "  Voost Vision - Development Setup"
echo "=========================================="
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print status messages
print_status() {
    echo -e "${GREEN}[OK]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check for Node.js
echo "Checking prerequisites..."
if ! command -v node &> /dev/null; then
    print_error "Node.js is not installed. Please install Node.js 18+ from https://nodejs.org"
    exit 1
fi

NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    print_error "Node.js version 18+ required. Current version: $(node -v)"
    exit 1
fi
print_status "Node.js $(node -v) detected"

# Check for npm
if ! command -v npm &> /dev/null; then
    print_error "npm is not installed. Please install npm."
    exit 1
fi
print_status "npm $(npm -v) detected"

# Navigate to project root
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
cd "$SCRIPT_DIR"

# Install frontend dependencies
echo ""
echo "Installing frontend dependencies..."
if [ -d "frontend" ]; then
    cd frontend
    npm install
    print_status "Frontend dependencies installed"
    cd ..
else
    print_warning "Frontend directory not found. Run this script after project structure is created."
fi

# Create .env file if it doesn't exist
echo ""
echo "Checking environment configuration..."
if [ ! -f "frontend/.env" ] && [ -d "frontend" ]; then
    if [ -f "frontend/.env.example" ]; then
        cp frontend/.env.example frontend/.env
        print_status "Created .env file from .env.example"
        print_warning "Please update frontend/.env with your Supabase credentials"
    else
        cat > frontend/.env << 'EOF'
# Supabase Configuration
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

# Google Services (optional)
VITE_GOOGLE_MAPS_API_KEY=your_google_maps_key
VITE_GA_MEASUREMENT_ID=your_ga_id

# Cloudflare Turnstile
VITE_TURNSTILE_SITE_KEY=your_turnstile_site_key
EOF
        print_status "Created .env template"
        print_warning "Please update frontend/.env with your actual credentials"
    fi
else
    if [ -f "frontend/.env" ]; then
        print_status ".env file already exists"
    fi
fi

# Display helpful information
echo ""
echo "=========================================="
echo "  Setup Complete!"
echo "=========================================="
echo ""
echo "Next steps:"
echo ""
echo "1. Update environment variables:"
echo "   - Edit frontend/.env with your Supabase credentials"
echo "   - Get credentials from: https://supabase.com/dashboard"
echo ""
echo "2. Set up Supabase:"
echo "   - Create a new project at https://supabase.com"
echo "   - Run the database migrations (see README.md)"
echo "   - Enable Google OAuth in Authentication settings"
echo ""
echo "3. Start development server:"
echo "   cd frontend && npm run dev"
echo ""
echo "4. Access the application:"
echo "   - Frontend: http://localhost:5173"
echo "   - Admin Panel: http://localhost:5173/admin"
echo ""
echo "5. Build for production:"
echo "   cd frontend && npm run build"
echo ""
echo "Documentation: See README.md for more details"
echo ""
