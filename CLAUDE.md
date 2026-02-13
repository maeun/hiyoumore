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
| Auth | Kakao OAuth (Naver disabled - Netlify Functions dependency) |
| PWA | Workbox service worker with offline caching |
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
  Login.js             # Kakao OAuth login button (Naver disabled)
  Mypage.js            # User profile, sign-out (Solana wallet hidden)
  Footer.js + .css     # Navigation with Terms/Privacy links
  Terms.js             # 이용약관 (Terms of Use) legal page
  Privacy.js           # 개인정보처리방침 (Privacy Policy) legal page

  # OAuth Callbacks
  Oauth_Kakao_Callback.js
  Oauth_Naver_Callback.js

  # Shared Utilities
  toastUtils.js        # showToast(), showErrorToast()
  shareUtils.js        # handleShare() — navigator.share + clipboard fallback
  authUtils.js         # saveLoginTime(), saveLogoutTime() with KST conversion

  # PWA / Service Worker
  service-worker.js            # Workbox SW with Firebase/image caching
  serviceWorkerRegistration.js # SW registration logic

functions/               # Netlify serverless functions (Naver OAuth - not used on Vercel)
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
1. User clicks Kakao login button on `Login.js` (Naver currently disabled)
2. Redirected to OAuth provider, then back to `/oauth/kakao/callback`
3. Callback component exchanges code for token, stores in `AuthContext` (sessionStorage)
4. Login/logout times are logged to Firebase via `authUtils.js`

### PWA / Offline Capabilities
1. Service worker registered in `index.js` via `serviceWorkerRegistration.register()`
2. **Precaching**: Static assets (JS, CSS, images) cached on install
3. **Runtime caching strategies**:
   - Firebase Realtime DB: StaleWhileRevalidate (show cached, update in background)
   - Images: CacheFirst with 30-day expiration, max 60 entries
4. Users can browse previously viewed quizzes offline

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

### Button Design System
- **Share buttons**: Pink gradient (`#FF9999` → `#FFB6C1`) with soft glow shadow
  - Hover: Lifts 2px up with stronger shadow
  - Active: Presses down with lighter shadow
  - Icon-first layout (ShareIcon before text)
- **Secondary buttons**: Purple gradient (`#594b73` → `#6b5c8a`) matching brand
- **Mobile-friendly**: 44px min-height for easy tapping
- **Smooth animations**: 0.3s transitions on all interactive states

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
- `SharedQuiz.js` sets **dynamic OG tags** with quiz question preview
- Each shared quiz has a unique URL (`/shared-quiz?num=<id>`) — crawlable and shareable
- OG description format: `"[Quiz question preview...] - 친구가 보낸 퀴즈를 맞춰보세요!"`
- Better engagement on KakaoTalk/Naver shares with contextual preview

### Recent SEO Improvements
- ✅ Updated `index.html` OG URLs from Netlify to Vercel
- ✅ Dynamic OG descriptions for shared quizzes (shows question text)
- ✅ Added Terms (`/terms`) and Privacy (`/privacy`) pages with noindex
- ✅ Google Analytics (gtag.js) configured with G-4RYP120Y6E

### Areas for Future Improvement
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

### Important: Naver OAuth Status
The Naver OAuth flow **depends on Netlify Functions** (`functions/naverAuth.js`, `naverGetUserInfo.js`, `naverSignOut.js`) which don't work on Vercel. Therefore:
- ✅ **Kakao OAuth**: Fully functional (client-side only, no serverless needed)
- ❌ **Naver OAuth**: Currently disabled (commented out in Login.js, Footer.js, App.js)
- 🔄 **To re-enable Naver**: Migrate Netlify Functions to Vercel Serverless Functions (`/api/` directory)

## Expandability Considerations

### Content Management
- Quiz categories are data-driven via `CATEGORY_MAP` in `Category.js` — adding a new category requires only a DB field and one map entry
- Quiz data schema: `{ que, ans, index, my_pick, eng, animal, king, plant, food, english, religion }` — category fields are binary (0/1)
- **Easy to expand**: Just add new field to Firebase + one entry in `CATEGORY_MAP`

### Community Features (Future Potential)
**Phase 1: Comments System** (Recommended first step)
- Add Firebase collection: `quiz_comments` with quiz_index, user_id, comment, timestamp, likes
- Create `CommentSection.js` component (reusable across Quiz.js and SharedQuiz.js)
- UI: 💬 button on quiz cards → bottom sheet modal (mobile-first)
- Benefits: User engagement, retention, content discovery
- **Effort**: ~1-2 days implementation

**Phase 2: Leaderboard** (Gamification)
- Track quiz completion count per user
- Weekly/monthly leaderboards with top solvers
- Benefits: Competitive motivation, daily return visits
- **Effort**: ~2-3 days (needs quiz completion tracking)

