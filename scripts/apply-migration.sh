#!/bin/bash

# Script to apply the initial migration to Supabase
# This script reads the SQL migration file and applies it to your Supabase project

MIGRATION_FILE="supabase/migrations/20250112_initial_schema.sql"

echo "📦 Applying database migration to Supabase..."

if [ ! -f "$MIGRATION_FILE" ]; then
    echo "❌ Migration file not found: $MIGRATION_FILE"
    exit 1
fi

# Check if VITE_SUPABASE_URL is set
if [ -z "$VITE_SUPABASE_URL" ]; then
    echo "❌ VITE_SUPABASE_URL not set. Please check your .env.local file."
    exit 1
fi

# Extract project ref from URL
PROJECT_REF=$(echo "$VITE_SUPABASE_URL" | sed -E 's|https://([^.]+)\.supabase\.co|\1|')

echo "🔗 Project ref: $PROJECT_REF"
echo ""
echo "⚠️  This script requires the Supabase CLI and authentication."
echo "Please run the SQL migration manually in the Supabase SQL Editor:"
echo ""
echo "1. Go to: https://supabase.com/dashboard/project/$PROJECT_REF/sql/new"
echo "2. Copy the contents of: $MIGRATION_FILE"
echo "3. Paste and run in the SQL Editor"
echo ""
echo "Or use the Supabase CLI:"
echo "  npx supabase db push --db-url postgresql://postgres:[YOUR-PASSWORD]@db.${PROJECT_REF}.supabase.co:5432/postgres"
