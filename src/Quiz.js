import React, { useEffect, useState, useContext } from "react";
import ReactCardFlip from "react-card-flip";
import { styled } from "@mui/system";
import { Card, Button } from "@mui/joy";
import ShareIcon from "@mui/icons-material/Share";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import Skeleton from "@mui/material/Skeleton";
import DOMPurify from "dompurify";
import tokens from "./tokens";
import { handleShare } from "./shareUtils";
import { trackFlip } from "./utils/bookmarkUtils";
import AuthContext from "./AuthContext";
import BottomSheet from "./components/BottomSheet";
import CommentSection from "./components/CommentSection";
import BookmarkButton from "./components/BookmarkButton";
import "./Quiz.css";

const ShareButton = styled(Button)(({ theme }) => ({
  background: `linear-gradient(135deg, ${tokens.colors.accent} 0%, ${tokens.colors.accentLight} 100%)`,
  borderRadius: tokens.borderRadius.button,
  padding: "10px 16px",
  border: "none",
  fontSize: "0.85rem",
  fontWeight: 700,
  color: tokens.colors.white,
  fontFamily: tokens.fonts.korean,
  boxShadow: tokens.shadows.button,
  transition: "all 0.2s ease",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  gap: "6px",
  textTransform: "none",
  minHeight: "44px",
  width: "100%",
  "&:hover": {
    background: `linear-gradient(135deg, ${tokens.colors.accentLight} 0%, ${tokens.colors.accent} 100%)`,
    boxShadow: tokens.shadows.buttonHover,
    transform: "scale(1.02)",
  },
  "&:active": {
    transform: "scale(0.98)",
  },
}));

const CommentButton = styled(Button)(({ theme }) => ({
  background: `linear-gradient(135deg, ${tokens.colors.primary} 0%, ${tokens.colors.primaryLight} 100%)`,
  borderRadius: tokens.borderRadius.button,
  padding: "10px 16px",
  border: "none",
  fontSize: "0.85rem",
  fontWeight: 700,
  color: tokens.colors.white,
  fontFamily: tokens.fonts.korean,
  boxShadow: tokens.shadows.button,
  transition: "all 0.2s ease",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  gap: "6px",
  textTransform: "none",
  marginTop: "0",
  minHeight: "44px",
  width: "100%",
  "&:hover": {
    background: `linear-gradient(135deg, ${tokens.colors.primaryLight} 0%, ${tokens.colors.primary} 100%)`,
    boxShadow: tokens.shadows.buttonHover,
    transform: "scale(1.02)",
  },
  "&:active": {
    transform: "scale(0.98)",
  },
}));

const StyledCard = styled(Card)(({ theme }) => ({
  minHeight: "200px",
  height: "auto",
  maxHeight: "280px",
  backgroundColor: tokens.colors.cardFront,
  borderRadius: tokens.borderRadius.card,
  marginBottom: tokens.spacing.cardMarginBottom,
  justifyContent: "center",
  alignItems: "center",
  boxShadow: tokens.shadows.cardFront,
  transform: "perspective(600px) rotateY(0)",
  transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
  backfaceVisibility: "hidden",
  overflow: "hidden",
  padding: 0,
  position: "relative",
  border: `2px solid ${tokens.colors.borderLight}`,
  boxSizing: "border-box",
  cursor: "pointer",
  "&:hover": {
    boxShadow: tokens.shadows.cardHover,
    transform: "perspective(600px) rotateY(0) translateY(-4px)",
  },

  /* Mobile adjustments */
  "@media (max-width: 400px)": {
    minHeight: "180px",
    maxHeight: "260px",
  },
}));

