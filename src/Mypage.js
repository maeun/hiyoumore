import something_going_wrong from "./something_going_wrong.png";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { TextField, Avatar, Box, Typography, Button } from "@mui/material";
import { useContext, useEffect, useState } from "react";
import AuthContext from "./AuthContext";
import { ToastContainer } from "react-toastify";
import { showToast, showErrorToast } from "./toastUtils";

function Mypage() {
  const { isLoggedIn, setIsLoggedIn, token, refreshToken, platform } =
    useContext(AuthContext);
  const [userInfo, setUserInfo] = useState(null);
  const navigate = useNavigate();
  console.log(platform);
  console.log(token);
  console.log(refreshToken);

  const profileImages = [
    process.env.PUBLIC_URL + "/profile_yellow.png",
    process.env.PUBLIC_URL + "/profile_blue.png",
    process.env.PUBLIC_URL + "/profile_black.png", // 새로운 이미지 추가
    process.env.PUBLIC_URL + "/profile_orange.png", // 새로운 이미지 추가
  ];

  const defaultProfileImage =
    profileImages[Math.floor(Math.random() * profileImages.length)];

  useEffect(() => {
    if (isLoggedIn && token) {
      if (platform === "kakao") {
        fetchKakaoUserInfo();
      } else if (platform === "naver") {
        fetchNaverUserInfo();
      }
    }
  }, [isLoggedIn, token, platform]);

  const fetchKakaoUserInfo = async () => {
    try {
      const response = await axios.get("https://kapi.kakao.com/v2/user/me", {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/x-www-form-urlencoded",
        },
      });

      setUserInfo(response.data);
    } catch (error) {
      console.error("Error fetching the Kakao user info:", error);
    }
  };

  const fetchNaverUserInfo = async () => {
    console.log(token);
    try {
      console.log("netlify function try start");
      const response = await fetch(
        `/.netlify/functions/naverGetUserInfo?token=${token}`,
        {
          method: "GET",
          headers: {
            Accept: "application/json",
          },
        }
      );
      console.log("netlify function try end");

      const data = await response.json();

      if (data.response) {
        console.log(data.response);
        setUserInfo(data.response);
      } else {
        console.log("no data response");
      }
    } catch (error) {
      console.error("Error fetching the Naver user info:", error);
    }
  };

  const fetchNaverSignOut = async () => {
    try {
      const response = await fetch(
        `/.netlify/functions/naverSignOut?token=${token}&refresh_token=${refreshToken}`,
        {
          method: "GET",
          headers: {
            Accept: "application/json",
          },
        }
      );

      const data = await response.json();
      console.log(data.result);
      console.log(data.error);
      console.log(response);

      if (data.message) {
      } else {
        console.log("no data response");
      }
    } catch (error) {
      console.error("Error fetching the Naver user info:", error);
    }
  };

  const handleSignout = async () => {
    try {
      if (platform === "kakao") {
        const response = await axios.post(
          "https://kapi.kakao.com/v1/user/unlink",
          {}, // 빈 객체를 데이터로 전달
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/x-www-form-urlencoded",
            },
          }
        );

        console.log("Signout success", response.data);
        setIsLoggedIn(false);
        showToast("🤧 탈퇴되었습니다 🤧");
      } else if (platform === "naver") {
        fetchNaverSignOut();
        setIsLoggedIn(false);
        showToast("🤧 탈퇴되었습니다 🤧");
      }
    } catch (error) {
      console.error("Signout failed:", error);
      showErrorToast("Signout failed. Please try again.");
    }
    // navigate("/");
  };

  return (
    <div>
      <Helmet>
        <meta name="robots" content="noindex" />
      </Helmet>
      <ToastContainer />
      {isLoggedIn ? (
        <div>
          {userInfo && (
            <div>
              <Box
                sx={{
                  width: "100%",
                  maxWidth: "400px", // 동일한 최대 너비
                  margin: "0 auto", // 가운데 정렬
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
                    src={
                      platform === "kakao"
                        ? userInfo.kakao_account.profile.profile_image_url ||
                          defaultProfileImage
                        : platform === "naver"
                        ? userInfo.profile_image || defaultProfileImage
                        : defaultProfileImage
                    }
                    alt="Profile"
                    sx={{ width: 80, height: 80, marginBottom: "16px" }}
                  />
                  <Typography
                    variant="h6"
                    component="p"
                    sx={{ marginBottom: "8px" }}
                  >
                    {platform === "kakao"
                      ? userInfo.kakao_account.profile.nickname
                      : platform === "naver"
                      ? userInfo.nickname
                      : userInfo.nickname}
                    님 환영합니다
                  </Typography>
                  <Typography
                    variant="body1"
                    sx={{ marginBottom: "16px", color: "#555" }}
                  >
                    {platform === "kakao"
                      ? userInfo.kakao_account.email
                      : platform === "naver"
                      ? userInfo.email
                      : userInfo.email}
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
                  🥺 탈퇴하기
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
