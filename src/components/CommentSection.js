import React, { useState, useEffect, useContext } from 'react';
import { CircularProgress, Avatar } from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import CloseIcon from '@mui/icons-material/Close';
import PersonIcon from '@mui/icons-material/Person';
import { styled } from '@mui/system';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseConfig';
import AuthContext from '../AuthContext';
import { showToast, showErrorToast } from '../toastUtils';
import { deleteComment } from '../utils/commentUtils';
import tokensArcade from '../tokens-arcade';

/**
 * CommentSection Component - Arcade Edition
 *
 * Displays comments with retro arcade styling.
 * Features pixel shadow bubbles, neon borders, and arcade buttons.
 */

const COMMENTS_PER_PAGE = 10;

// Container
const Container = styled('div')({
  display: 'flex',
  flexDirection: 'column',
  gap: tokensArcade.spacing.base,
  minHeight: '200px',
});

// Comment Input - Arcade Style
const CommentInputContainer = styled('div')({
  display: 'flex',
  flexDirection: 'column',
  gap: tokensArcade.spacing.sm,
  paddingBottom: tokensArcade.spacing.base,
  borderBottom: `${tokensArcade.borders.base} ${tokensArcade.colors.neonPink}`,
});

const ArcadeTextArea = styled('textarea')({
  width: '100%',
  minHeight: '80px',
  padding: tokensArcade.spacing.md,
  fontFamily: tokensArcade.fonts.body,
  fontSize: tokensArcade.fonts.sm,
  color: tokensArcade.colors.pureWhite,
  backgroundColor: tokensArcade.colors.deepBlack,
  border: tokensArcade.borders.base,
  borderColor: tokensArcade.colors.electricPurple,
  borderRadius: tokensArcade.borderRadius.md,
  boxShadow: tokensArcade.shadows.pixel,
  resize: 'vertical',
  outline: 'none',
  lineHeight: 1.5,
  boxSizing: 'border-box',

  '&::placeholder': {
    color: tokensArcade.colors.pixelGray,
  },

  '&:focus': {
    borderColor: tokensArcade.colors.neonPink,
    boxShadow: tokensArcade.shadows.arcade,
  },

  // Hide scrollbar but keep functionality
  scrollbarWidth: 'none',
  msOverflowStyle: 'none',
  '&::-webkit-scrollbar': {
    display: 'none',
  },
});

const CharCount = styled('div')(({ isOverLimit }) => ({
  fontFamily: tokensArcade.fonts.pixel,
  fontSize: tokensArcade.fonts.xs,
  color: isOverLimit ? tokensArcade.colors.hotOrange : tokensArcade.colors.pixelGray,
  textAlign: 'right',
  marginTop: `-${tokensArcade.spacing.xs}`,
}));

const SubmitButton = styled('div')(({ disabled }) => ({
  alignSelf: 'flex-end',
  padding: `${tokensArcade.spacing.md} ${tokensArcade.spacing.xl}`,
  backgroundColor: disabled ? tokensArcade.colors.pixelGray : tokensArcade.colors.neonPink,
  color: tokensArcade.colors.pureWhite,
  border: tokensArcade.borders.base,
  borderColor: tokensArcade.colors.shadowPurple,
  borderRadius: tokensArcade.borderRadius.lg,
  boxShadow: disabled ? tokensArcade.shadows.pixel : tokensArcade.shadows.arcade,
  cursor: disabled ? 'not-allowed' : 'pointer',
  transition: `all ${tokensArcade.motion.durations.fast} ${tokensArcade.motion.easings.snap}`,
  fontFamily: tokensArcade.fonts.pixel,
  fontSize: tokensArcade.fonts.xs,
  textTransform: 'uppercase',
  letterSpacing: '0.5px',
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  minHeight: '36px',
  opacity: disabled ? 0.6 : 1,

  '&:hover': disabled ? {} : {
    transform: 'translateY(-2px)',
    boxShadow: tokensArcade.shadows.deep,
  },

  '&:active': disabled ? {} : {
    transform: 'translateY(2px)',
    boxShadow: tokensArcade.shadows.pixel,
  },
}));

