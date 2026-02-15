# Testing Guide - Neo-Kawaii Arcade Redesign

**Complete testing checklist for local verification**

---

## 🚀 Quick Start

```bash
# Install dependencies (if needed)
npm install

# Start development server
npm start

# Open browser
# http://localhost:3000
```

---

## ✅ Testing Checklist

### 1. Home Page (`/`)

**Visual:**
- [ ] Tron grid background visible (animated pink grid)
- [ ] ArcadeHeader shows at top (70px, black, neon pink logo)
- [ ] TabBar shows at bottom (80px, centered 500px width)
- [ ] Category chips are arcade-styled (32px height, chunky borders)
- [ ] Selected category has purple background + deep shadow
- [ ] Refresh icon shows next to selected category
- [ ] Quiz cards have white front, blue back

**Interactions:**
- [ ] Click category chip → loads 3 new quizzes
- [ ] Click quiz card front → instantly reveals answer (no animation)
- [ ] Confetti shows when flipping to answer
- [ ] All 4 buttons on card back are uniform size (110px × 36px)
- [ ] Share button works (mobile share or clipboard copy)
- [ ] Comments button opens arcade BottomSheet
- [ ] Bookmark button toggles (yellow star when active)
- [ ] Page scrolls smoothly (no visible scrollbar)

**Spacing:**
- [ ] Last quiz card not hidden by TabBar
- [ ] Category chips not cut off at bottom
- [ ] No horizontal scroll

---

### 2. Shared Quiz (`/shared-quiz?num=1`)

**Visual:**
- [ ] Yellow challenge banner shows "⚔️ FRIEND CHALLENGE! ⚔️"
- [ ] Card is larger than home page cards (280-360px height)
- [ ] Bookmark button floats in top-right corner
- [ ] Confetti shows on answer reveal

**Interactions:**
- [ ] Click card → instantly flips to answer
- [ ] Confetti explosion on flip
- [ ] SHARE button works (primary pink, mega size)
- [ ] COMMENTS button opens BottomSheet
- [ ] INSERT COIN button navigates to home
- [ ] Bookmark button toggles successfully

**Edge Cases:**
- [ ] Invalid quiz number shows error
- [ ] Missing quiz number shows error
- [ ] URL works when shared

---

### 3. Login Page (`/login`)

**Visual:**
- [ ] Black background with Tron grid animation (cyan/purple)
- [ ] "INSERT COIN" text in neon pink with pulse animation
- [ ] Coin slot machine decoration (purple box with coin icon)
- [ ] Blinking arrow (⬇️) points to button
- [ ] Yellow Kakao button (60px height, chunky border)

**Interactions:**
- [ ] Hover Kakao button → lifts -4px, brighter yellow
- [ ] Active press → drops +2px
- [ ] Click button → redirects to Kakao OAuth

---

### 4. Mypage (`/mypage`)

**Visual:**
- [ ] Black profile header with neon pink border
- [ ] Profile avatar has pink frame with pixel shadow
- [ ] Player name in neon cyan with glow
- [ ] "ACHIEVEMENTS" title in purple pixel font
- [ ] 3-column stats grid (봤던 퀴즈, 북마크, 댓글)
- [ ] Animated counters count up from 0
- [ ] "VIEW COLLECTION" button (pink, mega size)
- [ ] Red logout button with visible background

**Interactions:**
- [ ] Click stat cards → navigate to collection pages
- [ ] Numbers animate on load
- [ ] VIEW COLLECTION button works
- [ ] Logout button shows confirmation → logs out

**Spacing:**
- [ ] Nothing hidden at bottom
- [ ] Right side not clipped
- [ ] Cards not overflowing container

---

### 5. MyBookmarks (`/my-bookmarks`)

**Visual:**
- [ ] Black header with "⭐ MY COLLECTION" in neon pink
- [ ] Trading card grid (2-col mobile, 3-col tablet/desktop)
- [ ] White cards with purple borders
- [ ] Purple category badges in top-left
- [ ] Red X delete buttons in top-right
- [ ] Question preview centered, 3-line clamp

**Interactions:**
- [ ] Hover card → lifts -6px, border turns pink
- [ ] Active press → drops +2px
- [ ] Click card → navigates to shared quiz
- [ ] Hover delete button → rotates 90°, scales 1.2x
- [ ] Click delete → shows confirmation → removes card
- [ ] Empty state shows sad face + message

**Responsive:**
- [ ] Mobile (375px): 2 columns
- [ ] Tablet (768px): 3 columns
- [ ] Cards maintain aspect ratio

---

