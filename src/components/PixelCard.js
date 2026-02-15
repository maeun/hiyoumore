import React from 'react';
import { styled } from '@mui/system';
import { Box } from '@mui/material';
import tokensArcade from '../tokens-arcade';

// ============================================
// PIXEL CARD COMPONENT
// Base card primitive with arcade styling
// ============================================

const StyledPixelCard = styled(Box)(({
  variant = 'light',
  padding = 'normal',
  elevated = false,
  clickable = false,
}) => {
  // Variant styles
  const variantStyles = {
    light: {
      backgroundColor: tokensArcade.colors.pureWhite,
      borderColor: tokensArcade.colors.electricPurple,
      color: tokensArcade.colors.deepBlack,
    },
    dark: {
      backgroundColor: tokensArcade.colors.midnightBlue,
      borderColor: tokensArcade.colors.neonPink,
      color: tokensArcade.colors.pureWhite,
    },
    cream: {
      backgroundColor: tokensArcade.colors.softCream,
      borderColor: tokensArcade.colors.electricPurple,
      color: tokensArcade.colors.deepBlack,
    },
    purple: {
      backgroundColor: tokensArcade.colors.electricPurple,
      borderColor: tokensArcade.colors.neonPink,
      color: tokensArcade.colors.pureWhite,
    },
    yellow: {
      backgroundColor: tokensArcade.colors.arcadeYellow,
      borderColor: tokensArcade.colors.shadowPurple,
      color: tokensArcade.colors.deepBlack,
    },
  };

  // Padding variants
  const paddingStyles = {
    compact: tokensArcade.spacing.md,
    normal: tokensArcade.spacing.base,
    spacious: tokensArcade.spacing.xl,
    mega: tokensArcade.spacing.xxl,
  };

  return {
    // Base styles
    border: tokensArcade.borders.thick,
    borderRadius: tokensArcade.borderRadius.lg,
    boxShadow: elevated ? tokensArcade.shadows.deep : tokensArcade.shadows.arcade,
    padding: paddingStyles[padding],
    position: 'relative',
    transition: `all ${tokensArcade.motion.durations.fast} ${tokensArcade.motion.easings.snap}`,
    overflow: 'hidden',

    // Variant styles
    ...variantStyles[variant],

    // Clickable state
    ...(clickable && {
      cursor: 'pointer',
      '&:hover': {
        transform: 'translateY(-2px)',
        boxShadow: tokensArcade.shadows.deep,
      },
      '&:active': {
        transform: 'translateY(2px)',
        boxShadow: tokensArcade.shadows.arcade,
      },
    }),

    // Focus state (accessibility)
    '&:focus-visible': {
      outline: `3px solid ${tokensArcade.colors.neonCyan}`,
      outlineOffset: '3px',
    },
  };
});

// Badge slot positioned top-left corner
const BadgeSlot = styled(Box)({
  position: 'absolute',
  top: tokensArcade.spacing.sm,
  left: tokensArcade.spacing.sm,
  zIndex: 2,
});

// Badge slot positioned top-right corner
const BadgeSlotRight = styled(Box)({
  position: 'absolute',
  top: tokensArcade.spacing.sm,
  right: tokensArcade.spacing.sm,
  zIndex: 2,
});

// ============================================
// PIXEL CARD COMPONENT
// ============================================

const PixelCard = ({
  children,
  variant = 'light',
  padding = 'normal',
  elevated = false,
  clickable = false,
  badge = null,
  badgeRight = null,
  onClick,
  ...props
}) => {
  return (
    <StyledPixelCard
      variant={variant}
      padding={padding}
      elevated={elevated}
      clickable={clickable}
      onClick={clickable ? onClick : undefined}
      tabIndex={clickable ? 0 : undefined}
      role={clickable ? 'button' : undefined}
      {...props}
    >
      {badge && <BadgeSlot>{badge}</BadgeSlot>}
      {badgeRight && <BadgeSlotRight>{badgeRight}</BadgeSlotRight>}
      {children}
    </StyledPixelCard>
  );
};

export default PixelCard;