const LoginPrompt = styled('div')({
  textAlign: 'center',
  padding: tokensArcade.spacing.xl,
  backgroundColor: tokensArcade.colors.deepBlack,
  border: tokensArcade.borders.base,
  borderColor: tokensArcade.colors.neonCyan,
  borderRadius: tokensArcade.borderRadius.lg,
  boxShadow: tokensArcade.shadows.arcade,
  marginBottom: tokensArcade.spacing.base,
});

const LoginPromptText = styled('p')({
  margin: `0 0 ${tokensArcade.spacing.md} 0`,
  fontFamily: tokensArcade.fonts.pixel,
  fontSize: tokensArcade.fonts.xs,
  color: tokensArcade.colors.neonCyan,
  textShadow: tokensArcade.shadows.neonCyan,
  letterSpacing: '0.5px',
});

const LoginButton = styled('div')({
  display: 'inline-block',
  padding: `${tokensArcade.spacing.md} ${tokensArcade.spacing.xl}`,
  backgroundColor: tokensArcade.colors.arcadeYellow,
  color: tokensArcade.colors.deepBlack,
  border: tokensArcade.borders.base,
  borderColor: tokensArcade.colors.shadowPurple,
  borderRadius: tokensArcade.borderRadius.lg,
  boxShadow: tokensArcade.shadows.arcade,
  cursor: 'pointer',
  transition: `all ${tokensArcade.motion.durations.fast} ${tokensArcade.motion.easings.bounce}`,
  fontFamily: tokensArcade.fonts.display,
  fontSize: tokensArcade.fonts.sm,
  fontWeight: tokensArcade.fonts.weights.bold,

  '&:hover': {
    transform: 'translateY(-4px) scale(1.02)',
    boxShadow: tokensArcade.shadows.mega,
    backgroundColor: '#FFDE33',
  },

  '&:active': {
    transform: 'translateY(2px)',
    boxShadow: tokensArcade.shadows.arcade,
  },
});

// Comment List
const CommentList = styled('div')({
  display: 'flex',
  flexDirection: 'column',
  gap: tokensArcade.spacing.base,
});

// Arcade Comment Bubble
const CommentItem = styled('div')({
  display: 'flex',
  gap: tokensArcade.spacing.md,
  padding: tokensArcade.spacing.base,
  backgroundColor: tokensArcade.colors.deepBlack,
  border: tokensArcade.borders.base,
  borderColor: tokensArcade.colors.electricPurple,
  borderRadius: tokensArcade.borderRadius.md,
  boxShadow: tokensArcade.shadows.pixel,
  position: 'relative',
  transition: `all ${tokensArcade.motion.durations.fast} ${tokensArcade.motion.easings.snap}`,

  '&:hover': {
    borderColor: tokensArcade.colors.neonPink,
    boxShadow: tokensArcade.shadows.arcade,
  },
});

const AvatarFrame = styled('div')({
  width: '36px',
  height: '36px',
  flexShrink: 0,
  border: tokensArcade.borders.base,
  borderColor: tokensArcade.colors.neonCyan,
  borderRadius: tokensArcade.borderRadius.sm,
  overflow: 'hidden',
  boxShadow: tokensArcade.shadows.pixel,
});

const CommentContent = styled('div')({
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  gap: tokensArcade.spacing.xs,
  minWidth: 0,
});

const CommentHeader = styled('div')({
  display: 'flex',
  alignItems: 'center',
  gap: tokensArcade.spacing.sm,
});

const Nickname = styled('span')({
  fontFamily: tokensArcade.fonts.display,
  fontSize: tokensArcade.fonts.sm,
  fontWeight: tokensArcade.fonts.weights.bold,
  color: tokensArcade.colors.neonCyan,
  textShadow: tokensArcade.shadows.neonCyan,
});

const Timestamp = styled('span')({
  fontFamily: tokensArcade.fonts.pixel,
  fontSize: '0.6rem',
  color: tokensArcade.colors.pixelGray,
});

