# Next.js App Router Migration Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Migrate HIYOUMORE from Create React App to Next.js 15 App Router, achieving true SSR for all pages and server-rendered OG tags for shared quiz links.

**Architecture:** Three sequential phases — Phase 1 scaffolds Next.js alongside the existing `src/` directory; Phase 2 ports all 11 pages one by one as `"use client"` components; Phase 3 converts `/quiz/[id]` to a true Server Component with `generateMetadata` for real SSR OG tags. All work happens on the `feat/nextjs` branch.

**Tech Stack:** Next.js 15, React 18, MUI v5 with `@emotion/cache` for App Router, Supabase JS v2, `next/navigation` replacing `react-router-dom`, Next.js `metadata` API replacing `react-helmet-async`.

---

## Router Migration Reference

Every component that uses `react-router-dom` needs these substitutions. Refer back to this table in every task.

| react-router-dom | next/navigation equivalent |
|---|---|
| `import { useNavigate } from 'react-router-dom'` | `import { useRouter } from 'next/navigation'` |
| `import { useLocation } from 'react-router-dom'` | `import { usePathname, useSearchParams } from 'next/navigation'` |
| `import { NavLink } from 'react-router-dom'` | `import Link from 'next/link'` + `usePathname()` for active state |
| `import { Link } from 'react-router-dom'` | `import Link from 'next/link'` |
| `const navigate = useNavigate()` | `const router = useRouter()` |
| `navigate('/path')` | `router.push('/path')` |
| `navigate(-1)` | `router.back()` |
| `navigate('/', { replace: true })` | `router.replace('/')` |
| `navigate('/', { replace: true, state: {} })` | `router.replace('/')` (state not used in Next.js) |
| `location.pathname` | `usePathname()` — returns string directly |
| `location.search` | `useSearchParams()` — returns URLSearchParams-like object |
| `new URLSearchParams(location.search).get('key')` | `useSearchParams().get('key')` |

---

## File Map

| Action | File | Purpose |
|---|---|---|
| Create | `feat/nextjs` branch | Isolated migration workspace |
| Create | `jsconfig.json` | `@/` path alias pointing to project root |
| Create | `next.config.js` | Redirects, image config |
| Create | `app/layout.js` | Root layout: html/body, Providers, ArcadeHeader, TabBar |
| Create | `app/providers.js` | `"use client"` — MUI emotion cache, AuthProvider, ToastContainer |
| Create | `app/page.js` | Home page wrapper |
| Create | `app/not-found.js` | 404 page |
| Create | `app/quiz/[id]/page.js` | SSR quiz page with generateMetadata |
| Create | `app/login/page.js` | Login page |
| Create | `app/auth/callback/page.js` | OAuth callback |
| Create | `app/mypage/page.js` | Mypage |
| Create | `app/my-bookmarks/page.js` | Bookmarks |
| Create | `app/my-history/page.js` | History |
| Create | `app/my-comments/page.js` | Comments |
| Create | `app/info/page.js` | Info menu |
| Create | `app/terms/page.js` | Terms |
| Create | `app/privacy/page.js` | Privacy |
| Modify | `src/supabaseConfig.js` | Use `NEXT_PUBLIC_` env vars |
| Modify | `src/components/ArcadeHeader.js` | Add `"use client"`, swap to `useRouter` |
| Modify | `src/components/TabBar.js` | Add `"use client"`, swap `NavLink` → `Link` + `usePathname` |
| Modify | `src/components/CommentSection.js` | Add `"use client"`, swap `useNavigate` → `useRouter` |
| Modify | `src/AuthCallback.js` | Add `"use client"`, swap `useNavigate` → `useRouter` |
| Modify | `src/Home.js` | Add `"use client"`, remove state-based toast, swap router |
| Modify | `src/Category.js` | Add `"use client"`, swap router |
| Modify | `src/Mypage.js` | Add `"use client"`, swap router |
| Modify | `src/MyBookmarks.js` | Add `"use client"`, swap router |
| Modify | `src/MyHistory.js` | Add `"use client"`, swap router |
| Modify | `src/MyComments.js` | Add `"use client"`, swap router |
| Modify | `src/Info.js` | Add `"use client"`, swap router |
| Modify | `src/Terms.js` | Add `"use client"`, swap router |
| Modify | `src/Privacy.js` | Add `"use client"`, swap router |
| Modify | `src/NotFound.js` | Add `"use client"`, swap router |
| Modify | `src/SharedQuiz.js` | Add `"use client"`, accept `quizData`+`quizId` props, swap router |
| Modify | `.env.local` | Add `NEXT_PUBLIC_` vars alongside existing ones |
| Modify | `package.json` | Replace CRA scripts with Next.js scripts |

---

# PHASE 1 — Foundation

---

## Task 1: Create Branch + Install Next.js

**Files:**
- Create: `feat/nextjs` branch
- Modify: `package.json`
- Modify: `.env.local`

- [ ] **Step 1: Create the feature branch**

```bash
cd C:\Users\maeun\side_pjt\hiyoumore
git checkout -b feat/nextjs
```

Expected: `Switched to a new branch 'feat/nextjs'`

