import React, { useEffect, useState, useContext } from "react";
import { styled } from "@mui/system";
import { Box } from "@mui/material";
import ShareIcon from "@mui/icons-material/Share";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import Skeleton from "@mui/material/Skeleton";
import DOMPurify from "dompurify";
import ConfettiExplosion from "react-confetti-explosion";
import tokensArcade from "./tokens-arcade";
import ArcadeButton from "./components/ArcadeButton";
import NeonBadge from "./components/NeonBadge";
import { handleShare } from "./shareUtils";
import { trackFlip } from "./utils/bookmarkUtils";
import AuthContext from "./AuthContext";
import BottomSheet from "./components/BottomSheet";
import CommentSection from "./components/CommentSection";
import BookmarkButton from "./components/BookmarkButton";
import "./Quiz.css";

// ============================================
// ARCADE QUIZ CARD - FRONT
// ============================================

const ArcadeCardFront = styled(Box)({
  position: 'relative',
  minHeight: '220px',
  height: 'auto',
  maxHeight: '300px',
  backgroundColor: tokensArcade.colors.pureWhite,
  border: tokensArcade.borders.thick,
  borderColor: tokensArcade.colors.electricPurple,
  borderRadius: tokensArcade.borderRadius.lg,
  boxShadow: tokensArcade.shadows.arcade,
  marginBottom: tokensArcade.spacing.base,
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  cursor: 'pointer',
  transition: `all ${tokensArcade.motion.durations.fast} ${tokensArcade.motion.easings.snap}`,
  padding: tokensArcade.spacing.xl,
  overflow: 'hidden',

  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: tokensArcade.shadows.deep,
  },

  '&:active': {
    transform: 'translateY(2px)',
    boxShadow: tokensArcade.shadows.pixel,
  },

  '@media (max-width: 400px)': {
    minHeight: '200px',
    maxHeight: '280px',
    padding: tokensArcade.spacing.base,
  },
});

// Question mark block (top-left corner)
const QuestionBlock = styled(Box)({
  position: 'absolute',
  top: tokensArcade.spacing.md,
  left: tokensArcade.spacing.md,
  width: '48px',
  height: '48px',
  backgroundColor: tokensArcade.colors.arcadeYellow,
  border: tokensArcade.borders.base,
  borderColor: tokensArcade.colors.shadowPurple,
  borderRadius: tokensArcade.borderRadius.sm,
  boxShadow: tokensArcade.shadows.pixel,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontFamily: tokensArcade.fonts.pixel,
  fontSize: tokensArcade.fonts.lg,
  fontWeight: tokensArcade.fonts.weights.normal,
  color: tokensArcade.colors.deepBlack,
  animation: 'float 3s ease-in-out infinite',

  '@keyframes float': {
    '0%, 100%': {
      transform: 'translateY(0)',
    },
    '50%': {
      transform: 'translateY(-4px)',
    },
  },
});

// Card number badge (top-right corner)
const CardNumberBadge = styled(Box)({
  position: 'absolute',
  top: tokensArcade.spacing.md,
  right: tokensArcade.spacing.md,
});

// Question text container
const QuestionText = styled(Box)({
  fontFamily: 'Maplestory_Light, sans-serif',
  fontSize: 'clamp(1.1rem, 3.5vw, 1.5rem)',
  lineHeight: 1.5,
  color: tokensArcade.colors.deepBlack,
  textAlign: 'center',
  maxWidth: '100%',
  wordBreak: 'keep-all',
  overflowWrap: 'break-word',

  '& p': {
    margin: 0,
    padding: 0,
    display: '-webkit-box',
    WebkitLineClamp: 4,
    WebkitBoxOrient: 'vertical',
    overflow: 'hidden',
  },
});

// TAP hint with pulse animation
const TapHint = styled('span')({
  position: 'absolute',
  bottom: tokensArcade.spacing.md,
  fontFamily: tokensArcade.fonts.pixel,
  fontSize: tokensArcade.fonts.xs,
  color: tokensArcade.colors.electricPurple,
  textTransform: 'uppercase',
  animation: 'pulse 2s ease-in-out infinite',

  '@keyframes pulse': {
    '0%, 100%': {
      opacity: 0.6,
      transform: 'scale(1)',
    },
    '50%': {
      opacity: 1,
      transform: 'scale(1.05)',
    },
  },
});