const CommentText = styled('p')({
  margin: 0,
  fontFamily: tokensArcade.fonts.body,
  fontSize: tokensArcade.fonts.sm,
  color: tokensArcade.colors.pureWhite,
  lineHeight: 1.5,
  whiteSpace: 'pre-wrap',
  wordBreak: 'break-word',
});

const CommentActions = styled('div')({
  display: 'flex',
  alignItems: 'center',
  gap: tokensArcade.spacing.sm,
  marginTop: tokensArcade.spacing.xs,
});

const LikeButton = styled('div')(({ isLiked }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: '4px',
  padding: `4px ${tokensArcade.spacing.sm}`,
  backgroundColor: isLiked ? 'rgba(255, 46, 151, 0.2)' : 'transparent',
  border: tokensArcade.borders.base,
  borderColor: isLiked ? tokensArcade.colors.neonPink : tokensArcade.colors.pixelGray,
  borderRadius: tokensArcade.borderRadius.pill,
  cursor: 'pointer',
  transition: `all ${tokensArcade.motion.durations.fast} ${tokensArcade.motion.easings.snap}`,

  '&:hover': {
    transform: 'scale(1.1)',
    borderColor: tokensArcade.colors.neonPink,
  },

  '&:active': {
    transform: 'scale(0.95)',
  },
}));

const LikeCount = styled('span')(({ isLiked }) => ({
  fontFamily: tokensArcade.fonts.pixel,
  fontSize: '0.6rem',
  color: isLiked ? tokensArcade.colors.neonPink : tokensArcade.colors.pixelGray,
  fontWeight: tokensArcade.fonts.weights.bold,
}));

const DeleteButton = styled('div')({
  width: '24px',
  height: '24px',
  backgroundColor: tokensArcade.colors.hotOrange,
  border: tokensArcade.borders.base,
  borderColor: tokensArcade.colors.shadowPurple,
  borderRadius: '50%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  cursor: 'pointer',
  transition: `all ${tokensArcade.motion.durations.fast} ${tokensArcade.motion.easings.snap}`,
  marginLeft: 'auto',

  '& .MuiSvgIcon-root': {
    fontSize: '0.9rem',
    color: tokensArcade.colors.pureWhite,
  },

  '&:hover': {
    transform: 'scale(1.2) rotate(90deg)',
    backgroundColor: '#FF8456',
    boxShadow: tokensArcade.shadows.pixel,
  },

  '&:active': {
    transform: 'scale(0.9)',
  },
});

const LoadMoreButton = styled('div')({
  alignSelf: 'center',
  padding: `${tokensArcade.spacing.md} ${tokensArcade.spacing.xl}`,
  backgroundColor: tokensArcade.colors.electricPurple,
  color: tokensArcade.colors.pureWhite,
  border: tokensArcade.borders.base,
  borderColor: tokensArcade.colors.shadowPurple,
  borderRadius: tokensArcade.borderRadius.lg,
  boxShadow: tokensArcade.shadows.arcade,
  cursor: 'pointer',
  transition: `all ${tokensArcade.motion.durations.fast} ${tokensArcade.motion.easings.snap}`,
  fontFamily: tokensArcade.fonts.pixel,
  fontSize: tokensArcade.fonts.xs,
  textTransform: 'uppercase',
  letterSpacing: '0.5px',
  marginTop: tokensArcade.spacing.base,

  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: tokensArcade.shadows.deep,
  },

  '&:active': {
    transform: 'translateY(2px)',
    boxShadow: tokensArcade.shadows.pixel,
  },
});

const EmptyState = styled('div')({
  textAlign: 'center',
  padding: `${tokensArcade.spacing.mega} ${tokensArcade.spacing.lg}`,
  fontFamily: tokensArcade.fonts.pixel,
  fontSize: tokensArcade.fonts.xs,
  color: tokensArcade.colors.pixelGray,
  textTransform: 'uppercase',
  letterSpacing: '0.5px',
});