- [ ] **Step 2: Install Next.js and emotion cache**

```bash
npm install next@15
npm install --save-dev @emotion/cache
```

Expected: both packages installed, `package.json` updated.

- [ ] **Step 3: Update package.json scripts**

Open `package.json`. Replace the `"scripts"` section with:

```json
"scripts": {
  "dev": "next dev",
  "prebuild": "node scripts/generate-sitemap.js",
  "build": "next build",
  "start": "next start",
  "test": "react-scripts test",
  "eject": "react-scripts eject"
},
```

Note: `react-scripts` stays for now (test script still uses it). The old `start`, `postbuild`, `predeploy`, `deploy` scripts are removed.

- [ ] **Step 4: Add NEXT_PUBLIC_ env vars to .env.local**

Open `.env.local`. It already has:
```
REACT_APP_SUPABASE_URL=...
REACT_APP_SUPABASE_ANON_KEY=...
```

Add these two new lines at the bottom (same values):
```
NEXT_PUBLIC_SUPABASE_URL=<same value as REACT_APP_SUPABASE_URL>
NEXT_PUBLIC_SUPABASE_ANON_KEY=<same value as REACT_APP_SUPABASE_ANON_KEY>
```

- [ ] **Step 5: Commit**

```bash
git add package.json package-lock.json
git commit -m "feat(nextjs): install Next.js 15, update scripts"
```

Note: Do NOT commit `.env.local` — it is gitignored.

---

## Task 2: jsconfig.json + next.config.js

**Files:**
- Create: `jsconfig.json`
- Create: `next.config.js`

- [ ] **Step 1: Create `jsconfig.json`**

Create at project root:

```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./*"]
    }
  }
}
```

This enables `@/src/...` imports in Next.js pages (e.g. `import Category from '@/src/Category'`).

- [ ] **Step 2: Create `next.config.js`**

Create at project root:

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      {
        source: '/shared-quiz',
        has: [{ type: 'query', key: 'num', value: '(?<id>.*)' }],
        destination: '/quiz/:id',
        permanent: true,
      },
    ];
  },
};

module.exports = nextConfig;
```

- [ ] **Step 3: Verify next.config.js syntax**

```bash
node -e "require('./next.config.js'); console.log('OK')"
```

Expected: `OK`

- [ ] **Step 4: Commit**

```bash
git add jsconfig.json next.config.js
git commit -m "feat(nextjs): add jsconfig path alias and next.config.js with quiz redirect"
```

---

## Task 3: Update supabaseConfig.js for NEXT_PUBLIC_ vars

**Files:**
- Modify: `src/supabaseConfig.js`

- [ ] **Step 1: Read the current file**

Open `src/supabaseConfig.js`. It currently reads `REACT_APP_SUPABASE_URL` and `REACT_APP_SUPABASE_ANON_KEY`.

- [ ] **Step 2: Update to support both prefixes**

Replace the env var references to fall back gracefully:

```javascript
import { createClient } from '@supabase/supabase-js';

const supabaseUrl =
  process.env.NEXT_PUBLIC_SUPABASE_URL ||
  process.env.REACT_APP_SUPABASE_URL;

const supabaseAnonKey =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  process.env.REACT_APP_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
```

Keep everything else in the file unchanged.

- [ ] **Step 3: Commit**

```bash
git add src/supabaseConfig.js
git commit -m "feat(nextjs): support NEXT_PUBLIC_ env vars in supabaseConfig"
```

---

## Task 4: Create app/providers.js

**Files:**
- Create: `app/providers.js`

- [ ] **Step 1: Create the `app/` directory and `providers.js`**

Create `app/providers.js`:

```javascript
'use client';

import { useState } from 'react';
import createCache from '@emotion/cache';
import { CacheProvider } from '@emotion/react';
import { AuthProvider } from '@/src/AuthContext';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function createEmotionCache() {
  return createCache({ key: 'css', prepend: true });
}

