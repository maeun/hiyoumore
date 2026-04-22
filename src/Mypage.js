'use client';
import something_going_wrong from "./something_going_wrong.png";
import { useRouter } from "next/navigation";
import { styled } from "@mui/system";
import { Avatar, Box, Typography } from "@mui/material";
import { useContext, useEffect, useMemo, useState } from "react";
import VisibilityIcon from "@mui/icons-material/Visibility";
import LogoutIcon from "@mui/icons-material/Logout";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import AuthContext from "./AuthContext";
import { showToast, showErrorToast } from "./toastUtils";
import { supabase } from "./supabaseConfig";
import { saveLogoutTime } from "./authUtils";
import { getBookmarkCount, getFlipCount } from "./utils/bookmarkUtils";
import { getCommentCount } from "./utils/commentUtils";
import { handleKakaoLogin } from "./utils/loginUtils";
import tokensArcade from "./tokens-arcade";
import ArcadeButton from "./components/ArcadeButton";
import ScoreCounter from "./components/ScoreCounter";

/** =========================
 * ARCADE MYPAGE LAYOUT
 * ========================= */

const Page = styled("div")({
  background: tokensArcade.colors.softCream,
  paddingTop: 24,
  paddingBottom: 100, // Space for TabBar (80px) + extra margin
  display: "flex",
  justifyContent: "center",
});

const Shell = styled(Box)({
  width: "100%",
  maxWidth: 600,
  padding: "0 20px",
  margin: "0 auto",
  display: "flex",
  justifyContent: "center",
  boxSizing: "border-box",
});

const Stack = styled(Box)({
  display: "flex",
  flexDirection: "column",
  gap: tokensArcade.spacing.base,
  width: "100%",
  maxWidth: "100%",
  alignItems: "center",
  boxSizing: "border-box",
});

/** =========================
 * PROFILE HERO - Arcade Header
 * ========================= */

const ProfileHeader = styled(Box)({
  padding: `${tokensArcade.spacing.md} ${tokensArcade.spacing.lg}`,
  display: "flex",
  flexDirection: "row",
  alignItems: "center",
  gap: tokensArcade.spacing.lg,
  background: tokensArcade.colors.deepBlack,
  border: tokensArcade.borders.thick,
  borderColor: tokensArcade.colors.neonCyan,
  borderRadius: tokensArcade.borderRadius.lg,
  boxShadow: tokensArcade.shadows.glowCyan,
  width: "100%",
  maxWidth: "100%",
  boxSizing: "border-box",
  position: 'relative',
  overflow: 'hidden',

  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: `repeating-linear-gradient(
      0deg,
      rgba(0, 240, 255, 0.03) 0px,
      rgba(0, 240, 255, 0.03) 1px,
      transparent 1px,
      transparent 2px
    )`,
    pointerEvents: 'none',
  },
});

const AvatarFrame = styled(Box)({
  flexShrink: 0,
  width: 68,
  height: 68,
  padding: 3,
  background: tokensArcade.colors.neonPink,
  border: tokensArcade.borders.thick,
  borderColor: tokensArcade.colors.pureWhite,
  borderRadius: tokensArcade.borderRadius.md,
  boxShadow: tokensArcade.shadows.glowPink,
  position: 'relative',
  zIndex: 1,
});

const StyledAvatar = styled(Avatar)({
  width: '100%',
  height: '100%',
  borderRadius: tokensArcade.borderRadius.sm,
});

const ProfileInfo = styled(Box)({
  display: "flex",
  flexDirection: "column",
  alignItems: "flex-start",
  gap: tokensArcade.spacing.xs,
  position: 'relative',
  zIndex: 1,
  minWidth: 0,
});

const PlayerName = styled(Typography)({
  fontFamily: tokensArcade.fonts.number,
  fontSize: tokensArcade.fonts.lg,
  fontWeight: tokensArcade.fonts.weights.black,
  color: tokensArcade.colors.neonCyan,
  textShadow: tokensArcade.shadows.neonCyan,
  letterSpacing: '1px',
  lineHeight: 1.2,
  whiteSpace: 'nowrap',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  maxWidth: '100%',
});

