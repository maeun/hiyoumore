'use client';
import React, { useEffect, useState, useContext } from "react";
import { useSearchParams } from "next/navigation";
import { styled } from "@mui/system";
import { Box, Typography } from "@mui/material";
import CircularProgress from "@mui/material/CircularProgress";
import Skeleton from "@mui/material/Skeleton";
import ShareIcon from "@mui/icons-material/Share";
import QuizIcon from "@mui/icons-material/Quiz";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import ConfettiExplosion from "react-confetti-explosion";
import { supabase } from './supabaseConfig';
import DOMPurify from "dompurify";
import tokensArcade from "./tokens-arcade";
import ArcadeButton from "./components/ArcadeButton";
import NeonBadge from "./components/NeonBadge";
import { handleShare } from "./shareUtils";
import { trackFlip } from "./utils/bookmarkUtils";
import AuthContext from "./AuthContext";
import BottomSheet from "./components/BottomSheet";
import CommentSection from "./components/CommentSection";
import BookmarkButton from "./components/BookmarkButton";
import "./SharedQuiz.css";

// ============================================
// BOSS BATTLE SCREEN LAYOUT
// ============================================

const BattleArena = styled(Box)({
  padding: `${tokensArcade.spacing.xl} ${tokensArcade.spacing.base}`,
  minHeight: 'calc(100vh - 70px - 80px)',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  gap: tokensArcade.spacing.lg,
  paddingBottom: '100px', // Space for TabBar
  boxSizing: 'border-box',
  maxWidth: '500px',
  margin: '0 auto',
  width: '100%',
});

// Challenge banner
const ChallengeBanner = styled(Box)({
  background: tokensArcade.colors.arcadeYellow,
  border: tokensArcade.borders.thick,
  borderColor: tokensArcade.colors.shadowPurple,
  borderRadius: tokensArcade.borderRadius.lg,
  padding: `${tokensArcade.spacing.md} ${tokensArcade.spacing.lg}`,
  boxShadow: tokensArcade.shadows.arcade,
  position: 'relative',
  textAlign: 'center',
  width: '100%',
  maxWidth: '100%',
  boxSizing: 'border-box',

  // Speech bubble arrow
  '&::after': {
    content: '""',
    position: 'absolute',
    bottom: '-12px',
    left: '50%',
    transform: 'translateX(-50%)',
    width: 0,
    height: 0,
    borderLeft: '12px solid transparent',
    borderRight: '12px solid transparent',
    borderTop: `12px solid ${tokensArcade.colors.arcadeYellow}`,
  },
});

const ChallengeText = styled(Typography)({
  fontFamily: tokensArcade.fonts.pixel,
  fontSize: tokensArcade.fonts.sm,
  fontWeight: tokensArcade.fonts.weights.normal,
  color: tokensArcade.colors.deepBlack,
  textTransform: 'uppercase',
  letterSpacing: '1px',
  textShadow: `2px 2px 0 ${tokensArcade.colors.pixelGray}`,
});

// Boss Battle Card - FRONT
const BossCardFront = styled(Box)({
  position: 'relative',
  width: '100%',
  minHeight: '280px',
  height: 'auto',
  maxHeight: '360px',
  backgroundColor: tokensArcade.colors.pureWhite,
  border: tokensArcade.borders.thick,
  borderColor: tokensArcade.colors.electricPurple,
  borderRadius: tokensArcade.borderRadius.lg,
  boxShadow: tokensArcade.shadows.deep,
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  cursor: 'pointer',
  transition: `all ${tokensArcade.motion.durations.fast} ${tokensArcade.motion.easings.snap}`,
  padding: tokensArcade.spacing.xxl,
  overflow: 'hidden',
  boxSizing: 'border-box',

  // Animated sparkle background
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: `
      radial-gradient(circle at 20% 30%, rgba(255, 46, 151, 0.1) 0%, transparent 50%),
      radial-gradient(circle at 80% 70%, rgba(0, 240, 255, 0.1) 0%, transparent 50%),
      radial-gradient(circle at 50% 50%, rgba(255, 214, 0, 0.1) 0%, transparent 50%)
    `,
    animation: 'sparkle 4s ease-in-out infinite',
    pointerEvents: 'none',
  },

  '@keyframes sparkle': {
    '0%, 100%': {
      opacity: 0.3,
    },
    '50%': {
      opacity: 0.8,
    },
  },

  '&:hover': {
    transform: 'translateY(-4px) scale(1.02)',
    boxShadow: tokensArcade.shadows.mega,
  },

  '&:active': {
    transform: 'translateY(2px)',
    boxShadow: tokensArcade.shadows.arcade,
  },

  '@media (max-width: 400px)': {
    minHeight: '240px',
    maxHeight: '320px',
    padding: tokensArcade.spacing.lg,
  },
});

