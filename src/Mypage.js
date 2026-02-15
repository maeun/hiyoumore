import something_going_wrong from "./something_going_wrong.png";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { styled } from "@mui/system";
import { Avatar, Box, Typography, Button } from "@mui/material";
import { useContext, useEffect, useMemo, useState } from "react";
import StarIcon from "@mui/icons-material/Star";
import VisibilityIcon from "@mui/icons-material/Visibility";
import LogoutIcon from "@mui/icons-material/Logout";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import AuthContext from "./AuthContext";
import { ToastContainer } from "react-toastify";
import { showToast, showErrorToast } from "./toastUtils";
import { supabase } from "./supabaseConfig";
import { saveLogoutTime } from "./authUtils";
import { getBookmarkCount, getFlipCount } from "./utils/bookmarkUtils";
import tokens from "./tokens";

/** =========================
 * Layout primitives
 * ========================= */

const Page = styled("div")({
  background: tokens.colors.background,
  paddingTop: 20,
  paddingBottom: 20,

  // ✅ Page-level centering
  display: "flex",
  justifyContent: "center",
});

const Shell = styled(Box)({
  width: "100%",
  maxWidth: 620,
  padding: "0 16px",

  // ✅ Center align within Page flex
  margin: "0 auto",

  // ✅ If you want everything inside to be centered by default
  display: "flex",
  justifyContent: "center",
});

const Stack = styled(Box)({
  display: "flex",
  flexDirection: "column",
  gap: 16,
  width: "100%",

  // ✅ ensures children align consistently
  alignItems: "center",
});

/** =========================
 * Profile (Hero) section
 * ========================= */

const ProfileCard = styled(Box)({
  padding: "28px 20px 22px",
  textAlign: "center",
  color: "#FFF",
  background: `linear-gradient(135deg, ${tokens.colors.primary} 0%, #8B7ADB 100%)`,
  borderRadius: 22,
  boxShadow: "0 6px 18px rgba(124, 92, 219, 0.16)",

  // ✅ keep full width of Shell
  width: "100%",
});

const StyledAvatar = styled(Avatar)({
  width: 86,
  height: 86,
  margin: "0 auto 14px",
  border: "3px solid rgba(255, 255, 255, 0.28)",
  boxShadow: "0 10px 26px rgba(0, 0, 0, 0.18)",
});

const WelcomeText = styled(Typography)({
  fontSize: "1.55rem",
  fontWeight: 800,
  marginBottom: 6,
  fontFamily: tokens.fonts.korean,
  color: "#FFF",
  textShadow: "0 2px 8px rgba(0,0,0,0.14)",
});

const EmailText = styled(Typography)({
  fontSize: "0.85rem",
  color: "rgba(255, 255, 255, 0.82)",
  fontFamily: tokens.fonts.korean,
  fontWeight: 500,
});

/** =========================
 * Stats card
 * ========================= */

const Card = styled(Box)({
  background: "#FFF",
  borderRadius: 22,
  padding: "22px 18px",
  boxShadow: "0 10px 26px rgba(16, 42, 67, 0.06)",
  border: "1px solid rgba(124, 92, 219, 0.08)",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",

  // ✅ keep full width of Shell
  width: "100%",
});

const SectionTitle = styled(Typography)({
  fontSize: "0.78rem",
  fontWeight: 800,
  color: tokens.colors.textSecondary,
  fontFamily: tokens.fonts.korean,
  marginBottom: 14,
  textTransform: "uppercase",
  letterSpacing: "0.9px",
  textAlign: "center",
  width: "100%",
});

const StatsGrid = styled(Box)({
  display: "grid",
  gridTemplateColumns: "1fr 1fr",
  gap: 14,
  marginBottom: 16,
  width: "100%",
});

