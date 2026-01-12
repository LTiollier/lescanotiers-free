#!/bin/bash

# Script to login to Supabase and generate TypeScript types
# This requires manual interaction for login

echo "🔐 Step 1: Login to Supabase"
echo "This will open a browser window for authentication..."
echo ""

npx supabase login

if [ $? -ne 0 ]; then
    echo "❌ Login failed. Please try again."
    exit 1
fi

echo ""
echo "✅ Login successful!"
echo ""
echo "📦 Step 2: Generating TypeScript types from database..."
echo ""

npx supabase gen types typescript --project-id iiqcmoqzilxpsbcycrjz > src/types/database.types.ts

if [ $? -ne 0 ]; then
    echo "❌ Type generation failed."
    exit 1
fi

echo ""
echo "✅ TypeScript types generated successfully!"
echo "📄 File: src/types/database.types.ts"
echo ""
echo "You can now use these types in your application."
