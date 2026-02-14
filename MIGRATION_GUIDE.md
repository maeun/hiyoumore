# 🚀 Firebase to Supabase Migration - Quick Start Guide

## ✅ Code Migration Complete!

All code has been successfully updated to use Supabase instead of Firebase. Here's what was changed:

### Files Created
- ✅ `src/supabaseConfig.js` - Supabase client configuration
- ✅ `src/AuthCallback.js` - New unified OAuth callback handler
- ✅ `.env.local.example` - Template for environment variables
- ✅ `migration/schema.sql` - Database schema for Supabase
- ✅ `migration/transform-quizzes.js` - Data transformation script
- ✅ `migration/README.md` - Detailed migration instructions

### Files Updated
- ✅ `src/AuthContext.js` - Now uses Supabase Auth
- ✅ `src/Login.js` - Uses Supabase OAuth flow
- ✅ `src/Category.js` - Queries Supabase instead of Firebase
- ✅ `src/SharedQuiz.js` - Fetches from Supabase
- ✅ `src/authUtils.js` - Logs to Supabase tables
- ✅ `src/Mypage.js` - Fetches user profile from Supabase
- ✅ `src/App.js` - Updated routes for new auth callback
- ✅ `src/service-worker.js` - Caches Supabase requests
- ✅ `.gitignore` - Protects environment variables

### Files to Remove Later (After Testing)
- ⏳ `src/firebaseConfig.js` - Old Firebase config
- ⏳ `src/Oauth_Kakao_Callback.js` - Old Kakao callback
- ⏳ `src/Oauth_Naver_Callback.js` - Old Naver callback
- ⏳ `functions/` directory - Netlify-specific functions

---

## 🎯 Next Steps (Required Before App Works)

### Step 1: Create Supabase Project (5 minutes)

1. Go to https://supabase.com and sign up/login
2. Click **New Project**
3. Fill in:
   - **Name**: `hiyoumore`
   - **Database Password**: (generate strong password)
   - **Region**: Choose closest to South Korea
4. Wait 2-3 minutes for project setup

### Step 2: Run Database Schema (2 minutes)

1. In Supabase Dashboard, go to **SQL Editor**
2. Open `migration/schema.sql` from your project
3. Copy the entire file contents
4. Paste into SQL Editor and click **Run**
5. You should see "Success. No rows returned"

### Step 3: Configure Kakao OAuth (5 minutes)

#### In Supabase Dashboard:
1. Go to **Authentication → Providers**
2. Find **Kakao** and click **Enable**
3. Enter:
   - **Client ID**: `05d00f0fda1f9c72cd19cc6f219cd58a`
   - **Client Secret**: *[Get from next step]*
4. **Copy the Callback URL** (looks like `https://xxx.supabase.co/auth/v1/callback`)

#### In Kakao Developers Console:
1. Go to https://developers.kakao.com
2. Select your app (or create one)
3. Go to **Product Settings → Kakao Login → Redirect URI**
4. Click **Add Redirect URI**
5. Paste the Supabase callback URL you copied
6. Save
7. Go to **My Application → App Settings → App Keys**
8. Copy **REST API Key** (this is your Client ID - should match above)
9. Copy **Client Secret** (under **App Keys → Show Client Secret**)
10. Go back to Supabase and paste the **Client Secret**
11. Click **Save** in Supabase

### Step 4: Get Supabase Credentials (1 minute)

1. In Supabase Dashboard, go to **Settings → API**
2. Copy these values:
   - **Project URL**: `https://[your-id].supabase.co`
   - **anon public key**: Long string starting with `eyJ...`

### Step 5: Create Local Environment File (1 minute)

Create a file named `.env.local` in your project root:

```bash
REACT_APP_SUPABASE_URL=https://[your-project-id].supabase.co
REACT_APP_SUPABASE_ANON_KEY=eyJhbG...your-anon-key-here
```

**Important**: Replace the values with YOUR actual Supabase credentials from Step 4!

### Step 6: Import Quiz Data (10 minutes)

#### Option A: Using the Transform Script (Recommended)

```bash
# Navigate to migration folder
cd migration

# Run transformation script
node transform-quizzes.js
```

This creates `supabase-quizzes.json`.

#### Option B: Manual CSV Import

1. Convert `migration/supabase-quizzes.json` to CSV
2. Supabase Dashboard → **Table Editor** → **quizzes** → **Import CSV**

**Verify Import:**
```sql
-- Run in Supabase SQL Editor
SELECT COUNT(*) FROM quizzes;
-- Should return ~300+ quizzes
```

