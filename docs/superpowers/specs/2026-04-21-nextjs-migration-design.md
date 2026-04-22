# Next.js App Router Migration Design — HIYOUMORE
**Date:** 2026-04-21  
**Status:** Approved  
**Branch:** `feat/nextjs` (merges to `main` when complete)

---

## Goal

Migrate HIYOUMORE from Create React App (CRA) to Next.js 15 App Router to achieve true server-side rendering — eliminating the empty HTML problem for bots and enabling real SSR OG tags on shared quiz pages.

---

## Motivation

The current CRA SPA ships `<div id="root"></div>` to all crawlers. The react-snap workaround added in the previous session pre-renders 5 static routes but cannot pre-render the 427 individual quiz pages (`/shared-quiz?num=X`) that are the app's primary viral sharing surface. Next.js App Router solves this at the framework level:

- Every page renders real HTML on the server
- `/quiz/[id]` fetches quiz data server-side and injects it into OG tags before the response is sent
- KakaoTalk, Google, Perplexity, and AI crawlers all see real content instantly

---

## What Changes

### Removed
- `react-scripts` (CRA build tooling)
- `react-router-dom` (routing — replaced by App Router)
- `react-helmet-async` (meta tags — replaced by Next.js `metadata` API)
- `react-snap` (pre-rendering workaround — no longer needed)
- `serviceWorkerRegistration.js`, `service-worker.js` (PWA — deferred to later)
- `workbox-*` packages

### Added
- `next` (Next.js 15)
- `@emotion/cache` (required for MUI in App Router)

### Unchanged
- All page components (ported, not rewritten)
- `tokens-arcade.js` and entire design system
- MUI v5 (`@mui/material`, `@mui/system`, `@mui/icons-material`)
- Supabase client (`supabaseConfig.js`, `AuthContext.js`)
- All utilities (`toastUtils.js`, `shareUtils.js`, `bookmarkUtils.js`, etc.)
- `react-toastify`, `react-confetti-explosion`, `DOMPurify`
- `public/` directory (llms.txt, robots.txt, sitemap script, etc.)

---

## URL Changes

| Old URL | New URL | Mechanism |
|---|---|---|
| `/shared-quiz?num=42` | `/quiz/42` | 301 redirect in `next.config.js` |
| All other routes | Identical | No change |

Old shared quiz links already circulating via KakaoTalk are preserved via the redirect.

---

## Directory Structure

```
(project root)
├── app/                          # Next.js App Router
│   ├── layout.js                 # Root layout: html/body, Providers, ArcadeHeader, TabBar
│   ├── providers.js              # "use client" — MUI emotion cache, AuthProvider, ToastContainer
│   ├── page.js                   # Home page (Category + Quiz)
│   ├── not-found.js              # 404 Game Over screen
│   ├── quiz/
│   │   └── [id]/
│   │       └── page.js           # SharedQuiz — SSR Server Component
│   ├── login/page.js
│   ├── auth/callback/page.js
│   ├── mypage/page.js
│   ├── my-bookmarks/page.js
│   ├── my-history/page.js
│   ├── my-comments/page.js
│   ├── info/page.js
│   ├── terms/page.js
│   └── privacy/page.js
│
├── src/                          # Existing components and utilities (paths unchanged)
│   ├── components/               # ArcadeButton, TabBar, ArcadeHeader, etc.
│   ├── utils/                    # bookmarkUtils, loginUtils, commentUtils
│   ├── tokens-arcade.js
│   ├── AuthContext.js
│   ├── supabaseConfig.js
│   ├── toastUtils.js
│   ├── shareUtils.js
│   ├── authUtils.js
│   ├── fonts.css
│   ├── App.css                   # Global styles (imported in app/layout.js)
│   ├── index.css                 # Global styles (imported in app/layout.js)
│   └── [all page components]    # Category.js, Quiz.js, SharedQuiz.js, etc.
│
├── public/                       # Unchanged
├── next.config.js                # Redirects, image domains
├── package.json                  # Updated scripts and deps
└── .env.local                    # Unchanged (REACT_APP_* vars work in Next.js client components)
```

---

## Architecture

### Root Layout (`app/layout.js`) — Server Component

Wraps every page. Contains global metadata, font imports, and the shell structure.

```javascript
// Server Component — no "use client"
import { metadata } from './metadata'; // exported separately
import Providers from './providers';
import ArcadeHeader from '@/src/components/ArcadeHeader';
import TabBar from '@/src/components/TabBar';
import '@/src/fonts.css';
import '@/src/index.css';
import '@/src/App.css';

export const metadata = {
  title: { default: 'HIYOUMORE', template: '%s | HIYOUMORE' },
  description: '427개의 한국어 퀴즈를 풀고 친구와 공유해보세요!',
  metadataBase: new URL('https://hiyoumore.xyz'),
  openGraph: { siteName: 'HIYOUMORE', locale: 'ko_KR' },
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

### Providers (`app/providers.js`) — Client Boundary

Isolates all client-only libraries from the server component tree.

```javascript
"use client";
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
        <ToastContainer autoClose={2000} newestOnTop closeOnClick
          pauseOnFocusLoss={false} pauseOnHover draggable theme="dark" />
      </AuthProvider>
    </CacheProvider>
  );
}
```

### Client Pages (standard pattern)

All pages except `/quiz/[id]` follow this pattern — identical to current components, just wrapped:

```javascript
// app/mypage/page.js
"use client";
export { default } from '@/src/Mypage';
```

Or with metadata:
```javascript
// app/terms/page.js
import Terms from '@/src/Terms';

export const metadata = {
  title: '이용약관',
  robots: { index: false },
};