// ============================================
// ARCADE QUIZ CARD - BACK
// ============================================

const ArcadeCardBack = styled(Box)({
  position: 'relative',
  minHeight: '220px',
  height: 'auto',
  maxHeight: '300px',
  backgroundColor: tokensArcade.colors.midnightBlue,
  border: tokensArcade.borders.thick,
  borderColor: tokensArcade.colors.neonPink,
  borderRadius: tokensArcade.borderRadius.lg,
  boxShadow: tokensArcade.shadows.deep,
  marginBottom: tokensArcade.spacing.base,
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'stretch',
  gap: tokensArcade.spacing.base,
  padding: tokensArcade.spacing.lg,
  cursor: 'pointer',
  transition: `all ${tokensArcade.motion.durations.fast} ${tokensArcade.motion.easings.snap}`,
  overflow: 'visible',

  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: tokensArcade.shadows.mega,
  },

  '&:active': {
    transform: 'translateY(2px)',
    boxShadow: tokensArcade.shadows.arcade,
  },

  '@media (max-width: 400px)': {
    minHeight: '200px',
    maxHeight: '280px',
    padding: tokensArcade.spacing.base,
    gap: tokensArcade.spacing.md,
  },
});

// Answer text container with neon glow
const AnswerText = styled(Box)({
  fontFamily: 'Maplestory_Light, sans-serif',
  fontWeight: 700,
  fontSize: 'clamp(1.2rem, 4vw, 1.7rem)',
  lineHeight: 1.45,
  color: tokensArcade.colors.neonCyan,
  textShadow: tokensArcade.shadows.neonCyan,
  textAlign: 'center',
  flex: 1,
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  minWidth: 0,
  wordBreak: 'keep-all',
  overflowWrap: 'break-word',

  '& p': {
    margin: 0,
    padding: 0,
    maxWidth: '100%',
    display: '-webkit-box',
    WebkitLineClamp: 3,
    WebkitBoxOrient: 'vertical',
    overflow: 'hidden',
  },
});

// Button container
const ButtonContainer = styled(Box)({
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'stretch',
  gap: tokensArcade.spacing.sm,
  width: '110px',
  flexShrink: 0,

  // Make all child buttons same size
  '& > *': {
    width: '110px !important',
    minWidth: '110px !important',
    height: '36px !important',
  },

  '@media (max-width: 400px)': {
    width: '100px',
    '& > *': {
      width: '100px !important',
      minWidth: '100px !important',
    },
  },
});

// Confetti container
const ConfettiContainer = styled(Box)({
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  pointerEvents: 'none',
  zIndex: 100,
});

// ============================================
// QUIZ COMPONENT
// ============================================

