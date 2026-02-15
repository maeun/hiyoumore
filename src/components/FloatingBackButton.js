import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { styled, keyframes } from '@mui/system';
import { IconButton } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

/**
 * FloatingBackButton - Ethereal Glass-Morphism Navigation
 *
 * A soft, glowing bubble that floats above content on user profile pages.
 * Aesthetic: Korean soft modernism with gentle animations and glass effects.
 */

// Animations
const float = keyframes`
  0%, 100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-3px);
  }
`;

const slideIn = keyframes`
  from {
    opacity: 0;
    transform: translateX(-40px) scale(0.8);
  }
  to {
    opacity: 1;
    transform: translateX(0) scale(1);
  }
`;

const ripple = keyframes`
  0% {
    transform: scale(0);
    opacity: 0.6;
  }
  100% {
    transform: scale(2.5);
    opacity: 0;
  }
`;

const BackButton = styled(IconButton)(({ theme }) => ({
  position: 'fixed',
  top: '80px',
  left: '16px',
  zIndex: 1000,

  // Soft glass-morphism bubble
  background: 'linear-gradient(135deg, rgba(124, 92, 219, 0.85) 0%, rgba(155, 127, 232, 0.75) 100%)',
  backdropFilter: 'blur(12px)',
  WebkitBackdropFilter: 'blur(12px)',

  width: '48px',
  height: '48px',
  borderRadius: '50%',

  // Soft glow
  boxShadow: `
    0 4px 16px rgba(124, 92, 219, 0.3),
    0 2px 8px rgba(124, 92, 219, 0.2),
    inset 0 1px 0 rgba(255, 255, 255, 0.3)
  `,

  border: '1px solid rgba(255, 255, 255, 0.2)',

  // Gentle float animation
  animation: `${slideIn} 0.5s cubic-bezier(0.34, 1.56, 0.64, 1), ${float} 3s ease-in-out infinite`,

  transition: 'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',

  '&:hover': {
    background: 'linear-gradient(135deg, rgba(124, 92, 219, 0.95) 0%, rgba(155, 127, 232, 0.85) 100%)',
    transform: 'translateY(-2px) scale(1.05)',
    boxShadow: `
      0 6px 24px rgba(124, 92, 219, 0.4),
      0 3px 12px rgba(124, 92, 219, 0.3),
      inset 0 1px 0 rgba(255, 255, 255, 0.4)
    `,
  },

  '&:active': {
    transform: 'translateY(0) scale(0.95)',
    boxShadow: `
      0 2px 8px rgba(124, 92, 219, 0.3),
      inset 0 1px 0 rgba(255, 255, 255, 0.2)
    `,

    '&::after': {
      content: '""',
      position: 'absolute',
      top: '50%',
      left: '50%',
      width: '100%',
      height: '100%',
      borderRadius: '50%',
      background: 'rgba(255, 255, 255, 0.4)',
      transform: 'translate(-50%, -50%)',
      animation: `${ripple} 0.6s ease-out`,
    },
  },

  // Mobile optimization
  '@media (max-width: 600px)': {
    top: '76px',
    left: '12px',
    width: '44px',
    height: '44px',
  },
}));

const BackIcon = styled(ArrowBackIcon)({
  color: '#FFFFFF',
  fontSize: '1.3rem',
  filter: 'drop-shadow(0 1px 2px rgba(0, 0, 0, 0.2))',
});

const FloatingBackButton = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isVisible, setIsVisible] = useState(false);

  // Routes that should show the floating back button
  const showOnRoutes = ['/my-history', '/my-bookmarks', '/my-comments'];

  useEffect(() => {
    setIsVisible(showOnRoutes.includes(location.pathname));
  }, [location.pathname]);

  const handleBack = () => {
    navigate(-1);
  };

  if (!isVisible) return null;

  return (
    <BackButton
      onClick={handleBack}
      aria-label="뒤로가기"
      disableRipple
    >
      <BackIcon />
    </BackButton>
  );
};

export default FloatingBackButton;
