# 🗄️ Database Migration Instructions

## Step 4: Apply the Database Schema (ACTION REQUIRED)

The database schema SQL file has been created at:
```
supabase/migrations/20250112_initial_schema.sql
```

You need to apply this migration to your Supabase project manually.

### Option 1: Using Supabase SQL Editor (⭐ Recommended)

1. **Open the Supabase SQL Editor:**
   - Go to: https://supabase.com/dashboard/project/iiqcmoqzilxpsbcycrjz/sql/new

2. **Copy the migration SQL:**
   ```bash
   cat supabase/migrations/20250112_initial_schema.sql
   ```

3. **Paste and Run:**
   - Paste the entire SQL content into the SQL Editor
   - The migration is wrapped in a **transaction** (BEGIN...COMMIT)
   - If any error occurs, everything will rollback automatically ✅
   - Click **"Run"** button
   - Wait for confirmation (should show "Success")

4. **Verify tables were created:**
   - Go to: Table Editor
   - You should see: `profiles`, `parcels`, `vegetable_categories`, `vegetables`, `cycles`, `activities`, `times`

5. **If something goes wrong:**
   - The transaction will rollback automatically on error
   - Or you can manually run the rollback script:
     ```bash
     cat supabase/migrations/20250112_rollback.sql
     ```
   - Then paste and run it in the SQL Editor to completely remove the schema

### Option 2: Using Supabase CLI

1. **Install Supabase CLI (if not already installed):**
   ```bash
   npm install -g supabase
   ```

2. **Login to Supabase:**
   ```bash
   supabase login
   ```

3. **Link your project:**
   ```bash
   supabase link --project-ref iiqcmoqzilxpsbcycrjz
   ```

4. **Push the migration:**
   ```bash
   supabase db push
   ```

### What this migration creates:

✅ **7 Tables:**
- `profiles` - User profiles with roles (admin/employee)
- `parcels` - Farm parcels
- `vegetable_categories` - Categories of vegetables
- `vegetables` - Types of vegetables
- `cycles` - Growing cycles
- `activities` - Work activities (Semis, Plantation, etc.)
- `times` - Time tracking entries

✅ **Row Level Security (RLS):**
- All tables protected with RLS policies
- Employees can only see their own time entries
- Admins can manage everything

✅ **Automatic Profile Creation:**
- Trigger that creates a profile when a user signs up

✅ **Performance Indexes:**
- Optimized indexes on foreign keys and date columns

✅ **Seed Data:**
- 6 pre-populated activities
- 5 pre-populated vegetable categories

---

## After Migration

Once you've applied the migration, come back and let me know so I can:
1. ✅ Test the Supabase connection
2. ✅ Regenerate TypeScript types from the live database
3. ✅ Verify everything is working

Just say: **"Migration applied"** or **"Done"** and I'll continue! 🚀