### 6. MyHistory (`/my-history`)

**Visual:**
- [ ] Black header with "👁️ QUIZ HISTORY" in neon cyan
- [ ] Same grid layout as bookmarks
- [ ] Cyan category badges (instead of purple)
- [ ] Border turns cyan on hover (instead of pink)

**Interactions:**
- [ ] All interactions same as MyBookmarks
- [ ] Delete removes from history (calls deleteFlipHistory)

---

### 7. MyComments (`/my-comments`)

**Visual:**
- [ ] Black header with "💬 COMMENTS HISTORY" in arcade yellow
- [ ] Same grid layout
- [ ] Pink likes badge with heart icon (if likes > 0)
- [ ] Comment text preview (3-line clamp)
- [ ] Quiz hint below comment ("퀴즈: ...")

**Interactions:**
- [ ] Click card → navigates to quiz
- [ ] Delete removes comment
- [ ] LOAD MORE button appears if hasMore (purple, arcade style)
- [ ] Load more works correctly

---

### 8. Comments BottomSheet (Quiz/SharedQuiz)

**Open from any quiz card:**

**Visual:**
- [ ] Midnight blue background
- [ ] Neon pink thick border on top
- [ ] Black header with pink title
- [ ] Red X button in top-right
- [ ] Deep black backdrop with blur

**Input Area (logged in):**
- [ ] Black textarea with purple border
- [ ] Border turns pink on focus
- [ ] Character counter shows (green normally, orange when over 500)
- [ ] Pink "POST COMMENT" button

**Comment List:**
- [ ] Black bubbles with purple borders
- [ ] Cyan avatar frames
- [ ] Neon cyan nicknames with glow
- [ ] Gray timestamps in pixel font
- [ ] Pink like button with pill border when active
- [ ] Red delete button (only on own comments, rotates on hover)

**Interactions:**
- [ ] Type in textarea → counter updates
- [ ] Submit comment → adds to list, clears input, shows toast
- [ ] Click like → toggles, count updates
- [ ] Click delete → confirmation → removes
- [ ] Click backdrop → closes sheet
- [ ] Click X button → closes sheet
- [ ] Scroll works (hidden scrollbar)

**Login Prompt (not logged in):**
- [ ] Black box with cyan border
- [ ] Cyan text with glow
- [ ] Yellow Kakao button

---

### 9. Toast Notifications

**Trigger various actions to see toasts:**

**Visual:**
- [ ] Bottom-center position (above TabBar at ~100px)
- [ ] Black background
- [ ] Colored borders (green/pink/orange)
- [ ] Pixel font, uppercase
- [ ] Colored glow effect
- [ ] Progress bar (gradient for success/info, solid for error)

**Types:**
- [ ] **Success** (showToast): Green border/text
  - Bookmark added/removed
  - Comment posted
  - Logout success
- [ ] **Error** (showErrorToast): Orange border/text
  - Comment too long
  - Delete failed
  - Login failed
- [ ] **Info** (showInfoToast): Pink border/text
  - General messages

**Behavior:**
- [ ] Auto-closes after 1.5s
- [ ] Slides up from bottom
- [ ] Click to dismiss
- [ ] Multiple toasts stack

---

### 10. Terms (`/terms`)

