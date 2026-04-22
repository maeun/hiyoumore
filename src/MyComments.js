'use client';
import React, { useState, useEffect, useContext } from "react";
import { useRouter } from "next/navigation";
import { styled } from "@mui/system";
import { Box, CircularProgress, Typography } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import FavoriteIcon from "@mui/icons-material/Favorite";
import AuthContext from "./AuthContext";
import { getUserComments, deleteComment } from "./utils/commentUtils";
import tokensArcade from "./tokens-arcade";
import NeonBadge from "./components/NeonBadge";

// ============================================
// TRADING CARD GALLERY (Comments)
// Reusing design from MyBookmarks
// ============================================

const GalleryContainer = styled(Box)({
  minHeight: "calc(100vh - 70px - 80px)",
  backgroundColor: tokensArcade.colors.softCream,
  paddingBottom: "100px",
  boxSizing: "border-box",
  overflowX: "hidden",
});

const GalleryHeader = styled(Box)({
  background: tokensArcade.colors.deepBlack,
  border: `${tokensArcade.borders.base} ${tokensArcade.colors.arcadeYellow}`,
  borderTop: "none",
  borderLeft: "none",
  borderRight: "none",
  height: "60px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  boxShadow: `0 4px 0 ${tokensArcade.colors.shadowPurple}`,
  position: "relative",
});

const GalleryTitle = styled(Typography)({
  fontFamily: tokensArcade.fonts.pixel,
  fontSize: tokensArcade.fonts.sm,
  fontWeight: tokensArcade.fonts.weights.normal,
  color: tokensArcade.colors.arcadeYellow,
  textShadow: tokensArcade.shadows.neonYellow,
  textTransform: "uppercase",
  letterSpacing: "1px",
});

const GalleryContent = styled(Box)({
  maxWidth: "900px",
  margin: "0 auto",
  padding: tokensArcade.spacing.md,
  boxSizing: "border-box",
});

const CardGrid = styled(Box)({
  display: "grid",
  gridTemplateColumns: "1fr",
  gap: tokensArcade.spacing.base,
  width: "100%",
  boxSizing: "border-box",

  "@media (min-width: 768px)": {
    gridTemplateColumns: "repeat(2, minmax(0, 1fr))", // 🔥 변경
  },
});

const TradingCard = styled(Box)({
  position: "relative",
  backgroundColor: tokensArcade.colors.pureWhite,
  border: tokensArcade.borders.thick,
  borderColor: tokensArcade.colors.electricPurple,
  borderRadius: tokensArcade.borderRadius.lg,
  boxShadow: tokensArcade.shadows.arcade,
  padding: tokensArcade.spacing.base,
  paddingTop: tokensArcade.spacing.xxl,
  cursor: "pointer",
  transition: `all ${tokensArcade.motion.durations.fast} ${tokensArcade.motion.easings.snap}`,
  minHeight: "180px",
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  boxSizing: "border-box",

  "&:hover": {
    transform: "translateY(-6px)",
    boxShadow: tokensArcade.shadows.deep,
    borderColor: tokensArcade.colors.arcadeYellow,
  },

  "&:active": {
    transform: "translateY(2px)",
    boxShadow: tokensArcade.shadows.pixel,
  },
  minWidth: 0,
});

const LikesBadge = styled(Box)({
  position: "absolute",
  top: tokensArcade.spacing.sm,
  left: tokensArcade.spacing.sm,
  zIndex: 2,
});

const DeleteButton = styled(Box)({
  position: "absolute",
  top: tokensArcade.spacing.sm,
  right: tokensArcade.spacing.sm,
  width: "28px",
  height: "28px",
  backgroundColor: tokensArcade.colors.hotOrange,
  border: tokensArcade.borders.base,
  borderColor: tokensArcade.colors.shadowPurple,
  borderRadius: "50%",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  cursor: "pointer",
  transition: `all ${tokensArcade.motion.durations.fast} ${tokensArcade.motion.easings.snap}`,
  zIndex: 3,

  "& .MuiSvgIcon-root": {
    fontSize: "1rem",
    color: tokensArcade.colors.pureWhite,
  },

  "&:hover": {
    transform: "scale(1.2) rotate(90deg)",
    backgroundColor: "#FF8456",
    boxShadow: tokensArcade.shadows.pixel,
  },

  "&:active": {
    transform: "scale(0.9)",
  },
});

const CommentPreview = styled(Typography)({
  fontFamily: tokensArcade.fonts.body,
  fontSize: tokensArcade.fonts.sm,
  color: tokensArcade.colors.deepBlack,
  lineHeight: 1.5,
  overflow: "hidden",
  textOverflow: "ellipsis",
  display: "-webkit-box",
  WebkitLineClamp: 3,
  WebkitBoxOrient: "vertical",
  wordBreak: "break-word",
  overflowWrap: "break-word",
  textAlign: "left",
  padding: `0 ${tokensArcade.spacing.xs}`,
  marginBottom: tokensArcade.spacing.xs,
  width: "100%",
  maxWidth: "100%",
  boxSizing: "border-box",
  minWidth: 0,
});

const QuizHint = styled(Typography)({
  fontFamily: tokensArcade.fonts.pixel,
  fontSize: tokensArcade.fonts.xs,
  color: tokensArcade.colors.pixelGray,
  textAlign: "center",
  overflow: "hidden",
  textOverflow: "ellipsis",
  whiteSpace: "nowrap",
  padding: `0 ${tokensArcade.spacing.xs}`,
  width: "100%",
  boxSizing: "border-box",
  minWidth: 0,
});

