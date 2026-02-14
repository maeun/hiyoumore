import React, { useEffect, useState } from "react";
import ReactCardFlip from "react-card-flip";
import DOMPurify from "dompurify";
import { handleShare } from "./shareUtils";
import "./Quiz.css";

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
    <div key={index} className="quiz-card-wrapper">
      <ReactCardFlip
        isFlipped={isFlipped[index]}
        flipDirection="vertical"
      >
        <div className="quiz-card-front" onClick={() => handleClick(index)}>
          <p
            className="quiz-question"
            dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(card.que) }}
          />
          <div className="tap-hint">탭하여 정답 보기</div>
        </div>

        <div className="quiz-card-back" onClick={() => handleClick(index)}>
          <p
            className="quiz-answer"
            dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(card.ans) }}
          />
          <button
            className="share-button-enhanced"
            onClick={(e) => {
              e.stopPropagation();
              onShare(card.index);
            }}
          >
            <span className="share-icon">💝</span>
            친구에게 전달하기
          </button>
        </div>
      </ReactCardFlip>
    </div>
  );

  const renderSkeleton = (index) => (
    <div key={index} className="skeleton-card">
      <div className="skeleton-line"></div>
      <div className="skeleton-line"></div>
      <div className="skeleton-line"></div>
    </div>
  );

  return (
    <div className="quiz-cards-container">
      {selectedQuestions.length === 0
        ? Array.from({ length: 3 }).map((_, index) => renderSkeleton(index))
        : selectedQuestions
            .slice(0, 3)
            .map((card, index) => renderCardContent(card, index))}
    </div>
  );
}

export default Quiz;
