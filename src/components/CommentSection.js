import React, { useState, useEffect, useContext } from 'react';
import { Button, CircularProgress, Avatar, IconButton, TextField } from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import DeleteIcon from '@mui/icons-material/Delete';
import PersonIcon from '@mui/icons-material/Person';
import { styled } from '@mui/system';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseConfig';
import AuthContext from '../AuthContext';
import { showToast, showErrorToast } from '../toastUtils';
import { deleteComment } from '../utils/commentUtils';
import tokens from '../tokens';

/**
 * CommentSection Component
 *
 * Displays comments for a specific quiz with pagination and likes.
 *
 * Features:
 * - Fetch comments from Supabase (comments_with_profiles view)
 * - Pagination (10 comments per page)
 * - Like/unlike with optimistic UI
 * - Login prompt for anonymous users
 * - Real-time character count (500 max)
 *
 * Props:
 * - quizIndex: INTEGER (matches quizzes.index, NOT quizzes.id!)
 *
 * Usage:
 * <CommentSection quizIndex={quiz.index} />
 */

const COMMENTS_PER_PAGE = 10;

// Styled Components
const Container = styled('div')({
  display: 'flex',
  flexDirection: 'column',
  gap: '16px',
  minHeight: '200px',
});

const CommentInputContainer = styled('div')({
  display: 'flex',
  flexDirection: 'column',
  gap: '8px',
  paddingBottom: '16px',
  borderBottom: `1px solid ${tokens.colors.border}`,
});

const CharCount = styled('div')(({ isOverLimit }) => ({
  fontSize: '0.75rem',
  color: isOverLimit ? '#d32f2f' : tokens.colors.textSecondary,
  textAlign: 'right',
  marginTop: '-4px',
}));

const SubmitButton = styled(Button)({
  alignSelf: 'flex-end',
  background: `linear-gradient(135deg, ${tokens.colors.primary} 0%, #6b5c8a 100%)`,
  color: tokens.colors.white,
  borderRadius: '20px',
  padding: '8px 24px',
  fontSize: '0.9rem',
  fontWeight: 600,
  minHeight: '40px',
  boxShadow: '0 2px 8px rgba(89, 75, 115, 0.2)',
  '&:hover': {
    background: `linear-gradient(135deg, #6b5c8a 0%, ${tokens.colors.primary} 100%)`,
    boxShadow: '0 4px 12px rgba(89, 75, 115, 0.3)',
  },
  '&:disabled': {
    background: '#ddd',
    color: '#999',
  },
});

const LoginPrompt = styled('div')({
  textAlign: 'center',
  padding: '24px 16px',
  backgroundColor: '#f5f3f8',
  borderRadius: tokens.borderRadius.medium,
  marginBottom: '16px',
});

const LoginPromptText = styled('p')({
  margin: '0 0 12px 0',
  color: tokens.colors.textSecondary,
  fontSize: '0.9rem',
});

const LoginButton = styled(Button)({
  background: `linear-gradient(135deg, ${tokens.colors.primary} 0%, #6b5c8a 100%)`,
  color: tokens.colors.white,
  borderRadius: '20px',
  padding: '10px 24px',
  fontSize: '0.9rem',
  fontWeight: 600,
  '&:hover': {
    background: `linear-gradient(135deg, #6b5c8a 0%, ${tokens.colors.primary} 100%)`,
  },
});

const CommentList = styled('div')({
  display: 'flex',
  flexDirection: 'column',
  gap: '16px',
});

const CommentItem = styled('div')({
  display: 'flex',
  gap: '12px',
  padding: '12px 0',
  borderBottom: `1px solid ${tokens.colors.border}`,
  '&:last-child': {
    borderBottom: 'none',
  },
});

const CommentContent = styled('div')({
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  gap: '4px',
});

const CommentHeader = styled('div')({
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
});

const Nickname = styled('span')({
  fontWeight: 600,
  fontSize: '0.9rem',
  color: tokens.colors.text,
});

const Timestamp = styled('span')({
  fontSize: '0.75rem',
  color: tokens.colors.textSecondary,
});

const CommentText = styled('p')({
  margin: 0,
  fontSize: '0.95rem',
  color: tokens.colors.text,
  lineHeight: 1.5,
  whiteSpace: 'pre-wrap',
  wordBreak: 'break-word',
});

const CommentActions = styled('div')({
  display: 'flex',
  alignItems: 'center',
  gap: '4px',
  marginTop: '4px',
});

const LikeButton = styled(IconButton)({
  padding: '4px',
  '&:hover': {
    backgroundColor: 'rgba(255, 153, 153, 0.1)',
  },
});

const LikeCount = styled('span')(({ isLiked }) => ({
  fontSize: '0.85rem',
  color: isLiked ? '#FF9999' : tokens.colors.textSecondary,
  fontWeight: isLiked ? 600 : 400,
}));

