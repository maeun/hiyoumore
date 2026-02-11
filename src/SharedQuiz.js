import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { useLocation } from "react-router-dom";
import "./SharedQuiz.css";
import Button from "@mui/joy/Button";
import ReactCardFlip from "react-card-flip";
import { Card } from "@mui/joy";
import CircularProgress from "@mui/material/CircularProgress";
import Skeleton from "@mui/material/Skeleton";
import { ref, get, query, orderByChild, equalTo } from "firebase/database";
import { qa_db } from "./firebaseConfig";
import DOMPurify from "dompurify";
import tokens from "./tokens";
import { handleShare } from "./shareUtils";

function SharedQuiz() {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const num = searchParams.get("num");

  const [question, setQuestion] = useState({ que: "", ans: "" });
  const [isFlipped, setIsFlipped] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const onShare = () => {
    handleShare(window.location.href);
  };

  const handleFlipCard = () => {
    setIsFlipped(!isFlipped);
  };

  useEffect(() => {
    if (!num) {
      setError("퀴즈 번호가 없습니다.");
      setLoading(false);
      return;
    }

    const fetchQuestionAndAnswer = async () => {
      const QuestionsRef = query(
        ref(qa_db),
        orderByChild("index"),
        equalTo(parseInt(num))
      );
      try {
        const snapshot = await get(QuestionsRef);
        if (snapshot.exists()) {
          snapshot.forEach((childSnapshot) => {
            const questionData = childSnapshot.val();
            setQuestion({ que: questionData.que, ans: questionData.ans });
          });
          setLoading(false);
        } else {
          console.log("No data available");
          setError("퀴즈를 찾을 수 없습니다.");
          setLoading(false);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        setError("데이터를 불러오는 중 오류가 발생했습니다.");
        setLoading(false);
      }
    };

    fetchQuestionAndAnswer();
  }, [num]);

  if (loading) {
    return (
      <div className="SharedQuiz_Frame" style={{ alignItems: "center" }}>
        <CircularProgress sx={{ color: tokens.colors.primary, marginBottom: "16px" }} />
        <Skeleton variant="rounded" width="100%" height={180} sx={{ borderRadius: tokens.borderRadius.card, marginBottom: "16px" }} />
        <Skeleton variant="rounded" width="100%" height={40} sx={{ borderRadius: "8px" }} />
      </div>
    );
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="SharedQuiz_Frame">
      <Helmet>
        <title>친구가 보낸 퀴즈 | 하이유모어</title>
        <meta name="description" content="친구가 보낸 퀴즈가 도착했어요! 한 번 맞춰볼까요?" />
        <meta property="og:title" content="친구가 보낸 퀴즈 | 하이유모어" />
        <meta property="og:description" content="친구가 보낸 퀴즈가 도착했어요! 한 번 맞춰볼까요?" />
      </Helmet>
      <p className="text">
        ☺️친구에게 받은 퀴즈예요☺️
        <br />한 번 맞춰볼까요?
      </p>

      <ReactCardFlip isFlipped={isFlipped} flipDirection="vertical">
        <Card
          sx={{
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
            position: "relative",
            border: "2px solid rgba(89, 75, 115, 0.08)",
          }}
          className="Card_Front"
          onClick={handleFlipCard}
        >
          <div className="Card_Back_Ans">
            <p dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(question.que) }} />
          </div>
          <span className="tap-hint">탭하여 정답 보기</span>
        </Card>
        <Card
          sx={{
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
            border: "2px solid rgba(89, 75, 115, 0.15)",
          }}
          className="Card_Back"
          onClick={handleFlipCard}
        >
          <div className="Card_Back_Ans">
            <p dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(question.ans) }} />
          </div>
        </Card>
      </ReactCardFlip>
      <Button
        size="lg"
        className="btn"
        color="info"
        onClick={onShare}
        variant="solid"
      >
        😎 친구에게 공유하기
      </Button>
      <a href="https://hiyoumore.netlify.app/">
        <Button
          style={{ width: "100%" }}
          size="lg"
          className="btn"
          color="info"
          variant="solid"
        >
          📝 다른 퀴즈 풀어보기
        </Button>
      </a>
    </div>
  );
}

export default SharedQuiz;
