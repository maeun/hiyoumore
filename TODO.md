# ✅ Migration TODO Checklist

**Quick reference checklist for Firebase → Supabase migration**

---

## Before You Start
- [ ] Read `MIGRATION_GUIDE.md` (5 min overview)
- [ ] Backup Firebase data (already exported to `etc/`)
- [ ] Ensure you have Kakao Developer account access

---

## 1. Supabase Setup (15 minutes)

### Create Project
- [ ] Go to https://supabase.com
- [ ] Create new project named "hiyoumore"
- [ ] Save database password somewhere safe
- [ ] Wait for project to initialize (~2 min)

### Run Database Schema
- [ ] Open Supabase Dashboard → SQL Editor
- [ ] Copy contents of `migration/schema.sql`
- [ ] Paste and click "Run"
- [ ] Verify success message

### Configure Kakao OAuth
- [ ] Supabase Dashboard → Authentication → Providers
- [ ] Enable Kakao provider
- [ ] Enter Client ID: `05d00f0fda1f9c72cd19cc6f219cd58a`
- [ ] Get Client Secret from Kakao Developers Console
- [ ] Copy Supabase callback URL
- [ ] Add callback URL to Kakao app settings
- [ ] Save in Supabase

### Get Credentials
- [ ] Supabase Dashboard → Settings → API
- [ ] Copy Project URL
- [ ] Copy anon public key

---

## 2. Data Migration (10 minutes)

### Transform Data
- [ ] Open terminal in project root
- [ ] Run: `cd migration`
- [ ] Run: `node transform-quizzes.js`
- [ ] Verify `supabase-quizzes.json` created

### Import to Supabase
Choose one method:

**Option A: CSV Import** (Easier)
- [ ] Convert `supabase-quizzes.json` to CSV
- [ ] Supabase Dashboard → Table Editor → quizzes
- [ ] Click "Import data from CSV"
- [ ] Upload and import

**Option B: Script** (For large datasets)
- [ ] Create import script (see `migration/README.md`)
- [ ] Run bulk insert

### Verify
- [ ] Supabase SQL Editor
- [ ] Run: `SELECT COUNT(*) FROM quizzes;`
- [ ] Confirm count matches Firebase (~300+)

---

## 3. Local Setup (5 minutes)

### Create Environment File
- [ ] In project root, create `.env.local`
- [ ] Copy from `.env.local.example`
- [ ] Replace with your actual Supabase URL
- [ ] Replace with your actual anon key

### Test Locally
- [ ] Run: `npm start`
- [ ] App loads without errors
- [ ] Categories load quizzes
- [ ] "Today's" works
- [ ] Click Kakao login
- [ ] Completes login flow
- [ ] My Page shows profile
- [ ] Logout works
- [ ] Visit `localhost:3000/shared-quiz?num=0`

---

## 4. Deploy to Vercel (10 minutes)

### Set Environment Variables
- [ ] Go to Vercel Dashboard
- [ ] Select hiyoumore project
- [ ] Settings → Environment Variables
- [ ] Add `REACT_APP_SUPABASE_URL`
- [ ] Add `REACT_APP_SUPABASE_ANON_KEY`
- [ ] Apply to Production, Preview, Development

### Deploy
- [ ] Run: `git add .`
- [ ] Run: `git commit -m "Migrate from Firebase to Supabase"`
- [ ] Run: `git push origin main`
- [ ] Wait for Vercel auto-deploy (~2 min)

### Test Production
- [ ] Visit https://hiyoumore.vercel.app
- [ ] Test Kakao login in production
- [ ] Test quiz loading
- [ ] Test shared URLs
- [ ] Check browser console (no errors)
- [ ] Monitor Supabase Dashboard → Logs

---

## 5. Monitoring (First 24 Hours)

### Check Metrics
- [ ] Supabase Dashboard → Database → Tables
  - [ ] user_profiles has new rows
  - [ ] login_logs has entries
  - [ ] logout_logs has entries
- [ ] Vercel Dashboard → Deployment logs (no errors)
- [ ] Browser console (test on mobile too)

### User Feedback
- [ ] Test from different devices
- [ ] Test with actual Kakao account
- [ ] Confirm shared quiz URLs work
- [ ] Check loading performance

---

## 6. Cleanup (After 1 Week)

**⚠️ ONLY after confirming everything works!**

### Remove Old Code
- [ ] Delete `src/firebaseConfig.js`
- [ ] Delete `src/Oauth_Kakao_Callback.js`
- [ ] Delete `src/Oauth_Naver_Callback.js`
- [ ] Delete `functions/` directory

### Remove Dependencies
- [ ] Run: `npm uninstall firebase axios`
- [ ] Verify app still works

### Commit Cleanup
- [ ] Run: `git add .`
- [ ] Run: `git commit -m "Remove Firebase dependencies"`
- [ ] Run: `git push origin main`

### Disable Firebase (Optional)
- [ ] Firebase Console → Project Settings
- [ ] Disable billing
- [ ] Export final backup (if needed)

---

## 🎉 Done!

Your app is now running on Supabase!

**Next Steps:**
- [ ] Update `CLAUDE.md` to reflect Supabase architecture
- [ ] Update `MEMORY.md` with migration learnings
- [ ] Consider enabling additional Supabase features:
  - Real-time subscriptions
  - Storage for user uploads
  - Edge Functions for serverless logic

---

**Stuck?** See:
- `MIGRATION_GUIDE.md` for detailed steps
- `migration/README.md` for troubleshooting
- `IMPLEMENTATION_SUMMARY.md` for technical details
