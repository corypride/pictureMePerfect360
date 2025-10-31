#!/bin/bash

# Build script for static export to Render
# This script prepares the Next.js app for static hosting

set -e

echo "🚀 Building PictureMePerfect360 for Render Static Hosting"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

print_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    print_error "package.json not found. Please run this script from the project root."
    exit 1
fi

print_info "Installing dependencies..."
npm ci

print_info "Running type check..."
npm run typecheck

print_info "Running tests..."
npm run test || print_warning "Tests failed, but continuing build..."

print_info "Building static export..."
npm run build

print_info "Checking build output..."
if [ ! -d "out" ]; then
    print_error "Build output directory 'out' not found"
    exit 1
fi

print_info "Verifying static files..."
REQUIRED_FILES=("index.html" "_next")
for file in "${REQUIRED_FILES[@]}"; do
    if [ ! -e "out/$file" ]; then
        print_error "Required file/directory '$file' not found in build output"
        exit 1
    fi
done

print_info "Optimizing for static hosting..."
# Create a simple .nojekyll file to disable Jekyll processing on GitHub Pages (if needed)
touch out/.nojekyll

# Create a robots.txt if it doesn't exist in the build output
if [ ! -f "out/robots.txt" ]; then
    print_info "Creating robots.txt..."
    cat > out/robots.txt << EOF
User-agent: *
Allow: /
Sitemap: https://$(echo $RENDER_EXTERNAL_URL | sed 's/https:\/\/$//')/sitemap.xml
EOF
fi

print_success "Static build completed successfully!"
print_info "Build output size: $(du -sh out | cut -f1)"
print_info "Files created: $(find out -type f | wc -l)"

print_success "Ready for Render Static Site deployment!"