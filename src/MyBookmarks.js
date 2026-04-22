'use client';
import React, { useState, useEffect, useContext } from "react";
import { useRouter } from "next/navigation";
import { styled } from "@mui/system";
import { Box, CircularProgress, Typography } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import AuthContext from "./AuthContext";
import { getUserBookmarks, deleteBookmark } from "./utils/bookmarkUtils";
import { handleKakaoLogin } from "./utils/loginUtils";
import tokensArcade from "./tokens-arcade";
import NeonBadge from "./components/NeonBadge";
import ArcadeButton from "./components/ArcadeButton";

// ============================================
// TRADING CARD GALLERY LAYOUT
// ============================================

const GalleryContainer = styled(Box)({
  minHeight: 'calc(100vh - 70px - 80px)',
  backgroundColor: tokensArcade.colors.softCream,
  paddingBottom: '100px', // Space for TabBar
  boxSizing: 'border-box',
});

const GalleryHeader = styled(Box)({
  background: tokensArcade.colors.deepBlack,
  border: `${tokensArcade.borders.base} ${tokensArcade.colors.neonCyan}`,
  borderTop: 'none',
  borderLeft: 'none',
  borderRight: 'none',
  height: '60px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  boxShadow: `0 4px 0 ${tokensArcade.colors.shadowPurple}`,
  position: 'relative',
});

const GalleryTitle = styled(Typography)({
  fontFamily: tokensArcade.fonts.pixel,
  fontSize: tokensArcade.fonts.sm,
  fontWeight: tokensArcade.fonts.weights.normal,
  color: tokensArcade.colors.neonPink,
  textShadow: tokensArcade.shadows.neonPink,
  textTransform: 'uppercase',
  letterSpacing: '1px',
});

const GalleryContent = styled(Box)({
  maxWidth: '900px',
  margin: '0 auto',
  padding: tokensArcade.spacing.md,
  boxSizing: 'border-box',
});

// Masonry Grid Layout
const CardGrid = styled(Box)({
  display: 'grid',
  gridTemplateColumns: '1fr',
  gap: tokensArcade.spacing.base,
  width: '100%',
  boxSizing: 'border-box',

  '@media (min-width: 768px)': {
    gridTemplateColumns: 'repeat(2, 1fr)',
  },
});

// Trading Card
const TradingCard = styled(Box)({
  position: 'relative',
  backgroundColor: tokensArcade.colors.pureWhite,
  border: tokensArcade.borders.thick,
  borderColor: tokensArcade.colors.electricPurple,
  borderRadius: tokensArcade.borderRadius.lg,
  boxShadow: tokensArcade.shadows.arcade,
  padding: tokensArcade.spacing.base,
  paddingTop: tokensArcade.spacing.xxl,
  cursor: 'pointer',
  transition: `all ${tokensArcade.motion.durations.fast} ${tokensArcade.motion.easings.snap}`,
  minHeight: '180px',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  boxSizing: 'border-box',

  '&:hover': {
    transform: 'translateY(-6px)',
    boxShadow: tokensArcade.shadows.deep,
    borderColor: tokensArcade.colors.neonPink,
  },

  '&:active': {
    transform: 'translateY(2px)',
    boxShadow: tokensArcade.shadows.pixel,
  },
});

// Category Sticker (top-left)
const CategorySticker = styled(Box)({
  position: 'absolute',
  top: tokensArcade.spacing.sm,
  left: tokensArcade.spacing.sm,
  zIndex: 2,
});