export default function Providers({ children }) {
  const [emotionCache] = useState(() => createEmotionCache());

  return (
    <CacheProvider value={emotionCache}>
      <AuthProvider>
        {children}
        <ToastContainer
          autoClose={2000}
          newestOnTop
          closeOnClick
          pauseOnFocusLoss={false}
          pauseOnHover
          draggable
          theme="dark"
        />
      </AuthProvider>
    </CacheProvider>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add app/providers.js
git commit -m "feat(nextjs): add Providers client boundary (MUI emotion cache + AuthProvider + Toast)"
```

---

## Task 5: Migrate ArcadeHeader + TabBar to Next.js Navigation

**Files:**
- Modify: `src/components/ArcadeHeader.js`
- Modify: `src/components/TabBar.js`

- [ ] **Step 1: Add `"use client"` to ArcadeHeader and swap useNavigate**

Open `src/components/ArcadeHeader.js`.

At the very top of the file (before all imports), add:
```javascript
'use client';
```

Then replace the import:
```javascript
// Remove this line:
import { useNavigate } from 'react-router-dom';

// Add this line:
import { useRouter } from 'next/navigation';
```

Find where `useNavigate` is called (around line 125):
```javascript
// Remove:
const navigate = useNavigate();

// Add:
const router = useRouter();
```

Find all `navigate(...)` calls and replace:
```javascript
// Before:
navigate('/');

// After:
router.push('/');
```

- [ ] **Step 2: Migrate TabBar — replace NavLink with Link + usePathname**

Open `src/components/TabBar.js`.

At the very top, add:
```javascript
'use client';
```

Replace the import:
```javascript
// Remove:
import { NavLink } from 'react-router-dom';

// Add:
import Link from 'next/link';
import { usePathname } from 'next/navigation';
```

`TabBar.js` uses `styled(NavLink)` — replace with `styled(Link)` and handle active state manually.

Find:
```javascript
const TabButton = styled(NavLink)({
```

Replace with:
```javascript
const TabButton = styled(Link)({
```

Now `NavLink` provided `isActive` via className callback. Find where active styling was applied using `NavLink`'s `className` prop or `&.active` selectors and replace with an `isactive` prop. In the component body, add `usePathname()` and pass `isactive` to each `TabButton`:

```javascript
function TabBar() {
  const pathname = usePathname();

  return (
    <TabBarContainer>
      <TabButton href="/" isactive={pathname === '/' ? 'true' : undefined}>
        {/* existing icon content */}
      </TabButton>
      <TabButton href="/my-bookmarks" isactive={pathname === '/my-bookmarks' ? 'true' : undefined}>
        {/* existing icon content */}
      </TabButton>
      <TabButton href="/mypage" isactive={pathname === '/mypage' ? 'true' : undefined}>
        {/* existing icon content */}
      </TabButton>
      <TabButton href="/info" isactive={pathname === '/info' ? 'true' : undefined}>
        {/* existing icon content */}
      </TabButton>
    </TabBarContainer>
  );
}
```

In the `styled(Link)` definition, update the active selector. Find any `'&.active'` CSS rule and replace with `'&[data-active="true"]'` or use the `isactive` prop in the styled component:

```javascript
const TabButton = styled(Link)(({ isactive }) => ({
  // ... all existing styles unchanged ...
  ...(isactive && {
    color: tokensArcade.colors.neonPink,
    // any other active styles from the original &.active block
  }),
}));
```

Read the full TabBar.js file carefully before making changes — preserve all existing icon content and styles exactly.

- [ ] **Step 3: Verify no react-router-dom imports remain in these two files**

```bash
grep -n "react-router-dom" src/components/ArcadeHeader.js src/components/TabBar.js
```

Expected: no output (no matches).

- [ ] **Step 4: Commit**

```bash
git add src/components/ArcadeHeader.js src/components/TabBar.js
git commit -m "feat(nextjs): migrate ArcadeHeader and TabBar to next/navigation"
```

---

## Task 6: Create app/layout.js + app/page.js — Verify Dev Server

**Files:**
- Create: `app/layout.js`
- Create: `app/page.js`

- [ ] **Step 1: Create `app/layout.js`**

```javascript
import Providers from './providers';
import ArcadeHeader from '@/src/components/ArcadeHeader';
import TabBar from '@/src/components/TabBar';
import '@/src/fonts.css';
import '@/src/index.css';
import '@/src/App.css';

export const metadata = {
  title: {
    default: 'HIYOUMORE',
    template: '%s | HIYOUMORE',
  },
  description: '427개의 한국어 퀴즈를 풀고 친구와 공유해보세요!',
  metadataBase: new URL('https://hiyoumore.xyz'),
  openGraph: {
    siteName: 'HIYOUMORE',
    locale: 'ko_KR',
    type: 'website',
    images: [{ url: '/meta_img.png' }],
  },
  twitter: {
    card: 'summary_large_image',
    images: ['/meta_img.png'],
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="ko">
      <body>
        <Providers>
          <div className="Main">
            <ArcadeHeader />
            <div className="Content">{children}</div>
            <TabBar />
          </div>
        </Providers>
      </body>
    </html>
  );
}
```

- [ ] **Step 2: Create `app/page.js` (home page stub)**

```javascript
'use client';

import { useState } from 'react';
import Home from '@/src/Home';

export default function HomePage() {
  const [selectedQuestions, setSelectedQuestions] = useState([]);
  return (
    <Home
      selectedQuestions={selectedQuestions}
      handleSelectedQuestions={setSelectedQuestions}
    />
  );
}
```

- [ ] **Step 3: Add `"use client"` and fix router in Home.js**

Open `src/Home.js`. Add at the very top:
```javascript
'use client';
```

Replace the router imports and usage:
```javascript
// Remove:
import { useLocation, useNavigate } from "react-router-dom";

// Add:
import { useRouter, useSearchParams } from 'next/navigation';
```

Replace the hook calls and toast logic:
```javascript
// Remove the entire location/navigate block and replace with:
const router = useRouter();
const searchParams = useSearchParams();
const loginSuccess = searchParams.get('loginSuccess');

useEffect(() => {
  if (!loginSuccess) return;
  showToast('👋 로그인 되었습니다 👋');
  router.replace('/');
}, [loginSuccess, router]);
```

Remove the old `Helmet` import and block (Next.js handles titles via `metadata` in `app/page.js`):
```javascript
// Remove:
import { Helmet } from "react-helmet-async";

// Remove the entire <Helmet>...</Helmet> block from the return statement
```

The return statement becomes:
```javascript
return (
  <div className="PageWrapper">
    <Category handleSelectedQuestions={handleSelectedQuestions} />
    <Quiz selectedQuestions={selectedQuestions} />
  </div>
);
```

- [ ] **Step 4: Add `"use client"` to Category.js and fix router**

Open `src/Category.js`. Add at the very top:
```javascript
'use client';
```

Replace import:
```javascript
// Remove:
import { useLocation, useNavigate } from "react-router-dom";

// Add:
import { useRouter, useSearchParams } from 'next/navigation';
```

Replace hook usage in the component function:
```javascript
// Remove:
const location = useLocation();
const navigate = useNavigate();

// Replace loginSuccess check:
const params = new URLSearchParams(location.search);
if (params.get('loginSuccess') === 'true') { ... navigate('/', { replace: true }); }

// Add:
const router = useRouter();
const searchParams = useSearchParams();

// Update loginSuccess check in useEffect:
if (searchParams.get('loginSuccess') === 'true') {
  setTimeout(() => { showLoginToast('👋 로그인 되었습니다 👋'); }, 300);
  router.replace('/');
}
```

Also remove the `Helmet` import and block from `Category.js` — metadata is now handled by `app/page.js`. Remove the `CATEGORY_ITEM_LIST_SCHEMA` JSON-LD `<script>` from Helmet too — that will be handled by `app/page.js` metadata later.

- [ ] **Step 5: Start the dev server and verify**

```bash
npm run dev
```

Open `http://localhost:3000` in a browser. Verify:
- ArcadeHeader renders (black bar with HIYOUMORE logo)
- TabBar renders at the bottom
- Home page content loads (category chips, quiz cards)
- No console errors about missing modules

- [ ] **Step 6: Commit**

```bash
git add app/layout.js app/page.js src/Home.js src/Category.js
git commit -m "feat(nextjs): add root layout, home page, fix Home/Category router migration"
```

---

# PHASE 2 — Page Migration

---

## Task 7: Static Pages — Terms, Privacy, Info

**Files:**
- Create: `app/terms/page.js`
- Create: `app/privacy/page.js`
- Create: `app/info/page.js`
- Modify: `src/Terms.js`
- Modify: `src/Privacy.js`
- Modify: `src/Info.js`

- [ ] **Step 1: Add `"use client"` and fix router in Terms.js**

Open `src/Terms.js`. Add at top:
```javascript
'use client';
```

Replace:
```javascript
// Remove:
import { useNavigate } from "react-router-dom";
const navigate = useNavigate();
navigate(-1); // ESC key handler

// Add:
import { useRouter } from 'next/navigation';
const router = useRouter();
router.back(); // ESC key handler
```

Also remove any `import { Helmet }` and `<Helmet>` blocks — page title handled by `app/terms/page.js`.

- [ ] **Step 2: Add `"use client"` and fix router in Privacy.js**

Open `src/Privacy.js`. Apply identical changes as Step 1 (same pattern — ESC key uses `navigate(-1)`):

```javascript
'use client';
// Remove react-router-dom import
import { useRouter } from 'next/navigation';
const router = useRouter();
// replace navigate(-1) with router.back()
```

Remove any `Helmet` import and block.

- [ ] **Step 3: Add `"use client"` and fix router in Info.js**

Open `src/Info.js`. Add at top:
```javascript
'use client';
```

Replace:
```javascript
// Remove:
import { useNavigate } from 'react-router-dom';
const navigate = useNavigate();

// Add:
import { useRouter } from 'next/navigation';
const router = useRouter();
```

Replace all `navigate(...)` calls with `router.push(...)` or `router.back()` as appropriate. Remove `Helmet` import and block.

- [ ] **Step 4: Create app/terms/page.js**

```javascript
import Terms from '@/src/Terms';

export const metadata = {
  title: '이용약관',
  robots: { index: false },
};

export default function TermsPage() {
  return <Terms />;
}
```

- [ ] **Step 5: Create app/privacy/page.js**

```javascript
import Privacy from '@/src/Privacy';

export const metadata = {
  title: '개인정보처리방침',
  robots: { index: false },
};

export default function PrivacyPage() {
  return <Privacy />;
}
```

- [ ] **Step 6: Create app/info/page.js**

```javascript
import Info from '@/src/Info';

export const metadata = {
  title: '정보',
};

export default function InfoPage() {
  return <Info />;
}
```

- [ ] **Step 7: Verify all three pages**

With `npm run dev` running, visit:
- `http://localhost:3000/terms` — green terminal screen renders
- `http://localhost:3000/privacy` — green terminal screen renders
- `http://localhost:3000/info` — info menu renders
- ESC key works on Terms and Privacy (navigate back)

- [ ] **Step 8: Commit**

```bash
git add app/terms/page.js app/privacy/page.js app/info/page.js src/Terms.js src/Privacy.js src/Info.js
git commit -m "feat(nextjs): migrate terms, privacy, info pages"
```

---

## Task 8: Auth Pages — Login + AuthCallback

**Files:**
- Create: `app/login/page.js`
- Create: `app/auth/callback/page.js`
- Modify: `src/AuthCallback.js`

- [ ] **Step 1: Add `"use client"` and fix router in AuthCallback.js**

Open `src/AuthCallback.js`. Add at top:
```javascript
'use client';
```

Replace:
```javascript
// Remove:
import { useNavigate } from 'react-router-dom';
const navigate = useNavigate();
navigate('/?loginSuccess=true');
navigate('/login');

// Add:
import { useRouter } from 'next/navigation';
const router = useRouter();
router.push('/?loginSuccess=true');
router.push('/login');
```

- [ ] **Step 2: Create app/login/page.js**

```javascript
import Login from '@/src/Login';

export const metadata = {
  title: '로그인',
  robots: { index: false },
};

export default function LoginPage() {
  return <Login />;
}
```

- [ ] **Step 3: Create app/auth/callback/page.js**

```javascript
import AuthCallback from '@/src/AuthCallback';

export const metadata = {
  robots: { index: false },
};

export default function AuthCallbackPage() {
  return <AuthCallback />;
}
```

- [ ] **Step 4: Verify auth flow**

With `npm run dev` running:
- Visit `http://localhost:3000/login` — INSERT COIN screen renders
- Click Kakao login button — should redirect to Kakao OAuth
- After OAuth, should redirect back to `/?loginSuccess=true` and show toast

- [ ] **Step 5: Commit**

```bash
git add app/login/page.js app/auth/callback/page.js src/AuthCallback.js
git commit -m "feat(nextjs): migrate login and auth callback pages"
```

---

## Task 9: Auth-Gated Pages — Mypage, MyBookmarks, MyHistory, MyComments

**Files:**
- Create: `app/mypage/page.js`
- Create: `app/my-bookmarks/page.js`
- Create: `app/my-history/page.js`
- Create: `app/my-comments/page.js`
- Modify: `src/Mypage.js`
- Modify: `src/MyBookmarks.js`
- Modify: `src/MyHistory.js`
- Modify: `src/MyComments.js`
- Modify: `src/components/CommentSection.js`

- [ ] **Step 1: Fix router in Mypage.js**

Open `src/Mypage.js`. Add at top:
```javascript
'use client';
```

Replace:
```javascript
// Remove:
import { useNavigate } from "react-router-dom";
const navigate = useNavigate();

// Add:
import { useRouter } from 'next/navigation';
const router = useRouter();
```

Replace all `navigate(...)` calls with `router.push(...)` or `router.back()`. Remove any `Helmet` imports/blocks.

- [ ] **Step 2: Fix router in MyBookmarks.js**

Open `src/MyBookmarks.js`. Add at top:
```javascript
'use client';
```

Replace:
```javascript
// Remove:
import { useNavigate } from "react-router-dom";
const navigate = useNavigate();

// Add:
import { useRouter } from 'next/navigation';
const router = useRouter();
```

Replace all `navigate(...)` calls. Remove `Helmet` if present.

- [ ] **Step 3: Fix router in MyHistory.js**

Open `src/MyHistory.js`. Add at top:
```javascript
'use client';
```

Replace:
```javascript
// Remove:
import { useNavigate } from 'react-router-dom';
const navigate = useNavigate();

// Add:
import { useRouter } from 'next/navigation';
const router = useRouter();
```

Replace all `navigate(...)` calls. Remove `Helmet` if present.

- [ ] **Step 4: Fix router in MyComments.js**

Open `src/MyComments.js`. Add at top:
```javascript
'use client';
```

Replace:
```javascript
// Remove:
import { useNavigate } from "react-router-dom";
const navigate = useNavigate();

// Add:
import { useRouter } from 'next/navigation';
const router = useRouter();
```

Replace all `navigate(...)` calls. Remove `Helmet` if present.

- [ ] **Step 5: Fix router in CommentSection.js**

Open `src/components/CommentSection.js`. Add at top:
```javascript
'use client';
```

Replace:
```javascript
// Remove:
import { useNavigate } from 'react-router-dom';
const navigate = useNavigate();
navigate('/login');

// Add:
import { useRouter } from 'next/navigation';
const router = useRouter();
router.push('/login');
```

- [ ] **Step 6: Create app/mypage/page.js**

```javascript
import Mypage from '@/src/Mypage';

export const metadata = {
  title: '마이페이지',
  robots: { index: false },
};

export default function MypagePage() {
  return <Mypage />;
}
```

- [ ] **Step 7: Create app/my-bookmarks/page.js**

```javascript
import MyBookmarks from '@/src/MyBookmarks';

export const metadata = {
  title: '저장 목록',
  robots: { index: false },
};

export default function MyBookmarksPage() {
  return <MyBookmarks />;
}
```

- [ ] **Step 8: Create app/my-history/page.js**

```javascript
import MyHistory from '@/src/MyHistory';

export const metadata = {
  title: '퀴즈 기록',
  robots: { index: false },
};

export default function MyHistoryPage() {
  return <MyHistory />;
}
```

- [ ] **Step 9: Create app/my-comments/page.js**

```javascript
import MyComments from '@/src/MyComments';

export const metadata = {
  title: '내 댓글',
  robots: { index: false },
};

export default function MyCommentsPage() {
  return <MyComments />;
}
```

- [ ] **Step 10: Verify all four pages**

With `npm run dev` running, visit each page while logged in and logged out:
- `http://localhost:3000/mypage`
- `http://localhost:3000/my-bookmarks`
- `http://localhost:3000/my-history`
- `http://localhost:3000/my-comments`

Each should render without errors. Auth-gated content should show login prompt when logged out.

- [ ] **Step 11: Commit**

```bash
git add app/mypage/page.js app/my-bookmarks/page.js app/my-history/page.js app/my-comments/page.js src/Mypage.js src/MyBookmarks.js src/MyHistory.js src/MyComments.js src/components/CommentSection.js
git commit -m "feat(nextjs): migrate mypage, bookmarks, history, comments pages"
```

---

## Task 10: 404 Page

**Files:**
- Create: `app/not-found.js`
- Modify: `src/NotFound.js`

- [ ] **Step 1: Fix router in NotFound.js**

Open `src/NotFound.js`. Add at top:
```javascript
'use client';
```

Replace:
```javascript
// Remove:
import { useNavigate } from 'react-router-dom';
const navigate = useNavigate();

// Add:
import { useRouter } from 'next/navigation';
const router = useRouter();
```

Replace all `navigate(...)` calls with `router.push(...)` or `router.back()`. Remove `Helmet` if present.

- [ ] **Step 2: Create `app/not-found.js`**

In Next.js App Router, `not-found.js` in the `app/` directory is the 404 page:

```javascript
import NotFound from '@/src/NotFound';

export default function NotFoundPage() {
  return <NotFound />;
}
```

- [ ] **Step 3: Verify**

Visit `http://localhost:3000/some-nonexistent-page` — Game Over 404 screen should render with countdown.

- [ ] **Step 4: Commit**

```bash
git add app/not-found.js src/NotFound.js
git commit -m "feat(nextjs): migrate 404 not-found page"
```

---

## Task 11: Phase 2 Verification

- [ ] **Step 1: Verify no react-router-dom imports remain in migrated files**

```bash
grep -rn "from 'react-router-dom'" src/ --include="*.js"
```

Expected output should only include files NOT yet migrated (e.g. `Quiz.js`, `Login.js` if they use router). If any migrated file still appears, fix it.

- [ ] **Step 2: Check Login.js for router usage**

```bash
grep -n "react-router-dom\|useNavigate\|useLocation" src/Login.js
```

If any matches, add `'use client'` and swap to `useRouter` as per the router migration table at the top of this plan.

- [ ] **Step 3: Check Quiz.js for router usage**

```bash
grep -n "react-router-dom\|useNavigate\|useLocation" src/Quiz.js
```

If any matches, add `'use client'` and swap accordingly.

- [ ] **Step 4: Full page smoke test**

Visit every route in the browser and confirm it renders:
- `/` — quiz home
- `/terms` — green terminal
- `/privacy` — green terminal
- `/info` — info menu
- `/login` — INSERT COIN screen
- `/mypage` — stats dashboard
- `/my-bookmarks` — trading card gallery
- `/my-history` — trading card gallery
- `/my-comments` — trading card gallery
- `/nonexistent` — Game Over 404

- [ ] **Step 5: Commit any remaining fixes**

```bash
git add -A
git commit -m "feat(nextjs): Phase 2 complete — all pages migrated"
```

---

# PHASE 3 — SSR Quiz Page + Metadata

---

## Task 12: Update SharedQuiz.js to Accept Props

**Files:**
- Modify: `src/SharedQuiz.js`

The current `SharedQuiz.js` reads `?num=` from the URL. In Next.js, `/quiz/[id]` passes the id as a prop. We update `SharedQuiz` to accept optional `quizData` and `quizId` props — if provided, skip the Supabase fetch (SSR path); if not, fetch client-side.

- [ ] **Step 1: Add `"use client"` and update the component signature**

Open `src/SharedQuiz.js`. Add at top:
```javascript
'use client';
```

Replace the import:
```javascript
// Remove:
import { useLocation } from "react-router-dom";

// No replacement needed — we use props instead
```

- [ ] **Step 2: Update the component to accept quizData and quizId props**

Find the component function:
```javascript
// Before:
function SharedQuiz() {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const num = searchParams.get("num");
  // ...
  useEffect(() => {
    if (!num) { ... }
    const fetchQuestionAndAnswer = async () => {
      const { data: quiz, error } = await supabase
        .from('quizzes').select(...).eq('index', parseInt(num)).single();
      // ...
    };
    fetchQuestionAndAnswer();
  }, [num]);
```

Replace with:
```javascript
// After:
function SharedQuiz({ quizData = null, quizId = null }) {
  // Determine num: prefer quizId prop, fall back to URL query param
  const num = quizId ?? (
    typeof window !== 'undefined'
      ? new URLSearchParams(window.location.search).get('num')
      : null
  );

  // ...existing state declarations unchanged...

  useEffect(() => {
    // If SSR pre-fetched data is provided, use it directly
    if (quizData) {
      setQuestion({ que: quizData.question, ans: quizData.answer });
      setLoading(false);
      return;
    }

    if (!num) {
      setError("퀴즈 번호가 없습니다.");
      setLoading(false);
      return;
    }

    const fetchQuestionAndAnswer = async () => {
      const { data: quiz, error } = await supabase
        .from('quizzes')
        .select('question, answer, index')
        .eq('index', parseInt(num))
        .single();
      // ... rest of fetch logic unchanged
    };
    fetchQuestionAndAnswer();
  }, [num, quizData]);
```

- [ ] **Step 3: Remove the Helmet block from SharedQuiz.js**

Find and remove:
```javascript
import { Helmet } from "react-helmet-async";
```

And remove the entire `<Helmet>...</Helmet>` block from the return statement. The `qaSchema` variable and `ogDescription` variable can also be removed — OG tags are now handled by `generateMetadata` in `app/quiz/[id]/page.js`.

- [ ] **Step 4: Verify SharedQuiz still works client-side**

With `npm run dev` running, visit `http://localhost:3000/quiz/1` (the page doesn't exist yet — expect 404). This is fine for now. The client-side path will be verified in Task 13.

- [ ] **Step 5: Commit**

```bash
git add src/SharedQuiz.js
git commit -m "feat(nextjs): update SharedQuiz to accept quizData/quizId props for SSR"
```

---

## Task 13: Create /quiz/[id] Server Component Page

**Files:**
- Create: `app/quiz/[id]/page.js`

- [ ] **Step 1: Create the directory and file**

Create `app/quiz/[id]/page.js`:

```javascript
import { createClient } from '@supabase/supabase-js';
import SharedQuiz from '@/src/SharedQuiz';

async function fetchQuiz(id) {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );
  const { data, error } = await supabase
    .from('quizzes')
    .select('question, answer, index')
    .eq('index', parseInt(id))
    .single();

  if (error || !data) return null;
  return data;
}

export async function generateMetadata({ params }) {
  const quiz = await fetchQuiz(params.id);
  if (!quiz) {
    return { title: '퀴즈를 찾을 수 없어요' };
  }
  const question = quiz.question?.replace(/<[^>]*>/g, '') ?? '';
  const preview = question.substring(0, 80);
  return {
    title: question.substring(0, 60) || 'FRIEND CHALLENGE',
    description: `"${preview}${question.length > 80 ? '...' : ''}" - 친구가 보낸 퀴즈를 맞춰보세요!`,
    openGraph: {
      title: '친구가 보낸 퀴즈 | HIYOUMORE',
      description: `"${preview}${question.length > 80 ? '...' : ''}" - 맞춰보세요!`,
      images: [{ url: '/meta_img.png' }],
      type: 'article',
    },
    twitter: {
      card: 'summary_large_image',
      title: '친구가 보낸 퀴즈 | HIYOUMORE',
      description: `"${preview}${question.length > 80 ? '...' : ''}" - 맞춰보세요!`,
    },
  };
}

export default async function QuizPage({ params }) {
  const quiz = await fetchQuiz(params.id);
  return <SharedQuiz quizData={quiz} quizId={params.id} />;
}
```

- [ ] **Step 2: Verify SSR renders correctly**

With `npm run dev` running, visit `http://localhost:3000/quiz/1`.

Verify:
- The quiz card renders with real content
- Run `curl http://localhost:3000/quiz/1` and check the output contains the actual quiz question text in the HTML (not loading spinner)
- Check `<title>` in the HTML source contains the quiz question

Expected curl output contains something like:
```html
<title><!-- quiz question text here --> | HIYOUMORE</title>
```

- [ ] **Step 3: Test the redirect**

Visit `http://localhost:3000/shared-quiz?num=1` — it should redirect to `http://localhost:3000/quiz/1`.

```bash
curl -I "http://localhost:3000/shared-quiz?num=1"
```

Expected: `HTTP/1.1 301` with `Location: /quiz/1`

- [ ] **Step 4: Commit**

```bash
git add "app/quiz/[id]/page.js"
git commit -m "feat(nextjs): add SSR quiz page with generateMetadata — real OG tags for shared links"
```

---

## Task 14: Add Per-Page Metadata + Remove react-helmet-async

**Files:**
- Modify: `app/page.js` (add metadata + JSON-LD)
- Modify: `package.json` (remove react-helmet-async)

- [ ] **Step 1: Add metadata export to app/page.js**

Update `app/page.js` to add metadata and the JSON-LD schemas that were previously in `Category.js`:

```javascript
'use client';

import { useState } from 'react';
import Home from '@/src/Home';

export default function HomePage() {
  const [selectedQuestions, setSelectedQuestions] = useState([]);
  return (
    <Home
      selectedQuestions={selectedQuestions}
      handleSelectedQuestions={setSelectedQuestions}
    />
  );
}
```

Add a separate `app/page-metadata.js` is not needed — metadata can be exported from a Server Component. Since `app/page.js` is `'use client'`, move metadata to a wrapper. The cleanest approach: keep `app/page.js` as a Server Component that renders a client wrapper:

Replace `app/page.js` entirely with:

```javascript
// Server Component — no "use client"
import HomeClient from './home-client';

export const metadata = {
  title: 'HIYOUMORE — 오늘의 퀴즈',
  description: '427개의 한국어 퀴즈를 풀고 친구와 공유해보세요! 동물, 상식, 음식, 역사 등 다양한 카테고리.',
  openGraph: {
    title: 'HIYOUMORE — 오늘의 퀴즈',
    description: '427개의 한국어 퀴즈를 풀고 친구와 공유해보세요!',
    type: 'website',
  },
};

export default function HomePage() {
  return <HomeClient />;
}
```

Create `app/home-client.js`:

```javascript
'use client';

import { useState } from 'react';
import Home from '@/src/Home';

export default function HomeClient() {
  const [selectedQuestions, setSelectedQuestions] = useState([]);
  return (
    <Home
      selectedQuestions={selectedQuestions}
      handleSelectedQuestions={setSelectedQuestions}
    />
  );
}
```

- [ ] **Step 2: Verify no remaining Helmet usage**

```bash
grep -rn "react-helmet-async\|from 'react-helmet" src/ --include="*.js"
```

If any files still import Helmet, remove those imports and their `<Helmet>` blocks. Page titles are now handled by `metadata` exports in `app/*/page.js` files.

- [ ] **Step 3: Remove react-helmet-async from package.json**

```bash
npm uninstall react-helmet-async
```

Verify `package.json` no longer lists `react-helmet-async`.

- [ ] **Step 4: Verify dev server still works after removing react-helmet-async**

```bash
npm run dev
```

Visit `http://localhost:3000`. Confirm no import errors.

- [ ] **Step 5: Commit**

```bash
git add app/page.js app/home-client.js package.json package-lock.json
git commit -m "feat(nextjs): add per-page metadata exports, remove react-helmet-async"
```

---

## Task 15: Final Verification + Merge Prep

- [ ] **Step 1: Run production build**

```bash
npm run build
```

Expected: build completes without errors. Warnings are acceptable. Note any errors and fix them before proceeding.

- [ ] **Step 2: Start production server and smoke test**

```bash
npm start
```

Visit `http://localhost:3000` and spot-check all pages.

- [ ] **Step 3: Verify SSR OG tags with curl**

```bash
curl -s http://localhost:3000/quiz/1 | grep -E "<title>|og:title|og:description"
```

Expected output contains the actual quiz question text, not a loading state:
```html
<title>실제 퀴즈 질문 텍스트 | HIYOUMORE</title>
<meta property="og:title" content="친구가 보낸 퀴즈 | HIYOUMORE"/>
<meta property="og:description" content="&quot;실제 질문...&quot; - 친구가 보낸 퀴즈를 맞춰보세요!"/>
```

- [ ] **Step 4: Verify redirect works in production**

```bash
curl -I "http://localhost:3000/shared-quiz?num=42"
```

Expected: `301` redirect to `/quiz/42`.

- [ ] **Step 5: Check browser tab titles on all pages**

| URL | Expected title |
|---|---|
| `/` | `HIYOUMORE — 오늘의 퀴즈` |
| `/quiz/1` | `[question text] \| HIYOUMORE` |
| `/terms` | `이용약관 \| HIYOUMORE` |
| `/privacy` | `개인정보처리방침 \| HIYOUMORE` |
| `/info` | `정보 \| HIYOUMORE` |
| `/login` | `로그인 \| HIYOUMORE` |
| `/mypage` | `마이페이지 \| HIYOUMORE` |
| `/my-bookmarks` | `저장 목록 \| HIYOUMORE` |
| `/my-history` | `퀴즈 기록 \| HIYOUMORE` |
| `/my-comments` | `내 댓글 \| HIYOUMORE` |
| `/nonexistent` | `HIYOUMORE` (default) |

- [ ] **Step 6: Final commit**

```bash
git add -A
git commit -m "feat(nextjs): Phase 3 complete — SSR quiz page, metadata exports, all pages verified"
```

- [ ] **Step 7: Push feat/nextjs branch**

```bash
git push origin feat/nextjs
```

Then open a pull request from `feat/nextjs` → `main`. Do NOT merge until you have verified the Vercel preview deployment works correctly (Vercel will auto-deploy the PR as a preview URL).

---

## Out of Scope (Do After Merge)

- Remove `react-scripts`, `react-router-dom`, `react-snap`, `workbox-*` from `package.json`
- Remove `src/App.js`, `src/index.js`, `src/serviceWorkerRegistration.js`, `src/service-worker.js`
- Remove `REACT_APP_` env vars from `.env.local` (after confirming all code uses `NEXT_PUBLIC_`)
- Add `next-pwa` for PWA support
- Submit updated sitemap to Google Search Console and Naver Search Advisor
