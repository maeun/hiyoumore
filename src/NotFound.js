'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { styled } from '@mui/system';
import tokensArcade from './tokens-arcade';
import ArcadeButton from './components/ArcadeButton';

// ============================================
// ARCADE GAME OVER SCREEN - 404 NOT FOUND
// ============================================

const GameOverScreen = styled('div')({
  minHeight: 'calc(100vh - 70px - 80px)',
  backgroundColor: tokensArcade.colors.deepBlack,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  padding: tokensArcade.spacing.xl,
  paddingBottom: '100px',
  position: 'relative',
  overflow: 'hidden',

  // Tron grid animation
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundImage: `
      linear-gradient(rgba(255, 46, 151, 0.1) 1px, transparent 1px),
      linear-gradient(90deg, rgba(255, 46, 151, 0.1) 1px, transparent 1px)
    `,
    backgroundSize: '40px 40px',
    animation: 'gridScroll 20s linear infinite',
    pointerEvents: 'none',
  },

  '@keyframes gridScroll': {
    '0%': {
      transform: 'translate(0, 0)',
    },
    '100%': {
      transform: 'translate(40px, 40px)',
    },
  },

  // Radial glow
  '&::after': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'radial-gradient(circle at 50% 50%, rgba(255, 46, 151, 0.2) 0%, transparent 70%)',
    pointerEvents: 'none',
  },
});

const GameOverContent = styled('div')({
  position: 'relative',
  zIndex: 2,
  textAlign: 'center',
  maxWidth: '600px',
  width: '100%',
});

const GameOverTitle = styled('div')({
  fontFamily: tokensArcade.fonts.pixel,
  fontSize: 'clamp(2rem, 8vw, 4rem)',
  fontWeight: tokensArcade.fonts.weights.normal,
  color: tokensArcade.colors.hotOrange,
  textShadow: `
    0 0 20px rgba(255, 107, 53, 0.8),
    0 0 40px rgba(255, 107, 53, 0.4),
    4px 4px 0 ${tokensArcade.colors.shadowPurple}
  `,
  marginBottom: tokensArcade.spacing.xl,
  letterSpacing: '8px',
  animation: 'pulse 2s ease-in-out infinite',

  '@keyframes pulse': {
    '0%, 100%': {
      opacity: 1,
      transform: 'scale(1)',
    },
    '50%': {
      opacity: 0.8,
      transform: 'scale(1.05)',
    },
  },
});

const ErrorCode = styled('div')({
  fontFamily: tokensArcade.fonts.number,
  fontSize: 'clamp(4rem, 15vw, 8rem)',
  fontWeight: tokensArcade.fonts.weights.black,
  color: tokensArcade.colors.neonPink,
  textShadow: tokensArcade.shadows.neonPink,
  marginBottom: tokensArcade.spacing.lg,
  lineHeight: 1,
  letterSpacing: '4px',
});

const ErrorMessage = styled('div')({
  fontFamily: tokensArcade.fonts.pixel,
  fontSize: tokensArcade.fonts.sm,
  color: tokensArcade.colors.neonCyan,
  textShadow: tokensArcade.shadows.neonCyan,
  marginBottom: tokensArcade.spacing.xxl,
  letterSpacing: '2px',
  textTransform: 'uppercase',
  lineHeight: 1.8,
});

const PixelDivider = styled('div')({
  width: '100%',
  maxWidth: '400px',
  height: '4px',
  backgroundColor: tokensArcade.colors.electricPurple,
  margin: `${tokensArcade.spacing.xl} auto`,
  boxShadow: tokensArcade.shadows.arcade,
  position: 'relative',

  '&::before': {
    content: '""',
    position: 'absolute',
    top: '-8px',
    left: '50%',
    transform: 'translateX(-50%)',
    width: '40px',
    height: '20px',
    backgroundColor: tokensArcade.colors.arcadeYellow,
    clipPath: 'polygon(50% 0%, 100% 100%, 0% 100%)',
  },
});

const ContinuePrompt = styled('div')({
  fontFamily: tokensArcade.fonts.pixel,
  fontSize: tokensArcade.fonts.xs,
  color: tokensArcade.colors.pixelGray,
  marginBottom: tokensArcade.spacing.xl,
  letterSpacing: '1px',
  animation: 'blink 1.5s ease-in-out infinite',

  '@keyframes blink': {
    '0%, 100%': { opacity: 1 },
    '50%': { opacity: 0.3 },
  },
});

const Countdown = styled('div')({
  fontFamily: tokensArcade.fonts.number,
  fontSize: tokensArcade.fonts.xl,
  fontWeight: tokensArcade.fonts.weights.black,
  color: tokensArcade.colors.arcadeYellow,
  textShadow: tokensArcade.shadows.neonYellow,
  marginTop: tokensArcade.spacing.lg,
  letterSpacing: '2px',
});

const ButtonStack = styled('div')({
  display: 'flex',
  flexDirection: 'column',
  gap: tokensArcade.spacing.md,
  maxWidth: '300px',
  margin: '0 auto',
});

const NotFound = () => {
  const router = useRouter();
  const [countdown, setCountdown] = useState(10);

  // Auto-redirect countdown
  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          router.push('/');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [router]);

  // ESC key to go back
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        router.back();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [router]);

  const handleGoHome = () => {
    router.push('/');
  };

  const handleGoBack = () => {
    router.back();
  };

  return (
    <GameOverScreen>
      <GameOverContent>
        <GameOverTitle>GAME OVER</GameOverTitle>

        <ErrorCode>404</ErrorCode>

        <ErrorMessage>
          PAGE NOT FOUND
          <br />
          퀴즈가 이 세계에 존재하지 않습니다
        </ErrorMessage>

        <PixelDivider />

        <ContinuePrompt>INSERT COIN TO CONTINUE</ContinuePrompt>

        <ButtonStack>
          <ArcadeButton
            variant="primary"
            size="mega"
            fullWidth
            onClick={handleGoHome}
          >
            🏠 HOME
          </ArcadeButton>

          <ArcadeButton
            variant="secondary"
            size="large"
            fullWidth
            onClick={handleGoBack}
          >
            ← GO BACK
          </ArcadeButton>
        </ButtonStack>

        <Countdown>
          AUTO REDIRECT: {countdown}
        </Countdown>
      </GameOverContent>
    </GameOverScreen>
  );
};

export default NotFound;
