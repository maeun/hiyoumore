import React, { useEffect } from 'react';
import { Modal } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { styled } from '@mui/system';
import tokensArcade from '../tokens-arcade';

/**
 * BottomSheet Component - Arcade Edition
 *
 * Mobile-first bottom sheet modal with retro arcade styling.
 *
 * Features:
 * - Slide-up animation from bottom
 * - Midnight blue background with neon border
 * - Arcade-style close button
 * - Mobile keyboard handling (iOS/Android)
 * - Max width 500px to match main container
 * - Accessible (ESC to close, focus trap, ARIA labels)
 *
 * z-index Hierarchy:
 * - ArcadeHeader: 100
 * - BottomSheet Backdrop: 1000
 * - BottomSheet Container: 1001
 */

// Arcade backdrop - deep black overlay
const StyledBackdrop = styled('div')({
  position: 'fixed',
  inset: 0,
  backgroundColor: 'rgba(10, 10, 15, 0.85)', // Deep black with high opacity
  backdropFilter: 'blur(4px)',
  zIndex: 1000,
  WebkitTapHighlightColor: 'transparent',
});

// Arcade container - midnight blue with neon border
const StyledContainer = styled('div')(({ maxHeight }) => ({
  position: 'fixed',
  bottom: 0,
  left: '50%',
  transform: 'translateX(-50%)',
  width: 'min(500px, 100vw)',
  maxHeight: maxHeight || '70vh',
  backgroundColor: tokensArcade.colors.midnightBlue,
  border: tokensArcade.borders.thick,
  borderColor: tokensArcade.colors.neonPink,
  borderBottom: 'none',
  borderTopLeftRadius: tokensArcade.borderRadius.lg,
  borderTopRightRadius: tokensArcade.borderRadius.lg,
  boxShadow: tokensArcade.shadows.mega,
  zIndex: 1001,
  display: 'flex',
  flexDirection: 'column',
  overflow: 'hidden',

  // Slide-up animation
  animation: 'slideUp 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
  '@keyframes slideUp': {
    from: {
      transform: 'translateX(-50%) translateY(100%)',
    },
    to: {
      transform: 'translateX(-50%) translateY(0)',
    },
  },
}));

// Arcade header with neon title and close button
const Header = styled('div')({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: `${tokensArcade.spacing.base} ${tokensArcade.spacing.lg}`,
  borderBottom: `${tokensArcade.borders.base} ${tokensArcade.colors.neonPink}`,
  flexShrink: 0,
  backgroundColor: tokensArcade.colors.deepBlack,
});

const Title = styled('h2')({
  margin: 0,
  fontFamily: tokensArcade.fonts.pixel,
  fontSize: tokensArcade.fonts.sm,
  fontWeight: tokensArcade.fonts.weights.normal,
  color: tokensArcade.colors.neonPink,
  textShadow: tokensArcade.shadows.neonPink,
  textTransform: 'uppercase',
  letterSpacing: '0.5px',
});

// Arcade close button - red circle with X
const CloseButton = styled('div')({
  width: '32px',
  height: '32px',
  backgroundColor: tokensArcade.colors.hotOrange,
  border: tokensArcade.borders.base,
  borderColor: tokensArcade.colors.shadowPurple,
  borderRadius: '50%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  cursor: 'pointer',
  transition: `all ${tokensArcade.motion.durations.fast} ${tokensArcade.motion.easings.snap}`,

  '& .MuiSvgIcon-root': {
    fontSize: '1.1rem',
    color: tokensArcade.colors.pureWhite,
  },

  '&:hover': {
    transform: 'scale(1.2) rotate(90deg)',
    backgroundColor: '#FF8456',
    boxShadow: tokensArcade.shadows.pixel,
  },

  '&:active': {
    transform: 'scale(0.9)',
  },
});

// Scrollable content area with arcade background
const Content = styled('div')({
  flex: 1,
  overflowY: 'auto',
  overflowX: 'hidden',
  WebkitOverflowScrolling: 'touch',
  padding: `${tokensArcade.spacing.lg} ${tokensArcade.spacing.lg}`,
  backgroundColor: tokensArcade.colors.midnightBlue,

  // Hide scrollbar but keep functionality
  scrollbarWidth: 'none',
  msOverflowStyle: 'none',
  '&::-webkit-scrollbar': {
    display: 'none',
  },
});

const BottomSheet = ({ isOpen, onClose, title, children, maxHeight }) => {
  // Backward compatibility: accept both 'open' and 'isOpen' props
  const open = isOpen;

  // Lock body scroll when modal is open
  useEffect(() => {
    if (open) {
      // Save original styles before locking
      const originalOverflow = document.body.style.overflow;
      const originalPosition = document.body.style.position;

      // Lock scroll
      document.body.style.overflow = 'hidden';
      document.body.style.position = 'relative';

      // Cleanup: Restore scroll when modal closes or component unmounts
      return () => {
        document.body.style.overflow = originalOverflow || '';
        document.body.style.position = originalPosition || '';
      };
    }
    // No else clause - cleanup function handles restoration
  }, [open]);

  // Handle mobile keyboard (adjust height when keyboard opens)
  useEffect(() => {
    if (!open) return;

    let prevHeight = window.innerHeight;

    const handleResize = () => {
      const currentHeight = window.innerHeight;

      if (currentHeight < prevHeight) {
        const keyboardHeight = prevHeight - currentHeight;
        document.documentElement.style.setProperty(
          '--bottom-sheet-keyboard-offset',
          `${keyboardHeight}px`
        );
      } else {
        document.documentElement.style.setProperty(
          '--bottom-sheet-keyboard-offset',
          '0px'
        );
      }

      prevHeight = currentHeight;
    };

    window.addEventListener('resize', handleResize);
    if (window.visualViewport) {
      window.visualViewport.addEventListener('resize', handleResize);
    }

    return () => {
      window.removeEventListener('resize', handleResize);
      if (window.visualViewport) {
        window.visualViewport.removeEventListener('resize', handleResize);
      }
      document.documentElement.style.setProperty(
        '--bottom-sheet-keyboard-offset',
        '0px'
      );
    };
  }, [open]);

  return (
    <Modal
      open={open}
      onClose={onClose}
      closeAfterTransition
      disableAutoFocus
      keepMounted={false}
      aria-labelledby="bottom-sheet-title"
      aria-describedby="bottom-sheet-content"
      BackdropComponent={StyledBackdrop}
      slots={{ backdrop: StyledBackdrop }}
    >
      <StyledContainer maxHeight={maxHeight}>
        <Header>
          <Title id="bottom-sheet-title">{title}</Title>
          <CloseButton onClick={onClose} aria-label="닫기">
            <CloseIcon />
          </CloseButton>
        </Header>
        <Content id="bottom-sheet-content">
          {children}
        </Content>
      </StyledContainer>
    </Modal>
  );
};

export default BottomSheet;