const StyledCardBack = styled(Card)(({ theme }) => ({
  minHeight: "200px",
  height: "auto",
  maxHeight: "280px",
  backgroundColor: tokens.colors.cardBack,
  borderRadius: tokens.borderRadius.card,
  marginBottom: tokens.spacing.cardMarginBottom,
  display: "flex",
  flexDirection: "row",
  justifyContent: "space-between",
  alignItems: "stretch",
  boxShadow: tokens.shadows.cardBack,
  transform: "perspective(600px) rotateY(0)",
  transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
  backfaceVisibility: "hidden",
  overflow: "visible",
  padding: "20px",
  gap: "16px",
  border: `2px solid ${tokens.colors.border}`,
  boxSizing: "border-box",
  cursor: "pointer",
  "&:hover": {
    boxShadow: tokens.shadows.cardHover,
    transform: "perspective(600px) rotateY(0) translateY(-4px)",
  },

  /* Mobile adjustments */
  "@media (max-width: 400px)": {
    minHeight: "180px",
    maxHeight: "260px",
    padding: "16px",
    gap: "12px",
  },
}));

function Quiz({ selectedQuestions }) {
  const { user } = useContext(AuthContext);
  const [isFlipped, setIsFlipped] = useState([]);
  const [currentQuizIds, setCurrentQuizIds] = useState([]);
  const [isCommentsOpen, setIsCommentsOpen] = useState(false);
  const [selectedQuizIndex, setSelectedQuizIndex] = useState(null);

  useEffect(() => {
    const initialFlippedState = Array(selectedQuestions.length || 3).fill(false);
    const quizIds = selectedQuestions.map(q => q?.index || null);
    setIsFlipped(initialFlippedState);
    setCurrentQuizIds(quizIds);
  }, [selectedQuestions]);

  const handleClick = (index) => {
    const card = selectedQuestions[index];
    const wasFlipped = isFlipped[index];

    setIsFlipped((prevIsFlipped) => {
      const updatedIsFlipped = [...prevIsFlipped];
      updatedIsFlipped[index] = !updatedIsFlipped[index];
      return updatedIsFlipped;
    });

    // Track flip when user flips to see answer (not when flipping back)
    if (!wasFlipped && card?.index && user?.id) {
      trackFlip(card.index, user.id);
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
    <ReactCardFlip
      key={`${card.index}-${index}`}
      isFlipped={isFlipped[index]}
      flipDirection="vertical"
    >
      <StyledCard className="Card_Front" onClick={() => handleClick(index)}>
        <div className="Card_Front_Que">
          <p dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(card.que) }} />
        </div>
        <span className="tap-hint">탭하여 정답 보기</span>
      </StyledCard>

      <StyledCardBack className="Card_Back" onClick={() => handleClick(index)}>
        <div className="Card_Back_Ans">
          <p dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(card.ans) }} />
        </div>
        <div className="button-container">
          <ShareButton
            variant="solid"
            className="ShareButton"
            onClick={(e) => {
              e.stopPropagation();
              onShare(card.index);
            }}
          >
            <ShareIcon sx={{ fontSize: "0.9rem" }} />
            공유
          </ShareButton>
          <CommentButton
            variant="solid"
            onClick={(e) => {
              e.stopPropagation();
              onOpenComments(card.index);
            }}
          >
            <ChatBubbleOutlineIcon sx={{ fontSize: "0.9rem" }} />
            댓글
          </CommentButton>
          <BookmarkButton quizIndex={card.index} />
        </div>
      </StyledCardBack>
    </ReactCardFlip>
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
              <StyledCard key={index}>
                <Skeleton
                  variant="rectangular"
                  width="100%"
                  height="100%"
                  sx={{ borderRadius: "inherit" }}
                />
              </StyledCard>
            ))
          : selectedQuestions
              .slice(0, 3)
              .map((card, index) => renderCardContent(card, index))}
      </div>

      {/* Comments Bottom Sheet */}
      <BottomSheet
        open={isCommentsOpen}
        onClose={() => setIsCommentsOpen(false)}
        title="💬 댓글"
        maxHeight="75vh"
      >
        {selectedQuizIndex && (
          <CommentSection quizIndex={selectedQuizIndex} />
        )}
      </BottomSheet>
    </>
  );
}

export default Quiz;
