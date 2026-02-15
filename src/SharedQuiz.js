import React, { useEffect, useState, useContext } from "react";
import { Helmet } from "react-helmet-async";
import { useLocation } from "react-router-dom";
import "./SharedQuiz.css";
import Button from "@mui/joy/Button";
import ReactCardFlip from "react-card-flip";
import { Card } from "@mui/joy";
import { styled } from "@mui/system";
import CircularProgress from "@mui/material/CircularProgress";
import Skeleton from "@mui/material/Skeleton";
import ShareIcon from "@mui/icons-material/Share";
import QuizIcon from "@mui/icons-material/Quiz";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import { supabase } from './supabaseConfig';
import DOMPurify from "dompurify";
import tokens from "./tokens";
import { handleShare } from "./shareUtils";
import { trackFlip } from "./utils/bookmarkUtils";
import AuthContext from "./AuthContext";
import BottomSheet from "./components/BottomSheet";
import CommentSection from "./components/CommentSection";
import BookmarkButton from "./components/BookmarkButton";

const ShareButton = styled(Button)({
  background: `linear-gradient(135deg, ${tokens.colors.accent} 0%, #FFB6C1 100%)`,
  borderRadius: "24px",
  padding: "14px 28px",
  border: "none",
  fontSize: "1rem",
  fontWeight: 600,
  color: tokens.colors.white,
  boxShadow: "0 4px 12px rgba(255, 153, 153, 0.3)",
  transition: "all 0.3s ease",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  gap: "8px",
  textTransform: "none",
  width: "100%",
  height: "48px",
  "&:hover": {
    background: `linear-gradient(135deg, #FF7A7A 0%, ${tokens.colors.accent} 100%)`,
    boxShadow: "0 6px 16px rgba(255, 153, 153, 0.4)",
    transform: "translateY(-2px)",
  },
  "&:active": {
    transform: "translateY(0)",
    boxShadow: "0 2px 8px rgba(255, 153, 153, 0.3)",
  },
});

const CommentButton = styled(Button)({
  background: `linear-gradient(135deg, ${tokens.colors.primary} 0%, #6b5c8a 100%)`,
  borderRadius: "24px",
  padding: "14px 28px",
  border: "none",
  fontSize: "1rem",
  fontWeight: 600,
  color: tokens.colors.white,
  boxShadow: "0 4px 12px rgba(89, 75, 115, 0.25)",
  transition: "all 0.3s ease",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  gap: "8px",
  textTransform: "none",
  width: "100%",
  height: "48px",
  "&:hover": {
    background: `linear-gradient(135deg, #6b5c8a 0%, ${tokens.colors.primary} 100%)`,
    boxShadow: "0 6px 16px rgba(89, 75, 115, 0.35)",
    transform: "translateY(-2px)",
  },
  "&:active": {
    transform: "translateY(0)",
    boxShadow: "0 2px 8px rgba(89, 75, 115, 0.25)",
  },
});

const SecondaryButton = styled(Button)({
  background: `linear-gradient(135deg, ${tokens.colors.primary} 0%, ${tokens.colors.primaryLight} 100%)`,
  borderRadius: "24px",
  padding: "14px 28px",
  border: "none",
  fontSize: "1rem",
  fontWeight: 600,
  color: tokens.colors.white,
  boxShadow: "0 4px 12px rgba(89, 75, 115, 0.25)",
  transition: "all 0.3s ease",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  gap: "8px",
  textTransform: "none",
  width: "100%",
  height: "48px",
  "&:hover": {
    background: `linear-gradient(135deg, ${tokens.colors.primaryLight} 0%, #7d6ea0 100%)`,
    boxShadow: "0 6px 16px rgba(89, 75, 115, 0.35)",
    transform: "translateY(-2px)",
  },
  "&:active": {
    transform: "translateY(0)",
    boxShadow: "0 2px 8px rgba(89, 75, 115, 0.25)",
  },
});

