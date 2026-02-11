# CLAUDE.md - HiYouMore Project Reference

## Project Concept

**HiYouMore** (하이유모어) is a Korean quiz-sharing web app. Users browse categorized trivia quizzes (3 cards per view), flip cards to reveal answers, and share individual quizzes with friends via mobile share or clipboard. The core loop is: **discover → solve → share → invite**.

- **Target audience**: Korean mobile users (KakaoTalk, Naver ecosystem)
- **Core value**: Lightweight, instant quiz fun with zero friction — no signup required to play
- **Monetization**: None currently; social virality is the growth mechanism
- **Content**: Quiz data lives in Firebase Realtime DB, managed externally (CSV/JSON in `etc/`)

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, React Router v6 |
| UI Library | MUI Joy UI + MUI Material (mixed) |
| Styling | `styled()` from `@mui/system`, CSS files, CSS variables |
| Design Tokens | `src/tokens.js` (colors, shadows, borderRadius, spacing, fonts) |
| Database | Firebase Realtime Database (3 separate DBs: qa, sign_up, log_in_out) |
| Auth | Kakao OAuth + Naver OAuth (social login only) |
| Serverless | Netlify Functions (`functions/`) for Naver OAuth proxy |
| Deployment | Vercel (primary), previously Netlify |
| Security | DOMPurify for XSS sanitization on quiz content |

## Architecture

### Directory Structure
```
src/
  App.js              # Router, layout, state lifting for selectedQuestions
  AuthContext.js       # Auth state (sessionStorage persistence)
  firebaseConfig.js   # 3 Firebase DB instances (qa, sign_up, log_in_out)
  tokens.js           # Centralized design tokens
  fonts.css            # All @font-face + Google Fonts import

  # Pages / Features
  Header.js + .css     # Sticky header with logo, navigates to home
  Category.js + .css   # Horizontal scrollable category chips
  Quiz.js + .css       # 3 flip cards (front=question, back=answer+share)
  SharedQuiz.js + .css # Single shared quiz card via URL param
  Login.js             # Kakao + Naver OAuth login buttons
  Mypage.js            # User profile, sign-out
  Footer.js + .css     # Logout, nav links, copyright

  # OAuth Callbacks
  Oauth_Kakao_Callback.js
  Oauth_Naver_Callback.js

  # Shared Utilities
  toastUtils.js        # showToast(), showErrorToast()
  shareUtils.js        # handleShare() — navigator.share + clipboard fallback
  authUtils.js         # saveLoginTime(), saveLogoutTime() with KST conversion

functions/               # Netlify serverless functions (Naver OAuth proxy)
  naverAuth.js
  naverGetUserInfo.js
  naverSignOut.js
  kakaoAuth.js
```

### Data Flow
1. `Category.js` fetches quizzes from Firebase by category field (e.g., `orderByChild("animal"), equalTo(1)`)
2. "Today's" uses a deterministic seed (date-based LCG) — same 3 quizzes all day
3. Other categories shuffle and pick 3 random quizzes
4. `Quiz.js` receives `selectedQuestions` via props, renders flip cards
5. Share button generates a URL with `?num=<quiz_index>` and invokes `shareUtils.handleShare()`
6. `SharedQuiz.js` reads `num` from URL, fetches that specific quiz from Firebase

### Auth Flow
1. User clicks Kakao/Naver login button on `Login.js`
2. Redirected to OAuth provider, then back to `/oauth/{platform}/callback`
3. Callback component exchanges code for token, stores in `AuthContext` (sessionStorage)
4. Login/logout times are logged to Firebase via `authUtils.js`

## UI/UX Design Principles

### Mobile-First
- **Max width**: 500px container (`.Main`), centered on desktop with shadow
- **Desktop**: Purple/blue gradient background visible around the app container
- All interactions designed for touch (tap to flip, horizontal swipe for categories)

### Visual Identity
- **Primary color**: `#594b73` (muted purple) — used in header, links, accents
- **Card front**: Light background (`#f2f4fb`), subtle shadow
- **Card back**: Darker tone (`#dae1ee`), stronger shadow — visual reward for flipping
- **Header**: Gradient purple (`#594b73` → `#6b5c8a`), sticky, white text
- **Body background**: Gradient (`#e8e0f0` → `#d5dce8` → `#e0e8f0`) for desktop depth

