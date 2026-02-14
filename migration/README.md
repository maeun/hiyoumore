# Firebase to Supabase Migration Guide

This directory contains scripts and SQL schemas for migrating HiYouMore from Firebase to Supabase.

## Prerequisites

1. **Supabase Account**: Create a new project at [supabase.com](https://supabase.com)
2. **Firebase Export**: Ensure `../etc/hiyoumore-qa-db-export_241224.json` exists
3. **Node.js**: Required for running transformation scripts

## Migration Steps

### Phase 1: Supabase Setup

#### 1.1 Create Database Schema

1. Go to your Supabase project dashboard
2. Navigate to **SQL Editor**
3. Copy and paste the entire contents of `schema.sql`
4. Click **Run** to execute

This creates:
- `quizzes` table (replaces Firebase qa_db)
- `user_profiles` table (replaces sign_up_db)
- `login_logs` and `logout_logs` tables (replaces log_in_out_db)
- Indexes for fast category queries
- Row Level Security policies
- Trigger to auto-create user profiles on signup

#### 1.2 Configure Kakao OAuth

1. In Supabase Dashboard, go to **Authentication → Providers**
2. Enable **Kakao** provider
3. Enter your Kakao credentials:
   - **Client ID**: `05d00f0fda1f9c72cd19cc6f219cd58a`
   - **Client Secret**: (get from Kakao Developers Console)
4. Copy the **Callback URL** shown by Supabase
5. Go to [Kakao Developers Console](https://developers.kakao.com)
6. Add the Supabase callback URL to your app's **Redirect URI** whitelist

#### 1.3 Get API Credentials

1. In Supabase Dashboard, go to **Settings → API**
2. Copy the following values:
   - **Project URL**: `https://[your-project-id].supabase.co`
   - **anon public key**: (starts with `eyJ...`)

### Phase 2: Data Migration

#### 2.1 Transform Quiz Data

```bash
cd migration
node transform-quizzes.js
```

This creates `supabase-quizzes.json` with Supabase-compatible format.

#### 2.2 Import to Supabase

**Option A: CSV Import (Recommended for large datasets)**

1. Convert `supabase-quizzes.json` to CSV (use Excel or online converter)
2. In Supabase Dashboard, go to **Table Editor → quizzes**
3. Click **Import data from CSV**
4. Upload and import

**Option B: Supabase JS Client (for automated import)**

*Coming soon: import-to-supabase.js script*

#### 2.3 Verify Import

Run these queries in Supabase SQL Editor:

```sql
-- Check total quiz count
SELECT COUNT(*) FROM quizzes;

-- Verify no duplicate indexes
SELECT index, COUNT(*) FROM quizzes
GROUP BY index HAVING COUNT(*) > 1;

-- Check category distribution
SELECT
  COUNT(*) FILTER (WHERE category_animal = true) AS animal,
  COUNT(*) FILTER (WHERE category_eng = true) AS eng,
  COUNT(*) FILTER (WHERE category_king = true) AS king,
  COUNT(*) FILTER (WHERE category_plant = true) AS plant
FROM quizzes;
```

### Phase 3: Frontend Configuration

#### 3.1 Create Environment File

Create `.env.local` in project root:

```bash
REACT_APP_SUPABASE_URL=https://[your-project-id].supabase.co
REACT_APP_SUPABASE_ANON_KEY=your-anon-key-here
```

**⚠️ Never commit this file to Git!** (Already in .gitignore)

#### 3.2 Test Locally

```bash
npm start
```

Test the following features:
- [ ] Kakao login works
- [ ] Session persists on refresh
- [ ] "Today's" quizzes load (same 3 all day)
- [ ] All 8 category filters work
- [ ] Shared quiz URLs work (`?num=0`, `?num=100`)
- [ ] Card flip animation works
- [ ] My page displays profile
- [ ] Logout works

### Phase 4: Deployment

#### 4.1 Configure Vercel Environment Variables

1. Go to [Vercel Dashboard](https://vercel.com)
2. Select your project
3. Navigate to **Settings → Environment Variables**
4. Add:
   - `REACT_APP_SUPABASE_URL` = `https://[your-project-id].supabase.co`
   - `REACT_APP_SUPABASE_ANON_KEY` = `your-anon-key-here`

#### 4.2 Deploy

```bash
git add .
git commit -m "Migrate from Firebase to Supabase"
git push origin main
```

Vercel will auto-deploy from the `main` branch.

#### 4.3 Test Production

1. Visit `https://hiyoumore.vercel.app`
2. Test Kakao login
3. Test quiz loading
4. Check browser console for errors
5. Monitor Supabase Dashboard → Logs for API errors

### Phase 5: Cleanup (After Confirming Success)

**⚠️ Only do this after 1 week of stable operation!**

```bash
# Remove Firebase dependencies
npm uninstall firebase

# Delete old files
rm src/firebaseConfig.js
rm src/Oauth_Kakao_Callback.js
rm src/Oauth_Naver_Callback.js
rm -rf functions/

# Commit cleanup
git add .
git commit -m "Remove Firebase dependencies"
git push
```

## Rollback Plan

If critical issues occur:

1. **Revert Git Commit**:
   ```bash
   git revert HEAD
   git push
   ```

2. **Vercel Rollback**:
   - Vercel Dashboard → Deployments
   - Find previous deployment
   - Click **Promote to Production**

3. **Re-enable Firebase**:
   ```bash
   git checkout [previous-commit-hash]
   git push --force
   ```

## Files in This Directory

- **schema.sql**: PostgreSQL schema for Supabase database
- **transform-quizzes.js**: Node.js script to convert Firebase JSON to Supabase format
- **README.md**: This file

## Support

If you encounter issues during migration:

1. Check Supabase Dashboard → Logs for API errors
2. Check browser console for frontend errors
3. Verify environment variables are set correctly
4. Ensure RLS policies allow public quiz access

## Migration Checklist

- [ ] Phase 1.1: Run schema.sql in Supabase
- [ ] Phase 1.2: Configure Kakao OAuth
- [ ] Phase 1.3: Get Supabase API credentials
- [ ] Phase 2.1: Run transform-quizzes.js
- [ ] Phase 2.2: Import quizzes to Supabase
- [ ] Phase 2.3: Verify quiz count and categories
- [ ] Phase 3.1: Create .env.local
- [ ] Phase 3.2: Test locally (all features)
- [ ] Phase 4.1: Set Vercel environment variables
- [ ] Phase 4.2: Deploy to Vercel
- [ ] Phase 4.3: Test production
- [ ] Phase 5: Cleanup (after 1 week)
