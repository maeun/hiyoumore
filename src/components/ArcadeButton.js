import React from 'react';
import { styled } from '@mui/system';
import { Button } from '@mui/material';
import tokensArcade from '../tokens-arcade';

// ============================================
// ARCADE BUTTON COMPONENT
// Chunky retro button with pixel shadows
// ============================================

const StyledArcadeButton = styled(Button)(({ variant = 'primary', size = 'medium', fullWidth }) => {
  // Color variants
  const variantStyles = {
    primary: {
      backgroundColor: tokensArcade.colors.neonPink,
      color: tokensArcade.colors.pureWhite,
      borderColor: tokensArcade.colors.shadowPurple,
      '&:hover': {
        backgroundColor: '#FF4AA8', // Lighter pink
        boxShadow: tokensArcade.shadows.deep,
        transform: 'translateY(-2px)',
      },
      '&:active': {
        transform: 'translateY(2px)',
        boxShadow: tokensArcade.shadows.pixel,
      },
    },
    secondary: {
      backgroundColor: tokensArcade.colors.neonCyan,
      color: tokensArcade.colors.deepBlack,
      borderColor: tokensArcade.colors.shadowPurple,
      '&:hover': {
        backgroundColor: '#33F3FF', // Lighter cyan
        boxShadow: tokensArcade.shadows.deep,
        transform: 'translateY(-2px)',
      },
      '&:active': {
        transform: 'translateY(2px)',
        boxShadow: tokensArcade.shadows.pixel,
      },
    },
    danger: {
      backgroundColor: tokensArcade.colors.hotOrange,
      color: tokensArcade.colors.pureWhite,
      borderColor: tokensArcade.colors.shadowPurple,
      '&:hover': {
        backgroundColor: '#FF8456', // Lighter orange
        boxShadow: tokensArcade.shadows.deep,
        transform: 'translateY(-2px)',
      },
      '&:active': {
        transform: 'translateY(2px)',
        boxShadow: tokensArcade.shadows.pixel,
      },
    },
    success: {
      backgroundColor: tokensArcade.colors.mintGreen,
      color: tokensArcade.colors.deepBlack,
      borderColor: tokensArcade.colors.shadowPurple,
      '&:hover': {
        backgroundColor: '#33FFBF', // Lighter mint
        boxShadow: tokensArcade.shadows.deep,
        transform: 'translateY(-2px)',
      },
      '&:active': {
        transform: 'translateY(2px)',
        boxShadow: tokensArcade.shadows.pixel,
      },
    },
    yellow: {
      backgroundColor: tokensArcade.colors.arcadeYellow,
      color: tokensArcade.colors.deepBlack,
      borderColor: tokensArcade.colors.shadowPurple,
      '&:hover': {
        backgroundColor: '#FFDE33', // Lighter yellow
        boxShadow: tokensArcade.shadows.deep,
        transform: 'translateY(-2px)',
      },
      '&:active': {
        transform: 'translateY(2px)',
        boxShadow: tokensArcade.shadows.pixel,
      },
    },
    purple: {
      backgroundColor: tokensArcade.colors.electricPurple,
      color: tokensArcade.colors.pureWhite,
      borderColor: tokensArcade.colors.shadowPurple,
      '&:hover': {
        backgroundColor: '#C247FF', // Lighter purple
        boxShadow: tokensArcade.shadows.deep,
        transform: 'translateY(-2px)',
      },
      '&:active': {
        transform: 'translateY(2px)',
        boxShadow: tokensArcade.shadows.pixel,
      },
    },
  };

  // Size variants
  const sizeStyles = {
    small: {
      height: '36px',
      padding: `${tokensArcade.spacing.sm} ${tokensArcade.spacing.base}`,
      fontSize: tokensArcade.fonts.xs,
      minWidth: '80px',
    },
    medium: {
      height: '44px',
      padding: `${tokensArcade.spacing.md} ${tokensArcade.spacing.lg}`,
      fontSize: tokensArcade.fonts.sm,
      minWidth: '100px',
    },
    large: {
      height: '56px',
      padding: `${tokensArcade.spacing.base} ${tokensArcade.spacing.xl}`,
      fontSize: tokensArcade.fonts.base,
      minWidth: '120px',
    },
    mega: {
      height: '60px',
      padding: `${tokensArcade.spacing.lg} ${tokensArcade.spacing.xxl}`,
      fontSize: tokensArcade.fonts.md,
      minWidth: '140px',
    },
  };

  return {
    // Base styles
    fontFamily: tokensArcade.fonts.display,
    fontWeight: tokensArcade.fonts.weights.bold,
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    border: tokensArcade.borders.base,
    borderRadius: tokensArcade.borderRadius.md,
    boxShadow: tokensArcade.shadows.arcade,
    transition: `all ${tokensArcade.motion.durations.fast} ${tokensArcade.motion.easings.snap}`,
    cursor: 'pointer',
    position: 'relative',
    overflow: 'hidden',
    width: fullWidth ? '100%' : 'auto',

    // Variant styles
    ...variantStyles[variant],

    // Size styles
    ...sizeStyles[size],

    // Disabled state
    '&:disabled': {
      backgroundColor: tokensArcade.colors.pixelGray,
      color: tokensArcade.colors.shadowPurple,
      borderColor: tokensArcade.colors.pixelGray,
      boxShadow: tokensArcade.shadows.pixel,
      cursor: 'not-allowed',
      opacity: 0.6,
      transform: 'none',
    },

    // Focus state (accessibility)
    '&:focus-visible': {
      outline: `3px solid ${tokensArcade.colors.neonCyan}`,
      outlineOffset: '3px',
    },
  };
});

// ============================================
// ARCADE BUTTON COMPONENT
// ============================================

const ArcadeButton = ({
  children,
  variant = 'primary',
  size = 'medium',
  fullWidth = false,
  icon = null,
  disabled = false,
  onClick,
  ...props
}) => {
  return (
    <StyledArcadeButton
      variant={variant}
      size={size}
      fullWidth={fullWidth}
      disabled={disabled}
      onClick={onClick}
      disableRipple // Disable MUI ripple for custom arcade feel
      {...props}
    >
      {icon && (
        <span style={{
          marginRight: tokensArcade.spacing.sm,
          display: 'inline-flex',
          alignItems: 'center',
        }}>
          {icon}
        </span>
      )}
      {children}
    </StyledArcadeButton>
  );
};

export default ArcadeButton;
