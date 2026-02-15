import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { CircularProgress } from '@mui/material';
import { styled } from '@mui/system';
import { Box } from '@mui/material';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import StarIcon from '@mui/icons-material/Star';
import AuthContext from '../AuthContext';
import { toggleBookmark, checkIfBookmarked } from '../utils/bookmarkUtils';
import tokensArcade from '../tokens-arcade';

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

const BookmarkButton = ({ quizIndex }) => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [loading, setLoading] = useState(false);
  const [checking, setChecking] = useState(true);

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

    // If not logged in, redirect to login immediately
    if (!user) {
      navigate('/login');
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

  // Don't show button while checking initial status
  if (checking) {
    return null;
  }

  return (
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
  );
};

export default BookmarkButton;
