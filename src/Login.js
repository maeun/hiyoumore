'use client';

import React from "react";
import { styled } from "@mui/system";
import { Box, Typography } from "@mui/material";
import { supabase } from './supabaseConfig';
import { showErrorToast } from './toastUtils';
import tokensArcade from './tokens-arcade';
import kakao_login_btn from "./kakao_login_btn.png";

// ============================================
// INSERT COIN SCREEN
// ============================================

const ArcadeScreen = styled(Box)({
  minHeight: 'calc(100vh - 70px - 80px)',
  background: tokensArcade.colors.deepBlack,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  padding: tokensArcade.spacing.xxl,
  paddingBottom: '100px', // Space for TabBar
  position: 'relative',
  overflow: 'hidden',

  // Tron grid lines animation
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundImage: `
      linear-gradient(rgba(0, 240, 255, 0.1) 1px, transparent 1px),
      linear-gradient(90deg, rgba(0, 240, 255, 0.1) 1px, transparent 1px)
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

  // Radial gradient overlay
  '&::after': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'radial-gradient(circle at 50% 50%, rgba(176, 38, 255, 0.2) 0%, transparent 70%)',
    pointerEvents: 'none',
  },
});

const CoinSlotMachine = styled(Box)({
  width: '120px',
  height: '140px',
  margin: '0 auto 32px',
  background: tokensArcade.colors.shadowPurple,
  border: tokensArcade.borders.thick,
  borderColor: tokensArcade.colors.neonCyan,
  borderRadius: tokensArcade.borderRadius.lg,
  boxShadow: tokensArcade.shadows.glowCyan,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  gap: tokensArcade.spacing.sm,
  position: 'relative',
  zIndex: 2,

  // Coin slot (horizontal line)
  '&::before': {
    content: '""',
    width: '60px',
    height: '4px',
    backgroundColor: tokensArcade.colors.deepBlack,
    borderRadius: '2px',
    boxShadow: `inset 0 0 8px rgba(0, 0, 0, 0.5)`,
  },

  // Pixel coin icon
  '&::after': {
    content: '"🪙"',
    fontSize: '48px',
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    animation: 'coinBounce 2s ease-in-out infinite',
  },

  '@keyframes coinBounce': {
    '0%, 100%': {
      transform: 'translate(-50%, -50%) translateY(0)',
    },
    '50%': {
      transform: 'translate(-50%, -50%) translateY(-8px)',
    },
  },
});

const InsertCoinText = styled(Typography)({
  fontFamily: tokensArcade.fonts.pixel,
  fontSize: tokensArcade.fonts.md,
  fontWeight: tokensArcade.fonts.weights.normal,
  color: tokensArcade.colors.neonPink,
  textShadow: tokensArcade.shadows.neonPink,
  textAlign: 'center',
  marginBottom: tokensArcade.spacing.lg,
  letterSpacing: '2px',
  textTransform: 'uppercase',
  position: 'relative',
  zIndex: 2,
  animation: 'textPulse 2s ease-in-out infinite',

  '@keyframes textPulse': {
    '0%, 100%': {
      opacity: 0.8,
    },
    '50%': {
      opacity: 1,
    },
  },
});

const ContinueText = styled(Typography)({
  fontFamily: tokensArcade.fonts.pixel,
  fontSize: tokensArcade.fonts.sm,
  fontWeight: tokensArcade.fonts.weights.normal,
  color: tokensArcade.colors.neonCyan,
  textShadow: tokensArcade.shadows.neonCyan,
  textAlign: 'center',
  marginBottom: tokensArcade.spacing.xxl,
  letterSpacing: '1px',
  textTransform: 'uppercase',
  position: 'relative',
  zIndex: 2,
});

const KakaoLoginButton = styled(Box)({
  width: '100%',
  maxWidth: '400px',
  height: '60px',
  backgroundColor: tokensArcade.colors.arcadeYellow,
  border: tokensArcade.borders.thick,
  borderColor: tokensArcade.colors.deepBlack,
  borderRadius: tokensArcade.borderRadius.lg,
  boxShadow: tokensArcade.shadows.deep,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: tokensArcade.spacing.md,
  cursor: 'pointer',
  transition: `all ${tokensArcade.motion.durations.fast} ${tokensArcade.motion.easings.bounce}`,
  fontFamily: tokensArcade.fonts.display,
  fontSize: tokensArcade.fonts.md,
  fontWeight: tokensArcade.fonts.weights.bold,
  color: tokensArcade.colors.deepBlack,
  position: 'relative',
  zIndex: 2,

  '&:hover': {
    transform: 'translateY(-4px) scale(1.02)',
    boxShadow: tokensArcade.shadows.mega,
    backgroundColor: '#FFDE33',
  },

  '&:active': {
    transform: 'translateY(2px)',
    boxShadow: tokensArcade.shadows.arcade,
  },

  '@media (max-width: 400px)': {
    maxWidth: '100%',
  },
});

const BlinkingArrow = styled(Box)({
  position: 'absolute',
  top: '-48px',
  left: '50%',
  transform: 'translateX(-50%)',
  fontSize: '32px',
  animation: 'arrowBlink 1s ease-in-out infinite',

  '@keyframes arrowBlink': {
    '0%, 100%': {
      opacity: 1,
      transform: 'translateX(-50%) translateY(0)',
    },
    '50%': {
      opacity: 0.3,
      transform: 'translateX(-50%) translateY(4px)',
    },
  },
});

// ============================================
// LOGIN COMPONENT
// ============================================

function Login() {
  const handleKakaoLogin = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'kakao',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`
      }
    });

    if (error) {
      showErrorToast('로그인 실패');
      console.error('Login error:', error);
    }
  };

  return (
    <ArcadeScreen>
      {/* Coin Slot Machine */}
      <CoinSlotMachine />

      {/* INSERT COIN Title */}
      <InsertCoinText>
        INSERT COIN
      </InsertCoinText>

      {/* Continue Text */}
      <ContinueText>
        TO CONTINUE
      </ContinueText>

      {/* Kakao Login Button with Blinking Arrow */}
      <Box sx={{ position: 'relative', width: '100%', maxWidth: '400px' }}>
        <BlinkingArrow>⬇️</BlinkingArrow>
        <KakaoLoginButton onClick={handleKakaoLogin}>
          <img
            src={kakao_login_btn}
            alt="kakao"
            style={{
              height: '28px',
            }}
          />
          카카오로 로그인하기
        </KakaoLoginButton>
      </Box>
    </ArcadeScreen>
  );
}

export default Login;