### Typography
- **Header**: BinggraeSamanco-Bold (Korean decorative font)
- **Quiz cards**: Maplestory_Light (friendly, casual)
- **Shared quiz**: Binggrae (warm, rounded)
- **Category chips**: Noto Sans KR (clean, readable)
- **System text**: System font stack
- All custom fonts use `font-display: swap` for performance

### Interaction Patterns
- **Quiz cards flip vertically** via `react-card-flip`
- **"탭하여 정답 보기"** (tap to see answer) hint on front of cards
- **Category chips**: Horizontal scroll with hidden scrollbar, fade edge indicators (CSS `::before`/`::after`)
- **Toast notifications**: Top-center, 900ms auto-close, light theme (via `toastUtils.js`)
- **Share**: `navigator.share()` on mobile, clipboard copy with toast feedback on desktop
- **Loading states**: Skeleton placeholders for quiz cards, CircularProgress for OAuth callbacks

### Component Styling Approach
- `styled()` from `@mui/system` for component-level styles (StyledCard, ShareButton)
- CSS files for layout, global styles, scrollbar hiding, pseudo-elements
- `--bg-color` CSS variable for consistent background across components
- `tokens.js` for shared design values — prevents magic numbers in styled components

## SEO & Social Sharing

### Current State
- `<html lang="ko">` for Korean language targeting
- `react-helmet-async` for per-page `<title>` and `<meta>` tags
- Open Graph and Twitter Card meta tags in `index.html`
- `<meta name="robots" content="noindex" />` on Login, Mypage, OAuth callbacks
- `meta_img.png` for social preview image
- `manifest.json` with Korean app name for PWA/installability

### Shared Quiz SEO
- `SharedQuiz.js` sets custom OG tags: "친구가 보낸 퀴즈 | 하이유모어"
- Each shared quiz has a unique URL (`/shared-quiz?num=<id>`) — crawlable and shareable

### Areas for Improvement
- `index.html` still references `hiyoumore.netlify.app` in OG URL and canonical link — should be updated to Vercel
- No structured data (JSON-LD) for quiz content
- No sitemap.xml or robots.txt customization beyond defaults
- SPA routing requires server-side redirect config for Vercel (currently only Netlify `_redirects`)

## Deployment

### Vercel (Current)
- GitHub repo: `hess-ky/hiyoumore`
- Git author: `hess.kpark <hess.kpark@gmail.com>`
- `CI=false` in `.env` and `package.json` build script to prevent eslint warnings from blocking builds
- Homepage: `https://hiyoumore.vercel.app/`

### Netlify (Previous)
- `netlify.toml` and `functions/` directory still present
- Naver OAuth uses Netlify Functions as a proxy (CORS workaround)
- `_redirects` file handles SPA routing

### Important: Netlify Functions Dependency
The Naver OAuth flow **depends on Netlify Functions** (`functions/naverAuth.js`, `naverGetUserInfo.js`, `naverSignOut.js`). These won't work on Vercel without migration to Vercel Serverless Functions (`/api/` directory). Kakao OAuth works client-side only (no serverless dependency).

## Expandability Considerations

### Content
- Quiz categories are data-driven via `CATEGORY_MAP` in `Category.js` — adding a new category requires only a DB field and one map entry
- Quiz data schema: `{ que, ans, index, my_pick, eng, animal, king, plant, food, english, religion }` — category fields are binary (0/1)

### Features (Potential)
- **User-generated quizzes**: Requires new Firebase collection + create/edit UI
- **Score tracking / leaderboard**: Needs per-user quiz result storage
- **Difficulty levels**: DB field exists (`"🎖️ 난이도 상"` is commented out in category list)
- **PWA offline**: manifest.json exists but no service worker is registered
- **i18n**: Currently Korean-only; all UI strings are hardcoded

### Technical Debt
- Pre-existing eslint warnings (useEffect dependencies, unused vars) — suppressed via `CI=false`
- MUI Joy + MUI Material mixed usage (ideally pick one)
- OAuth client IDs hardcoded in source (should use environment variables)
- `functions/` directory is Netlify-specific — needs Vercel migration for Naver OAuth
- Some `console.log` debug statements remain in production code

## Coding Conventions

- **React**: Function components only, hooks for state
- **Imports**: React/libraries first, then local modules, then CSS
- **Styling**: Prefer `styled()` for reusable components; CSS files for layout/global
- **Utilities**: Shared logic extracted to `*Utils.js` files (toast, share, auth)
- **State management**: React Context (`AuthContext`) — no Redux
- **Naming**: Components in PascalCase files, utilities in camelCase files
- **Firebase**: Direct SDK usage (no abstraction layer)
