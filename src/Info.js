import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { styled } from '@mui/system';
import { Box, Typography } from '@mui/material';
import tokensArcade from './tokens-arcade';
import ArticleIcon from '@mui/icons-material/Article';
import PrivacyTipIcon from '@mui/icons-material/PrivacyTip';

// ============================================
// INFO PAGE LAYOUT
// ============================================

const PageContainer = styled(Box)({
  minHeight: 'calc(100vh - 70px - 80px)',
  backgroundColor: tokensArcade.colors.softCream,
  paddingBottom: '100px', // Space for TabBar
  boxSizing: 'border-box',
});

const PageHeader = styled(Box)({
  background: tokensArcade.colors.deepBlack,
  border: `${tokensArcade.borders.base} ${tokensArcade.colors.neonCyan}`,
  borderTop: 'none',
  borderLeft: 'none',
  borderRight: 'none',
  height: '60px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  boxShadow: `0 4px 0 ${tokensArcade.colors.shadowPurple}`,
});

const PageTitle = styled(Typography)({
  fontFamily: tokensArcade.fonts.pixel,
  fontSize: tokensArcade.fonts.sm,
  fontWeight: tokensArcade.fonts.weights.normal,
  color: tokensArcade.colors.neonCyan,
  textShadow: tokensArcade.shadows.neonCyan,
  textTransform: 'uppercase',
  letterSpacing: '1px',
});

const Content = styled(Box)({
  maxWidth: '500px',
  margin: '0 auto',
  padding: tokensArcade.spacing.lg,
});

// Menu Card
const MenuCard = styled(Box)({
  backgroundColor: tokensArcade.colors.pureWhite,
  border: tokensArcade.borders.thick,
  borderColor: tokensArcade.colors.electricPurple,
  borderRadius: tokensArcade.borderRadius.lg,
  boxShadow: tokensArcade.shadows.arcade,
  overflow: 'hidden',
  marginBottom: tokensArcade.spacing.base,
});

const MenuItem = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  gap: tokensArcade.spacing.base,
  padding: tokensArcade.spacing.lg,
  cursor: 'pointer',
  transition: `all ${tokensArcade.motion.durations.fast} ${tokensArcade.motion.easings.snap}`,
  borderBottom: `2px solid ${tokensArcade.colors.softCream}`,

  '&:last-child': {
    borderBottom: 'none',
  },

  '&:hover': {
    backgroundColor: tokensArcade.colors.softCream,
    transform: 'translateX(4px)',
  },

  '&:active': {
    transform: 'translateX(2px)',
  },
});

const IconWrapper = styled(Box)({
  width: '48px',
  height: '48px',
  backgroundColor: tokensArcade.colors.neonPink,
  border: tokensArcade.borders.base,
  borderColor: tokensArcade.colors.shadowPurple,
  borderRadius: tokensArcade.borderRadius.md,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  flexShrink: 0,
  boxShadow: tokensArcade.shadows.pixel,

  '& .MuiSvgIcon-root': {
    fontSize: '28px',
    color: tokensArcade.colors.pureWhite,
  },
});

const MenuText = styled(Box)({
  flex: 1,
});

const MenuTitle = styled(Typography)({
  fontFamily: tokensArcade.fonts.display,
  fontSize: tokensArcade.fonts.base,
  fontWeight: tokensArcade.fonts.weights.bold,
  color: tokensArcade.colors.deepBlack,
  marginBottom: tokensArcade.spacing.xs,
});

const MenuDescription = styled(Typography)({
  fontFamily: tokensArcade.fonts.body,
  fontSize: tokensArcade.fonts.xs,
  color: tokensArcade.colors.pixelGray,
  lineHeight: 1.4,
});

// ============================================
// INFO PAGE COMPONENT
// ============================================

const Info = () => {
  const navigate = useNavigate();

  return (
    <PageContainer>
      <Helmet>
        <title>INFO | 하이유모어</title>
        <meta name="robots" content="noindex" />
      </Helmet>

      <PageHeader>
        <PageTitle>ℹ️ INFORMATION</PageTitle>
      </PageHeader>

      <Content>
        <MenuCard>
          <MenuItem onClick={() => navigate('/terms')}>
            <IconWrapper>
              <ArticleIcon />
            </IconWrapper>
            <MenuText>
              <MenuTitle>이용약관</MenuTitle>
              <MenuDescription>서비스 이용에 관한 약관</MenuDescription>
            </MenuText>
          </MenuItem>

          <MenuItem onClick={() => navigate('/privacy')}>
            <IconWrapper style={{ backgroundColor: tokensArcade.colors.neonCyan }}>
              <PrivacyTipIcon />
            </IconWrapper>
            <MenuText>
              <MenuTitle>개인정보처리방침</MenuTitle>
              <MenuDescription>개인정보 수집 및 이용에 관한 방침</MenuDescription>
            </MenuText>
          </MenuItem>
        </MenuCard>
      </Content>
    </PageContainer>
  );
};

export default Info;
