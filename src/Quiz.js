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
  backgroundColor: tokens.colors.white,
  borderRadius: tokens.borderRadius.button,
  padding: theme.spacing(1),
  border: "3px white",
  "&:hover": {
    border: "2px solid pink",
    backgroundColor: tokens.colors.accent,
    color: tokens.colors.white,
  },
  color: tokens.colors.accent,
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
  justifyContent: "center",
  alignItems: "center",
  boxShadow: tokens.shadows.cardBack,
  transform: "perspective(600px) rotateY(0)",
  transition: "0.6s",
  backfaceVisibility: "hidden",
  overflow: "hidden",
  padding: 0,
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
          variant="outlined"
          className="ShareButton"
          onClick={() => onShare(card.index)}
        >
          친구에게 전달하기 <ShareIcon />
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
