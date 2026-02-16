import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { CircularProgress, Typography } from '@mui/material';
import { styled } from '@mui/system';
import { Box } from '@mui/material';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import StarIcon from '@mui/icons-material/Star';
import AuthContext from '../AuthContext';
import { toggleBookmark, checkIfBookmarked } from '../utils/bookmarkUtils';
import tokensArcade from '../tokens-arcade';
import BottomSheet from './BottomSheet';
import ArcadeButton from './ArcadeButton';

/**
 * BookmarkButton Component
 *
 * Allows users to save/unsave quizzes to their personal collection.
 *
 * Features:
 * - Toggle bookmark on/off with optimistic UI
 * - Visual feedback (gold star when bookmarked)
 * - Login prompt for anonymous users
 * - Syncs with Supabase user_bookmarks table
 *
 * Props:
 * - quizIndex: INTEGER (quiz.index from database)
 *
 * Usage:
 * <BookmarkButton quizIndex={quiz.index} />
 */

const StyledBookmarkButton = styled(Box)(({ isBookmarked }) => ({
  // Match ArcadeButton small size exactly
  height: '36px',
  padding: `${tokensArcade.spacing.sm} ${tokensArcade.spacing.base}`,
  boxSizing: 'border-box',

  // Arcade styling
  fontFamily: tokensArcade.fonts.display,
  fontWeight: tokensArcade.fonts.weights.bold,
  fontSize: tokensArcade.fonts.xs,
  textTransform: 'uppercase',
  letterSpacing: '0.5px',
  border: tokensArcade.borders.base,
  borderRadius: tokensArcade.borderRadius.md,
  cursor: 'pointer',
  transition: `all ${tokensArcade.motion.durations.fast} ${tokensArcade.motion.easings.snap}`,

  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: tokensArcade.spacing.xs,

  // Color variants
  backgroundColor: isBookmarked ? tokensArcade.colors.arcadeYellow : tokensArcade.colors.pixelGray,
  borderColor: tokensArcade.colors.shadowPurple,
  color: tokensArcade.colors.deepBlack,
  boxShadow: isBookmarked ? tokensArcade.shadows.arcade : tokensArcade.shadows.pixel,

  '&:hover': {
    backgroundColor: isBookmarked ? '#FFDE33' : '#D0D0D0',
    boxShadow: tokensArcade.shadows.deep,
    transform: 'translateY(-2px)',
  },

  '&:active': {
    transform: 'translateY(2px)',
    boxShadow: tokensArcade.shadows.pixel,
  },

  '&.disabled': {
    backgroundColor: tokensArcade.colors.pixelGray,
    color: tokensArcade.colors.shadowPurple,
    borderColor: tokensArcade.colors.pixelGray,
    cursor: 'not-allowed',
    opacity: 0.6,
    transform: 'none',
  },

  // Focus state (accessibility)
  '&:focus-visible': {
    outline: `3px solid ${tokensArcade.colors.neonCyan}`,
    outlineOffset: '3px',
  },
}));

// Login Prompt Styled Components (for BottomSheet)
const LoginPromptContent = styled(Box)({
  padding: tokensArcade.spacing.xl,
  textAlign: 'center',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: tokensArcade.spacing.lg,
});

const LoginPromptIcon = styled('div')({
  fontSize: '4rem',
  animation: 'bounce 2s ease-in-out infinite',

  '@keyframes bounce': {
    '0%, 100%': { transform: 'translateY(0px)' },
    '50%': { transform: 'translateY(-12px)' },
  },
});

const LoginPromptTitle = styled(Typography)({
  fontFamily: tokensArcade.fonts.pixel,
  fontSize: tokensArcade.fonts.md,
  color: tokensArcade.colors.neonPink,
  textShadow: tokensArcade.shadows.neonPink,
  letterSpacing: '1px',
  textTransform: 'uppercase',
});

const LoginPromptText = styled(Typography)({
  fontFamily: tokensArcade.fonts.body,
  fontSize: tokensArcade.fonts.sm,
  color: tokensArcade.colors.neonCyan,
  textShadow: `0 0 10px rgba(0, 240, 255, 0.5)`,
  lineHeight: 1.6,
});

const BookmarkButton = ({ quizIndex }) => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [loading, setLoading] = useState(false);
  const [checking, setChecking] = useState(true);
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);

  // Check bookmark status on mount and when user/quizIndex changes
  useEffect(() => {
    const checkStatus = async () => {
      setChecking(true);
      const bookmarked = await checkIfBookmarked(quizIndex, user?.id);
      setIsBookmarked(bookmarked);
      setChecking(false);
    };

    checkStatus();
  }, [quizIndex, user?.id]);

  const handleToggle = async (e) => {
    e.stopPropagation(); // Prevent card flip when clicking button

    // If not logged in, show login prompt BottomSheet
    if (!user) {
      setShowLoginPrompt(true);
      return;
    }

    setLoading(true);

    // Optimistic UI update (only for logged-in users)
    const newBookmarkState = !isBookmarked;
    setIsBookmarked(newBookmarkState);

    // Server update
    const result = await toggleBookmark(quizIndex, user?.id);

    if (result === null) {
      // Error occurred - revert optimistic update
      setIsBookmarked(!newBookmarkState);
    } else {
      // Success - result is the actual bookmark state
      setIsBookmarked(result);
    }

    setLoading(false);
  };

  const handleLoginClick = () => {
    setShowLoginPrompt(false);
    navigate('/login');
  };

  // Don't show button while checking initial status
  if (checking) {
    return null;
  }

  return (
    <>
      <StyledBookmarkButton
        onClick={handleToggle}
        className={loading ? 'disabled' : ''}
        isBookmarked={isBookmarked}
        aria-label={isBookmarked ? '북마크 해제' : '북마크 추가'}
        role="button"
        tabIndex={0}
      >
        {loading ? (
          <CircularProgress size={14} sx={{ color: tokensArcade.colors.deepBlack }} />
        ) : isBookmarked ? (
          <>
            <StarIcon sx={{ fontSize: '0.9rem' }} />
            저장됨
          </>
        ) : (
          <>
            <StarBorderIcon sx={{ fontSize: '0.9rem' }} />
            저장
          </>
        )}
      </StyledBookmarkButton>

      {/* Login Prompt BottomSheet */}
      <BottomSheet
        isOpen={showLoginPrompt}
        onClose={() => setShowLoginPrompt(false)}
        title="⭐ LOGIN REQUIRED"
        maxHeight="50vh"
      >
        <LoginPromptContent>
          <LoginPromptIcon>⭐</LoginPromptIcon>
          <LoginPromptTitle>SAVE YOUR FAVORITES!</LoginPromptTitle>
          <LoginPromptText>
            퀴즈를 북마크하려면 로그인이 필요해요!<br />
            로그인하고 나만의 컬렉션을 만들어보세요 😊
          </LoginPromptText>
          <ArcadeButton
            variant="yellow"
            size="large"
            fullWidth
            onClick={handleLoginClick}
          >
            🎮 카카오로 시작하기
          </ArcadeButton>
        </LoginPromptContent>
      </BottomSheet>
    </>
  );
};

export default BookmarkButton;