const PlayerID = styled(Typography)({
  fontFamily: tokensArcade.fonts.pixel,
  fontSize: '0.55rem',
  color: tokensArcade.colors.pixelGray,
  textTransform: 'uppercase',
  letterSpacing: '0.5px',
  lineHeight: 1.4,
});

/** =========================
 * ACHIEVEMENTS CARD
 * ========================= */

const AchievementsCard = styled(Box)({
  background: tokensArcade.colors.pureWhite,
  border: tokensArcade.borders.thick,
  borderColor: tokensArcade.colors.electricPurple,
  borderRadius: tokensArcade.borderRadius.lg,
  boxShadow: tokensArcade.shadows.arcade,
  padding: tokensArcade.spacing.xl,
  width: "100%",
  maxWidth: "100%",
  boxSizing: "border-box",
});

const AchievementsTitle = styled(Typography)({
  fontFamily: tokensArcade.fonts.pixel,
  fontSize: tokensArcade.fonts.sm,
  fontWeight: tokensArcade.fonts.weights.normal,
  color: tokensArcade.colors.electricPurple,
  textAlign: "center",
  marginBottom: tokensArcade.spacing.lg,
  textTransform: 'uppercase',
  letterSpacing: '1px',
  textShadow: `2px 2px 0 ${tokensArcade.colors.pixelGray}`,
});

const StatsGrid = styled(Box)({
  display: "grid",
  gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
  gap: tokensArcade.spacing.sm,
  marginBottom: tokensArcade.spacing.lg,
  width: "100%",
});

const StatCard = styled(Box)({
  textAlign: "center",
  padding: tokensArcade.spacing.base,
  background: tokensArcade.colors.midnightBlue,
  border: tokensArcade.borders.base,
  borderColor: tokensArcade.colors.neonPink,
  borderRadius: tokensArcade.borderRadius.lg,
  boxShadow: tokensArcade.shadows.pixel,
  cursor: "pointer",
  transition: `all ${tokensArcade.motion.durations.fast} ${tokensArcade.motion.easings.snap}`,

  "&:hover": {
    transform: "translateY(-4px)",
    boxShadow: tokensArcade.shadows.arcade,
  },

  "&:active": {
    transform: "translateY(2px)",
    boxShadow: tokensArcade.shadows.pixel,
  },
});

const StatIconBox = styled(Box)({
  width: 32,
  height: 32,
  margin: "0 auto 8px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  color: tokensArcade.colors.arcadeYellow,
  filter: `drop-shadow(0 0 8px ${tokensArcade.colors.arcadeYellow})`,
});

const StatLabel = styled(Typography)({
  fontSize: tokensArcade.fonts.xs,
  color: tokensArcade.colors.pixelGray,
  fontFamily: tokensArcade.fonts.body,
  fontWeight: tokensArcade.fonts.weights.medium,
  marginTop: tokensArcade.spacing.xs,
});

/** =========================
 * QUICK LINKS ROW
 * ========================= */

const QuickLinksRow = styled(Box)({
  display: "grid",
  gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
  gap: tokensArcade.spacing.sm,
  width: "100%",
  marginTop: tokensArcade.spacing.xs,
});

const QuickLinkButton = styled(Box)(({ color }) => ({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  gap: 4,
  padding: `${tokensArcade.spacing.sm} ${tokensArcade.spacing.xs}`,
  background: tokensArcade.colors.pureWhite,
  border: tokensArcade.borders.base,
  borderColor: color || tokensArcade.colors.electricPurple,
  borderRadius: tokensArcade.borderRadius.md,
  boxShadow: `3px 3px 0 ${tokensArcade.colors.shadowPurple}`,
  cursor: "pointer",
  transition: `all ${tokensArcade.motion.durations.fast} ${tokensArcade.motion.easings.snap}`,

  "&:hover": {
    transform: "translateY(-3px)",
    boxShadow: `4px 4px 0 ${tokensArcade.colors.shadowPurple}`,
  },
  "&:active": {
    transform: "translateY(1px)",
    boxShadow: "none",
  },
}));

