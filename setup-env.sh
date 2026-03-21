#!/bin/bash

# Setup script for environment variables
# Run this script to create .env.local file

echo "🔧 Setting up environment variables..."

cat > .env.local << 'EOF'
# Frontend Environment Variables
# This file is gitignored - DO NOT commit sensitive data

# GraphQL API Endpoint
# Public API runs on port 4001
NEXT_PUBLIC_API_URL=http://localhost:4001/graphql
NEXT_PUBLIC_API_GRAPHQL_URL=http://localhost:4001/graphql

# WebSocket URL for GraphQL Subscriptions
# Public API WebSocket runs on port 4001
NEXT_PUBLIC_API_WS=ws://localhost:4001/graphql
NEXT_PUBLIC_WS_URL=ws://localhost:4001/graphql

# Development/Production Mode
NODE_ENV=development
EOF

echo "✅ .env.local file created!"
echo ""
echo "📝 Configuration:"
echo "  - GraphQL URL: http://localhost:4001/graphql"
echo "  - WebSocket URL: ws://localhost:4001/graphql"
echo ""
echo "🚀 Next steps:"
echo "  1. Make sure your backend is running on port 4001"
echo "  2. Start Next.js: npm run dev"
echo "  3. Test the connection in your browser"
