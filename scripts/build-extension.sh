#!/bin/bash
# Build script for Promptability AI Chrome Extension

# Print current step
echo_step() {
  echo "🚀 $1"
}

# Print success message
echo_success() {
  echo "✅ $1"
}

# Print error message and exit
echo_error() {
  echo "❌ $1"
  exit 1
}

# Clean previous build
echo_step "Cleaning previous build..."
rm -rf dist
mkdir -p dist

# Build with Vite
echo_step "Building React application with Vite..."
npm run build || echo_error "Build failed!"

# Copy static files
echo_step "Copying static files..."
cp public/manifest.json dist/
cp -r public/icons dist/
cp public/content-style.css dist/

# Check if Firebase config exists and add it
if [ -f firebase/firebaseConfig.ts ]; then
  echo_step "Adding Firebase configuration..."
  cp firebase/firebaseConfig.ts dist/
else
  echo_error "Firebase configuration not found at firebase/firebaseConfig.ts"
fi

# Create ZIP file for Chrome Web Store submission
echo_step "Creating ZIP archive for Chrome Web Store submission..."
cd dist
zip -r ../promptability-chrome-extension.zip *
cd ..

echo_success "Build completed successfully!"
echo "📦 Extension files are in the 'dist' directory"
echo "📦 ZIP archive for Chrome Web Store submission: promptability-chrome-extension.zip"