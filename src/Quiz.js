import React, { useEffect, useState } from "react";
import ReactCardFlip from "react-card-flip";
import { styled } from "@mui/system";
import { Card, Button } from "@mui/joy";
import ShareIcon from "@mui/icons-material/Share";
import Skeleton from "@mui/material/Skeleton";
import DOMPurify from "dompurify";
import tokens from "./tokens";
import { handleShare } from "./shareUtils";
import "./Quiz.css";

const ShareButton = styled(Button)(({ theme }) => ({
  background: `linear-gradient(135deg, ${tokens.colors.accent} 0%, #FFB6C1 100%)`,
  borderRadius: "24px",
  padding: "12px 24px",
  border: "none",
  fontSize: "0.95rem",
  fontWeight: 600,
  color: tokens.colors.white,
  boxShadow: "0 4px 12px rgba(255, 153, 153, 0.3)",
  transition: "all 0.3s ease",
  display: "flex",
  alignItems: "center",
  gap: "8px",
  textTransform: "none",
  "&:hover": {
    background: `linear-gradient(135deg, #FF7A7A 0%, ${tokens.colors.accent} 100%)`,
    boxShadow: "0 6px 16px rgba(255, 153, 153, 0.4)",
    transform: "translateY(-2px)",
  },
  "&:active": {
    transform: "translateY(0)",
    boxShadow: "0 2px 8px rgba(255, 153, 153, 0.3)",
  },
}));

const StyledCard = styled(Card)(({ theme }) => ({
  height: "180px",
  backgroundColor: tokens.colors.background,
  borderRadius: tokens.borderRadius.card,
  marginBottom: tokens.spacing.cardMarginBottom,
  justifyContent: "center",
  alignItems: "center",
  boxShadow: tokens.shadows.cardFront,
  transform: "perspective(600px) rotateY(0)",
  transition: "0.6s",
  backfaceVisibility: "hidden",
  overflow: "hidden",
  padding: 0,
  position: "relative",
  border: "2px solid rgba(89, 75, 115, 0.08)",
}));

const StyledCardBack = styled(Card)(({ theme }) => ({
  height: "180px",
  backgroundColor: tokens.colors.cardBack,
  borderRadius: tokens.borderRadius.card,
  marginBottom: tokens.spacing.cardMarginBottom,
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
  boxShadow: tokens.shadows.cardBack,
  transform: "perspective(600px) rotateY(0)",
  transition: "0.6s",
  backfaceVisibility: "hidden",
  overflow: "visible",
  padding: "16px",
  border: "2px solid rgba(89, 75, 115, 0.15)",
}));

function Quiz({ selectedQuestions }) {
  const [isFlipped, setIsFlipped] = useState([]);

  useEffect(() => {
    const initialFlippedState = Array(selectedQuestions.length || 3).fill(
      false
    );
    setIsFlipped(initialFlippedState);
  }, [selectedQuestions]);

  const handleClick = (index) => {
    setIsFlipped((prevIsFlipped) => {
      const updatedIsFlipped = [...prevIsFlipped];
      updatedIsFlipped[index] = !updatedIsFlipped[index];
      return updatedIsFlipped;
    });
  };

  const onShare = (quiz_num) => {
    const share_url = `${window.location.href}shared-quiz?num=${quiz_num}`;
    handleShare(share_url);
  };

  const renderCardContent = (card, index) => (
    <ReactCardFlip
      key={index}
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
        <ShareButton
          variant="solid"
          className="ShareButton"
          onClick={(e) => {
            e.stopPropagation();
            onShare(card.index);
          }}
        >
          <ShareIcon sx={{ fontSize: "1.1rem" }} />
          친구에게 전달하기
        </ShareButton>
      </StyledCardBack>
    </ReactCardFlip>
  );

  return (
    <div className="QAcardSet">
      {selectedQuestions.length === 0
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
  );
}

export default Quiz;
