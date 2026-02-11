import React, { useEffect, useState, useContext } from "react";
import { Helmet } from "react-helmet-async";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import AuthContext from "./AuthContext";
import "react-toastify/dist/ReactToastify.css";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { ref, set } from "firebase/database";
import { sign_up_db } from "./firebaseConfig";
import { showToast } from "./toastUtils";
import { saveLoginTime } from "./authUtils";

function Oauth_Kakao_Callback() {
  const { setIsLoggedIn, setToken, setPlatform } = useContext(AuthContext);
  const [, setCode] = useState("");
  const [, setUserInfo] = useState(null);
  const [, setAccessToken] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    let isMounted = true;
    const urlCode = new URL(window.location.href).searchParams.get("code");
    setCode(urlCode);

    if (urlCode && isMounted) {
      fetchToken(urlCode);
    }

    return () => {
      isMounted = false;
    };
  }, []);

  const fetchToken = async (code) => {
    const grantType = "authorization_code";
    const clientId = "05d00f0fda1f9c72cd19cc6f219cd58a"; // 카카오 개발자 콘솔에서 발급받은 REST API 키
    const redirectUri = "https://hiyoumore.netlify.app/oauth/kakao/callback"; // 설정한 Redirect URI

    try {
      const response = await axios.post(
        "https://kauth.kakao.com/oauth/token",
        new URLSearchParams({
          grant_type: grantType,
          client_id: clientId,
          redirect_uri: redirectUri,
          code: code,
        }),
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
        }
      );

      const accessToken = response.data.access_token;
      setToken(accessToken);
      setAccessToken(accessToken);

      // Access token을 사용하여 사용자 정보 요청
      fetchUserInfo(accessToken);
    } catch (error) {
      console.error("Error fetching the access token:", error);
    }
  };

  const fetchUserInfo = async (accessToken) => {
    try {
      const response = await axios.get("https://kapi.kakao.com/v2/user/me", {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/x-www-form-urlencoded",
        },
      });

      const userData = response.data;
      setUserInfo(userData);
      setIsLoggedIn(true);
      setPlatform("kakao");
      saveLoginTime(userData.id, accessToken, "KAKAO");
      saveUserInfo(userData);

      showToast("👋 로그인 되었습니다 👋");

      // navigate 호출
      navigate("/");
    } catch (error) {
      console.error("Error fetching the user info:", error);
    }
  };

  const saveUserInfo = async (userData) => {
    const userRef = ref(sign_up_db, `kakao_oauth/${userData.id}`);
    try {
      const userInfo = {
        id: userData.id,
        oauth_platform: "Kakao",
        nickname: userData.kakao_account.profile.nickname,
        email: userData.kakao_account.email || "N/A", // 기본값 설정
        name: userData.kakao_account.name || "N/A",
        phone_number: userData.kakao_account.phone_number || "N/A",
        profile_image_url:
          userData.kakao_account.profile.profile_image_url || "",
        connected_at: userData.connected_at,
      };

      await set(userRef, userInfo);
      console.log("User information saved successfully");
    } catch (error) {
      console.error("Error saving user information:", error);
    }
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "50vh", gap: "16px" }}>
      <Helmet>
        <meta name="robots" content="noindex" />
      </Helmet>
      <CircularProgress sx={{ color: "#594b73" }} />
      <Typography sx={{ fontFamily: '"Noto Sans KR", sans-serif' }}>
        로그인 처리 중...
      </Typography>
    </Box>
  );
}

export default Oauth_Kakao_Callback;
