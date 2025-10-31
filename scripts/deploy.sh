#!/bin/bash

# Production Deployment Script for PictureMePerfect360
# This script prepares and deploys the application to production

set -e

echo "🚀 Starting PictureMePerfect360 Production Deployment"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Helper functions
print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

# Check prerequisites
check_prerequisites() {
    print_info "Checking prerequisites..."

    # Check if Node.js is installed
    if ! command -v node &> /dev/null; then
        print_error "Node.js is not installed"
        exit 1
    fi

    # Check if npm is installed
    if ! command -v npm &> /dev/null; then
        print_error "npm is not installed"
        exit 1
    fi

    # Check if Firebase CLI is installed
    if ! command -v firebase &> /dev/null; then
        print_error "Firebase CLI is not installed. Install with: npm install -g firebase-tools"
        exit 1
    fi

    print_success "Prerequisites check passed"
}

# Install dependencies
install_dependencies() {
    print_info "Installing dependencies..."
    npm ci
    print_success "Dependencies installed"
}

# Run tests
run_tests() {
    print_info "Running tests..."
    npm run test
    print_success "Tests passed"
}

# Type checking
type_check() {
    print_info "Running TypeScript type checking..."
    npm run typecheck
    print_success "Type checking passed"
}

# Linting
lint_code() {
    print_info "Running ESLint..."
    npm run lint
    print_success "Linting passed"
}

# Build application
build_app() {
    print_info "Building application..."
    npm run build
    print_success "Application built successfully"
}

# Check environment variables
check_env_vars() {
    print_info "Checking environment variables..."

    if [ ! -f ".env" ]; then
        print_warning ".env file not found. Creating from template..."
        if [ -f ".env.example" ]; then
            cp .env.example .env
            print_warning "Please update .env file with your production values"
        else
            print_error "No .env.example file found"
            exit 1
        fi
    fi

    # Check for required environment variables
    source .env

    required_vars=("STRIPE_SECRET_KEY" "NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY" "NEXT_PUBLIC_SITE_URL")
    missing_vars=()

    for var in "${required_vars[@]}"; do
        if [ -z "${!var}" ]; then
            missing_vars+=("$var")
        fi
    done

    if [ ${#missing_vars[@]} -gt 0 ]; then
        print_error "Missing required environment variables: ${missing_vars[*]}"
        print_info "Please update your .env file with the missing values"
        exit 1
    fi

    print_success "Environment variables check passed"
}

# Deploy to Firebase
deploy_to_firebase() {
    print_info "Deploying to Firebase App Hosting..."
    firebase deploy --only hosting
    print_success "Deployment completed successfully"
}

# Post-deployment verification
verify_deployment() {
    print_info "Verifying deployment..."

    # Get the deployed URL
    DEPLOY_URL=$(firebase hosting:channel:open | grep -o 'https://[^[:space:]]*' | head -1)

    if [ -n "$DEPLOY_URL" ]; then
        print_success "Application deployed to: $DEPLOY_URL"

        # Wait a moment for the deployment to be ready
        sleep 5

        # Check if the health endpoint is responding
        HEALTH_URL="$DEPLOY_URL/api/health"
        if curl -f -s "$HEALTH_URL" > /dev/null; then
            print_success "Health check passed for deployed application"
        else
            print_warning "Health check failed. The application may still be starting up."
        fi
    else
        print_warning "Could not retrieve deployment URL"
    fi
}

# Main deployment process
main() {
    print_info "Starting deployment process..."

    # Run all checks and steps
    check_prerequisites
    install_dependencies
    type_check
    lint_code
    run_tests
    build_app
    check_env_vars
    deploy_to_firebase
    verify_deployment

    print_success "🎉 PictureMePerfect360 has been successfully deployed to production!"
    print_info "Don't forget to:"
    print_info "1. Update your DNS records if using a custom domain"
    print_info "2. Configure monitoring and analytics"
    print_info "3. Test the payment flow with small amounts"
    print_info "4. Set up backup and monitoring"
}

# Run main function
main "$@"