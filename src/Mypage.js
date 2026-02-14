import something_going_wrong from "./something_going_wrong.png";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { Avatar, Box, Typography, Button } from "@mui/material";
import { useContext, useEffect, useState } from "react";
import AuthContext from "./AuthContext";
import { ToastContainer } from "react-toastify";
import { showToast, showErrorToast } from "./toastUtils";
import { supabase } from './supabaseConfig';
import { saveLogoutTime } from './authUtils';

function Mypage() {
  const { user, session, platform, isLoggedIn } = useContext(AuthContext);
  const [userProfile, setUserProfile] = useState(null);
  const navigate = useNavigate();

  const profileImages = [
    process.env.PUBLIC_URL + "/profile_yellow.png",
    process.env.PUBLIC_URL + "/profile_blue.png",
    process.env.PUBLIC_URL + "/profile_black.png", // 새로운 이미지 추가
    process.env.PUBLIC_URL + "/profile_orange.png", // 새로운 이미지 추가
  ];

  const defaultProfileImage =
    profileImages[Math.floor(Math.random() * profileImages.length)];

  useEffect(() => {
    if (user) {
      fetchUserProfile();
    }
  }, [user]);

  const fetchUserProfile = async () => {
    const { data, error } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    if (error) {
      console.error('Error fetching profile:', error);
      // Fallback to user metadata from auth.users
      setUserProfile({
        nickname: user.user_metadata?.name || user.email,
        email: user.email,
        profile_image_url: user.user_metadata?.avatar_url
      });
    } else {
      setUserProfile(data);
    }
  };

  const handleSignout = async () => {
    // Save logout time before signing out
    await saveLogoutTime(user.id, session.access_token, platform);

    const { error } = await supabase.auth.signOut();

    if (error) {
      showErrorToast('로그아웃 실패');
      console.error('Signout error:', error);
    } else {
      showToast('🤧 로그아웃되었습니다 🤧');
      navigate('/');
    }
  };

  return (
    <div>
      <Helmet>
        <meta name="robots" content="noindex" />
      </Helmet>
      <ToastContainer />
      {isLoggedIn ? (
        <div>
          {userProfile && (
            <div>
              <Box
                sx={{
                  width: "100%",
                  maxWidth: "400px",
                  margin: "0 auto",
                  padding: "16px",
                  backgroundColor: "#f9f9f9",
                  borderRadius: "8px",
                  boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    width: "100%",
                  }}
                >
                  <Avatar
                    src={userProfile.profile_image_url || defaultProfileImage}
                    alt="Profile"
                    sx={{ width: 80, height: 80, marginBottom: "16px" }}
                  />
                  <Typography
                    variant="h6"
                    component="p"
                    sx={{ marginBottom: "8px" }}
                  >
                    {userProfile.nickname || userProfile.name}님 환영합니다
                  </Typography>
                  <Typography
                    variant="body1"
                    sx={{ marginBottom: "16px", color: "#555" }}
                  >
                    {userProfile.email}
                  </Typography>
                  {/* Solana Wallet - Currently hidden */}
                  {/*
                  <TextField
                    id="standard-read-only-input"
                    label="Solana Wallet Address"
                    defaultValue="Hello World"
                    InputProps={{
                      readOnly: true,
                    }}
                    variant="standard"
                    fullWidth
                  />
                  */}
                </Box>
                <Button
                  component="section"
                  sx={{
                    width: "100%",
                    border: "2px dashed grey",
                    marginTop: "16px",
                    padding: "8px",
                    boxSizing: "border-box",
                  }}
                  onClick={handleSignout}
                >
                  🤧 로그아웃
                </Button>
              </Box>
            </div>
          )}
        </div>
      ) : (
        <div>
          <img src={something_going_wrong} alt="Something went wrong" />
        </div>
      )}
    </div>
  );
}

export default Mypage;
