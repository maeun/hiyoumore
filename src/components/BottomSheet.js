import React, { useEffect } from 'react';
import { Modal, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { styled } from '@mui/system';
import tokens from '../tokens';

/**
 * BottomSheet Component
 *
 * Mobile-first bottom sheet modal for HiYouMore.
 * First modal component in the app - establishes z-index hierarchy.
 *
 * Features:
 * - Slide-up animation from bottom
 * - Backdrop click to close
 * - Mobile keyboard handling (iOS/Android)
 * - Max width 500px to match .Main container
 * - Accessible (ESC to close, focus trap, ARIA labels)
 *
 * z-index Hierarchy:
 * - Header: 100
 * - BottomSheet Backdrop: 1000
 * - BottomSheet Container: 1001
 *
 * Usage:
 * <BottomSheet
 *   open={isOpen}
 *   onClose={() => setIsOpen(false)}
 *   title="💬 댓글"
 *   maxHeight="75vh"
 * >
 *   {children}
 * </BottomSheet>
 */

// Styled backdrop - purple tint overlay
const StyledBackdrop = styled('div')({
  position: 'fixed',
  inset: 0,
  backgroundColor: 'rgba(89, 75, 115, 0.4)', // tokens.colors.primary with opacity
  zIndex: 1000,
  WebkitTapHighlightColor: 'transparent',
});

// Styled container - white rounded sheet
const StyledContainer = styled('div')(({ maxHeight }) => ({
  position: 'fixed',
  bottom: 0,
  left: '50%',
  transform: 'translateX(-50%)',
  width: 'min(500px, 100vw)', // Match .Main container
  maxHeight: maxHeight || '70vh',
  backgroundColor: tokens.colors.white,
  borderTopLeftRadius: '24px',
  borderTopRightRadius: '24px',
  boxShadow: tokens.shadows.strong,
  zIndex: 1001,
  display: 'flex',
  flexDirection: 'column',
  overflow: 'hidden',

  // Slide-up animation
  animation: 'slideUp 0.3s ease-out',
  '@keyframes slideUp': {
    from: {
      transform: 'translateX(-50%) translateY(100%)',
    },
    to: {
      transform: 'translateX(-50%) translateY(0)',
    },
  },
}));

// Header with title and close button
const Header = styled('div')({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: '16px 20px',
  borderBottom: `1px solid ${tokens.colors.border}`,
  flexShrink: 0,
});

const Title = styled('h2')({
  margin: 0,
  fontSize: '1.1rem',
  fontWeight: 600,
  color: tokens.colors.text,
  fontFamily: tokens.fonts.korean,
});

// Scrollable content area
const Content = styled('div')({
  flex: 1,
  overflowY: 'auto',
  overflowX: 'hidden',
  WebkitOverflowScrolling: 'touch', // Smooth scroll on iOS
  padding: '16px 20px',
});

const BottomSheet = ({ open, onClose, title, children, maxHeight }) => {
  // Lock body scroll when modal is open
  useEffect(() => {
    if (open) {
      // Save original body style
      const originalOverflow = document.body.style.overflow;
      const originalPosition = document.body.style.position;

      // Lock scroll
      document.body.style.overflow = 'hidden';
      document.body.style.position = 'relative';

      return () => {
        // Restore original styles
        document.body.style.overflow = originalOverflow;
        document.body.style.position = originalPosition;
      };
    }
  }, [open]);

  // Handle mobile keyboard (adjust height when keyboard opens)
  useEffect(() => {
    if (!open) return;

    let prevHeight = window.innerHeight;

    const handleResize = () => {
      const currentHeight = window.innerHeight;

      // Keyboard opened (height decreased)
      if (currentHeight < prevHeight) {
        // Reduce max height to prevent content being hidden
        const keyboardHeight = prevHeight - currentHeight;
        document.documentElement.style.setProperty(
          '--bottom-sheet-keyboard-offset',
          `${keyboardHeight}px`
        );
      } else {
        // Keyboard closed
        document.documentElement.style.setProperty(
          '--bottom-sheet-keyboard-offset',
          '0px'
        );
      }

      prevHeight = currentHeight;
    };

    // Listen for viewport height changes (keyboard open/close)
    window.addEventListener('resize', handleResize);
    // Also listen for visual viewport (iOS Safari)
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
      keepMounted={false} // Unmount when closed for performance
      aria-labelledby="bottom-sheet-title"
      aria-describedby="bottom-sheet-content"
      BackdropComponent={StyledBackdrop}
      slots={{ backdrop: StyledBackdrop }}
    >
      <StyledContainer maxHeight={maxHeight}>
        <Header>
          <Title id="bottom-sheet-title">{title}</Title>
          <IconButton
            onClick={onClose}
            size="small"
            aria-label="닫기"
            sx={{
              color: tokens.colors.textSecondary,
              '&:hover': {
                backgroundColor: 'rgba(89, 75, 115, 0.08)',
              },
            }}
          >
            <CloseIcon />
          </IconButton>
        </Header>
        <Content id="bottom-sheet-content">
          {children}
        </Content>
      </StyledContainer>
    </Modal>
  );
};

export default BottomSheet;
