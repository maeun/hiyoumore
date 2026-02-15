import React, { useState, useEffect, useContext } from 'react';
import { Button, CircularProgress } from '@mui/material';
import { styled } from '@mui/system';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import StarIcon from '@mui/icons-material/Star';
import AuthContext from '../AuthContext';
import { toggleBookmark, checkIfBookmarked } from '../utils/bookmarkUtils';
import tokens from '../tokens';

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

const StyledBookmarkButton = styled(Button)(({ isBookmarked }) => ({
  background: isBookmarked
    ? `linear-gradient(135deg, #FFB800 0%, #FFA000 100%)` // Gold gradient when bookmarked
    : `linear-gradient(135deg, #B8B8D8 0%, #D8D8E8 100%)`, // Purple-tinted gray when not bookmarked
  borderRadius: '24px',
  padding: '14px 28px',
  border: 'none',
  fontSize: '1rem',
  fontWeight: 600,
  color: tokens.colors.white,
  fontFamily: tokens.fonts.korean,
  boxShadow: isBookmarked
    ? '0 4px 12px rgba(255, 184, 0, 0.3)'
    : '0 4px 12px rgba(184, 184, 216, 0.25)',
  transition: 'all 0.3s ease',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '8px',
  textTransform: 'none',
  width: '100%',
  height: '48px',
  '&:hover': {
    background: isBookmarked
      ? `linear-gradient(135deg, #FFA000 0%, #FFB800 100%)`
      : `linear-gradient(135deg, #A8A8C8 0%, #C8C8D8 100%)`,
    boxShadow: isBookmarked
      ? '0 6px 16px rgba(255, 184, 0, 0.4)'
      : '0 6px 16px rgba(184, 184, 216, 0.35)',
    transform: 'translateY(-2px)',
  },
  '&:active': {
    transform: 'translateY(0)',
    boxShadow: isBookmarked
      ? '0 2px 8px rgba(255, 184, 0, 0.3)'
      : '0 2px 8px rgba(184, 184, 216, 0.25)',
  },
  '&:disabled': {
    background: '#E8E8E8',
    color: '#A0A0A0',
    boxShadow: 'none',
  },
}));

const BookmarkButton = ({ quizIndex }) => {
  const { user } = useContext(AuthContext);
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

    setLoading(true);

    // Optimistic UI update
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
      disabled={loading}
      isBookmarked={isBookmarked}
      aria-label={isBookmarked ? '북마크 해제' : '북마크 추가'}
    >
      {loading ? (
        <CircularProgress size={14} color="inherit" />
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