const StatItem = styled(Box)({
  textAlign: "center",
  padding: "18px 14px",
  background: `linear-gradient(135deg, ${tokens.colors.background} 0%, #F0EDFF 100%)`,
  borderRadius: 18,
  border: `1px solid ${tokens.colors.borderLight}`,
  transition: "all 0.2s ease",
  cursor: "pointer",
  "&:hover": {
    transform: "translateY(-2px)",
    boxShadow: "0 10px 22px rgba(124, 92, 219, 0.12)",
    borderColor: tokens.colors.primary,
  },
  "&:active": {
    transform: "translateY(0px)",
  },
});

const StatIconWrapper = styled(Box)({
  width: 42,
  height: 42,
  margin: "0 auto 12px",
  borderRadius: "50%",
  background: `linear-gradient(135deg, ${tokens.colors.primary} 0%, ${tokens.colors.primaryLight} 100%)`,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  boxShadow: "0 6px 14px rgba(124, 92, 219, 0.28)",
});

const StatNumber = styled(Typography)({
  fontSize: "2.2rem",
  fontWeight: 900,
  color: tokens.colors.primary,
  marginBottom: 4,
  lineHeight: 1,
  fontFamily: tokens.fonts.body,
});

const StatLabel = styled(Typography)({
  fontSize: "0.78rem",
  color: tokens.colors.textSecondary,
  fontWeight: 700,
  fontFamily: tokens.fonts.korean,
});

/** =========================
 * Buttons
 * ========================= */

const PrimaryButton = styled(Button)({
  background: `linear-gradient(135deg, ${tokens.colors.primary} 0%, ${tokens.colors.primaryLight} 100%)`,
  color: "#FFF",
  borderRadius: 16,
  padding: "14px 16px",
  fontSize: "1rem",
  fontWeight: 800,
  textTransform: "none",
  fontFamily: tokens.fonts.korean,
  boxShadow: "0 10px 22px rgba(124, 92, 219, 0.30)",
  display: "flex",
  alignItems: "center",
  gap: 10,
  width: "100%",
  transition: "all 0.2s ease",
  "&:hover": {
    boxShadow: "0 12px 28px rgba(124, 92, 219, 0.38)",
    transform: "translateY(-1px)",
  },
  "&:active": {
    transform: "translateY(0px)",
  },
});

const DangerButton = styled(Button)({
  background: "rgba(239, 68, 68, 0.08)",
  color: "#DC2626",
  borderRadius: 16,
  padding: "12px 16px",
  fontSize: "0.95rem",
  fontWeight: 700,
  textTransform: "none",
  fontFamily: tokens.fonts.korean,
  border: "1px solid rgba(239, 68, 68, 0.18)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  gap: 10,
  width: "100%",
  transition: "all 0.2s ease",
  "&:hover": {
    background: "rgba(239, 68, 68, 0.14)",
    borderColor: "rgba(239, 68, 68, 0.28)",
    transform: "translateY(-1px)",
  },
  "&:active": {
    transform: "translateY(0px)",
  },
});

