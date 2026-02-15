import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { styled, keyframes } from '@mui/system';
import {
  CircularProgress,
  IconButton,
  Button,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import VisibilityIcon from '@mui/icons-material/Visibility';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import AuthContext from './AuthContext';
import { getUserFlipHistory } from './utils/bookmarkUtils';
import tokens from './tokens';

/**
 * MyHistory Page - Refined Design
 *
 * Clean, readable layout optimized for mobile and desktop.
 * Consistent with MyComments and Mypage styling.
 */

// Animations
const fadeInUp = keyframes`
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const float = keyframes`
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-8px); }
`;

// Layout Components
const Container = styled('div')({
  minHeight: '100vh',
  backgroundColor: 'var(--bg-color)',
  paddingBottom: '80px',
});

const Header = styled('div')({
  background: `linear-gradient(135deg, ${tokens.colors.primary} 0%, #6b5c8a 100%)`,
  color: tokens.colors.white,
  height: '60px',
  position: 'sticky',
  top: 0,
  zIndex: 100,
  boxShadow: tokens.shadows.medium,
  width: '100%',
});

const HeaderInner = styled('div')({
  maxWidth: '500px',
  width: '100%',
  height: '60px',
  margin: '0 auto',
  padding: '0 20px',
  display: 'flex',
  alignItems: 'center',
  position: 'relative',
});

