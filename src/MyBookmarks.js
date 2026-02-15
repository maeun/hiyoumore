import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { styled } from "@mui/system";
import { CircularProgress, IconButton, Chip, Button } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import AuthContext from "./AuthContext";
import { getUserBookmarks, deleteBookmark } from "./utils/bookmarkUtils";
import tokens from "./tokens";

/* =========================
   LAYOUT STYLES
========================= */

const Container = styled("div")({
  minHeight: "100vh",
  backgroundColor: "var(--bg-color)",
  paddingBottom: "80px",
});

/* FULL WIDTH HEADER */
const Header = styled("div")({
  background: `linear-gradient(135deg, ${tokens.colors.primary} 0%, #6b5c8a 100%)`,
  color: tokens.colors.white,
  height: "60px",
  position: "sticky",
  top: 0,
  zIndex: 100,
  boxShadow: tokens.shadows.medium,
  width: "100%",
});

/* INNER 500px CENTER WRAPPER */
const HeaderInner = styled("div")({
  maxWidth: "500px",
  width: "100%",
  height: "60px",
  margin: "0 auto",
  padding: "0 20px",
  display: "flex",
  alignItems: "center",
  position: "relative",
});

/* BACK BUTTON LEFT */
const BackButton = styled(IconButton)({
  color: tokens.colors.white,
  zIndex: 1,
  "&:hover": {
    backgroundColor: "rgba(255,255,255,0.1)",
  },
});

/* TITLE PERFECT CENTER */
const Title = styled("h1")({
  margin: 0,
  fontSize: "1.3rem",
  fontWeight: 700,
  fontFamily: tokens.fonts.korean,
  position: "absolute",
  left: "50%",
  transform: "translateX(-50%)",
  display: "inline-flex",
  alignItems: "center",
  gap: "8px",
});

const Content = styled("div")({
  maxWidth: "500px",
  margin: "0 auto",
  padding: "20px",
});

/* =========================
   UI COMPONENT STYLES
========================= */

const EmptyState = styled("div")({
  textAlign: "center",
  padding: "60px 20px",
  color: tokens.colors.textSecondary,
});

const EmptyIcon = styled("div")({
  fontSize: "4rem",
  marginBottom: "16px",
});

const EmptyText = styled("p")({
  fontSize: "1rem",
  margin: "0 0 24px 0",
});

const BookmarkList = styled("div")({
  display: "flex",
  flexDirection: "column",
  gap: "12px",
});

const BookmarkItem = styled("div")({
  backgroundColor: tokens.colors.white,
  borderRadius: tokens.borderRadius.medium,
  padding: "16px",
  boxShadow: tokens.shadows.light,
  display: "flex",
  gap: "12px",
  alignItems: "flex-start",
  cursor: "pointer",
  transition: "all 0.2s ease",
  border: "1px solid rgba(89, 75, 115, 0.1)",
  "&:hover": {
    boxShadow: tokens.shadows.medium,
    transform: "translateY(-2px)",
    borderColor: tokens.colors.primary,
  },
});

const BookmarkContent = styled("div")({
  flex: 1,
  minWidth: 0,
});

const CategoryBadge = styled(Chip)({
  fontSize: "0.75rem",
  height: "24px",
  marginBottom: "8px",
  backgroundColor: tokens.colors.primary,
  color: tokens.colors.white,
  fontWeight: 600,
});

const QuestionPreview = styled("p")({
  margin: 0,
  fontSize: "0.95rem",
  color: tokens.colors.text,
  lineHeight: 1.5,
  overflow: "hidden",
  textOverflow: "ellipsis",
  display: "-webkit-box",
  WebkitLineClamp: 2,
  WebkitBoxOrient: "vertical",
  wordBreak: "break-word",
});

const DeleteButton = styled(IconButton)({
  color: tokens.colors.textSecondary,
  padding: "8px",
  "&:hover": {
    color: "#d32f2f",
    backgroundColor: "rgba(211,47,47,0.08)",
  },
});

const LoadMoreButton = styled(Button)({
  alignSelf: "center",
  color: tokens.colors.primary,
  borderRadius: "20px",
  padding: "8px 20px",
  fontSize: "0.85rem",
  marginTop: "16px",
});

const LoadingContainer = styled("div")({
  display: "flex",
  justifyContent: "center",
  padding: "40px 20px",
});

/* =========================
   PAGE COMPONENT
========================= */

const MyBookmarks = () => {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [bookmarks, setBookmarks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) fetchBookmarks();
    else setLoading(false);
  }, [user]);

  const fetchBookmarks = async () => {
    const { data } = await getUserBookmarks(user?.id, 0, 10);
    setBookmarks(data || []);
    setLoading(false);
  };

  const stripHtml = (html) => {
    const tmp = document.createElement("div");
    tmp.innerHTML = html;
    return tmp.textContent || "";
  };

  if (loading) {
    return (
      <Container>
        <Header>
          <HeaderInner>
            <BackButton onClick={() => navigate(-1)}>
              <ArrowBackIcon />
            </BackButton>
            <Title>⭐ 내 북마크</Title>
          </HeaderInner>
        </Header>
        <Content>
          <LoadingContainer>
            <CircularProgress sx={{ color: tokens.colors.primary }} />
          </LoadingContainer>
        </Content>
      </Container>
    );
  }

  return (
    <Container>
      <Helmet>
        <title>내 북마크 | 하이유모어</title>
        <meta name="robots" content="noindex" />
      </Helmet>

      <Header>
        <HeaderInner>
          <BackButton onClick={() => navigate(-1)}>
            <ArrowBackIcon />
          </BackButton>
          <Title>⭐ 내 북마크</Title>
        </HeaderInner>
      </Header>

      <Content>
        {bookmarks.length === 0 ? (
          <EmptyState>
            <EmptyIcon>⭐</EmptyIcon>
            <EmptyText>아직 북마크한 퀴즈가 없어요.</EmptyText>
          </EmptyState>
        ) : (
          <BookmarkList>
            {bookmarks.map((b) => (
              <BookmarkItem key={b.id}>
                <BookmarkContent>
                  <CategoryBadge label={b.category} size="small" />
                  <QuestionPreview>{stripHtml(b.question)}</QuestionPreview>
                </BookmarkContent>
                <DeleteButton>
                  <DeleteIcon fontSize="small" />
                </DeleteButton>
              </BookmarkItem>
            ))}
          </BookmarkList>
        )}
      </Content>
    </Container>
  );
};

export default MyBookmarks;
