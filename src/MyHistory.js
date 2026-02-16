import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { styled } from '@mui/system';
import { Box, CircularProgress, Typography } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import AuthContext from './AuthContext';
import { getUserFlipHistory, deleteFlipHistory } from './utils/bookmarkUtils';
import tokensArcade from './tokens-arcade';
import NeonBadge from './components/NeonBadge';

// ============================================
// TRADING CARD GALLERY (History)
// Reusing design from MyBookmarks
// ============================================

const GalleryContainer = styled(Box)({
  minHeight: 'calc(100vh - 70px - 80px)',
  backgroundColor: tokensArcade.colors.softCream,
  paddingBottom: '100px',
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
  color: tokensArcade.colors.neonCyan,
  textShadow: tokensArcade.shadows.neonCyan,
  textTransform: 'uppercase',
  letterSpacing: '1px',
});

const GalleryContent = styled(Box)({
  maxWidth: '900px',
  margin: '0 auto',
  padding: tokensArcade.spacing.lg,
});

const CardGrid = styled(Box)({
  display: 'grid',
  gridTemplateColumns: 'repeat(2, 1fr)',
  gap: tokensArcade.spacing.base,
  width: '100%',

  '@media (min-width: 768px)': {
    gridTemplateColumns: 'repeat(3, 1fr)',
  },
});

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
    borderColor: tokensArcade.colors.neonCyan,
  },

  '&:active': {
    transform: 'translateY(2px)',
    boxShadow: tokensArcade.shadows.pixel,
  },
});

const CategorySticker = styled(Box)({
  position: 'absolute',
  top: tokensArcade.spacing.sm,
  left: tokensArcade.spacing.sm,
  zIndex: 2,
});

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

// ============================================
// MY HISTORY COMPONENT
// ============================================

const MyHistory = () => {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) fetchHistory();
    else setLoading(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const fetchHistory = async () => {
    const { data } = await getUserFlipHistory(user?.id, 0, 50);
    setHistory(data || []);
    setLoading(false);
  };

  const handleDelete = async (e, historyId) => {
    e.stopPropagation();
    const confirmed = window.confirm('이 기록을 삭제하시겠습니까?');
    if (!confirmed) return;

    const success = await deleteFlipHistory(historyId, user?.id);
    if (success) {
      setHistory(history.filter(h => h.id !== historyId));
    }
  };

  const handleCardClick = (quizIndex) => {
    navigate(`/shared-quiz?num=${quizIndex}`);
  };

  const stripHtml = (html) => {
    const tmp = document.createElement('div');
    tmp.innerHTML = html;
    return tmp.textContent || '';
  };

  if (loading) {
    return (
      <GalleryContainer>
        <GalleryHeader>
          <GalleryTitle>👁️ QUIZ HISTORY</GalleryTitle>
        </GalleryHeader>
        <GalleryContent>
          <LoadingContainer>
            <CircularProgress sx={{ color: tokensArcade.colors.neonCyan }} />
          </LoadingContainer>
        </GalleryContent>
      </GalleryContainer>
    );
  }

  return (
    <GalleryContainer>
      <Helmet>
        <title>QUIZ HISTORY | 하이유모어</title>
        <meta name="robots" content="noindex" />
      </Helmet>

      <GalleryHeader>
        <GalleryTitle>👁️ QUIZ HISTORY</GalleryTitle>
      </GalleryHeader>

      <GalleryContent>
        {history.length === 0 ? (
          <EmptyState>
            <EmptyIcon>😢</EmptyIcon>
            <EmptyText>NO ITEMS COLLECTED</EmptyText>
          </EmptyState>
        ) : (
          <CardGrid>
            {history.map((h) => (
              <TradingCard
                key={h.id}
                onClick={() => handleCardClick(h.quiz_index)}
              >
                {/* Category Sticker */}
                {h.category && (
                  <CategorySticker>
                    <NeonBadge color="cyan" size="sm">
                      {h.category}
                    </NeonBadge>
                  </CategorySticker>
                )}

                {/* Delete Button */}
                <DeleteButton onClick={(e) => handleDelete(e, h.id)}>
                  <CloseIcon />
                </DeleteButton>

                {/* Question Preview */}
                <QuestionPreview>
                  {stripHtml(h.question)}
                </QuestionPreview>
              </TradingCard>
            ))}
          </CardGrid>
        )}
      </GalleryContent>
    </GalleryContainer>
  );
};

export default MyHistory;