const EmptyState = styled(Box)({
  textAlign: "center",
  padding: `${tokensArcade.spacing.mega} ${tokensArcade.spacing.lg}`,
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  gap: tokensArcade.spacing.lg,
});

const EmptyIcon = styled(Typography)({
  fontSize: "72px",
  filter: "grayscale(100%)",
  opacity: 0.5,
});

const EmptyText = styled(Typography)({
  fontFamily: tokensArcade.fonts.pixel,
  fontSize: tokensArcade.fonts.xs,
  color: tokensArcade.colors.shadowPurple,
  textTransform: "uppercase",
  letterSpacing: "0.5px",
});

const LoadingContainer = styled(Box)({
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  minHeight: "300px",
});

const LoadMoreButton = styled(Box)({
  marginTop: tokensArcade.spacing.lg,
  textAlign: "center",
});

const LoadMoreButtonInner = styled(Box)({
  display: "inline-block",
  padding: `${tokensArcade.spacing.md} ${tokensArcade.spacing.xl}`,
  backgroundColor: tokensArcade.colors.electricPurple,
  color: tokensArcade.colors.pureWhite,
  border: tokensArcade.borders.base,
  borderColor: tokensArcade.colors.shadowPurple,
  borderRadius: tokensArcade.borderRadius.lg,
  boxShadow: tokensArcade.shadows.arcade,
  cursor: "pointer",
  transition: `all ${tokensArcade.motion.durations.fast} ${tokensArcade.motion.easings.snap}`,
  fontFamily: tokensArcade.fonts.pixel,
  fontSize: tokensArcade.fonts.xs,
  textTransform: "uppercase",
  letterSpacing: "0.5px",

  "&:hover": {
    transform: "translateY(-4px)",
    boxShadow: tokensArcade.shadows.deep,
  },

  "&:active": {
    transform: "translateY(2px)",
    boxShadow: tokensArcade.shadows.pixel,
  },
});

// ============================================
// MY COMMENTS COMPONENT
// ============================================

const MyComments = () => {
  const router = useRouter();
  const { user } = useContext(AuthContext);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);

  const COMMENTS_PER_PAGE = 50;

  useEffect(() => {
    if (user) fetchComments(0, true);
    else setLoading(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const fetchComments = async (currentOffset, reset = false) => {
    if (reset) {
      setLoading(true);
    } else {
      setLoadingMore(true);
    }

    const { data, hasMore: more } = await getUserComments(
      user?.id,
      currentOffset,
      COMMENTS_PER_PAGE,
    );

    if (reset) {
      setComments(data);
    } else {
      setComments((prev) => [...prev, ...data]);
    }

    setHasMore(more);
    setOffset(currentOffset + COMMENTS_PER_PAGE);
    setLoading(false);
    setLoadingMore(false);
  };

  const handleDelete = async (e, commentId) => {
    e.stopPropagation();
    const confirmed = window.confirm("이 댓글을 삭제하시겠습니까?");
    if (!confirmed) return;

    const success = await deleteComment(commentId, user?.id);
    if (success) {
      setComments(comments.filter((c) => c.id !== commentId));
    }
  };

  const handleCardClick = (quizIndex) => {
    router.push(`/shared-quiz?num=${quizIndex}`);
  };

  const handleLoadMore = () => {
    fetchComments(offset, false);
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
          <GalleryTitle>💬 COMMENTS HISTORY</GalleryTitle>
        </GalleryHeader>
        <GalleryContent>
          <LoadingContainer>
            <CircularProgress
              sx={{ color: tokensArcade.colors.arcadeYellow }}
            />
          </LoadingContainer>
        </GalleryContent>
      </GalleryContainer>
    );
  }

  return (
    <GalleryContainer>
      <GalleryHeader>
        <GalleryTitle>💬 COMMENTS HISTORY</GalleryTitle>
      </GalleryHeader>

      <GalleryContent>
        {comments.length === 0 ? (
          <EmptyState>
            <EmptyIcon>😢</EmptyIcon>
            <EmptyText>NO ITEMS COLLECTED</EmptyText>
          </EmptyState>
        ) : (
          <>
            <CardGrid>
              {comments.map((c) => (
                <TradingCard
                  key={c.id}
                  onClick={() => handleCardClick(c.quiz_index)}
                >
                  {/* Likes Badge */}
                  {c.likes_count > 0 && (
                    <LikesBadge>
                      <NeonBadge color="pink" size="sm">
                        <FavoriteIcon
                          sx={{ fontSize: "0.7rem", marginRight: "2px" }}
                        />
                        {c.likes_count}
                      </NeonBadge>
                    </LikesBadge>
                  )}

                  {/* Delete Button */}
                  <DeleteButton onClick={(e) => handleDelete(e, c.id)}>
                    <CloseIcon />
                  </DeleteButton>

                  {/* Comment Preview */}
                  <CommentPreview>{c.comment_text}</CommentPreview>

                  {/* Quiz Hint */}
                  <QuizHint>
                    퀴즈: {stripHtml(c.question).substring(0, 20)}
                    {stripHtml(c.question).length > 20 ? "..." : ""}
                  </QuizHint>
                </TradingCard>
              ))}
            </CardGrid>

            {hasMore && (
              <LoadMoreButton>
                <LoadMoreButtonInner onClick={handleLoadMore}>
                  {loadingMore ? (
                    <CircularProgress
                      size={16}
                      sx={{ color: tokensArcade.colors.pureWhite }}
                    />
                  ) : (
                    "LOAD MORE"
                  )}
                </LoadMoreButtonInner>
              </LoadMoreButton>
            )}
          </>
        )}
      </GalleryContent>
    </GalleryContainer>
  );
};

export default MyComments;
