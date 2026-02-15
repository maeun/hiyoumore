import React, { useEffect, useState } from 'react';
import { styled } from '@mui/system';
import { Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import tokensArcade from '../tokens-arcade';
import { supabase } from '../supabaseConfig';

// ============================================
// ARCADE HEADER COMPONENT
// Retro marquee header with neon styling
// ============================================

const HeaderContainer = styled(Box)({
  position: 'sticky',
  top: 0,
  height: '70px',
  backgroundColor: tokensArcade.colors.deepBlack,
  borderBottom: `3px solid ${tokensArcade.colors.neonCyan}`,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: `0 ${tokensArcade.spacing.base}`,
  zIndex: tokensArcade.zIndex.sticky,
  boxShadow: `0 4px 0 ${tokensArcade.colors.shadowPurple}`,

  // Scanline effect animation
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: `repeating-linear-gradient(
      0deg,
      rgba(0, 240, 255, 0.03) 0px,
      rgba(0, 240, 255, 0.03) 1px,
      transparent 1px,
      transparent 2px
    )`,
    pointerEvents: 'none',
    animation: 'scanlines 8s linear infinite',
  },

  '@keyframes scanlines': {
    '0%': {
      transform: 'translateY(0)',
    },
    '100%': {
      transform: 'translateY(4px)',
    },
  },
});

const Logo = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  gap: tokensArcade.spacing.sm,
  cursor: 'pointer',
  transition: `transform ${tokensArcade.motion.durations.fast} ${tokensArcade.motion.easings.bounce}`,

  '&:hover': {
    transform: 'scale(1.05)',
  },

  '&:active': {
    transform: 'scale(0.95)',
  },
});

const LogoText = styled('h1')({
  fontFamily: tokensArcade.fonts.pixel,
  fontSize: tokensArcade.fonts.md,
  fontWeight: tokensArcade.fonts.weights.normal,
  color: tokensArcade.colors.neonPink,
  textShadow: `2px 2px 0 ${tokensArcade.colors.neonCyan},
                4px 4px 0 ${tokensArcade.colors.shadowPurple}`,
  margin: 0,
  letterSpacing: '1px',
  textTransform: 'uppercase',
});

const PixelIcon = styled(Box)({
  width: '40px',
  height: '40px',
  backgroundColor: tokensArcade.colors.neonPink,
  border: `3px solid ${tokensArcade.colors.pureWhite}`,
  borderRadius: tokensArcade.borderRadius.sm,
  boxShadow: tokensArcade.shadows.pixel,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: '24px',
});

const ScoreDisplay = styled(Box)({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-end',
  gap: tokensArcade.spacing.xs,
});

const ScoreLabel = styled('span')({
  fontFamily: tokensArcade.fonts.pixel,
  fontSize: tokensArcade.fonts.xs,
  color: tokensArcade.colors.pixelGray,
  textTransform: 'uppercase',
  letterSpacing: '0.5px',
});

const ScoreValue = styled('span')({
  fontFamily: tokensArcade.fonts.number,
  fontSize: tokensArcade.fonts.lg,
  fontWeight: tokensArcade.fonts.weights.black,
  color: tokensArcade.colors.arcadeYellow,
  textShadow: tokensArcade.shadows.neonYellow,
  letterSpacing: '1px',
});

// ============================================
// ARCADE HEADER COMPONENT
// ============================================

const ArcadeHeader = () => {
  const navigate = useNavigate();
  const [todayQuizCount, setTodayQuizCount] = useState(0);

  useEffect(() => {
    // Fetch today's quiz completion count from Supabase
    const fetchTodayQuizCount = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        // Get today's date in YYYY-MM-DD format (KST)
        const today = new Date();
        const kstDate = new Date(today.getTime() + (9 * 60 * 60 * 1000)); // KST offset
        const todayStr = kstDate.toISOString().split('T')[0];

        // Query quiz completions for today
        // Note: This assumes a quiz_completions table exists (Phase 2 feature)
        // For now, show mock data or localStorage count
        const localCount = localStorage.getItem(`quizCount_${todayStr}`) || 0;
        setTodayQuizCount(parseInt(localCount, 10));
      } catch (error) {
        console.error('Error fetching quiz count:', error);
      }
    };

    fetchTodayQuizCount();
  }, []);

  const handleLogoClick = () => {
    navigate('/');
  };

  return (
    <HeaderContainer>
      <Logo onClick={handleLogoClick}>
        <PixelIcon>🎮</PixelIcon>
        <LogoText>HIYOUMORE</LogoText>
      </Logo>

      <ScoreDisplay>
        <ScoreLabel>Today</ScoreLabel>
        <ScoreValue>{todayQuizCount}</ScoreValue>
      </ScoreDisplay>
    </HeaderContainer>
  );
};

export default ArcadeHeader;