function SharedQuiz() {
  const { user } = useContext(AuthContext);
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const num = searchParams.get("num");

  const [question, setQuestion] = useState({ que: "", ans: "" });
  const [isFlipped, setIsFlipped] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isCommentsOpen, setIsCommentsOpen] = useState(false);

  const onShare = () => {
    handleShare(window.location.href);
  };

  const handleFlipCard = () => {
    const wasFlipped = isFlipped;
    setIsFlipped(!isFlipped);

    // Track flip when user flips to see answer (not when flipping back)
    if (!wasFlipped && num && user?.id) {
      trackFlip(parseInt(num), user.id);
    }
  };

  useEffect(() => {
    if (!num) {
      setError("퀴즈 번호가 없습니다.");
      setLoading(false);
      return;
    }

    const fetchQuestionAndAnswer = async () => {
      const { data: quiz, error } = await supabase
        .from('quizzes')
        .select('question, answer, index')
        .eq('index', parseInt(num))
        .single();  // Returns single object instead of array

      if (error) {
        console.error('Error fetching data:', error);
        setError('퀴즈를 찾을 수 없습니다.');
        setLoading(false);
      } else if (quiz) {
        // Map to existing format
        setQuestion({ que: quiz.question, ans: quiz.answer });
        setLoading(false);
      } else {
        setError('퀴즈를 찾을 수 없습니다.');
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

  // Strip HTML tags for OG description
  const stripHtml = (html) => {
    const tmp = document.createElement("div");
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || "";
  };

  const ogDescription = question.que
    ? `"${stripHtml(question.que).substring(0, 80)}${stripHtml(question.que).length > 80 ? '...' : ''}" - 친구가 보낸 퀴즈를 맞춰보세요!`
    : "친구가 보낸 퀴즈가 도착했어요! 한 번 맞춰볼까요?";

  return (
    <div className="SharedQuiz_Frame">
      <Helmet>
        <title>친구가 보낸 퀴즈 | 하이유모어</title>
        <meta name="description" content={ogDescription} />
        <meta property="og:title" content="친구가 보낸 퀴즈 | 하이유모어" />
        <meta property="og:description" content={ogDescription} />
        <meta property="og:url" content={window.location.href} />
        <meta property="og:image" content="https://hiyoumore.vercel.app/meta_img.png" />
      </Helmet>
      <p className="text">
        ☺️친구에게 받은 퀴즈예요☺️
        <br />한 번 맞춰볼까요?
      </p>

      <ReactCardFlip isFlipped={isFlipped} flipDirection="vertical">
        <Card
          sx={{
            minHeight: "200px",
            height: "auto",
            maxHeight: "280px",
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
            overflow: "hidden",
            "@media (max-width: 400px)": {
              minHeight: "180px",
              maxHeight: "260px",
            },
          }}
          className="Card_Front"
          onClick={handleFlipCard}
        >
          <div className="Card_Front_Que">
            <p dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(question.que) }} />
          </div>
          <span className="tap-hint">탭하여 정답 보기</span>
        </Card>
        <Card
          sx={{
            minHeight: "200px",
            height: "auto",
            maxHeight: "280px",
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
            overflow: "hidden",
            "@media (max-width: 400px)": {
              minHeight: "180px",
              maxHeight: "260px",
            },
          }}
          className="Card_Back"
          onClick={handleFlipCard}
        >
          <div className="Card_Back_Ans">
            <p dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(question.ans) }} />
          </div>
        </Card>
      </ReactCardFlip>
      <ShareButton onClick={onShare}>
        <ShareIcon sx={{ fontSize: "1.2rem" }} />
        친구에게 공유하기
      </ShareButton>
      <CommentButton onClick={() => setIsCommentsOpen(true)}>
        <ChatBubbleOutlineIcon sx={{ fontSize: "1.1rem" }} />
        댓글 보기
      </CommentButton>
      {num && <BookmarkButton quizIndex={parseInt(num)} />}
      <a href="/" style={{ textDecoration: "none", width: "100%" }}>
        <SecondaryButton>
          <QuizIcon sx={{ fontSize: "1.2rem" }} />
          다른 퀴즈 풀어보기
        </SecondaryButton>
      </a>

      {/* Comments Bottom Sheet */}
      <BottomSheet
        open={isCommentsOpen}
        onClose={() => setIsCommentsOpen(false)}
        title="💬 댓글"
        maxHeight="75vh"
      >
        {num && (
          <CommentSection quizIndex={parseInt(num)} />
        )}
      </BottomSheet>
    </div>
  );
}

export default SharedQuiz;