**Visual:**
- [ ] Black background
- [ ] Bright green text (#00FF00)
- [ ] Courier New monospaced font
- [ ] CRT scanline overlay (horizontal lines)
- [ ] Screen glow (radial gradient)
- [ ] "SYSTEM INFORMATION: 이용약관" with blinking cursor
- [ ] Section titles with "> " prefix
- [ ] Content with "• " bullets
- [ ] "PRESS ESC TO EXIT" footer (blinking)

**Interactions:**
- [ ] Press ESC → goes back
- [ ] Scrolls smoothly (no scrollbar visible)
- [ ] Footer stays at bottom

---

### 11. Privacy (`/privacy`)

**Same as Terms, plus:**
- [ ] "SECURE TERMINAL MODE" subtitle
- [ ] Bulleted lists with "- " prefix
- [ ] Kakao link formatted as `[카카오톡 오픈채팅 문의]`
- [ ] Link hover → opacity 0.7
- [ ] Link click → opens in new tab

---

### 12. 404 NotFound (`/invalid-route`)

**Visual:**
- [ ] Black background with Tron grid (pink)
- [ ] "GAME OVER" title in orange (pulse animation)
- [ ] Giant "404" in neon pink
- [ ] "PAGE NOT FOUND" message in cyan
- [ ] Korean subtitle
- [ ] Yellow pixel divider with triangle
- [ ] "INSERT COIN TO CONTINUE" (blinking)
- [ ] HOME button (pink, mega)
- [ ] GO BACK button (purple, large)
- [ ] Countdown timer in yellow

**Interactions:**
- [ ] Countdown starts at 10
- [ ] Countdown decrements every second
- [ ] Auto-redirects to home at 0
- [ ] HOME button → goes to home immediately
- [ ] GO BACK button → goes to previous page
- [ ] ESC key → goes back

**Test URLs:**
- `/asdfasdf`
- `/nonexistent-page`
- `/quiz/999999`

---

## 🎨 Visual Regression Testing

### Color Accuracy

Open browser DevTools → Inspect elements:

- [ ] **neonPink**: `#FF2E97` (primary buttons, titles)
- [ ] **neonCyan**: `#00F0FF` (secondary elements, history)
- [ ] **arcadeYellow**: `#FFD600` (highlights, comments)
- [ ] **electricPurple**: `#B026FF` (cards, bookmarks)
- [ ] **deepBlack**: `#0A0A0F` (headers, backgrounds)
- [ ] **hotOrange**: `#FF6B35` (delete buttons, errors)
- [ ] **mintGreen**: `#00FFB3` (success states)

### Font Loading

Check Network tab → Fonts:

- [ ] Press Start 2P loads from Google Fonts
- [ ] Orbitron loads from Google Fonts
- [ ] Pretendard loads (if used)
- [ ] No font flash on load (font-display: swap working)

### Shadow Rendering

Inspect arcade buttons/cards:

- [ ] Shadows are hard-edged (no blur)
- [ ] Shadow color is `#2D1B69`
- [ ] Shadow offset is 4px/6px/8px/12px (no blur radius)

### Animation Performance

Open DevTools → Performance tab → Record:

- [ ] Card flip runs at 60fps
- [ ] Hover animations run at 60fps
- [ ] Tron grid animation runs smoothly
- [ ] Confetti doesn't lag
- [ ] No layout shift during animations

---

## 📱 Responsive Testing

### Mobile (375px)

Chrome DevTools → Toggle device toolbar → iPhone SE:

- [ ] All content fits in viewport (no horizontal scroll)
- [ ] TabBar centered and fits (500px or viewport width)
- [ ] Grid layouts show 2 columns
- [ ] Buttons are tappable (min 44px height)
- [ ] Text is readable (no tiny fonts)
- [ ] Cards stack vertically
- [ ] Quiz cards are readable

### Tablet (768px)

Chrome DevTools → iPad:

- [ ] Grid layouts show 3 columns (bookmarks, history, comments)
- [ ] Content still centered (max 900px for grids)
- [ ] TabBar still centered (500px)
- [ ] No wasted space
- [ ] All interactions work

### Desktop (1200px)

Full browser window:

- [ ] Content centered with gradient background visible
- [ ] Max-width constraints working (500px for main, 900px for grids)
- [ ] No content stretching too wide
- [ ] Hover states work correctly

---

## 🌐 Cross-Browser Testing

### Chrome (Primary)

- [ ] All features work
- [ ] Fonts render correctly
- [ ] Animations smooth
- [ ] Colors accurate

### Safari (iOS)

Test on iPhone or iPad Safari:

- [ ] Smooth scrolling works
- [ ] Touch interactions work
- [ ] Fonts load correctly
- [ ] Animations don't lag
- [ ] TabBar positioned correctly
- [ ] Bottom sheet keyboard handling works

### Firefox

- [ ] All features work
- [ ] Pixel fonts render correctly
- [ ] Gradients look good
- [ ] Animations smooth

### Edge

- [ ] All features work
- [ ] No layout issues
- [ ] Fonts render correctly

---

## ⌨️ Keyboard Navigation

### Tab Navigation

Press Tab repeatedly:

- [ ] Focus moves through all interactive elements
- [ ] Focus visible on all elements
- [ ] Tab order makes sense
- [ ] Can navigate entire app with keyboard

### Keyboard Shortcuts

- [ ] **ESC** on Terms page → goes back ✓
- [ ] **ESC** on Privacy page → goes back ✓
- [ ] **ESC** on 404 page → goes back ✓
- [ ] **Enter** on focused button → activates button

---

## 🐛 Edge Cases & Error Handling

### Network Errors

Disconnect internet → reload:

- [ ] Offline message shows (if PWA active)
- [ ] Service worker serves cached pages
- [ ] Error states show gracefully

### Empty States

Test with new account (no data):

- [ ] MyBookmarks shows "NO ITEMS COLLECTED"
- [ ] MyHistory shows "NO ITEMS COLLECTED"
- [ ] MyComments shows "NO ITEMS COLLECTED"
- [ ] Comments list shows "첫 댓글을 남겨보세요! 💬"

### Invalid Data

- [ ] `/shared-quiz?num=999999` → shows error
- [ ] `/shared-quiz` (no num) → shows error
- [ ] Invalid quiz index → graceful error

### Authentication States

- [ ] **Not logged in**: Login prompts show on protected features
- [ ] **Logged in**: All features accessible
- [ ] **Session expired**: Redirect to login
- [ ] **Logout**: Confirmation → clears session → redirects

---

## 🔍 Console Checks

Open DevTools Console:

### No Errors

- [ ] No red errors in console
- [ ] No CORS errors
- [ ] No 404s for assets
- [ ] Supabase connection works

### Expected Warnings (OK to ignore)

- [ ] `useEffect` dependency warnings (suppressed with eslint-disable)
- [ ] MUI warnings (if any)

---

## 📊 Performance Checks

### Lighthouse (Chrome DevTools)

Run Lighthouse audit:

- [ ] **Performance**: >85 (target: 90+)
- [ ] **Accessibility**: >90 (target: 95+)
- [ ] **Best Practices**: >90
- [ ] **SEO**: >90

### Bundle Size

Check build output:

```bash
npm run build
```

- [ ] Main bundle < 500KB gzipped
- [ ] Fonts load from CDN (not bundled)
- [ ] Images optimized

### Load Time

Network tab → Throttle to "Fast 3G":

- [ ] First Contentful Paint < 2s
- [ ] Time to Interactive < 4s
- [ ] No layout shift (CLS < 0.1)

---

## ✨ Polish Checks

### Micro-Interactions

Test all hover/active states:

- [ ] Buttons lift on hover (-2px to -6px)
- [ ] Buttons press on active (+2px)
- [ ] Delete buttons rotate on hover (90°)
- [ ] Category chips scale on click
- [ ] Cards lift on hover
- [ ] Like buttons scale on click

### Loading States

- [ ] Quiz cards show skeleton on load
- [ ] Comments show spinner on load
- [ ] Buttons show spinner when submitting
- [ ] Stats counters animate from 0

### Transitions

- [ ] Page transitions are smooth
- [ ] Modal open/close is smooth (0.3s)
- [ ] Toast slide-up is smooth
- [ ] All animations use hardware acceleration (no jank)

---

## 🎯 User Flow Testing

### Complete User Journey

**New User:**
1. [ ] Visit home → sees quiz cards
2. [ ] Click category → loads new quizzes
3. [ ] Click quiz → flips instantly, confetti shows
4. [ ] Click share → share dialog or clipboard toast
5. [ ] Click login → INSERT COIN screen
6. [ ] Login with Kakao → redirects to callback → back to home
7. [ ] Click bookmark → saves successfully, toast shows
8. [ ] Click profile → sees stats dashboard
9. [ ] Click collection → sees bookmarked quiz
10. [ ] Click delete → confirmation → removes from list
11. [ ] Click comment → opens bottom sheet
12. [ ] Post comment → shows in list, toast confirms
13. [ ] Click logout → confirmation → logs out
14. [ ] Click footer legal links → terminal screens
15. [ ] Press ESC on terminal → goes back
16. [ ] Visit invalid URL → Game Over screen
17. [ ] Wait 10s → auto-redirects home

---

## 🐛 Known Issues (If Any)

Document any issues found during testing:

```
Issue: [Description]
Steps to Reproduce:
1. ...
2. ...
Expected: ...
Actual: ...
Browser: ...
Screenshot: ...
```

---

## ✅ Sign-Off Checklist

Before deploying to production:

- [ ] All visual tests passed
- [ ] All interaction tests passed
- [ ] All pages work on mobile
- [ ] All pages work on tablet
- [ ] All pages work on desktop
- [ ] Tested on Chrome, Safari, Firefox, Edge
- [ ] No console errors
- [ ] Lighthouse scores acceptable
- [ ] Loading states work
- [ ] Empty states work
- [ ] Error states work
- [ ] 404 page works
- [ ] All user flows complete successfully
- [ ] Authentication works end-to-end
- [ ] Database operations work (CRUD)
- [ ] No regressions in existing features

---

**Testing completed by**: _________________

**Date**: _________________

**Build version**: 2.0.0 (Neo-Kawaii Arcade)

**Status**: [ ] PASS [ ] FAIL

**Notes**:
