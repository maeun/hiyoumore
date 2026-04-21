# SEO + GEO Improvement Design — HIYOUMORE
**Date:** 2026-04-21  
**Status:** Approved  
**Scope:** React SPA on Vercel, hiyoumore.xyz

---

## Goal

Improve discoverability of HIYOUMORE through two parallel tracks:

- **SEO**: Make the app visible to Google/Naver search bots that currently see near-empty HTML from the React SPA
- **GEO (Generative Engine Optimization)**: Make the app citable and recommendable by AI engines (Perplexity, ChatGPT, Google AI Overviews)

Target audience: Korean mobile users (18–35) via both tracks equally. AI-readable content in both Korean and English for maximum coverage.

---

## Architecture Overview

Five independent work areas, each deployable on its own:

| Area | Files | Primary Benefit |
|---|---|---|
| A. Pre-rendering | `package.json`, `src/index.js` | Bots see real HTML instead of empty `<div id="root">` |
| B. sitemap.xml | `scripts/generate-sitemap.js`, `package.json` | Crawlers discover all static + quiz pages |
| C. llms.txt | `public/llms.txt` | AI engines understand and cite the app |
| D. JSON-LD | `public/index.html`, `src/SharedQuiz.js`, `src/Category.js` | Structured content for Google AI Overviews, Perplexity |
| E. Meta polish | `public/manifest.json`, `public/robots.txt`, per-page Helmets | Brand consistency + crawler signals |

---

## Area A — Static Pre-rendering (react-snap)

### Problem
React SPA ships `<div id="root"></div>` to bots. Search crawlers and AI crawlers receive no meaningful content before JavaScript runs.

### Solution
Install `react-snap` as a postbuild step. It uses headless Chromium to crawl the built app and saves static HTML snapshots alongside the JS bundle. Vercel serves the snapshot to bots; real users still get the full React SPA.

### Pre-rendered Routes
```
/               (home / category page)
/login
/terms
/privacy
/info
/mypage
/my-bookmarks
/my-history
/my-comments
```

### Exclusions
- `/shared-quiz?num=X` — query-param pages are impractical to pre-render (427 quizzes). These receive JSON-LD via client-side react-helmet, which Google indexes via JavaScript rendering. Social sharing OG tags already work via react-helmet.
- `/auth/callback` — OAuth flow, must not be pre-rendered.

### package.json Changes
```json
"scripts": {
  "postbuild": "react-snap"
},
"reactSnap": {
  "inlineCss": true,
  "puppeteerArgs": ["--no-sandbox", "--disable-setuid-sandbox"],
  "skipThirdPartyRequests": true,
  "crawl": true,
  "include": [
    "/", "/login", "/terms", "/privacy",
    "/info", "/mypage", "/my-bookmarks",
    "/my-history", "/my-comments"
  ]
}
```

### src/index.js Change
Swap `ReactDOM.render` → `ReactDOM.hydrate` so react-snap snapshots hydrate correctly on the client.

```javascript
// Detect react-snap pre-render vs real browser
const rootElement = document.getElementById("root");
if (rootElement.hasChildNodes()) {
  ReactDOM.hydrate(<App />, rootElement);
} else {
  ReactDOM.render(<App />, rootElement);
}
```

---

## Area B — sitemap.xml

### Problem
No sitemap exists. Search engines and AI crawlers must discover pages by following links, missing many routes.

### Solution
A Node.js build script queries Supabase for all quiz `index` values, then writes `public/sitemap.xml`. Runs as `prebuild` in package.json so Vercel always deploys a fresh sitemap.

### Script: `scripts/generate-sitemap.js`
```
- Reads REACT_APP_SUPABASE_URL and REACT_APP_SUPABASE_ANON_KEY from .env.local
- Queries: SELECT index FROM quizzes ORDER BY index
- Writes public/sitemap.xml with:
    Static routes (priority 1.0 for /, 0.8 for others, weekly changefreq)
    /shared-quiz?num=X for each quiz index (priority 0.6, monthly changefreq)
    <lastmod> set to current build date (ISO 8601)
```

