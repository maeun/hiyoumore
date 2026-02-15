// HiYouMore Neo-Kawaii Arcade Design System
// Retro arcade game meets Korean kawaii meets brutalist web design

const tokensArcade = {
  // ============================================
  // COLORS - Neon Arcade Palette (12 colors)
  // ============================================
  colors: {
    // Primary brand colors
    neonPink: '#FF2E97',        // Primary CTA, active states, special highlights
    neonCyan: '#00F0FF',        // Secondary actions, hover states, links
    arcadeYellow: '#FFD600',    // Highlights, achievements, warnings
    electricPurple: '#B026FF',  // Quiz cards, category pills, brand accent

    // Base colors
    deepBlack: '#0A0A0F',       // Headers, dark mode base, rich blacks
    pureWhite: '#FFFFFF',       // Card fronts, light mode, text on dark
    midnightBlue: '#1A1A2E',    // Card backs, elevated surfaces, secondary bg
    softCream: '#FFF9F0',       // Page backgrounds, warm neutrals

    // Accent colors
    mintGreen: '#00FFB3',       // Correct answers, bookmarks, success states
    hotOrange: '#FF6B35',       // Danger, delete, error states
    pixelGray: '#C4C4C4',       // Borders, disabled states, subtle elements
    shadowPurple: '#2D1B69',    // Hard shadows, depth, brutalist borders
  },

  // ============================================
  // TYPOGRAPHY - Pixel + Korean Modern
  // ============================================
  fonts: {
    // Font families
    pixel: '"Press Start 2P", "Courier New", monospace',           // Headers, arcade UI
    display: '"Gmarket Sans", "Pretendard Variable", sans-serif',  // Titles, bold statements
    body: '"Pretendard Variable", "Noto Sans KR", sans-serif',     // Body text, readable
    number: '"Orbitron", "Courier New", monospace',                // Stats, counters, futuristic
    mono: '"IBM Plex Mono", "Courier New", monospace',             // Terminal, code, legal

    // Font sizes (8 sizes for hierarchy)
    xs: '0.6rem',     // 9.6px - Tiny labels, metadata
    sm: '0.75rem',    // 12px - Small text, captions
    base: '0.875rem', // 14px - Body text, default
    md: '1rem',       // 16px - Large body, emphasized text
    lg: '1.25rem',    // 20px - Section titles, card headers
    xl: '1.5rem',     // 24px - Page titles, major headings
    xxl: '2rem',      // 32px - Hero text, big numbers
    mega: '3rem',     // 48px - Score counters, achievements

    // Font weights
    weights: {
      normal: 400,
      medium: 500,
      semibold: 600,
      bold: 700,
      black: 900,
    },

    // Line heights
    lineHeights: {
      tight: 1.2,
      normal: 1.5,
      relaxed: 1.7,
    },
  },

  // ============================================
  // SHADOWS - Brutalist Pixel Shadows
  // ============================================
  shadows: {
    // Hard pixel shadows (offset shadows, no blur)
    pixel: '4px 4px 0 #2D1B69',      // Small elements, badges, chips
    arcade: '6px 6px 0 #2D1B69',     // Cards, buttons, medium elements
    deep: '8px 8px 0 #2D1B69',       // Buttons on hover, elevated cards
    mega: '12px 12px 0 #2D1B69',     // Modals, overlays, hero elements

    // Neon glow shadows (for special effects)
    neonPink: '0 0 20px rgba(255, 46, 151, 0.6), 0 0 40px rgba(255, 46, 151, 0.3)',
    neonCyan: '0 0 20px rgba(0, 240, 255, 0.6), 0 0 40px rgba(0, 240, 255, 0.3)',
    neonYellow: '0 0 20px rgba(255, 214, 0, 0.6), 0 0 40px rgba(255, 214, 0, 0.3)',
    neonPurple: '0 0 20px rgba(176, 38, 255, 0.6), 0 0 40px rgba(176, 38, 255, 0.3)',

    // Combined shadows (pixel + glow)
    glowPink: '4px 4px 0 #2D1B69, 0 0 20px rgba(255, 46, 151, 0.4)',
    glowCyan: '4px 4px 0 #2D1B69, 0 0 20px rgba(0, 240, 255, 0.4)',
  },

  // ============================================
  // SPACING - 8px Grid System
  // ============================================
  spacing: {
    xs: '4px',      // Tight spacing, icon gaps
    sm: '8px',      // Small gaps, inline elements
    md: '12px',     // Default spacing, vertical rhythm
    base: '16px',   // Standard spacing, card padding
    lg: '20px',     // Larger gaps, section spacing
    xl: '24px',     // Major sections, generous padding
    xxl: '32px',    // Page sections, hero spacing
    mega: '48px',   // Extra large, dramatic spacing
  },

  // ============================================
  // BORDER RADIUS - Chunky Corners
  // ============================================
  borderRadius: {
    none: '0px',       // Sharp corners for brutalist elements
    sm: '4px',         // Subtle rounding
    md: '8px',         // Standard rounding, buttons
    lg: '12px',        // Cards, larger elements
    xl: '16px',        // Prominent rounding
    pill: '9999px',    // Fully rounded, pills/badges
  },

  // ============================================
  // BORDERS - Chunky Outlines
  // ============================================
  borders: {
    thin: '2px solid',    // Subtle borders
    base: '3px solid',    // Standard borders, most elements
    thick: '4px solid',   // Heavy borders, emphasis
    mega: '6px solid',    // Extra thick, hero elements
  },

  // ============================================
  // MOTION - Arcade Animations
  // ============================================
  motion: {
    // Durations
    durations: {
      instant: '0.1s',   // Immediate feedback, hover
      fast: '0.2s',      // Quick transitions, buttons
      base: '0.3s',      // Standard animations, cards
      slow: '0.5s',      // Deliberate animations, page transitions
    },

    // Easing functions
    easings: {
      bounce: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',   // Bounce effect, playful
      snap: 'cubic-bezier(0.4, 0, 0.2, 1)',               // Sharp snap, arcade feel
      elastic: 'cubic-bezier(0.175, 0.885, 0.32, 1.275)', // Elastic overshoot
      smooth: 'cubic-bezier(0.4, 0, 0.6, 1)',             // Smooth, standard
    },
  },

  // ============================================
  // Z-INDEX - Layering System
  // ============================================
  zIndex: {
    base: 1,           // Default layer
    raised: 10,        // Raised elements, dropdowns
    sticky: 100,       // Sticky header
    modal: 1000,       // Modals, overlays
    toast: 2000,       // Toast notifications
    tooltip: 3000,     // Tooltips, popovers
  },

  // ============================================
  // BREAKPOINTS - Responsive Design
  // ============================================
  breakpoints: {
    mobile: '375px',    // Small mobile
    tablet: '768px',    // Tablet, landscape mobile
    desktop: '1024px',  // Desktop
    wide: '1440px',     // Wide desktop
  },
};

export default tokensArcade;