const DeleteButton = styled(IconButton)({
  padding: '4px',
  marginLeft: 'auto',
  '&:hover': {
    backgroundColor: 'rgba(211, 47, 47, 0.1)',
    color: '#d32f2f',
  },
});

const LoadMoreButton = styled(Button)({
  alignSelf: 'center',
  color: tokens.colors.primary,
  borderRadius: '20px',
  padding: '8px 20px',
  fontSize: '0.85rem',
  '&:hover': {
    backgroundColor: 'rgba(89, 75, 115, 0.08)',
  },
});

const EmptyState = styled('div')({
  textAlign: 'center',
  padding: '40px 20px',
  color: tokens.colors.textSecondary,
  fontSize: '0.95rem',
});

const LoadingContainer = styled('div')({
  display: 'flex',
  justifyContent: 'center',
  padding: '40px 20px',
});

// Helper: Format timestamp to Korean relative time
const formatTimestamp = (timestamp) => {
  const now = new Date();
  const commentDate = new Date(timestamp);
  const diffMs = now - commentDate;
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return '방금 전';
  if (diffMins < 60) return `${diffMins}분 전`;
  if (diffHours < 24) return `${diffHours}시간 전`;
  if (diffDays < 7) return `${diffDays}일 전`;

  return commentDate.toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

const CommentSection = ({ quizIndex }) => {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const isLoggedIn = !!user;

  // State
  const [comments, setComments] = useState([]);
  const [userLikes, setUserLikes] = useState(new Set());
  const [commentText, setCommentText] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(false);

  // Fetch comments on mount and when quizIndex changes
  useEffect(() => {
    fetchComments(quizIndex, 0, true);
    if (isLoggedIn) {
      fetchUserLikes();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [quizIndex, isLoggedIn]);

  // Fetch comments from Supabase
  const fetchComments = async (quizIdx, currentOffset = 0, reset = false) => {
    setLoading(true);

    const { data, error, count } = await supabase
      .from('comments_with_profiles')
      .select('*', { count: 'exact' })
      .eq('quiz_index', quizIdx)
      .order('is_pinned', { ascending: false })
      .order('created_at', { ascending: false })
      .range(currentOffset, currentOffset + COMMENTS_PER_PAGE - 1);

    if (error) {
      console.error('Error fetching comments:', error);
      showErrorToast('댓글을 불러올 수 없습니다');
      setLoading(false);
      return;
    }

    if (reset) {
      setComments(data || []);
    } else {
      setComments((prev) => [...prev, ...(data || [])]);
    }

    setHasMore(count > currentOffset + COMMENTS_PER_PAGE);
    setOffset(currentOffset + COMMENTS_PER_PAGE);
    setLoading(false);
  };

  // Fetch user's liked comments
  const fetchUserLikes = async () => {
    if (!user) return;

    const { data, error } = await supabase
      .from('comment_likes')
      .select('comment_id')
      .eq('user_id', user.id);

    if (error) {
      console.error('Error fetching user likes:', error);
      return;
    }

    const likedSet = new Set(data.map((like) => like.comment_id));
    setUserLikes(likedSet);
  };

  // Submit new comment
  const handleSubmitComment = async () => {
    if (!isLoggedIn) {
      showToast('로그인하면 댓글을 남길 수 있어요! 😊');
      return;
    }

    const trimmed = commentText.trim();

    if (!trimmed) {
      showErrorToast('댓글 내용을 입력해주세요');
      return;
    }

    if (trimmed.length > 500) {
      showErrorToast('댓글은 500자 이하로 작성해주세요');
      return;
    }

    setSubmitting(true);

    const { data, error } = await supabase
      .from('quiz_comments')
      .insert({
        quiz_index: quizIndex,
        user_id: user.id,
        comment_text: trimmed,
      })
      .select()
      .single();

    if (error) {
      console.error('Error submitting comment:', error);
      showErrorToast('댓글 작성에 실패했습니다');
      setSubmitting(false);
      return;
    }

    // Optimistic UI: Add comment to top of list immediately
    const newComment = {
      ...data,
      nickname: user.user_metadata?.nickname || user.user_metadata?.name || '익명',
      profile_image_url: user.user_metadata?.profile_image_url,
    };

    setComments((prev) => [newComment, ...prev]);
    setCommentText('');
    setSubmitting(false);
    showToast('댓글이 등록되었습니다! 💬');
  };

  // Toggle like/unlike
  const handleToggleLike = async (commentId) => {
    if (!isLoggedIn) {
      showToast('로그인하면 좋아요를 누를 수 있어요! 😊');
      return;
    }

    const isLiked = userLikes.has(commentId);

    // Optimistic UI update
    setUserLikes((prev) => {
      const newSet = new Set(prev);
      if (isLiked) {
        newSet.delete(commentId);
      } else {
        newSet.add(commentId);
      }
      return newSet;
    });

    setComments((prev) =>
      prev.map((comment) =>
        comment.id === commentId
          ? { ...comment, likes_count: comment.likes_count + (isLiked ? -1 : 1) }
          : comment
      )
    );

    // Server update
    if (isLiked) {
      const { error } = await supabase
        .from('comment_likes')
        .delete()
        .eq('comment_id', commentId)
        .eq('user_id', user.id);

      if (error) {
        console.error('Error unliking comment:', error);
        // Revert on error
        fetchComments(quizIndex, 0, true);
        fetchUserLikes();
      }
    } else {
      const { error } = await supabase
        .from('comment_likes')
        .insert({ comment_id: commentId, user_id: user.id });

      if (error) {
        console.error('Error liking comment:', error);
        // Revert on error
        fetchComments(quizIndex, 0, true);
        fetchUserLikes();
      }
    }
  };

  // Load more comments
  const handleLoadMore = () => {
    fetchComments(quizIndex, offset, false);
  };

  // Delete comment
  const handleDeleteComment = async (commentId) => {
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

  const charCount = commentText.length;
  const isOverLimit = charCount > 500;

  return (
    <Container>
      {/* Comment Input - Only for logged-in users */}
      {isLoggedIn ? (
        <CommentInputContainer>
          <TextField
            multiline
            rows={3}
            placeholder="댓글을 남겨보세요..."
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            variant="outlined"
            fullWidth
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: tokens.borderRadius.medium,
                fontSize: '0.95rem',
                fontFamily: tokens.fonts.korean,
              },
            }}
          />
          <CharCount isOverLimit={isOverLimit}>
            {charCount} / 500
          </CharCount>
          <SubmitButton
            onClick={handleSubmitComment}
            disabled={!commentText.trim() || isOverLimit || submitting}
          >
            {submitting ? <CircularProgress size={20} color="inherit" /> : '댓글 남기기'}
          </SubmitButton>
        </CommentInputContainer>
      ) : (
        <LoginPrompt>
          <LoginPromptText>로그인하면 댓글을 남길 수 있어요! 😊</LoginPromptText>
          <LoginButton onClick={() => navigate('/login')}>카카오 로그인하기</LoginButton>
        </LoginPrompt>
      )}

      {/* Comments List */}
      {loading && comments.length === 0 ? (
        <LoadingContainer>
          <CircularProgress sx={{ color: tokens.colors.primary }} />
        </LoadingContainer>
      ) : comments.length === 0 ? (
        <EmptyState>첫 댓글을 남겨보세요! 💬</EmptyState>
      ) : (
        <>
          <CommentList>
            {comments.map((comment) => {
              const isLiked = userLikes.has(comment.id);

              return (
                <CommentItem key={comment.id}>
                  <Avatar
                    src={comment.profile_image_url}
                    alt={comment.nickname}
                    sx={{ width: 36, height: 36 }}
                  >
                    {!comment.profile_image_url && <PersonIcon />}
                  </Avatar>
                  <CommentContent>
                    <CommentHeader>
                      <Nickname>{comment.nickname}</Nickname>
                      <Timestamp>{formatTimestamp(comment.created_at)}</Timestamp>
                    </CommentHeader>
                    <CommentText>{comment.comment_text}</CommentText>
                    <CommentActions>
                      <LikeButton
                        onClick={() => handleToggleLike(comment.id)}
                        size="small"
                        aria-label={isLiked ? '좋아요 취소' : '좋아요'}
                      >
                        {isLiked ? (
                          <FavoriteIcon sx={{ fontSize: '1rem', color: '#FF9999' }} />
                        ) : (
                          <FavoriteBorderIcon sx={{ fontSize: '1rem', color: tokens.colors.textSecondary }} />
                        )}
                      </LikeButton>
                      {comment.likes_count > 0 && (
                        <LikeCount isLiked={isLiked}>{comment.likes_count}</LikeCount>
                      )}
                      {/* Delete button - only show for comment owner */}
                      {user?.id === comment.user_id && (
                        <DeleteButton
                          onClick={() => handleDeleteComment(comment.id)}
                          size="small"
                          aria-label="댓글 삭제"
                        >
                          <DeleteIcon sx={{ fontSize: '0.9rem' }} />
                        </DeleteButton>
                      )}
                    </CommentActions>
                  </CommentContent>
                </CommentItem>
              );
            })}
          </CommentList>

          {/* Load More Button */}
          {hasMore && (
            <LoadMoreButton onClick={handleLoadMore} disabled={loading}>
              {loading ? <CircularProgress size={20} /> : '댓글 더보기'}
            </LoadMoreButton>
          )}
        </>
      )}
    </Container>
  );
};

export default CommentSection;
