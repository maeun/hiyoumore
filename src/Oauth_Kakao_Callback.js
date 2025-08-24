import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import AuthContext from "./AuthContext";
import { toast, ToastContainer, Bounce } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ref, set, get } from "firebase/database";
import { log_in_out_db, sign_up_db } from "./firebaseConfig"; // Firebase config 파일에서 sign_up_db도 import

function Oauth_Kakao_Callback() {
  const { setIsLoggedIn, setToken, setPlatform } = useContext(AuthContext);
  const [code, setCode] = useState("");
  const [userInfo, setUserInfo] = useState(null);
  const [accessToken, setAccessToken] = useState("");
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
      saveLoginTime(userData.id, accessToken);

      console.log("11");
      console.log("22");

      // Toast를 navigate 호출 직전에 렌더링
      toast(<b>👋 로그인 되었습니다 👋</b>, {
        position: "top-center",
        autoClose: 900,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
        transition: Bounce,
      });

      // navigate 호출
      navigate("/");
    } catch (error) {
      console.error("Error fetching the user info:", error);
    }
  };

  const saveLoginTime = async (userId, accessToken) => {
    const loginTime = new Date();
    const utc9Time = new Date(loginTime.getTime() + 9 * 60 * 60 * 1000); // UTC+9 시간대 변환
    const formattedTime = utc9Time.toISOString().replace("Z", "+09:00"); // 시간 문자열을 UTC+09:00 형식으로 변환

    // 날짜 형식을 YYYY-MM-DD로 변환
    const date = utc9Time.toISOString().split("T")[0];

    try {
      // 해당 날짜의 로그인 횟수 조회
      const dateRef = ref(log_in_out_db, `login/${date}`);
      const snapshot = await get(dateRef);
      let loginCount = 0;

      if (snapshot.exists()) {
        loginCount = snapshot.size; // 해당 날짜의 기존 로그인 수
      }

      // 새로운 로그인 번호
      const newLoginNumber = loginCount + 1;

      // 새로운 로그인 정보 저장
      const newLoginRef = ref(log_in_out_db, `login/${date}/${newLoginNumber}`);
      await set(newLoginRef, {
        user_id: userId,
        login_time: formattedTime,
        accessToken: accessToken,
        login_platform: "KAKAO",
      });

      console.log("Login time saved successfully");
    } catch (error) {
      console.error("Error saving login time:", error);
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
    <div>
      <p>짜란~!</p>
      <p>Code: {code}</p>
      <p>Token: {accessToken}</p>
      {userInfo && (
        <div>
          <p>User Info:</p>
          <p>ID: {userInfo.id}</p>
          <p>CONNECTED_AT: {userInfo.connected_at}</p>
          <p>Nickname: {userInfo.kakao_account.profile.nickname}</p>
          <p>Email: {userInfo.kakao_account.email}</p>
          <p>NAME: {userInfo.kakao_account.name}</p>
          <p>PHONE_NUMBER: {userInfo.kakao_account.phone_number}</p>
          <p>
            PROFILE_IMAGE_URL:{" "}
            {userInfo.kakao_account.profile.profile_image_url}
          </p>
        </div>
      )}
    </div>
  );
}

export default Oauth_Kakao_Callback;