function Mypage() {
  const { user, session, platform, isLoggedIn } = useContext(AuthContext);
  const [userProfile, setUserProfile] = useState(null);
  const [bookmarkCount, setBookmarkCount] = useState(0);
  const [flipCount, setFlipCount] = useState(0);
  const navigate = useNavigate();

  const PREVIEW_MODE = process.env.NODE_ENV !== "production" && true;

  const mockProfile = useMemo(
    () => ({
      nickname: "디자인 프리뷰",
      email: "preview@example.com",
      profile_image_url: null,
    }),
    [],
  );

  const mockIsLoggedIn = PREVIEW_MODE || isLoggedIn;

  const profileImages = useMemo(
    () => [
      process.env.PUBLIC_URL + "/profile_yellow.png",
      process.env.PUBLIC_URL + "/profile_blue.png",
      process.env.PUBLIC_URL + "/profile_black.png",
      process.env.PUBLIC_URL + "/profile_orange.png",
    ],
    [],
  );

  const defaultProfileImage = useMemo(() => {
    return profileImages[Math.floor(Math.random() * profileImages.length)];
  }, [profileImages]);

  useEffect(() => {
    if (PREVIEW_MODE) {
      setUserProfile(mockProfile);
      setBookmarkCount(42);
      setFlipCount(127);
      return;
    }
    if (user) {
      fetchUserProfile();
      fetchUserStats();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, PREVIEW_MODE, mockProfile]);

  const fetchUserProfile = async () => {
    if (!user?.id) return;

    const { data, error } = await supabase
      .from("user_profiles")
      .select("*")
      .eq("id", user.id)
      .single();

    if (error) {
      console.error("Error fetching profile:", error);
      setUserProfile({
        nickname: user.user_metadata?.name || user.email,
        email: user.email,
        profile_image_url: user.user_metadata?.avatar_url,
      });
    } else {
      setUserProfile(data);
    }
  };

  const fetchUserStats = async () => {
    if (!user?.id) return;

    const [bookmarks, flips] = await Promise.all([
      getBookmarkCount(user.id),
      getFlipCount(user.id),
    ]);
    setBookmarkCount(bookmarks);
    setFlipCount(flips);
  };

  const handleSignout = async () => {
    if (!user?.id || !session?.access_token) {
      showErrorToast("로그아웃 실패");
      return;
    }

    try {
      await saveLogoutTime(user.id, session.access_token, platform);
      const { error } = await supabase.auth.signOut();

      if (error) {
        showErrorToast("로그아웃 실패");
        console.error("Signout error:", error);
        return;
      }

      showToast("안녕히 가세요! 👋");
      navigate("/");
    } catch (e) {
      console.error(e);
      showErrorToast("로그아웃 실패");
    }
  };

  return (
    <Page>
      <Helmet>
        <title>마이페이지 | 하이유모어</title>
        <meta name="robots" content="noindex" />
      </Helmet>
      <ToastContainer />

      <Shell>
        {mockIsLoggedIn ? (
          userProfile && (
            <Stack>
              <ProfileCard>
                <StyledAvatar
                  src={userProfile.profile_image_url || defaultProfileImage}
                  alt="Profile"
                />
                <WelcomeText>
                  {(userProfile.nickname || userProfile.name) + "님"}
                </WelcomeText>
                <EmailText>{userProfile.email}</EmailText>
              </ProfileCard>

              <Card>
                <SectionTitle>My Activity</SectionTitle>

                <StatsGrid>
                  <StatItem onClick={() => navigate("/my-history")}>
                    <StatIconWrapper>
                      <VisibilityIcon
                        sx={{ color: "#FFF", fontSize: "1.45rem" }}
                      />
                    </StatIconWrapper>
                    <StatNumber>{flipCount}</StatNumber>
                    <StatLabel>봤던 퀴즈</StatLabel>
                  </StatItem>

                  <StatItem onClick={() => navigate("/my-bookmarks")}>
                    <StatIconWrapper>
                      <StarIcon sx={{ color: "#FFF", fontSize: "1.45rem" }} />
                    </StatIconWrapper>
                    <StatNumber>{bookmarkCount}</StatNumber>
                    <StatLabel>북마크</StatLabel>
                  </StatItem>
                </StatsGrid>

                <PrimaryButton onClick={() => navigate("/my-bookmarks")}>
                  <BookmarkIcon sx={{ fontSize: "1.2rem" }} />
                  내 북마크 보기
                  <ArrowForwardIcon
                    sx={{ marginLeft: "auto", fontSize: "1.2rem" }}
                  />
                </PrimaryButton>
              </Card>

              <DangerButton onClick={handleSignout}>
                <LogoutIcon sx={{ fontSize: "1.05rem" }} />
                로그아웃
              </DangerButton>
            </Stack>
          )
        ) : (
          <Box sx={{ textAlign: "center", padding: "40px 20px" }}>
            <img src={something_going_wrong} alt="Something went wrong" />
          </Box>
        )}
      </Shell>
    </Page>
  );
}

export default Mypage;