const LoadingContainer = styled('div')({
  display: 'flex',
  justifyContent: 'center',
  padding: `${tokensArcade.spacing.mega} ${tokensArcade.spacing.lg}`,
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

  const [comments, setComments] = useState([]);
  const [userLikes, setUserLikes] = useState(new Set());
  const [commentText, setCommentText] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(false);

  useEffect(() => {
    fetchComments(quizIndex, 0, true);
    if (isLoggedIn) {
      fetchUserLikes();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [quizIndex, isLoggedIn]);

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

  const handleToggleLike = async (commentId) => {
    if (!isLoggedIn) {
      showToast('로그인하면 좋아요를 누를 수 있어요! 😊');
      return;
    }

    const isLiked = userLikes.has(commentId);

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

    if (isLiked) {
      const { error } = await supabase
        .from('comment_likes')
        .delete()
        .eq('comment_id', commentId)
        .eq('user_id', user.id);

      if (error) {
        console.error('Error unliking comment:', error);
        fetchComments(quizIndex, 0, true);
        fetchUserLikes();
      }
    } else {
      const { error } = await supabase
        .from('comment_likes')
        .insert({ comment_id: commentId, user_id: user.id });

      if (error) {
        console.error('Error liking comment:', error);
        fetchComments(quizIndex, 0, true);
        fetchUserLikes();
      }
    }
  };

  const handleLoadMore = () => {
    fetchComments(quizIndex, offset, false);
  };

  const handleDeleteComment = async (commentId) => {
    // eslint-disable-next-line no-restricted-globals
    if (!confirm('댓글을 삭제하시겠습니까?')) {
      return;
    }

    const success = await deleteComment(commentId, user?.id);

    if (success) {
      setComments((prev) => prev.filter((c) => c.id !== commentId));
    }
  };

  const charCount = commentText.length;
  const isOverLimit = charCount > 500;

  return (
    <Container>
      {/* Comment Input - Arcade Style */}
      {isLoggedIn ? (
        <CommentInputContainer>
          <ArcadeTextArea
            placeholder="댓글을 남겨보세요..."
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
          />
          <CharCount isOverLimit={isOverLimit}>
            {charCount} / 500
          </CharCount>
          <SubmitButton
            onClick={handleSubmitComment}
            disabled={!commentText.trim() || isOverLimit || submitting}
          >
            {submitting ? <CircularProgress size={16} sx={{ color: tokensArcade.colors.pureWhite }} /> : 'POST COMMENT'}
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
          <CircularProgress sx={{ color: tokensArcade.colors.neonPink }} />
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
                  <AvatarFrame>
                    <Avatar
                      src={comment.profile_image_url}
                      alt={comment.nickname}
                      sx={{ width: '100%', height: '100%' }}
                    >
                      {!comment.profile_image_url && <PersonIcon />}
                    </Avatar>
                  </AvatarFrame>
                  <CommentContent>
                    <CommentHeader>
                      <Nickname>{comment.nickname}</Nickname>
                      <Timestamp>{formatTimestamp(comment.created_at)}</Timestamp>
                    </CommentHeader>
                    <CommentText>{comment.comment_text}</CommentText>
                    <CommentActions>
                      <LikeButton
                        onClick={() => handleToggleLike(comment.id)}
                        isLiked={isLiked}
                        aria-label={isLiked ? '좋아요 취소' : '좋아요'}
                      >
                        {isLiked ? (
                          <FavoriteIcon sx={{ fontSize: '0.9rem', color: tokensArcade.colors.neonPink }} />
                        ) : (
                          <FavoriteBorderIcon sx={{ fontSize: '0.9rem', color: tokensArcade.colors.pixelGray }} />
                        )}
                        {comment.likes_count > 0 && (
                          <LikeCount isLiked={isLiked}>{comment.likes_count}</LikeCount>
                        )}
                      </LikeButton>
                      {/* Delete button - only show for comment owner */}
                      {user?.id === comment.user_id && (
                        <DeleteButton
                          onClick={() => handleDeleteComment(comment.id)}
                          aria-label="댓글 삭제"
                        >
                          <CloseIcon />
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
            <LoadMoreButton onClick={handleLoadMore}>
              {loading ? <CircularProgress size={16} sx={{ color: tokensArcade.colors.pureWhite }} /> : 'LOAD MORE'}
            </LoadMoreButton>
          )}
        </>
      )}
    </Container>
  );
};

export default CommentSection;
