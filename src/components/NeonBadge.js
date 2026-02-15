import React from 'react';
import { styled } from '@mui/system';
import { Box } from '@mui/material';
import tokensArcade from '../tokens-arcade';

// ============================================
// NEON BADGE COMPONENT
// Pills, chips, tags with arcade styling
// ============================================

const StyledNeonBadge = styled(Box)(({ color = 'pink', size = 'md' }) => {
  // Color variants
  const colorStyles = {
    pink: {
      backgroundColor: tokensArcade.colors.neonPink,
      color: tokensArcade.colors.pureWhite,
      borderColor: tokensArcade.colors.shadowPurple,
    },
    cyan: {
      backgroundColor: tokensArcade.colors.neonCyan,
      color: tokensArcade.colors.deepBlack,
      borderColor: tokensArcade.colors.shadowPurple,
    },
    yellow: {
      backgroundColor: tokensArcade.colors.arcadeYellow,
      color: tokensArcade.colors.deepBlack,
      borderColor: tokensArcade.colors.shadowPurple,
    },
    purple: {
      backgroundColor: tokensArcade.colors.electricPurple,
      color: tokensArcade.colors.pureWhite,
      borderColor: tokensArcade.colors.shadowPurple,
    },
    green: {
      backgroundColor: tokensArcade.colors.mintGreen,
      color: tokensArcade.colors.deepBlack,
      borderColor: tokensArcade.colors.shadowPurple,
    },
    orange: {
      backgroundColor: tokensArcade.colors.hotOrange,
      color: tokensArcade.colors.pureWhite,
      borderColor: tokensArcade.colors.shadowPurple,
    },
  };

  // Size variants
  const sizeStyles = {
    sm: {
      fontSize: tokensArcade.fonts.xs,
      padding: `${tokensArcade.spacing.xs} ${tokensArcade.spacing.sm}`,
      height: '20px',
    },
    md: {
      fontSize: tokensArcade.fonts.sm,
      padding: `${tokensArcade.spacing.xs} ${tokensArcade.spacing.md}`,
      height: '24px',
    },
    lg: {
      fontSize: tokensArcade.fonts.base,
      padding: `${tokensArcade.spacing.sm} ${tokensArcade.spacing.base}`,
      height: '32px',
    },
  };

  return {
    // Base styles
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: tokensArcade.spacing.xs,
    fontFamily: tokensArcade.fonts.display,
    fontWeight: tokensArcade.fonts.weights.bold,
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    border: tokensArcade.borders.base,
    borderRadius: tokensArcade.borderRadius.pill,
    boxShadow: tokensArcade.shadows.pixel,
    whiteSpace: 'nowrap',

    // Color styles
    ...colorStyles[color],

    // Size styles
    ...sizeStyles[size],
  };
});

// ============================================
// NEON BADGE COMPONENT
// ============================================

const NeonBadge = ({
  children,
  color = 'pink',
  size = 'md',
  icon = null,
  ...props
}) => {
  return (
    <StyledNeonBadge color={color} size={size} {...props}>
      {icon && <span style={{ display: 'inline-flex', alignItems: 'center' }}>{icon}</span>}
      {children}
    </StyledNeonBadge>
  );
};

export default NeonBadge;