const QuickLinkLabel = styled(Typography)({
  fontFamily: tokensArcade.fonts.pixel,
  fontSize: '0.5rem',
  color: tokensArcade.colors.deepBlack,
  textAlign: "center",
  lineHeight: 1.3,
});

/** =========================
 * POWER OFF BUTTON
 * ========================= */

const PowerOffButton = styled(Box)({
  width: '100%',
  maxWidth: '100%',
  height: '44px',
  padding: `${tokensArcade.spacing.md} ${tokensArcade.spacing.base}`,
  backgroundColor: tokensArcade.colors.hotOrange,
  color: tokensArcade.colors.pureWhite,
  border: tokensArcade.borders.base,
  borderColor: tokensArcade.colors.shadowPurple,
  borderRadius: tokensArcade.borderRadius.md,
  boxShadow: tokensArcade.shadows.pixel,
  boxSizing: 'border-box',
  cursor: 'pointer',
  transition: `all ${tokensArcade.motion.durations.fast} ${tokensArcade.motion.easings.snap}`,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: tokensArcade.spacing.sm,
  fontFamily: tokensArcade.fonts.pixel,
  fontSize: tokensArcade.fonts.xs,
  fontWeight: tokensArcade.fonts.weights.normal,
  textTransform: 'uppercase',
  letterSpacing: '0.5px',

  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: tokensArcade.shadows.deep,
    backgroundColor: '#FF8456',
  },

  '&:active': {
    transform: 'translateY(2px)',
    boxShadow: tokensArcade.shadows.pixel,
  },
});

/** =========================
 * LOGIN PROMPT (Non-logged-in state)
 * ========================= */

const LoginPromptContainer = styled(Box)({
  padding: tokensArcade.spacing.xxl,
  background: tokensArcade.colors.pureWhite,
  border: tokensArcade.borders.thick,
  borderColor: tokensArcade.colors.electricPurple,
  borderRadius: tokensArcade.borderRadius.lg,
  boxShadow: tokensArcade.shadows.arcade,
  textAlign: 'center',
  width: '100%',
  maxWidth: '100%',
  boxSizing: 'border-box',
});

const LoginPromptIcon = styled('div')({
  fontSize: '3rem',
  marginBottom: tokensArcade.spacing.md,
});

const LoginPromptText = styled(Typography)({
  fontFamily: tokensArcade.fonts.body,
  fontSize: tokensArcade.fonts.base,
  color: tokensArcade.colors.deepBlack,
  marginBottom: tokensArcade.spacing.xl,
  lineHeight: 1.6,
});

/** =========================
 * MYPAGE COMPONENT
 * ========================= */

