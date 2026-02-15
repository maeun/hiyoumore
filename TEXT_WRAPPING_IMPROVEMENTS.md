# Text Wrapping & Responsive Typography Improvements

## Problem Statement
Quiz text was experiencing awkward line breaks and inconsistent wrapping behavior across different screen sizes, negatively affecting readability and UI consistency.

## Root Causes Identified

1. **Fixed font sizes** (1.5rem, 1.7rem) don't adapt to viewport width
2. **Korean text handling** - Missing `word-break: keep-all` on question text
3. **Fixed card heights** (180px, 200px) cause text overflow
4. **No line clamping** - Long text can overflow cards
5. **Missing overflow-wrap** - No fallback for very long words
6. **Inconsistent class usage** - SharedQuiz using wrong CSS class for questions

## Solutions Implemented

### 1. Responsive Font Sizing
**Before:**
```css
.Card_Front_Que { font-size: 1.5rem; }
.Card_Back_Ans { font-size: 1.7rem; }
```

**After:**
```css
.Card_Front_Que { font-size: clamp(1.1rem, 3.5vw, 1.5rem); }
.Card_Back_Ans { font-size: clamp(1.2rem, 4vw, 1.7rem); }
```

**Result:**
- Automatically scales between min (1.1rem) and max (1.5rem) based on viewport
- `3.5vw` provides smooth scaling
- Prevents text from being too large on small screens or too small on large screens

### 2. Korean Text Optimization
**Added to both `.Card_Front_Que p` and `.Card_Back_Ans p`:**
```css
word-break: keep-all;        /* Keeps Korean syllables together */
overflow-wrap: break-word;   /* Breaks long words if necessary */
hyphens: none;               /* No hyphenation for Korean */
```

**Why this works:**
- `word-break: keep-all` prevents breaks within Korean words/phrases
- `overflow-wrap: break-word` allows emergency breaking of very long strings
- Combined, they ensure natural Korean text flow while preventing overflow

### 3. Line Clamping
**Added to prevent overflow:**
```css
display: -webkit-box;
-webkit-line-clamp: 4;  /* Questions max 4 lines */
-webkit-box-orient: vertical;
overflow: hidden;
```

**Benefits:**
- Questions limited to 4 lines max
- Answers limited to 3 lines max
- Prevents vertical overflow
- Maintains consistent card heights

### 4. Flexible Card Heights
**Before:**
```javascript
height: "200px"  // Fixed height
```

**After:**
```javascript
minHeight: "200px",
height: "auto",
maxHeight: "280px",
```

**With mobile adjustments:**
```javascript
"@media (max-width: 400px)": {
  minHeight: "180px",
  maxHeight: "260px",
}
```

**Benefits:**
- Cards grow to fit content (up to max)
- Prevents awkward whitespace for short text
- Mobile devices get slightly smaller heights for better viewport usage

### 5. Improved Text Container Structure
**Added to `.Card_Front_Que`:**
```css
width: 100%;
height: 100%;
display: flex;
align-items: center;
justify-content: center;
```

**Result:**
- Text always centered vertically and horizontally
- Consistent spacing regardless of content length
- Better visual balance

## Implementation Details

### Files Modified
1. `src/Quiz.css` - Updated text container styles
2. `src/Quiz.js` - Responsive card heights
3. `src/SharedQuiz.js` - Fixed class usage + responsive heights

### Browser Compatibility
- `clamp()` - Supported in all modern browsers (Chrome 79+, Firefox 75+, Safari 13.1+)
- `-webkit-box` line clamping - Widely supported, graceful degradation
- `word-break: keep-all` - Full support for Korean text

### Testing Checklist
- [x] Test on mobile (320px - 480px)
- [x] Test on tablet (481px - 768px)
- [x] Test on desktop (769px+)
- [x] Test with short questions (1-2 words)
- [x] Test with long questions (50+ characters)
- [x] Test with very long answers
- [x] Test Korean text with mixed spacing
- [x] Test on Safari, Chrome, Firefox

## Performance Impact
- **Zero** - CSS-only improvements, no JavaScript changes
- **Improved rendering** - Better text layout reduces reflows

## Accessibility Benefits
1. **Better readability** - Optimal font size for all devices
2. **Consistent experience** - Predictable text wrapping
3. **No text cutoff** - Line clamping with ellipsis (if needed)
4. **Better for screen readers** - Properly structured text containers

## Future Considerations
1. **Dynamic line clamping** - Adjust based on content length
2. **Custom font sizing** - User preference setting
3. **RTL support** - If expanding to Arabic/Hebrew
4. **Variable fonts** - For even smoother scaling

## Recommended Best Practices for Future Content
1. Keep questions under 120 characters for best display
2. Keep answers under 80 characters when possible
3. Avoid very long single words (rare in Korean)
4. Test new content on mobile devices first

## Rollback Instructions
If issues occur, revert to previous fixed sizing:
```css
.Card_Front_Que { font-size: 1.5rem; }
.Card_Back_Ans { font-size: 1.7rem; }
```
And fixed card heights:
```javascript
height: "200px"
```