### Static Routes in Sitemap
```
https://hiyoumore.xyz/              priority=1.0
https://hiyoumore.xyz/terms         priority=0.5
https://hiyoumore.xyz/privacy       priority=0.5
https://hiyoumore.xyz/info          priority=0.6
```

Routes behind auth (`/mypage`, `/my-bookmarks`, `/my-history`, `/my-comments`) are excluded — they are `noindex` and irrelevant for public crawling.

### package.json
```json
"scripts": {
  "prebuild": "node scripts/generate-sitemap.js",
  "postbuild": "react-snap"
}
```

---

## Area C — llms.txt

### What is llms.txt?
A plain-text file at the root of a domain that AI engines (Perplexity, ChatGPT plugins, Google AI Overviews) read to understand a site's purpose, content, and structure. Analogous to `robots.txt` but for AI comprehension rather than crawl control.

### File: `public/llms.txt`

```
# HIYOUMORE

> A Korean quiz sharing app with a Neo-Kawaii Arcade aesthetic.
> 아케이드 감성의 한국어 퀴즈 공유 앱.

## What is HIYOUMORE?

HIYOUMORE is a free Korean trivia quiz app where users browse categorized 
quiz cards, flip them to reveal answers, and share individual quizzes with 
friends via KakaoTalk or any mobile share sheet. No login is required to 
play. The experience is designed around instant gratification — tap a card, 
see confetti, share the challenge.

## HIYOUMORE란?

HIYOUMORE는 무료 한국어 퀴즈 공유 앱입니다. 카테고리별 퀴즈 카드를 탐색하고, 
카드를 뒤집어 정답을 확인한 뒤, 카카오톡이나 모바일 공유 기능으로 친구에게 
퀴즈를 보낼 수 있습니다. 로그인 없이도 플레이 가능합니다.

## Quiz Categories / 퀴즈 카테고리

- Maker's Pick / 에디터 추천 (curated selection)
- 이과 / Science & Engineering
- 동물 / Animals
- 왕 / Kings & History
- 식물 / Plants
- 음식 / Food
- 영어 / English Language
- 종교 / Religion

## How Sharing Works / 공유 방법

Each quiz card has a unique URL (/shared-quiz?num=<id>). Tapping the Share 
button invokes the native mobile share sheet (navigator.share) with a direct 
link. Recipients land on a "Friend Challenge" page showing the same quiz card.

친구와 공유하면 상대방은 "Friend Challenge" 페이지에서 같은 퀴즈를 풀어볼 수 
있습니다. 각 퀴즈는 고유 URL을 가집니다.

## Key Facts / 주요 정보

- URL: https://hiyoumore.xyz
- Language: Korean (한국어)
- Quiz count: 427 curated trivia questions
- Login: Optional (Kakao OAuth) — required only for bookmarks and comments
- Platform: Progressive Web App (PWA), installable on iOS and Android
- Cost: Free / 무료
- Developer: we.select.studio@gmail.com

## Optional features (login required) / 로그인 시 추가 기능

- Bookmark quizzes / 퀴즈 북마크
- View quiz history / 퀴즈 기록 확인
- Leave comments on quizzes / 댓글 작성
```

---

## Area D — JSON-LD Structured Data

### Schema 1: WebApplication — `public/index.html`

Added as a `<script type="application/ld+json">` in `<head>`. Applies globally.

```json
{
  "@context": "https://schema.org",
  "@type": "WebApplication",
  "name": "HIYOUMORE",
  "alternateName": "하이유모어",
  "url": "https://hiyoumore.xyz",
  "description": "Korean trivia quiz sharing app. Browse, flip, and share quiz cards with friends via KakaoTalk.",
  "applicationCategory": "Game",
  "operatingSystem": "Web, iOS, Android",
  "inLanguage": ["ko", "en"],
  "isAccessibleForFree": true,
  "offers": {
    "@type": "Offer",
    "price": "0",
    "priceCurrency": "KRW"
  },
  "author": {
    "@type": "Organization",
    "name": "We Select Studio",
    "email": "we.select.studio@gmail.com"
  }
}
```