**Phase 3: User-Generated Quizzes** (Content scaling)
- Allow users to submit quizzes (with moderation queue)
- Community voting on quiz quality
- Best quizzes promoted to "Today's Picks"
- Benefits: Infinite content, community ownership
- **Effort**: ~1 week (needs moderation system)

### Feature Expansion Opportunities
- **Difficulty levels**: DB field exists (`"🎖️ 난이도 상"` commented out) — ready to enable
- **PWA installability**: ✅ Already implemented with service worker
- **i18n**: Currently Korean-only; all UI strings hardcoded — could add English/Japanese
- **Wallet integration**: Solana wallet field exists in Mypage (currently hidden) — ready for Web3 features
- **Blockchain rewards**: Could reward quiz creators/solvers with tokens (requires wallet re-enable)

### Technical Improvements Needed
- Pre-existing eslint warnings (useEffect dependencies, unused vars) — suppressed via `CI=false`
- MUI Joy + MUI Material mixed usage (ideally pick one for consistency)
- OAuth client IDs hardcoded in source (should use environment variables)
- `functions/` directory is Netlify-specific — needs Vercel migration for Naver OAuth
- Some `console.log` debug statements remain in production code
- No error boundary components (app crashes on unhandled errors)
- No analytics events tracking (only pageviews via Google Analytics)

## Recent Improvements (2025-02-13)

### Legal & Compliance
- ✅ Added Terms of Use (`/terms`) and Privacy Policy (`/privacy`) pages in Korean
- ✅ Footer navigation updated with legal links between Login and Contact
- ✅ Privacy policy covers Kakao OAuth data collection (Naver disabled)

### PWA & Performance
- ✅ Implemented service worker with Workbox for offline caching
- ✅ Firebase Realtime DB cached with StaleWhileRevalidate strategy
- ✅ Images cached with CacheFirst (30-day expiration, max 60 entries)
- ✅ Bundle size reduced by 24KB with improved share button implementation

### UI/UX Enhancements
- ✅ Redesigned share buttons with gradient backgrounds and animations
  - Pink gradient with soft glow for primary share button
  - Purple gradient for secondary "more quizzes" button
  - Hover lift effect + active press state
  - Icon-first layout for better visual hierarchy
- ✅ Dynamic OG tags for shared quizzes (shows question preview in social shares)
- ✅ Mobile-friendly tap targets (44px min-height)
- ✅ Updated footer to single-row navigation with flex-wrap for mobile

### Technical Updates
- ✅ Updated all OG URLs from Netlify to Vercel domain
- ✅ Disabled Naver OAuth (commented out, awaiting Vercel Functions migration)
- ✅ Hidden Solana wallet field in Mypage (future Web3 feature)
- ✅ Git author updated to `hess.kpark@gmail.com` for Vercel deployment

## Coding Conventions

- **React**: Function components only, hooks for state
- **Imports**: React/libraries first, then local modules, then CSS
- **Styling**: Prefer `styled()` for reusable components; CSS files for layout/global
- **Utilities**: Shared logic extracted to `*Utils.js` files (toast, share, auth)
- **State management**: React Context (`AuthContext`) — no Redux
- **Naming**: Components in PascalCase files, utilities in camelCase files
- **Firebase**: Direct SDK usage (no abstraction layer)

## Design Philosophy

### Minimalist Korean Aesthetic
- **Color palette**: Muted purple (`#594b73`) as primary, soft pastels for accents
- **Typography**: Custom Korean fonts (Binggrae, Maplestory) for warmth and friendliness
- **Spacing**: Generous whitespace, mobile-first 500px max-width container
- **Interactions**: Delightful micro-animations (card flips, button lifts) without being distracting

### Mobile-First Principles
1. **Touch targets**: Minimum 44px height for all interactive elements
2. **Horizontal scrolling**: Category chips scroll naturally without visible scrollbar
3. **Single-column layout**: All content stacks vertically for mobile readability
4. **Native sharing**: Uses `navigator.share()` API for seamless KakaoTalk sharing

### Performance & UX Trade-offs
- **PWA caching**: Aggressive caching for speed, but users may see stale quizzes (acceptable for viral content)
- **No authentication required**: Frictionless onboarding, but no personalization without login
- **Client-side routing**: Fast navigation, but requires server redirects for deep links
- **Gradient buttons**: Slightly larger bundle size for premium feel (worth it for conversion)

### Accessibility Considerations
- **Color contrast**: All text meets WCAG AA standards (purple on white, white on purple)
- **Font loading**: `font-display: swap` prevents invisible text
- **Semantic HTML**: Proper heading hierarchy, `<nav>` for navigation
- **Focus states**: Visible focus outlines on all interactive elements (via browser defaults)
- **Language**: `lang="ko"` attribute for screen readers

### Areas for Accessibility Improvement
- No ARIA labels on interactive elements (buttons, links)
- No keyboard navigation for category scrolling
- Card flip animation may cause motion sickness (no `prefers-reduced-motion` support)
- No alt text on some decorative images
