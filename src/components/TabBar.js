import React from 'react';
import { styled } from '@mui/system';
import { Box } from '@mui/material';
import { NavLink } from 'react-router-dom';
import tokensArcade from '../tokens-arcade';
import HomeIcon from '@mui/icons-material/Home';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import PersonIcon from '@mui/icons-material/Person';
import InfoIcon from '@mui/icons-material/Info';

// ============================================
// TAB BAR COMPONENT
// Arcade control panel bottom navigation
// ============================================

const TabBarContainer = styled(Box)({
  position: 'fixed',
  bottom: 0,
  left: '50%',
  transform: 'translateX(-50%)',
  width: 'min(500px, 100%)',
  height: '80px',
  backgroundColor: tokensArcade.colors.midnightBlue,
  borderTop: `3px solid ${tokensArcade.colors.pureWhite}`,
  display: 'flex',
  justifyContent: 'space-around',
  alignItems: 'center',
  padding: `${tokensArcade.spacing.sm} ${tokensArcade.spacing.base}`,
  zIndex: tokensArcade.zIndex.sticky,
  boxShadow: `0 -4px 0 ${tokensArcade.colors.shadowPurple}`,
});

const TabButton = styled(NavLink)({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  gap: tokensArcade.spacing.xs,
  padding: tokensArcade.spacing.sm,
  borderRadius: tokensArcade.borderRadius.md,
  textDecoration: 'none',
  color: tokensArcade.colors.pixelGray,
  transition: `all ${tokensArcade.motion.durations.fast} ${tokensArcade.motion.easings.snap}`,
  cursor: 'pointer',
  minWidth: '60px',
  position: 'relative',

  // Icon wrapper
  '& .icon-wrapper': {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '40px',
    height: '40px',
    borderRadius: tokensArcade.borderRadius.md,
    border: `2px solid transparent`,
    transition: `all ${tokensArcade.motion.durations.fast} ${tokensArcade.motion.easings.bounce}`,
  },

  // Icon
  '& .MuiSvgIcon-root': {
    fontSize: '28px',
    transition: `all ${tokensArcade.motion.durations.fast} ${tokensArcade.motion.easings.bounce}`,
  },

  // Label
  '& .tab-label': {
    fontFamily: tokensArcade.fonts.pixel,
    fontSize: tokensArcade.fonts.xs,
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
  },

  // Hover state
  '&:hover': {
    color: tokensArcade.colors.neonCyan,
    transform: 'translateY(-2px)',

    '& .icon-wrapper': {
      borderColor: tokensArcade.colors.neonCyan,
      boxShadow: `0 0 10px ${tokensArcade.colors.neonCyan}`,
    },
  },

  // Active state (selected tab)
  '&.active': {
    color: tokensArcade.colors.neonPink,

    '& .icon-wrapper': {
      backgroundColor: tokensArcade.colors.neonPink,
      borderColor: tokensArcade.colors.pureWhite,
      boxShadow: tokensArcade.shadows.glowPink,
    },

    '& .MuiSvgIcon-root': {
      color: tokensArcade.colors.pureWhite,
      transform: 'scale(1.1)',
    },

    // Pixel indicator above active tab
    '&::before': {
      content: '""',
      position: 'absolute',
      top: '-8px',
      left: '50%',
      transform: 'translateX(-50%)',
      width: '8px',
      height: '8px',
      backgroundColor: tokensArcade.colors.neonPink,
      boxShadow: `0 0 8px ${tokensArcade.colors.neonPink}`,
      animation: 'pulse 2s ease-in-out infinite',
    },

    '@keyframes pulse': {
      '0%, 100%': {
        opacity: 1,
      },
      '50%': {
        opacity: 0.5,
      },
    },
  },

  // Active click state
  '&:active': {
    transform: 'translateY(2px)',
  },
});

// ============================================
// TAB BAR COMPONENT
// ============================================

const TabBar = () => {
  const tabs = [
    { path: '/', icon: <HomeIcon />, label: 'Home' },
    { path: '/my-bookmarks', icon: <BookmarkIcon />, label: 'Saved' },
    { path: '/mypage', icon: <PersonIcon />, label: 'Profile' },
    { path: '/info', icon: <InfoIcon />, label: 'Info' },
  ];

  return (
    <TabBarContainer>
      {tabs.map((tab) => (
        <TabButton
          key={tab.path}
          to={tab.path}
          end={tab.path === '/'}
        >
          <div className="icon-wrapper">
            {tab.icon}
          </div>
          <span className="tab-label">{tab.label}</span>
        </TabButton>
      ))}
    </TabBarContainer>
  );
};

export default TabBar;
