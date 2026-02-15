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
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import AuthContext from './AuthContext';
import { getUserFlipHistory } from './utils/bookmarkUtils';
import tokens from './tokens';

/**
 * MyHistory Page - Timeline Memory Wall Design
 *
 * Aesthetic: Playful sophistication with staggered card reveals,
 * asymmetric layouts, and dynamic hover states.
 */

// Animations
const fadeInUp = keyframes`
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const slideInLeft = keyframes`
  from {
    opacity: 0;
    transform: translateX(-40px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
`;

const float = keyframes`
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
`;

const shimmer = keyframes`
  0% { background-position: -200% center; }
  100% { background-position: 200% center; }
`;

// Layout Components
const Container = styled('div')({
  minHeight: '100vh',
  background: 'linear-gradient(180deg, #F8F9FE 0%, #EEF1FB 100%)',
  paddingBottom: '80px',
  position: 'relative',

  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '400px',
    background: `
      radial-gradient(circle at 20% 50%, rgba(124, 92, 219, 0.08) 0%, transparent 50%),
      radial-gradient(circle at 80% 80%, rgba(124, 92, 219, 0.05) 0%, transparent 50%)
    `,
    pointerEvents: 'none',
    zIndex: 0,
  },
});

const Header = styled('div')({
  background: `linear-gradient(135deg, ${tokens.colors.primary} 0%, #7d6ea0 100%)`,
  color: tokens.colors.white,
  padding: '24px 20px',
  display: 'flex',
  alignItems: 'center',
  gap: '12px',
  position: 'sticky',
  top: 0,
  zIndex: 100,
  boxShadow: '0 8px 32px rgba(89, 75, 115, 0.2)',

  '&::after': {
    content: '""',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '3px',
    background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)',
  },
});

const BackButton = styled(IconButton)({
  color: tokens.colors.white,
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  '&:hover': {
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    transform: 'translateX(-3px)',
  },
});

const Title = styled('h1')({
  margin: 0,
  fontSize: '1.4rem',
  fontWeight: 800,
  fontFamily: tokens.fonts.korean,
  letterSpacing: '-0.5px',
});

const Content = styled('div')({
  maxWidth: '540px',
  margin: '0 auto',
  padding: '24px 20px',
  position: 'relative',
  zIndex: 1,
});

// Stats Hero Section
const StatsHero = styled('div')({
  background: 'linear-gradient(135deg, #FFFFFF 0%, #F8F9FE 100%)',
  borderRadius: '24px',
  padding: '32px 28px',
  marginBottom: '32px',
  boxShadow: '0 20px 60px rgba(89, 75, 115, 0.12), 0 8px 16px rgba(89, 75, 115, 0.08)',
  border: '1px solid rgba(124, 92, 219, 0.1)',
  position: 'relative',
  overflow: 'hidden',
  animation: `${fadeInUp} 0.6s cubic-bezier(0.4, 0, 0.2, 1)`,

  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    right: 0,
    width: '200px',
    height: '200px',
    background: 'radial-gradient(circle, rgba(124, 92, 219, 0.08) 0%, transparent 70%)',
    borderRadius: '50%',
    transform: 'translate(50%, -50%)',
  },
});

const StatsGrid = styled('div')({
  display: 'grid',
  gridTemplateColumns: '1fr 1fr',
  gap: '20px',
  position: 'relative',
  zIndex: 1,
});

const StatBox = styled('div')({
  textAlign: 'center',
  position: 'relative',

  '&::after': {
    content: '""',
    position: 'absolute',
    bottom: '-10px',
    left: '50%',
    transform: 'translateX(-50%)',
    width: '40px',
    height: '3px',
    background: `linear-gradient(90deg, transparent, ${tokens.colors.primary}, transparent)`,
    borderRadius: '2px',
  },
});

const StatNumber = styled('div')({
  fontSize: '3.2rem',
  fontWeight: 900,
  background: `linear-gradient(135deg, ${tokens.colors.primary} 0%, #9b87d8 100%)`,
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  lineHeight: 1,
  marginBottom: '8px',
  fontFamily: tokens.fonts.body,
  letterSpacing: '-2px',
});

const StatLabel = styled('div')({
  fontSize: '0.8rem',
  fontWeight: 700,
  color: tokens.colors.textSecondary,
  textTransform: 'uppercase',
  letterSpacing: '1.2px',
  fontFamily: tokens.fonts.korean,
});

// Timeline
const TimelineContainer = styled('div')({
  position: 'relative',

  '&::before': {
    content: '""',
    position: 'absolute',
    left: '24px',
    top: '20px',
    bottom: '20px',
    width: '2px',
    background: 'linear-gradient(180deg, rgba(124, 92, 219, 0.2) 0%, rgba(124, 92, 219, 0.05) 100%)',
    borderRadius: '2px',
  },
});

