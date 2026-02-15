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

const EmptyState = styled('div')({
  textAlign: 'center',
  padding: '60px 20px',
  color: tokens.colors.textSecondary,
});

const EmptyIcon = styled('div')({
  fontSize: '4rem',
  marginBottom: '16px',
});

const EmptyText = styled('p')({
  fontSize: '1rem',
  margin: '0 0 24px 0',
});

const HistoryList = styled('div')({
  display: 'flex',
  flexDirection: 'column',
  gap: '12px',
});

const HistoryItem = styled('div')({
  backgroundColor: tokens.colors.white,
  borderRadius: tokens.borderRadius.medium,
  padding: '16px',
  boxShadow: tokens.shadows.light,
  display: 'flex',
  gap: '12px',
  alignItems: 'flex-start',
  cursor: 'pointer',
  transition: 'all 0.2s ease',
  border: '1px solid rgba(89, 75, 115, 0.1)',
  '&:hover': {
    boxShadow: tokens.shadows.medium,
    transform: 'translateY(-2px)',
    borderColor: tokens.colors.primary,
  },
});

const HistoryContent = styled('div')({
  flex: 1,
  minWidth: 0,
});

const FlipBadge = styled(Chip)({
  fontSize: '0.75rem',
  height: '24px',
  marginBottom: '8px',
  backgroundColor: tokens.colors.primaryLight,
  color: tokens.colors.white,
  fontWeight: 600,
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
            <EmptyText>
              아직 본 퀴즈가 없어요.
              <br />
              재미있는 퀴즈를 풀어보세요!
            </EmptyText>
          </EmptyState>
        ) : (
          <>
            <HistoryList>
              {history.map((item) => (
                <HistoryItem
                  key={item.id}
                  onClick={() => handleHistoryClick(item.quiz_index)}
                >
                  <HistoryContent>
                    <FlipBadge
                      icon={<VisibilityIcon sx={{ fontSize: '0.9rem' }} />}
                      label={`${item.flip_count}번 봄`}
                      size="small"
                    />
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