### Step 7: Test Locally (5 minutes)

```bash
npm start
```

**Test Checklist:**
- [ ] App loads without errors
- [ ] Click a category (e.g., "🐖 동물") → 3 quizzes load
- [ ] Click "📆 Today's" → Always shows same 3 quizzes
- [ ] Click Kakao login → Redirects to Kakao
- [ ] After login → Shows "로그인 되었습니다" toast
- [ ] Click card → Flips to show answer
- [ ] Click share button → Opens share dialog
- [ ] Visit shared URL: `http://localhost:3000/shared-quiz?num=0`
- [ ] Go to My Page → Shows your Kakao profile
- [ ] Click 로그아웃 → Logs out successfully

### Step 8: Deploy to Vercel (5 minutes)

#### Set Environment Variables in Vercel:
1. Go to https://vercel.com/dashboard
2. Select **hiyoumore** project
3. Go to **Settings → Environment Variables**
4. Add:
   - **Name**: `REACT_APP_SUPABASE_URL`
   - **Value**: `https://[your-id].supabase.co`
   - **Environment**: Production, Preview, Development
5. Add:
   - **Name**: `REACT_APP_SUPABASE_ANON_KEY`
   - **Value**: `eyJhbG...` (your anon key)
   - **Environment**: Production, Preview, Development
6. Click **Save**

#### Deploy:
```bash
git add .
git commit -m "Migrate from Firebase to Supabase"
git push origin main
```

Vercel auto-deploys in 1-2 minutes.

### Step 9: Test Production (3 minutes)

1. Visit https://hiyoumore.vercel.app
2. Test Kakao login
3. Test quiz loading
4. Check for errors in browser console
5. Monitor Supabase Dashboard → **Logs** for API errors

---

## 🎉 Success Criteria

Your migration is successful when:

✅ Users can log in with Kakao
✅ Quizzes load in all 8 categories
✅ "Today's" shows same 3 quizzes all day
✅ Shared quiz URLs work
✅ User profiles display correctly
✅ Login/logout logs appear in Supabase

---

## 🔧 Troubleshooting

### "Missing Supabase environment variables"
- Check `.env.local` exists in project root
- Restart dev server: `npm start`

### Kakao login redirects to error page
- Verify callback URL is whitelisted in Kakao console
- Check Supabase Kakao provider is **Enabled**

### Quizzes don't load
- Verify quizzes imported: Run `SELECT COUNT(*) FROM quizzes;` in Supabase
- Check browser console for errors
- Verify RLS policy: `SELECT * FROM quizzes LIMIT 1;` should work

### "User profile not found"
- Database trigger should auto-create profiles
- Verify trigger exists: Check `handle_new_user()` function in Supabase

---

## 📚 Additional Resources

- **Detailed Migration Guide**: See `migration/README.md`
- **Database Schema**: See `migration/schema.sql`
- **Supabase Docs**: https://supabase.com/docs
- **Kakao OAuth Docs**: https://developers.kakao.com/docs/latest/en/kakaologin/rest-api

---

## 🚨 Rollback Plan

If critical issues occur:

1. **Revert code**:
   ```bash
   git revert HEAD
   git push origin main
   ```

2. **Or use Vercel UI**:
   - Dashboard → Deployments → Previous → Promote to Production

---

## ✨ What's Different?

### Before (Firebase)
- 3 separate Firebase Realtime Database instances
- Manual OAuth token exchange in frontend
- sessionStorage-based auth state
- No built-in RLS (Row Level Security)

### After (Supabase)
- Single PostgreSQL database with 4 tables
- Built-in Kakao OAuth via Supabase Auth
- Auto-refreshing sessions via localStorage
- Database-level security with RLS policies
- Faster queries with PostgreSQL indexes

---

## 🎯 User Impact

**Minimal Disruption:**
- ✅ Existing shared quiz URLs still work (same `index` field)
- ✅ Same quiz content (questions/answers unchanged)
- ✅ Same UI/UX (no visual changes)

**One-Time Inconvenience:**
- ⚠️ Users must re-login with Kakao (old sessions invalid)
- ⚠️ User data from Firebase not migrated (fresh start)

**Long-Term Benefits:**
- 🚀 Faster quiz queries (PostgreSQL indexes)
- 🔒 Better security (RLS policies)
- 🛠️ Easier to add features (SQL vs NoSQL)
- 💰 Better pricing (Supabase free tier is generous)

---

**Need help?** Check `migration/README.md` for detailed troubleshooting.