const HistoryCard = styled('div')(({ index }) => ({
  backgroundColor: '#FFFFFF',
  borderRadius: '20px',
  padding: '20px',
  marginBottom: '16px',
  marginLeft: '48px',
  boxShadow: '0 8px 24px rgba(89, 75, 115, 0.08), 0 2px 6px rgba(89, 75, 115, 0.04)',
  border: '1.5px solid rgba(124, 92, 219, 0.08)',
  position: 'relative',
  cursor: 'pointer',
  transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
  animation: `${fadeInUp} 0.5s cubic-bezier(0.4, 0, 0.2, 1) ${index * 0.08}s backwards`,

  '&::before': {
    content: '""',
    position: 'absolute',
    left: '-31px',
    top: '24px',
    width: '14px',
    height: '14px',
    background: `linear-gradient(135deg, ${tokens.colors.primary} 0%, ${tokens.colors.primaryLight} 100%)`,
    borderRadius: '50%',
    border: '3px solid #FFFFFF',
    boxShadow: '0 3px 12px rgba(124, 92, 219, 0.3)',
    transition: 'all 0.3s ease',
    zIndex: 2,
  },

  '&:hover': {
    transform: 'translateX(8px) translateY(-4px) rotate(0.5deg)',
    boxShadow: '0 20px 48px rgba(89, 75, 115, 0.15), 0 8px 16px rgba(89, 75, 115, 0.1)',
    borderColor: tokens.colors.primary,

    '&::before': {
      transform: 'scale(1.3)',
      boxShadow: '0 4px 16px rgba(124, 92, 219, 0.5)',
    },
  },

  '&:active': {
    transform: 'translateX(6px) translateY(-2px)',
  },
}));

const CardHeader = styled('div')({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  marginBottom: '12px',
  gap: '12px',
});

const ViewCount = styled('div')({
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  padding: '8px 14px',
  background: `linear-gradient(135deg, ${tokens.colors.primaryLight} 0%, ${tokens.colors.primary} 100%)`,
  borderRadius: '12px',
  boxShadow: '0 4px 12px rgba(124, 92, 219, 0.25)',
  position: 'relative',
  overflow: 'hidden',

  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)',
    backgroundSize: '200% 100%',
  },

  '&:hover::before': {
    animation: `${shimmer} 2s infinite`,
  },
});

const ViewNumber = styled('span')({
  fontSize: '1.3rem',
  fontWeight: 900,
  color: '#FFFFFF',
  lineHeight: 1,
  fontFamily: tokens.fonts.body,
});

const ViewLabel = styled('span')({
  fontSize: '0.7rem',
  fontWeight: 700,
  color: 'rgba(255, 255, 255, 0.95)',
  textTransform: 'uppercase',
  letterSpacing: '0.5px',
  fontFamily: tokens.fonts.korean,
});

const Timestamp = styled('div')({
  display: 'flex',
  alignItems: 'center',
  gap: '6px',
  fontSize: '0.75rem',
  color: tokens.colors.textSecondary,
  fontWeight: 600,
  fontFamily: tokens.fonts.korean,
  padding: '4px 10px',
  background: 'rgba(124, 92, 219, 0.05)',
  borderRadius: '8px',
});

const QuestionText = styled('p')({
  margin: 0,
  fontSize: '1rem',
  color: tokens.colors.text,
  lineHeight: 1.6,
  fontWeight: 500,
  fontFamily: tokens.fonts.korean,

  // Line clamping
  display: '-webkit-box',
  WebkitLineClamp: 2,
  WebkitBoxOrient: 'vertical',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  wordBreak: 'keep-all',
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
  padding: '80px 20px',
});

const LoginPrompt = styled('div')({
  textAlign: 'center',
  padding: '80px 20px',
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
          <BackButton onClick={() => navigate(-1)} aria-label="뒤로가기">
            <ArrowBackIcon />
          </BackButton>
          <Title>👀 봤던 퀴즈</Title>
        </Header>
        <LoginPrompt>
          <EmptyIcon>👀</EmptyIcon>
          <EmptyTitle>로그인이 필요해요</EmptyTitle>
          <EmptyText>로그인하면 본 퀴즈 기록을 확인할 수 있어요!</EmptyText>
          <LoginButton onClick={() => navigate('/login')}>
            카카오 로그인하기
          </LoginButton>
        </LoginPrompt>
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
          <BackButton onClick={() => navigate(-1)} aria-label="뒤로가기">
            <ArrowBackIcon />
          </BackButton>
          <Title>👀 봤던 퀴즈</Title>
        </Header>
        <LoadingContainer>
          <CircularProgress sx={{ color: tokens.colors.primary }} />
        </LoadingContainer>
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
        <BackButton onClick={() => navigate(-1)} aria-label="뒤로가기">
          <ArrowBackIcon />
        </BackButton>
        <Title>👀 봤던 퀴즈</Title>
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
            <StatsHero>
              <StatsGrid>
                <StatBox>
                  <StatNumber>{history.length}</StatNumber>
                  <StatLabel>Quizzes</StatLabel>
                </StatBox>
                <StatBox>
                  <StatNumber>{totalViews}</StatNumber>
                  <StatLabel>Total Views</StatLabel>
                </StatBox>
              </StatsGrid>
            </StatsHero>

            <TimelineContainer>
              {history.map((item, index) => (
                <HistoryCard
                  key={item.id}
                  index={index}
                  onClick={() => handleHistoryClick(item.quiz_index)}
                >
                  <CardHeader>
                    <ViewCount>
                      <ViewNumber>{item.flip_count}</ViewNumber>
                      <ViewLabel>번</ViewLabel>
                    </ViewCount>
                    <Timestamp>
                      <CalendarTodayIcon sx={{ fontSize: '0.75rem' }} />
                      {formatTimestamp(item.last_flipped_at)}
                    </Timestamp>
                  </CardHeader>
                  <QuestionText>{stripHtml(item.question)}</QuestionText>
                </HistoryCard>
              ))}
            </TimelineContainer>

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