// Boss Battle Card - BACK
const BossCardBack = styled(Box)({
  position: 'relative',
  width: '100%',
  minHeight: '280px',
  height: 'auto',
  maxHeight: '360px',
  backgroundColor: tokensArcade.colors.midnightBlue,
  border: tokensArcade.borders.thick,
  borderColor: tokensArcade.colors.neonPink,
  borderRadius: tokensArcade.borderRadius.lg,
  boxShadow: tokensArcade.shadows.mega,
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  cursor: 'pointer',
  transition: `all ${tokensArcade.motion.durations.fast} ${tokensArcade.motion.easings.snap}`,
  padding: tokensArcade.spacing.xxl,
  overflow: 'visible',
  boxSizing: 'border-box',

  '&:hover': {
    transform: 'translateY(-4px) scale(1.02)',
  },

  '&:active': {
    transform: 'translateY(2px)',
    boxShadow: tokensArcade.shadows.deep,
  },

  '@media (max-width: 400px)': {
    minHeight: '240px',
    maxHeight: '320px',
    padding: tokensArcade.spacing.lg,
  },
});

const QuestionText = styled(Box)({
  fontFamily: 'Maplestory_Light, sans-serif',
  fontSize: 'clamp(1.2rem, 4vw, 1.6rem)',
  lineHeight: 1.5,
  color: tokensArcade.colors.deepBlack,
  textAlign: 'center',
  maxWidth: '100%',
  wordBreak: 'keep-all',
  overflowWrap: 'break-word',
  position: 'relative',
  zIndex: 1,

  '& p': {
    margin: 0,
    padding: 0,
    display: '-webkit-box',
    WebkitLineClamp: 5,
    WebkitBoxOrient: 'vertical',
    overflow: 'hidden',
  },
});

const AnswerText = styled(Box)({
  fontFamily: 'Maplestory_Light, sans-serif',
  fontWeight: 700,
  fontSize: 'clamp(1.3rem, 4.5vw, 1.9rem)',
  lineHeight: 1.45,
  color: tokensArcade.colors.neonCyan,
  textShadow: tokensArcade.shadows.neonCyan,
  textAlign: 'center',
  wordBreak: 'keep-all',
  overflowWrap: 'break-word',
  position: 'relative',
  zIndex: 1,

  '& p': {
    margin: 0,
    padding: 0,
    maxWidth: '100%',
    display: '-webkit-box',
    WebkitLineClamp: 4,
    WebkitBoxOrient: 'vertical',
    overflow: 'hidden',
  },
});

const TapHint = styled('span')({
  position: 'absolute',
  bottom: tokensArcade.spacing.base,
  left: '50%',
  transform: 'translateX(-50%)',
  fontFamily: tokensArcade.fonts.pixel,
  fontSize: tokensArcade.fonts.xs,
  color: tokensArcade.colors.electricPurple,
  textTransform: 'uppercase',
  animation: 'pulse 2s ease-in-out infinite',

  '@keyframes pulse': {
    '0%, 100%': {
      opacity: 0.6,
      transform: 'translateX(-50%) scale(1)',
    },
    '50%': {
      opacity: 1,
      transform: 'translateX(-50%) scale(1.05)',
    },
  },
});

const ConfettiContainer = styled(Box)({
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  pointerEvents: 'none',
  zIndex: 100,
});

const BookmarkFloating = styled(Box)({
  position: 'absolute',
  top: tokensArcade.spacing.base,
  right: tokensArcade.spacing.base,
  zIndex: 10,
});

// Action buttons container
const ActionsStack = styled(Box)({
  display: 'flex',
  flexDirection: 'column',
  gap: tokensArcade.spacing.md,
  width: '100%',
  maxWidth: '100%',
  boxSizing: 'border-box',
});

// ============================================
// SHARED QUIZ COMPONENT
// ============================================