### Schema 2: QAPage — `src/SharedQuiz.js`

Added dynamically via `<Helmet>` once quiz data is loaded. This is the highest-value schema — Google AI Overviews and Perplexity actively surface Q&A pages.

```json
{
  "@context": "https://schema.org",
  "@type": "QAPage",
  "name": "[Quiz question preview] | HIYOUMORE",
  "url": "https://hiyoumore.xyz/shared-quiz?num=[id]",
  "mainEntity": {
    "@type": "Question",
    "name": "[Full question text, HTML-stripped]",
    "text": "[Full question text, HTML-stripped]",
    "acceptedAnswer": {
      "@type": "Answer",
      "text": "[Full answer text, HTML-stripped]",
      "url": "https://hiyoumore.xyz/shared-quiz?num=[id]"
    }
  }
}
```

### Schema 3: ItemList — `src/Category.js`

Added once on the home/category page via `<Helmet>`. Lists all quiz categories.

```json
{
  "@context": "https://schema.org",
  "@type": "ItemList",
  "name": "HIYOUMORE Quiz Categories",
  "description": "Korean trivia quiz categories available on HIYOUMORE",
  "itemListElement": [
    { "@type": "ListItem", "position": 1, "name": "Maker's Pick" },
    { "@type": "ListItem", "position": 2, "name": "이과 (Science)" },
    ...
  ]
}
```

---

## Area E — Meta Polish

### manifest.json Fixes
```json
{
  "short_name": "HIYOUMORE",
  "name": "HIYOUMORE — 퀴즈 공유 앱",
  "description": "친구에게 퀴즈를 보내보세요! 아케이드 감성의 한국어 퀴즈 앱.",
  "lang": "ko",
  "start_url": "/",
  "display": "standalone",
  "theme_color": "#FF2E97",
  "background_color": "#0A0A0F"
}
```
Note: `theme_color` updated to neon pink (`#FF2E97`) to match brand identity.

### robots.txt Additions
```
User-agent: *
Disallow: /mypage
Disallow: /my-bookmarks
Disallow: /my-history
Disallow: /my-comments
Disallow: /auth/callback

# Allow AI crawlers explicitly
User-agent: GPTBot
Allow: /

User-agent: PerplexityBot
Allow: /

User-agent: Claude-Web
Allow: /

User-agent: Googlebot
Allow: /

Sitemap: https://hiyoumore.xyz/sitemap.xml
```

### Per-page Helmet Audit
Pages missing unique `<title>` + `<meta name="description">` that need them added:

| Page | Title | Description |
|---|---|---|
| `/` (Category) | `HIYOUMORE — 오늘의 퀴즈` | `427개의 한국어 퀴즈를 풀고 친구와 공유해보세요!` |
| `/info` | `정보 | HIYOUMORE` | `이용약관 및 개인정보처리방침` |
| `/login` | `로그인 | HIYOUMORE` | (noindex, less critical) |

---

## Out of Scope

- Next.js migration
- Vercel Edge Middleware bot detection
- Naver Search Advisor submission (manual step, documented in implementation plan)
- Google Search Console submission (manual step)
- Actual quiz content translation to English (content is Korean, schema descriptions are bilingual)

---

## Success Metrics

| Metric | Tool | Target |
|---|---|---|
| Google indexing of `/shared-quiz` pages | Google Search Console | >50 pages indexed within 4 weeks |
| AI citation | Search "hiyoumore 퀴즈" on Perplexity | App appears in results |
| Lighthouse SEO score | Chrome DevTools | >90 (currently ~60) |
| Structured data validity | Google Rich Results Test | 0 errors on QAPage schema |