const BackButton = styled(IconButton)({
  color: tokens.colors.white,
  zIndex: 1,
  '&:hover': {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
});

const Title = styled('h1')({
  margin: 0,
  fontSize: '1.3rem',
  fontWeight: 700,
  fontFamily: tokens.fonts.korean,
  position: 'absolute',
  left: '50%',
  transform: 'translateX(-50%)',
  display: 'inline-flex',
  alignItems: 'center',
  gap: '8px',
});

const Content = styled('div')({
  maxWidth: '500px',
  margin: '0 auto',
  padding: '20px',
});

// Stats Card
const StatsCard = styled('div')({
  backgroundColor: tokens.colors.white,
  borderRadius: tokens.borderRadius.medium,
  padding: '24px',
  marginBottom: '20px',
  boxShadow: tokens.shadows.light,
  border: '1px solid rgba(89, 75, 115, 0.1)',
});

const StatsGrid = styled('div')({
  display: 'grid',
  gridTemplateColumns: '1fr 1fr',
  gap: '24px',
  textAlign: 'center',
});

const StatBox = styled('div')({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: '8px',
});

const StatNumber = styled('div')({
  fontSize: '2rem',
  fontWeight: 700,
  color: tokens.colors.primary,
  lineHeight: 1,
  fontFamily: tokens.fonts.body,
});

const StatLabel = styled('div')({
  fontSize: '0.85rem',
  fontWeight: 600,
  color: tokens.colors.text,
  fontFamily: tokens.fonts.korean,
});

// History List
const HistoryList = styled('div')({
  display: 'flex',
  flexDirection: 'column',
  gap: '12px',
});

const HistoryCard = styled('div')(({ index }) => ({
  backgroundColor: tokens.colors.white,
  borderRadius: tokens.borderRadius.medium,
  padding: '16px',
  boxShadow: tokens.shadows.light,
  border: '1px solid rgba(89, 75, 115, 0.1)',
  cursor: 'pointer',
  transition: 'all 0.2s ease',
  animation: `${fadeInUp} 0.4s ease ${index * 0.05}s backwards`,

  '&:hover': {
    boxShadow: tokens.shadows.medium,
    transform: 'translateY(-2px)',
    borderColor: tokens.colors.primary,
  },
}));

const CardTop = styled('div')({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  marginBottom: '8px',
  gap: '12px',
});

const ViewBadge = styled('div')({
  display: 'inline-flex',
  alignItems: 'center',
  gap: '6px',
  padding: '6px 12px',
  background: `linear-gradient(135deg, ${tokens.colors.primary} 0%, ${tokens.colors.primaryLight} 100%)`,
  borderRadius: '20px',
  fontSize: '0.85rem',
  fontWeight: 700,
  color: tokens.colors.white,
  fontFamily: tokens.fonts.korean,
  boxShadow: '0 2px 8px rgba(89, 75, 115, 0.2)',
});

const Timestamp = styled('div')({
  display: 'flex',
  alignItems: 'center',
  gap: '4px',
  fontSize: '0.75rem',
  color: tokens.colors.textSecondary,
  fontWeight: 500,
  fontFamily: tokens.fonts.korean,
});

const QuestionText = styled('p')({
  margin: 0,
  fontSize: '0.95rem',
  color: tokens.colors.text,
  lineHeight: 1.5,
  fontWeight: 400,
  fontFamily: tokens.fonts.korean,
  textAlign: 'left',

  // Line clamping
  display: '-webkit-box',
  WebkitLineClamp: 2,
  WebkitBoxOrient: 'vertical',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  wordBreak: 'keep-all',
  overflowWrap: 'break-word',
});

// Empty State
const EmptyState = styled('div')({
  textAlign: 'center',
  padding: '100px 20px',
  animation: `${fadeInUp} 0.6s cubic-bezier(0.4, 0, 0.2, 1)`,
});

const EmptyIcon = styled('div')({
  fontSize: '6rem',
  marginBottom: '24px',
  opacity: 0.4,
  animation: `${float} 3s ease-in-out infinite`,
});

const EmptyTitle = styled('h2')({
  margin: '0 0 12px 0',
  fontSize: '1.4rem',
  fontWeight: 800,
  color: tokens.colors.text,
  fontFamily: tokens.fonts.korean,
  letterSpacing: '-0.5px',
});

const EmptyText = styled('p')({
  margin: '0 0 32px 0',
  fontSize: '0.95rem',
  color: tokens.colors.textSecondary,
  lineHeight: 1.6,
  fontFamily: tokens.fonts.korean,
});

const StartButton = styled(Button)({
  background: `linear-gradient(135deg, ${tokens.colors.primary} 0%, ${tokens.colors.primaryLight} 100%)`,
  color: tokens.colors.white,
  borderRadius: '16px',
  padding: '14px 32px',
  fontSize: '1rem',
  fontWeight: 700,
  fontFamily: tokens.fonts.korean,
  textTransform: 'none',
  boxShadow: '0 8px 24px rgba(89, 75, 115, 0.3), 0 4px 8px rgba(89, 75, 115, 0.2)',
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',

  '&:hover': {
    background: `linear-gradient(135deg, #7d6ea0 0%, ${tokens.colors.primary} 100%)`,
    transform: 'translateY(-3px)',
    boxShadow: '0 12px 32px rgba(89, 75, 115, 0.4), 0 6px 12px rgba(89, 75, 115, 0.25)',
  },

  '&:active': {
    transform: 'translateY(-1px)',
  },
});

// Load More
const LoadMoreButton = styled(Button)({
  display: 'block',
  margin: '32px auto 0',
  color: tokens.colors.primary,
  fontWeight: 700,
  fontFamily: tokens.fonts.korean,
  borderRadius: '12px',
  padding: '12px 28px',
  fontSize: '0.9rem',
  textTransform: 'none',
  border: `2px solid ${tokens.colors.primary}`,
  background: 'transparent',
  transition: 'all 0.3s ease',

  '&:hover': {
    background: tokens.colors.primary,
    color: '#FFFFFF',
    transform: 'translateY(-2px)',
    boxShadow: '0 8px 20px rgba(89, 75, 115, 0.25)',
  },
});

const LoadingContainer = styled('div')({
  display: 'flex',
  justifyContent: 'center',
  padding: '60px 20px',
});

const LoginPrompt = styled('div')({
  textAlign: 'center',
  padding: '60px 20px',
  animation: `${fadeInUp} 0.6s cubic-bezier(0.4, 0, 0.2, 1)`,
});

const LoginButton = styled(Button)({
  background: `linear-gradient(135deg, ${tokens.colors.primary} 0%, #7d6ea0 100%)`,
  color: tokens.colors.white,
  borderRadius: '16px',
  padding: '14px 32px',
  fontSize: '1rem',
  fontWeight: 700,
  fontFamily: tokens.fonts.korean,
  textTransform: 'none',
  marginTop: '20px',
  boxShadow: '0 8px 24px rgba(89, 75, 115, 0.3)',

  '&:hover': {
    background: `linear-gradient(135deg, #7d6ea0 0%, ${tokens.colors.primary} 100%)`,
    transform: 'translateY(-2px)',
    boxShadow: '0 12px 32px rgba(89, 75, 115, 0.4)',
  },
});

const MyHistory = () => {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);

  const ITEMS_PER_PAGE = 10;

  // Fetch history on mount
  useEffect(() => {
    if (user) {
      fetchHistory(0, true);
    } else {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const fetchHistory = async (currentOffset, reset = false) => {
    if (reset) {
      setLoading(true);
    } else {
      setLoadingMore(true);
    }

    const { data, hasMore: more } = await getUserFlipHistory(
      user?.id,
      currentOffset,
      ITEMS_PER_PAGE
    );

    if (reset) {
      setHistory(data);
    } else {
      setHistory((prev) => [...prev, ...data]);
    }

    setHasMore(more);
    setOffset(currentOffset + ITEMS_PER_PAGE);
    setLoading(false);
    setLoadingMore(false);
  };

  const handleHistoryClick = (quizIndex) => {
    navigate(`/shared-quiz?num=${quizIndex}`);
  };

  const handleLoadMore = () => {
    fetchHistory(offset, false);
  };

  // Strip HTML tags for preview
  const stripHtml = (html) => {
    const tmp = document.createElement('div');
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || '';
  };

  // Format timestamp to Korean relative time
  const formatTimestamp = (timestamp) => {
    const now = new Date();
    const viewedDate = new Date(timestamp);
    const diffMs = now - viewedDate;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return '방금 전';
    if (diffMins < 60) return `${diffMins}분 전`;
    if (diffHours < 24) return `${diffHours}시간 전`;
    if (diffDays < 7) return `${diffDays}일 전`;

    return viewedDate.toLocaleDateString('ko-KR', {
      month: 'long',
      day: 'numeric',
    });
  };

  // Calculate total views
  const totalViews = history.reduce((sum, item) => sum + item.flip_count, 0);

  if (!user) {
    return (
      <Container>
        <Helmet>
          <title>봤던 퀴즈 | 하이유모어</title>
          <meta name="robots" content="noindex" />
        </Helmet>
        <Header>
          <HeaderInner>
            <BackButton onClick={() => navigate(-1)} aria-label="뒤로가기">
              <ArrowBackIcon />
            </BackButton>
            <Title>👀 봤던 퀴즈</Title>
          </HeaderInner>
        </Header>
        <Content>
          <LoginPrompt>
            <EmptyIcon>👀</EmptyIcon>
            <EmptyTitle>로그인이 필요해요</EmptyTitle>
            <EmptyText>로그인하면 본 퀴즈 기록을 확인할 수 있어요!</EmptyText>
            <LoginButton onClick={() => navigate('/login')}>
              카카오 로그인하기
            </LoginButton>
          </LoginPrompt>
        </Content>
      </Container>
    );
  }

  if (loading) {
    return (
      <Container>
        <Helmet>
          <title>봤던 퀴즈 | 하이유모어</title>
          <meta name="robots" content="noindex" />
        </Helmet>
        <Header>
          <HeaderInner>
            <BackButton onClick={() => navigate(-1)} aria-label="뒤로가기">
              <ArrowBackIcon />
            </BackButton>
            <Title>👀 봤던 퀴즈</Title>
          </HeaderInner>
        </Header>
        <Content>
          <LoadingContainer>
            <CircularProgress sx={{ color: tokens.colors.primary }} />
          </LoadingContainer>
        </Content>
      </Container>
    );
  }

  return (
    <Container>
      <Helmet>
        <title>{`봤던 퀴즈 (${history.length}개) | 하이유모어`}</title>
        <meta name="robots" content="noindex" />
      </Helmet>

      <Header>
        <HeaderInner>
          <BackButton onClick={() => navigate(-1)} aria-label="뒤로가기">
            <ArrowBackIcon />
          </BackButton>
          <Title>👀 봤던 퀴즈</Title>
        </HeaderInner>
      </Header>

      <Content>
        {history.length === 0 ? (
          <EmptyState>
            <EmptyIcon>👀</EmptyIcon>
            <EmptyTitle>아직 본 퀴즈가 없어요</EmptyTitle>
            <EmptyText>
              재미있는 퀴즈를 풀어보면
              <br />
              여기에 기록이 남아요!
            </EmptyText>
            <StartButton onClick={() => navigate('/')}>
              퀴즈 풀러가기
            </StartButton>
          </EmptyState>
        ) : (
          <>
            <StatsCard>
              <StatsGrid>
                <StatBox>
                  <StatNumber>{history.length}</StatNumber>
                  <StatLabel>퀴즈</StatLabel>
                </StatBox>
                <StatBox>
                  <StatNumber>{totalViews}</StatNumber>
                  <StatLabel>조회수</StatLabel>
                </StatBox>
              </StatsGrid>
            </StatsCard>

            <HistoryList>
              {history.map((item, index) => (
                <HistoryCard
                  key={item.id}
                  index={index}
                  onClick={() => handleHistoryClick(item.quiz_index)}
                >
                  <CardTop>
                    <ViewBadge>
                      <VisibilityIcon sx={{ fontSize: '0.9rem' }} />
                      {item.flip_count}번
                    </ViewBadge>
                    <Timestamp>
                      <CalendarTodayIcon sx={{ fontSize: '0.7rem' }} />
                      {formatTimestamp(item.last_flipped_at)}
                    </Timestamp>
                  </CardTop>
                  <QuestionText>{stripHtml(item.question)}</QuestionText>
                </HistoryCard>
              ))}
            </HistoryList>

            {hasMore && (
              <LoadMoreButton onClick={handleLoadMore} disabled={loadingMore}>
                {loadingMore ? <CircularProgress size={20} /> : '더 보기'}
              </LoadMoreButton>
            )}
          </>
        )}
      </Content>
    </Container>
  );
};

export default MyHistory;