function SharedQuiz({ quizData = null, quizId = null }) {
  const { user } = useContext(AuthContext);
  const searchParams = useSearchParams();
  // Use quizId prop if provided (SSR path), otherwise read from URL query param
  const num = quizId ?? searchParams.get("num");

  const [question, setQuestion] = useState({ que: "", ans: "" });
  const [isFlipped, setIsFlipped] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isCommentsOpen, setIsCommentsOpen] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

  const onShare = () => {
    handleShare(window.location.href);
  };

  const handleFlipCard = () => {
    const wasFlipped = isFlipped;
    setIsFlipped(!isFlipped);

    // Show confetti when flipping to answer
    if (!wasFlipped) {
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 1000);

      // Track flip when user flips to see answer
      if (num && user?.id) {
        trackFlip(parseInt(num), user.id);
      }
    }
  };

  useEffect(() => {
    // SSR path: use pre-fetched data directly
    if (quizData) {
      setQuestion({ que: quizData.question, ans: quizData.answer });
      setLoading(false);
      return;
    }

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
        .single();

      if (error) {
        console.error('Error fetching data:', error);
        setError('퀴즈를 찾을 수 없습니다.');
        setLoading(false);
      } else if (quiz) {
        setQuestion({ que: quiz.question, ans: quiz.answer });
        setLoading(false);
      } else {
        setError('퀴즈를 찾을 수 없습니다.');
        setLoading(false);
      }
    };

    fetchQuestionAndAnswer();
  }, [num, quizData, user]);

  if (loading) {
    return (
      <BattleArena style={{ justifyContent: 'center' }}>
        <CircularProgress sx={{ color: tokensArcade.colors.neonPink, marginBottom: "16px" }} />
        <Skeleton
          variant="rounded"
          width="100%"
          height={280}
          sx={{
            borderRadius: tokensArcade.borderRadius.lg,
            backgroundColor: tokensArcade.colors.pixelGray,
          }}
        />
      </BattleArena>
    );
  }

  if (error) {
    return (
      <BattleArena>
        <NeonBadge color="orange" size="lg">ERROR!</NeonBadge>
        <Typography sx={{
          fontFamily: tokensArcade.fonts.pixel,
          fontSize: tokensArcade.fonts.sm,
          color: tokensArcade.colors.deepBlack,
        }}>
          {error}
        </Typography>
      </BattleArena>
    );
  }

  return (
    <BattleArena>
      {/* Challenge Banner */}
      <ChallengeBanner>
        <ChallengeText>⚔️ FRIEND CHALLENGE! ⚔️</ChallengeText>
      </ChallengeBanner>

      {/* Boss Battle Card */}
      <Box sx={{ position: 'relative', width: '100%' }}>
        {/* Floating Bookmark */}
        {num && !isFlipped && (
          <BookmarkFloating>
            <BookmarkButton quizIndex={parseInt(num)} />
          </BookmarkFloating>
        )}

        {!isFlipped ? (
          /* FRONT - Question */
          <BossCardFront onClick={handleFlipCard}>
            <QuestionText>
              <p dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(question.que) }} />
            </QuestionText>
            <TapHint>TAP!</TapHint>
          </BossCardFront>
        ) : (
          /* BACK - Answer with Confetti */
          <BossCardBack onClick={handleFlipCard}>
            {showConfetti && (
              <ConfettiContainer>
                <ConfettiExplosion
                  force={0.8}
                  duration={2500}
                  particleCount={60}
                  width={1000}
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
              <p dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(question.ans) }} />
            </AnswerText>
          </BossCardBack>
        )}
      </Box>

      {/* Action Buttons */}
      <ActionsStack>
        {/* Share Button */}
        <ArcadeButton
          variant="primary"
          size="mega"
          fullWidth
          icon={<ShareIcon sx={{ fontSize: "1.2rem" }} />}
          onClick={onShare}
        >
          SHARE
        </ArcadeButton>

        {/* Comments Button */}
        <ArcadeButton
          variant="secondary"
          size="large"
          fullWidth
          icon={<ChatBubbleOutlineIcon sx={{ fontSize: "1.1rem" }} />}
          onClick={() => setIsCommentsOpen(true)}
        >
          COMMENTS
        </ArcadeButton>

        {/* More Quizzes Button */}
        <a href="/" style={{ textDecoration: "none", width: "100%" }}>
          <ArcadeButton
            variant="yellow"
            size="large"
            fullWidth
            icon={<QuizIcon sx={{ fontSize: "1.2rem" }} />}
          >
            INSERT COIN
          </ArcadeButton>
        </a>
      </ActionsStack>

      {/* Comments Bottom Sheet */}
      <BottomSheet
        isOpen={isCommentsOpen}
        onClose={() => setIsCommentsOpen(false)}
        title="💬 댓글"
      >
        {num && <CommentSection quizIndex={parseInt(num)} />}
      </BottomSheet>
    </BattleArena>
  );
}

export default SharedQuiz;
