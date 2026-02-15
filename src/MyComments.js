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
import DeleteIcon from '@mui/icons-material/Delete';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import FavoriteIcon from '@mui/icons-material/Favorite';
import AuthContext from './AuthContext';
import { getUserComments, deleteComment } from './utils/commentUtils';
import tokens from './tokens';

/**
 * MyComments Page
 *
 * Displays user's comments across all quizzes with:
 * - Comment text preview
 * - Quiz question preview
 * - Likes count badge
 * - Delete button
 * - Click to view quiz
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
  top: '60px',
  zIndex: 99,
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

const CommentList = styled('div')({
  display: 'flex',
  flexDirection: 'column',
  gap: '12px',
});

const CommentItem = styled('div')({
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

const CommentContent = styled('div')({
  flex: 1,
  minWidth: 0,
});

const LikesBadge = styled(Chip)({
  fontSize: '0.75rem',
  height: '24px',
  marginBottom: '8px',
  backgroundColor: '#FF9999',
  color: tokens.colors.white,
  fontWeight: 600,
});

const CommentText = styled('p')({
  margin: '0 0 8px 0',
  fontSize: '0.95rem',
  color: tokens.colors.text,
  lineHeight: 1.5,
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  display: '-webkit-box',
  WebkitLineClamp: 2,
  WebkitBoxOrient: 'vertical',
  wordBreak: 'break-word',
  whiteSpace: 'pre-wrap',
});

const QuizPreview = styled('p')({
  margin: 0,
  fontSize: '0.85rem',
  color: tokens.colors.textSecondary,
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
});

const DeleteButton = styled(IconButton)({
  color: tokens.colors.textSecondary,
  padding: '8px',
  '&:hover': {
    color: '#d32f2f',
    backgroundColor: 'rgba(211, 47, 47, 0.08)',
  },
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

const MyComments = () => {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);

  const COMMENTS_PER_PAGE = 10;

  // Fetch comments on mount
  useEffect(() => {
    if (user) {
      fetchComments(0, true);
    } else {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const fetchComments = async (currentOffset, reset = false) => {
    if (reset) {
      setLoading(true);
    } else {
      setLoadingMore(true);
    }

    const { data, hasMore: more } = await getUserComments(
      user?.id,
      currentOffset,
      COMMENTS_PER_PAGE
    );

    if (reset) {
      setComments(data);
    } else {
      setComments((prev) => [...prev, ...data]);
    }

    setHasMore(more);
    setOffset(currentOffset + COMMENTS_PER_PAGE);
    setLoading(false);
    setLoadingMore(false);
  };

  const handleDelete = async (e, commentId) => {
    e.stopPropagation(); // Prevent navigation when clicking delete

    // eslint-disable-next-line no-restricted-globals
    if (!confirm('댓글을 삭제하시겠습니까?')) {
      return;
    }

    const success = await deleteComment(commentId, user?.id);

    if (success) {
      // Remove from UI
      setComments((prev) => prev.filter((c) => c.id !== commentId));
    }
  };

  const handleCommentClick = (quizIndex) => {
    // Navigate to shared quiz page to view the full quiz
    navigate(`/shared-quiz?num=${quizIndex}`);
  };

  const handleLoadMore = () => {
    fetchComments(offset, false);
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
          <title>내 댓글 | 하이유모어</title>
          <meta name="robots" content="noindex" />
        </Helmet>
        <Header>
          <BackButton onClick={() => navigate(-1)} aria-label="뒤로가기">
            <ArrowBackIcon />
          </BackButton>
          <Title>💬 내 댓글</Title>
        </Header>
        <Content>
          <LoginPrompt>
            <EmptyIcon>💬</EmptyIcon>
            <EmptyText>로그인하면 댓글 기록을 확인할 수 있어요!</EmptyText>
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
          <title>내 댓글 | 하이유모어</title>
          <meta name="robots" content="noindex" />
        </Helmet>
        <Header>
          <BackButton onClick={() => navigate(-1)} aria-label="뒤로가기">
            <ArrowBackIcon />
          </BackButton>
          <Title>💬 내 댓글</Title>
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
        <title>{`내 댓글 (${comments.length}개) | 하이유모어`}</title>
        <meta name="robots" content="noindex" />
      </Helmet>

      <Header>
        <BackButton onClick={() => navigate(-1)} aria-label="뒤로가기">
          <ArrowBackIcon />
        </BackButton>
        <Title>💬 내 댓글</Title>
      </Header>

      <Content>
        {comments.length === 0 ? (
          <EmptyState>
            <EmptyIcon>💬</EmptyIcon>
            <EmptyText>
              아직 남긴 댓글이 없어요.
              <br />
              퀴즈를 풀고 댓글을 남겨보세요!
            </EmptyText>
          </EmptyState>
        ) : (
          <>
            <CommentList>
              {comments.map((comment) => (
                <CommentItem
                  key={comment.id}
                  onClick={() => handleCommentClick(comment.quiz_index)}
                >
                  <CommentContent>
                    {comment.likes_count > 0 && (
                      <LikesBadge
                        icon={<FavoriteIcon sx={{ fontSize: '0.9rem' }} />}
                        label={`${comment.likes_count}`}
                        size="small"
                      />
                    )}
                    <CommentText>{comment.comment_text}</CommentText>
                    <QuizPreview>
                      퀴즈: {stripHtml(comment.question).substring(0, 40)}
                      {stripHtml(comment.question).length > 40 ? '...' : ''}
                    </QuizPreview>
                  </CommentContent>
                  <DeleteButton
                    onClick={(e) => handleDelete(e, comment.id)}
                    aria-label="댓글 삭제"
                  >
                    <DeleteIcon fontSize="small" />
                  </DeleteButton>
                </CommentItem>
              ))}
            </CommentList>

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

export default MyComments;
