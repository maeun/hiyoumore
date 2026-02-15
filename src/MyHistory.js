import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { styled } from '@mui/system';
import {
  CircularProgress,
  IconButton,
  Chip,
  Button,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import VisibilityIcon from '@mui/icons-material/Visibility';
import AuthContext from './AuthContext';
import { getUserFlipHistory } from './utils/bookmarkUtils';
import tokens from './tokens';

/**
 * MyHistory Page
 *
 * Displays user's viewed quiz history with:
 * - Quiz question preview (first 50 chars)
 * - Flip count badge
 * - Click to view full quiz
 * - Pagination (10 per page)
 */

const Container = styled('div')({
  minHeight: '100vh',
  backgroundColor: 'var(--bg-color)',
  paddingBottom: '80px',
});

const Header = styled('div')({
  backgroundColor: tokens.colors.primary,
  background: `linear-gradient(135deg, ${tokens.colors.primary} 0%, #6b5c8a 100%)`,
  color: tokens.colors.white,
  padding: '20px',
  display: 'flex',
  alignItems: 'center',
  gap: '12px',
  position: 'sticky',
  top: 0,
  zIndex: 100,
  boxShadow: tokens.shadows.medium,
});

const BackButton = styled(IconButton)({
  color: tokens.colors.white,
  '&:hover': {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
});

const Title = styled('h1')({
  margin: 0,
  fontSize: '1.3rem',
  fontWeight: 700,
  fontFamily: tokens.fonts.korean,
});

const Content = styled('div')({
  maxWidth: '500px',
  margin: '0 auto',
  padding: '20px',
});

const SummaryCard = styled('div')({
  backgroundColor: tokens.colors.white,
  borderRadius: tokens.borderRadius.medium,
  padding: '20px',
  marginBottom: '20px',
  boxShadow: tokens.shadows.light,
  border: `1px solid ${tokens.colors.borderLight}`,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
});

const SummaryText = styled('div')({
  display: 'flex',
  flexDirection: 'column',
  gap: '4px',
});

const SummaryTitle = styled('h2')({
  margin: 0,
  fontSize: '0.85rem',
  fontWeight: 600,
  color: tokens.colors.textSecondary,
  textTransform: 'uppercase',
  letterSpacing: '0.5px',
});

const SummaryNumber = styled('div')({
  fontSize: '2rem',
  fontWeight: 900,
  color: tokens.colors.primary,
  lineHeight: 1,
});

const EmptyState = styled('div')({
  textAlign: 'center',
  padding: '80px 20px',
  color: tokens.colors.textSecondary,
});

const EmptyIcon = styled('div')({
  fontSize: '5rem',
  marginBottom: '20px',
  opacity: 0.6,
});

const EmptyText = styled('p')({
  fontSize: '1.05rem',
  margin: '0 0 12px 0',
  color: tokens.colors.text,
  fontWeight: 500,
  lineHeight: 1.6,
});

const EmptySubtext = styled('p')({
  fontSize: '0.9rem',
  margin: '0 0 32px 0',
  color: tokens.colors.textSecondary,
});

const StartButton = styled(Button)({
  background: `linear-gradient(135deg, ${tokens.colors.primary} 0%, ${tokens.colors.primaryLight} 100%)`,
  color: tokens.colors.white,
  borderRadius: '24px',
  padding: '12px 32px',
  fontSize: '1rem',
  fontWeight: 600,
  boxShadow: '0 4px 12px rgba(89, 75, 115, 0.3)',
  '&:hover': {
    background: `linear-gradient(135deg, ${tokens.colors.primaryLight} 0%, ${tokens.colors.primary} 100%)`,
    transform: 'translateY(-2px)',
    boxShadow: '0 6px 16px rgba(89, 75, 115, 0.4)',
  },
});

const HistoryList = styled('div')({
  display: 'flex',
  flexDirection: 'column',
  gap: '12px',
});

const HistoryItem = styled('div')({
  backgroundColor: tokens.colors.white,
  borderRadius: tokens.borderRadius.medium,
  padding: '18px',
  boxShadow: tokens.shadows.light,
  display: 'flex',
  gap: '14px',
  alignItems: 'stretch',
  cursor: 'pointer',
  transition: 'all 0.3s ease',
  border: '1px solid rgba(89, 75, 115, 0.1)',
  position: 'relative',
  overflow: 'hidden',
  '&:hover': {
    boxShadow: tokens.shadows.medium,
    transform: 'translateY(-3px)',
    borderColor: tokens.colors.primary,
    '&::before': {
      opacity: 1,
    },
  },
  '&::before': {
    content: '""',
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: '4px',
    background: `linear-gradient(180deg, ${tokens.colors.primary} 0%, ${tokens.colors.primaryLight} 100%)`,
    opacity: 0,
    transition: 'opacity 0.3s ease',
  },
});

const HistoryContent = styled('div')({
  flex: 1,
  minWidth: 0,
  display: 'flex',
  flexDirection: 'column',
  gap: '8px',
});

const FlipCountBadge = styled('div')({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  minWidth: '60px',
  padding: '12px',
  background: `linear-gradient(135deg, ${tokens.colors.primaryLight} 0%, ${tokens.colors.primary} 100%)`,
  borderRadius: '12px',
  flexDirection: 'column',
  gap: '4px',
  boxShadow: '0 4px 12px rgba(89, 75, 115, 0.2)',
});

const FlipNumber = styled('div')({
  fontSize: '1.5rem',
  fontWeight: 900,
  color: tokens.colors.white,
  lineHeight: 1,
});

const FlipLabel = styled('div')({
  fontSize: '0.65rem',
  color: 'rgba(255, 255, 255, 0.9)',
  fontWeight: 600,
  textTransform: 'uppercase',
  letterSpacing: '0.5px',
});

const QuestionMeta = styled('div')({
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  marginBottom: '4px',
});

const Timestamp = styled('span')({
  fontSize: '0.75rem',
  color: tokens.colors.textSecondary,
  fontWeight: 500,
});

const QuestionPreview = styled('p')({
  margin: 0,
  fontSize: '0.95rem',
  color: tokens.colors.text,
  lineHeight: 1.5,
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  display: '-webkit-box',
  WebkitLineClamp: 2,
  WebkitBoxOrient: 'vertical',
  wordBreak: 'break-word',
});

const LoadMoreButton = styled(Button)({
  alignSelf: 'center',
  color: tokens.colors.primary,
  borderRadius: '20px',
  padding: '8px 20px',
  fontSize: '0.85rem',
  marginTop: '16px',
  '&:hover': {
    backgroundColor: 'rgba(89, 75, 115, 0.08)',
  },
});

const LoadingContainer = styled('div')({
  display: 'flex',
  justifyContent: 'center',
  padding: '40px 20px',
});

const LoginPrompt = styled('div')({
  textAlign: 'center',
  padding: '60px 20px',
});

const LoginButton = styled(Button)({
  background: `linear-gradient(135deg, ${tokens.colors.primary} 0%, #6b5c8a 100%)`,
  color: tokens.colors.white,
  borderRadius: '24px',
  padding: '12px 32px',
  fontSize: '1rem',
  fontWeight: 600,
  marginTop: '16px',
  '&:hover': {
    background: `linear-gradient(135deg, #6b5c8a 0%, ${tokens.colors.primary} 100%)`,
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
    // Navigate to shared quiz page to view the full quiz
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
            <EmptyText>아직 본 퀴즈가 없어요</EmptyText>
            <EmptySubtext>
              재미있는 퀴즈를 풀어보면
              <br />
              여기에 기록이 남아요!
            </EmptySubtext>
            <StartButton onClick={() => navigate('/')}>
              퀴즈 풀러가기
            </StartButton>
          </EmptyState>
        ) : (
          <>
            <SummaryCard>
              <SummaryText>
                <SummaryTitle>Total Viewed</SummaryTitle>
                <SummaryNumber>{history.length}</SummaryNumber>
              </SummaryText>
              <VisibilityIcon sx={{ fontSize: '3rem', color: tokens.colors.primary, opacity: 0.3 }} />
            </SummaryCard>

            <HistoryList>
              {history.map((item) => (
                <HistoryItem
                  key={item.id}
                  onClick={() => handleHistoryClick(item.quiz_index)}
                >
                  <FlipCountBadge>
                    <FlipNumber>{item.flip_count}</FlipNumber>
                    <FlipLabel>번</FlipLabel>
                  </FlipCountBadge>
                  <HistoryContent>
                    <QuestionMeta>
                      <VisibilityIcon sx={{ fontSize: '0.9rem', color: tokens.colors.textSecondary }} />
                      <Timestamp>{formatTimestamp(item.last_flipped_at)}</Timestamp>
                    </QuestionMeta>
                    <QuestionPreview>
                      {stripHtml(item.question)}
                    </QuestionPreview>
                  </HistoryContent>
                </HistoryItem>
              ))}
            </HistoryList>

            {hasMore && (
              <LoadMoreButton onClick={handleLoadMore} disabled={loadingMore}>
                {loadingMore ? (
                  <CircularProgress size={20} />
                ) : (
                  '더 보기'
                )}
              </LoadMoreButton>
            )}
          </>
        )}
      </Content>
    </Container>
  );
};

export default MyHistory;