function Quiz({ selectedQuestions }) {
  const { user } = useContext(AuthContext);
  const [isFlipped, setIsFlipped] = useState([]);
  const [currentQuizIds, setCurrentQuizIds] = useState([]);
  const [isCommentsOpen, setIsCommentsOpen] = useState(false);
  const [selectedQuizIndex, setSelectedQuizIndex] = useState(null);
  const [showConfetti, setShowConfetti] = useState([]);

  useEffect(() => {
    const initialFlippedState = Array(selectedQuestions.length || 3).fill(false);
    const quizIds = selectedQuestions.map(q => q?.index || null);
    const initialConfettiState = Array(selectedQuestions.length || 3).fill(false);
    setIsFlipped(initialFlippedState);
    setCurrentQuizIds(quizIds);
    setShowConfetti(initialConfettiState);
  }, [selectedQuestions]);

  const handleClick = (index) => {
    const card = selectedQuestions[index];
    const wasFlipped = isFlipped[index];

    setIsFlipped((prevIsFlipped) => {
      const updatedIsFlipped = [...prevIsFlipped];
      updatedIsFlipped[index] = !updatedIsFlipped[index];
      return updatedIsFlipped;
    });

    // Show confetti when flipping to answer
    if (!wasFlipped) {
      setShowConfetti((prev) => {
        const updated = [...prev];
        updated[index] = true;
        return updated;
      });

      // Hide confetti after animation
      setTimeout(() => {
        setShowConfetti((prev) => {
          const updated = [...prev];
          updated[index] = false;
          return updated;
        });
      }, 1000);

      // Track flip when user flips to see answer
      if (card?.index && user?.id) {
        trackFlip(card.index, user.id);
      }
    }
  };

  const onShare = (quiz_num) => {
    const share_url = `${window.location.href}shared-quiz?num=${quiz_num}`;
    handleShare(share_url);
  };

  const onOpenComments = (quiz_index) => {
    setSelectedQuizIndex(quiz_index);
    setIsCommentsOpen(true);
  };

  const renderCardContent = (card, index) => (
    <Box key={`${card.index}-${index}`} sx={{ position: 'relative' }}>
      {!isFlipped[index] ? (
        /* FRONT - Question */
        <ArcadeCardFront onClick={() => handleClick(index)}>
          <QuestionBlock>?</QuestionBlock>
          <CardNumberBadge>
            <NeonBadge color="purple" size="sm">
              {index + 1}/3
            </NeonBadge>
          </CardNumberBadge>
          <QuestionText>
            <p dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(card.que) }} />
          </QuestionText>
          <TapHint>TAP!</TapHint>
        </ArcadeCardFront>
      ) : (
        /* BACK - Answer */
        <ArcadeCardBack onClick={() => handleClick(index)}>
          {showConfetti[index] && (
            <ConfettiContainer>
              <ConfettiExplosion
                force={0.6}
                duration={2500}
                particleCount={50}
                width={800}
                colors={[
                  tokensArcade.colors.neonPink,
                  tokensArcade.colors.neonCyan,
                  tokensArcade.colors.arcadeYellow,
                  tokensArcade.colors.electricPurple,
                  tokensArcade.colors.mintGreen,
                ]}
              />
            </ConfettiContainer>
          )}
          <AnswerText>
            <p dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(card.ans) }} />
          </AnswerText>
          <ButtonContainer>
            <ArcadeButton
              variant="primary"
              size="small"
              icon={<ShareIcon sx={{ fontSize: '0.9rem' }} />}
              onClick={(e) => {
                e.stopPropagation();
                onShare(card.index);
              }}
            >
              공유
            </ArcadeButton>
            <ArcadeButton
              variant="secondary"
              size="small"
              icon={<ChatBubbleOutlineIcon sx={{ fontSize: '0.9rem' }} />}
              onClick={(e) => {
                e.stopPropagation();
                onOpenComments(card.index);
              }}
            >
              댓글
            </ArcadeButton>
            <BookmarkButton quizIndex={card.index} />
          </ButtonContainer>
        </ArcadeCardBack>
      )}
    </Box>
  );

  // Check if current questions match stored quiz IDs
  const questionsMatch = selectedQuestions.every(
    (q, i) => q?.index === currentQuizIds[i]
  );

  return (
    <>
      <div className="QAcardSet">
        {selectedQuestions.length === 0 || !questionsMatch
          ? Array.from({ length: 3 }).map((_, index) => (
              <ArcadeCardFront key={index}>
                <Skeleton
                  variant="rectangular"
                  width="100%"
                  height="100%"
                  sx={{
                    borderRadius: 'inherit',
                    backgroundColor: tokensArcade.colors.pixelGray,
                  }}
                />
              </ArcadeCardFront>
            ))
          : selectedQuestions
              .slice(0, 3)
              .map((card, index) => renderCardContent(card, index))}
      </div>

      {/* Comments Bottom Sheet */}
      <BottomSheet
        isOpen={isCommentsOpen}
        onClose={() => setIsCommentsOpen(false)}
        title="댓글"
      >
        <CommentSection quizIndex={selectedQuizIndex} />
      </BottomSheet>
    </>
  );
}

export default Quiz;
