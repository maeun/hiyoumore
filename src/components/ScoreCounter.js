import React, { useEffect, useState } from 'react';
import { styled } from '@mui/system';
import { Box } from '@mui/material';
import tokensArcade from '../tokens-arcade';

// ============================================
// SCORE COUNTER COMPONENT
// Animated number counter with neon glow
// ============================================

const StyledCounter = styled(Box)(({ color = 'pink' }) => {
  // Color variants for neon glow
  const colorStyles = {
    pink: {
      color: tokensArcade.colors.neonPink,
      textShadow: tokensArcade.shadows.neonPink,
    },
    cyan: {
      color: tokensArcade.colors.neonCyan,
      textShadow: tokensArcade.shadows.neonCyan,
    },
    yellow: {
      color: tokensArcade.colors.arcadeYellow,
      textShadow: tokensArcade.shadows.neonYellow,
    },
    purple: {
      color: tokensArcade.colors.electricPurple,
      textShadow: tokensArcade.shadows.neonPurple,
    },
  };

  return {
    fontFamily: tokensArcade.fonts.number,
    fontSize: tokensArcade.fonts.mega,
    fontWeight: tokensArcade.fonts.weights.black,
    lineHeight: tokensArcade.fonts.lineHeights.tight,
    letterSpacing: '2px',
    ...colorStyles[color],
  };
});

// ============================================
// SCORE COUNTER COMPONENT
// ============================================

const ScoreCounter = ({
  value = 0,
  duration = 1000,
  color = 'pink',
  startValue = 0,
  ...props
}) => {
  const [displayValue, setDisplayValue] = useState(startValue);

  useEffect(() => {
    let startTime = null;
    let animationFrame = null;

    const animate = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);

      // Easing function (ease-out)
      const easeOut = 1 - Math.pow(1 - progress, 3);
      const currentValue = Math.floor(startValue + (value - startValue) * easeOut);

      setDisplayValue(currentValue);

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      }
    };

    animationFrame = requestAnimationFrame(animate);

    return () => {
      if (animationFrame) {
        cancelAnimationFrame(animationFrame);
      }
    };
  }, [value, duration, startValue]);

  return (
    <StyledCounter color={color} {...props}>
      {displayValue.toLocaleString()}
    </StyledCounter>
  );
};

export default ScoreCounter;