// Delete Button (top-right)
const DeleteButton = styled(Box)({
  position: 'absolute',
  top: tokensArcade.spacing.sm,
  right: tokensArcade.spacing.sm,
  width: '28px',
  height: '28px',
  backgroundColor: tokensArcade.colors.hotOrange,
  border: tokensArcade.borders.base,
  borderColor: tokensArcade.colors.shadowPurple,
  borderRadius: '50%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  cursor: 'pointer',
  transition: `all ${tokensArcade.motion.durations.fast} ${tokensArcade.motion.easings.snap}`,
  zIndex: 3,

  '& .MuiSvgIcon-root': {
    fontSize: '1rem',
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

const QuestionPreview = styled(Typography)({
  fontFamily: tokensArcade.fonts.body,
  fontSize: tokensArcade.fonts.sm,
  color: tokensArcade.colors.deepBlack,
  lineHeight: 1.5,
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  display: '-webkit-box',
  WebkitLineClamp: 3,
  WebkitBoxOrient: 'vertical',
  wordBreak: 'break-word',
  overflowWrap: 'break-word',
  textAlign: 'left',
  padding: `0 ${tokensArcade.spacing.xs}`,
});

// Empty State
const EmptyState = styled(Box)({
  textAlign: 'center',
  padding: `${tokensArcade.spacing.mega} ${tokensArcade.spacing.lg}`,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: tokensArcade.spacing.lg,
});

const EmptyIcon = styled(Typography)({
  fontSize: '72px',
  filter: 'grayscale(100%)',
  opacity: 0.5,
});

const EmptyText = styled(Typography)({
  fontFamily: tokensArcade.fonts.pixel,
  fontSize: tokensArcade.fonts.xs,
  color: tokensArcade.colors.shadowPurple,
  textTransform: 'uppercase',
  letterSpacing: '0.5px',
});

const LoadingContainer = styled(Box)({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  minHeight: '300px',
});

// Login Prompt (for non-logged-in users)
const LoginPromptContainer = styled(Box)({
  padding: tokensArcade.spacing.xxl,
  background: tokensArcade.colors.pureWhite,
  border: tokensArcade.borders.thick,
  borderColor: tokensArcade.colors.electricPurple,
  borderRadius: tokensArcade.borderRadius.lg,
  boxShadow: tokensArcade.shadows.arcade,
  textAlign: 'center',
  margin: tokensArcade.spacing.lg,
});

const LoginPromptIcon = styled('div')({
  fontSize: '3rem',
  marginBottom: tokensArcade.spacing.md,
});

const LoginPromptText = styled(Typography)({
  fontFamily: tokensArcade.fonts.body,
  fontSize: tokensArcade.fonts.base,
  color: tokensArcade.colors.deepBlack,
  marginBottom: tokensArcade.spacing.xl,
  lineHeight: 1.6,
});

// ============================================
// MY BOOKMARKS COMPONENT
// ============================================

const MyBookmarks = () => {
  const router = useRouter();
  const { user } = useContext(AuthContext);
  const [bookmarks, setBookmarks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchBookmarks();
    } else {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const fetchBookmarks = async () => {
    const { data } = await getUserBookmarks(user?.id, 0, 50);
    setBookmarks(data || []);
    setLoading(false);
  };

  const handleDelete = async (e, bookmarkId) => {
    e.stopPropagation();
    const confirmed = window.confirm('이 북마크를 삭제하시겠습니까?');
    if (!confirmed) return;

    const success = await deleteBookmark(bookmarkId, user?.id);
    if (success) {
      setBookmarks(bookmarks.filter(b => b.id !== bookmarkId));
    }
  };

  const handleCardClick = (quizIndex) => {
    router.push(`/shared-quiz?num=${quizIndex}`);
  };

  const stripHtml = (html) => {
    const tmp = document.createElement("div");
    tmp.innerHTML = html;
    return tmp.textContent || "";
  };

  if (loading) {
    return (
      <GalleryContainer>
        <GalleryHeader>
          <GalleryTitle>⭐ MY COLLECTION</GalleryTitle>
        </GalleryHeader>
        <GalleryContent>
          <LoadingContainer>
            <CircularProgress sx={{ color: tokensArcade.colors.neonPink }} />
          </LoadingContainer>
        </GalleryContent>
      </GalleryContainer>
    );
  }

  return (
    <GalleryContainer>
      <GalleryHeader>
        <GalleryTitle>⭐ MY COLLECTION</GalleryTitle>
      </GalleryHeader>

      <GalleryContent>
        {!user ? (
          <LoginPromptContainer>
            <LoginPromptIcon>🔒</LoginPromptIcon>
            <LoginPromptText>
              북마크한 퀴즈를 모아보려면 로그인이 필요해요!
            </LoginPromptText>
            <ArcadeButton
              variant="primary"
              size="large"
              fullWidth
              onClick={handleKakaoLogin}
            >
              카카오로 시작하기
            </ArcadeButton>
          </LoginPromptContainer>
        ) : bookmarks.length === 0 ? (
          <EmptyState>
            <EmptyIcon>😢</EmptyIcon>
            <EmptyText>NO ITEMS COLLECTED</EmptyText>
          </EmptyState>
        ) : (
          <CardGrid>
            {bookmarks.map((b) => (
              <TradingCard
                key={b.id}
                onClick={() => handleCardClick(b.quiz_index)}
              >
                {/* Category Sticker */}
                {b.category && (
                  <CategorySticker>
                    <NeonBadge color="purple" size="sm">
                      {b.category}
                    </NeonBadge>
                  </CategorySticker>
                )}

                {/* Delete Button */}
                <DeleteButton onClick={(e) => handleDelete(e, b.id)}>
                  <CloseIcon />
                </DeleteButton>

                {/* Question Preview */}
                <QuestionPreview>
                  {stripHtml(b.question)}
                </QuestionPreview>
              </TradingCard>
            ))}
          </CardGrid>
        )}
      </GalleryContent>
    </GalleryContainer>
  );
};

export default MyBookmarks;