export default function TermsPage() {
  return <Terms />;
}
```

### SSR Quiz Page (`app/quiz/[id]/page.js`) — Server Component

The primary SEO win. Fetches data server-side before sending HTML.

```javascript
// Server Component
import { createClient } from '@supabase/supabase-js';
import SharedQuiz from '@/src/SharedQuiz';

async function fetchQuiz(id) {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );
  const { data } = await supabase
    .from('quizzes')
    .select('*')
    .eq('index', id)
    .single();
  return data;
}

export async function generateMetadata({ params }) {
  const quiz = await fetchQuiz(params.id);
  if (!quiz) return { title: '퀴즈를 찾을 수 없어요' };
  const question = quiz.question?.replace(/<[^>]*>/g, '') ?? '';
  return {
    title: `${question.substring(0, 60)} | HIYOUMORE`,
    description: `"${question.substring(0, 80)}..." - 친구가 보낸 퀴즈를 맞춰보세요!`,
    openGraph: {
      title: '친구가 보낸 퀴즈 | HIYOUMORE',
      description: `"${question.substring(0, 80)}..." - 맞춰보세요!`,
      images: [{ url: '/meta_img.png' }],
      type: 'article',
    },
  };
}

export default async function QuizPage({ params }) {
  const quiz = await fetchQuiz(params.id);
  return <SharedQuiz quizData={quiz} quizId={params.id} />;
}
```

`SharedQuiz.js` will be updated to accept an optional `quizData` prop — if provided (SSR path), skip the Supabase fetch; if not (direct navigation), fetch client-side as before.

### next.config.js

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  redirects: async () => [
    {
      source: '/shared-quiz',
      has: [{ type: 'query', key: 'num', value: '(?<id>.*)' }],
      destination: '/quiz/:id',
      permanent: true,
    },
  ],
  images: {
    domains: [],
  },
};

module.exports = nextConfig;
```

### Environment Variables

Next.js requires `NEXT_PUBLIC_` prefix for client-accessible vars. The existing `REACT_APP_` vars in `.env.local` work in `"use client"` components during the transition but the server-side Supabase client (used in `/quiz/[id]`) needs `NEXT_PUBLIC_` versions.

Add to `.env.local`:
```
NEXT_PUBLIC_SUPABASE_URL=<same value as REACT_APP_SUPABASE_URL>
NEXT_PUBLIC_SUPABASE_ANON_KEY=<same value as REACT_APP_SUPABASE_ANON_KEY>
```

Both old and new var names coexist during migration. After full migration, remove `REACT_APP_` prefixed ones.

### React Router → Next.js Navigation

| CRA (react-router-dom) | Next.js equivalent |
|---|---|
| `useNavigate()` | `useRouter()` from `next/navigation` |
| `useLocation()` | `usePathname()`, `useSearchParams()` from `next/navigation` |
| `<Link to="/path">` | `<Link href="/path">` from `next/link` |
| `navigate('/path')` | `router.push('/path')` |
| `navigate(-1)` | `router.back()` |
| `useParams()` | `params` prop passed from page |

### Components Requiring `"use client"`

Any component using hooks, event handlers, or browser APIs needs `"use client"`:

- `src/components/ArcadeHeader.js` — uses `useNavigate` → add `"use client"`, swap to `useRouter`
- `src/components/TabBar.js` — uses `useLocation` → add `"use client"`, swap to `usePathname`
- `src/components/BookmarkButton.js` — uses state
- `src/components/CommentSection.js` — uses state, effects
- `src/components/BottomSheet.js` — uses state
- All page components (initially all `"use client"` — SSR optimization deferred to Phase 3)

---

## Three-Phase Execution Plan

### Phase 1 — Foundation (2–3 days)
- Create `feat/nextjs` branch
- Scaffold Next.js 15 alongside existing `src/` (no files deleted)
- Set up `app/layout.js` + `app/providers.js`
- Add `@emotion/cache`, configure MUI client boundary
- Add `"use client"` to `ArcadeHeader`, `TabBar` + swap router imports
- Create `next.config.js` with redirect
- Add `NEXT_PUBLIC_` env vars to `.env.local`
- Verify app shell renders at `localhost:3000` with no routes

### Phase 2 — Page Migration (3–4 days)
Port pages in this order (simplest → most complex):
1. `/terms`, `/privacy`, `/info` (static, no auth, no data)
2. `/login`, `/auth/callback` (auth flows)
3. `/mypage`, `/my-bookmarks`, `/my-history`, `/my-comments` (auth-gated)
4. `/` (home — Category + Quiz, complex state)
5. `not-found.js` (404 page)

For each page: create `app/<route>/page.js`, add `metadata` export, swap router imports, verify.

### Phase 3 — SSR + Metadata (1–2 days)
- Convert `/quiz/[id]` to Server Component with `generateMetadata`
- Update `SharedQuiz.js` to accept optional `quizData` prop
- Add per-page `metadata` exports to all pages
- Remove `react-helmet-async` dependency
- Smoke test OG tags with KakaoTalk share debugger

---

## Out of Scope

- PWA / service worker (deferred — add `next-pwa` post-migration)
- React 19 upgrade
- Removing `REACT_APP_` env vars (clean up post-merge)
- Removing old `src/App.js`, `src/index.js` (clean up post-merge)
- Removing `react-snap`, `react-scripts` from package.json (post-merge)

---

## Success Criteria

| Test | Expected |
|---|---|
| `curl https://hiyoumore.xyz/quiz/1` | Returns HTML with quiz question text in `<title>` and OG tags |
| KakaoTalk share of `/quiz/42` | Preview card shows actual question text |
| `https://hiyoumore.xyz/shared-quiz?num=42` | 301 redirects to `/quiz/42` |
| All 11 pages load without console errors | ✅ |
| Lighthouse SEO score | >90 |
| Google Rich Results Test on `/quiz/1` | QAPage schema detected |
