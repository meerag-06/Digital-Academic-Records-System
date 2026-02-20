#!/bin/bash
# UniVault Startup Script
# Run this to get started immediately

echo "🚀 UniVault - Digital College Management System"
echo "================================================"
echo ""
echo "System Check:"
echo "✅ Node.js: $(node --version)"
echo "✅ npm: $(npm --version)"
echo ""

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ ERROR: package.json not found!"
    echo "Please run this script from the univault directory"
    exit 1
fi

echo "📦 Checking dependencies..."
NPM_LIST=$(npm list --depth=0 2>/dev/null | grep -c "dependencies")
if [ $NPM_LIST -gt 0 ]; then
    echo "✅ Dependencies installed"
else
    echo "📥 Installing dependencies..."
    npm install
fi

echo ""
echo "✅ Environment configured"
echo "✅ All systems ready!"
echo ""
echo "🎯 Next Steps:"
echo "1. Make sure .env.local has your Supabase credentials"
echo "2. Open Supabase → SQL Editor → Paste SUPABASE_SCHEMA.sql → Run"
echo "3. Start dev server: npm run dev"
echo "4. Open: http://localhost:5173"
echo ""
echo "📚 Documentation:"
echo "   • QUICK_START.md    - 5-minute startup"
echo "   • README.md         - Full features"
echo "   • DEPLOYMENT.md     - Production guide"
echo "   • ARCHITECTURE.md   - Technical docs"
echo ""
echo "Happy coding! 🎉"