function Mypage() {
  const { user, session, platform, isLoggedIn } = useContext(AuthContext);
  const [userProfile, setUserProfile] = useState(null);
  const [bookmarkCount, setBookmarkCount] = useState(0);
  const [flipCount, setFlipCount] = useState(0);
  const [commentCount, setCommentCount] = useState(0);
  const router = useRouter();

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
      setCommentCount(18);
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

    const [bookmarks, flips, comments] = await Promise.all([
      getBookmarkCount(user.id),
      getFlipCount(user.id),
      getCommentCount(user.id),
    ]);
    setBookmarkCount(bookmarks);
    setFlipCount(flips);
    setCommentCount(comments);
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

      showToast("POWER OFF! 👋");
      router.push("/");
    } catch (e) {
      console.error(e);
      showErrorToast("로그아웃 실패");
    }
  };

  return (
    <Page>
      <Shell>
        {mockIsLoggedIn ? (
          userProfile && (
            <Stack>
              {/* PROFILE HEADER - Compact Horizontal */}
              <ProfileHeader>
                <AvatarFrame>
                  <StyledAvatar
                    src={userProfile.profile_image_url || defaultProfileImage}
                    alt="Profile"
                  />
                </AvatarFrame>
                <ProfileInfo>
                  <PlayerName>
                    {userProfile.nickname || userProfile.name || "PLAYER"}
                  </PlayerName>
                  <PlayerID>
                    ID: {userProfile.email
                      ? userProfile.email.replace(/(.{3}).*(@.*)/, "$1***$2")
                      : "UNKNOWN"}
                  </PlayerID>
                </ProfileInfo>
              </ProfileHeader>

              {/* ACHIEVEMENTS CARD */}
              <AchievementsCard>
                <AchievementsTitle>ACHIEVEMENTS</AchievementsTitle>

                <StatsGrid>
                  {/* Viewed Quizzes */}
                  <StatCard onClick={() => router.push("/my-history")}>
                    <StatIconBox>
                      <VisibilityIcon sx={{ fontSize: "1.8rem" }} />
                    </StatIconBox>
                    <ScoreCounter value={flipCount} color="cyan" duration={800} />
                    <StatLabel>봤던 퀴즈</StatLabel>
                  </StatCard>

                  {/* Bookmarks */}
                  <StatCard onClick={() => router.push("/my-bookmarks")}>
                    <StatIconBox>
                      <BookmarkIcon sx={{ fontSize: "1.8rem" }} />
                    </StatIconBox>
                    <ScoreCounter value={bookmarkCount} color="yellow" duration={800} />
                    <StatLabel>북마크</StatLabel>
                  </StatCard>

                  {/* Comments */}
                  <StatCard onClick={() => router.push("/my-comments")}>
                    <StatIconBox>
                      <ChatBubbleOutlineIcon sx={{ fontSize: "1.8rem" }} />
                    </StatIconBox>
                    <ScoreCounter value={commentCount} color="pink" duration={800} />
                    <StatLabel>댓글</StatLabel>
                  </StatCard>
                </StatsGrid>

                {/* QUICK LINKS */}
                <QuickLinksRow>
                  <QuickLinkButton
                    color={tokensArcade.colors.neonCyan}
                    onClick={() => router.push("/my-history")}
                  >
                    <VisibilityIcon sx={{ fontSize: "1rem", color: tokensArcade.colors.neonCyan }} />
                    <QuickLinkLabel>퀴즈 기록</QuickLinkLabel>
                  </QuickLinkButton>
                  <QuickLinkButton
                    color={tokensArcade.colors.arcadeYellow}
                    onClick={() => router.push("/my-bookmarks")}
                  >
                    <BookmarkIcon sx={{ fontSize: "1rem", color: tokensArcade.colors.arcadeYellow }} />
                    <QuickLinkLabel>저장 목록</QuickLinkLabel>
                  </QuickLinkButton>
                  <QuickLinkButton
                    color={tokensArcade.colors.neonPink}
                    onClick={() => router.push("/my-comments")}
                  >
                    <ChatBubbleOutlineIcon sx={{ fontSize: "1rem", color: tokensArcade.colors.neonPink }} />
                    <QuickLinkLabel>내 댓글</QuickLinkLabel>
                  </QuickLinkButton>
                </QuickLinksRow>
              </AchievementsCard>

              {/* POWER OFF (Logout) */}
              <PowerOffButton onClick={handleSignout}>
                <LogoutIcon sx={{ fontSize: "1rem" }} />
                POWER OFF
              </PowerOffButton>
            </Stack>
          )
        ) : (
          <LoginPromptContainer>
            <LoginPromptIcon>🔒</LoginPromptIcon>
            <LoginPromptText>
              나의 퀴즈 활동을 보려면 로그인이 필요해요!
            </LoginPromptText>
            <ArcadeButton
              variant="primary"
              size="large"
              fullWidth
              onClick={handleKakaoLogin}
            >
              카카오로 시작하기
            </ArcadeButton>
          </LoginPromptContainer>
        )}
      </Shell>
    </Page>
  );
}

export default Mypage;
