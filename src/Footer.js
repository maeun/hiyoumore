import "./Footer.css";
import { Link } from "react-router-dom";
import Typography from "@mui/joy/Typography";
import { useContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

import AuthContext from "./AuthContext";
import { toast, ToastContainer, Bounce } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ref, set, get } from "firebase/database";
import { log_in_out_db } from "./firebaseConfig"; // Firebase config 파일에서 login_db import

function Footer() {
  const { isLoggedIn, setIsLoggedIn, token, platform } =
    useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = async () => {
    if (platform === "kakao") {
      try {
        const response = await axios.post(
          "https://kapi.kakao.com/v1/user/logout",
          {}, // 빈 객체를 데이터로 전달
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/x-www-form-urlencoded",
            },
          }
        );

        console.log("Logout success", response.data);

        // 로그아웃 시간 저장
        saveLogoutTime(response.data.id);

        // 로그인 상태 업데이트
        setIsLoggedIn(false);
        navigate("/");

        toast(<b>🖐 로그아웃 되었습니다 🖐</b>, {
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
      } catch (error) {
        console.error("Logout failed:", error);
        toast.error("Logout failed. Please try again.");
      }
    } else if (platform === "naver") {
      // 네이버 로그아웃 처리
      console.log("Naver logout");

      // 네이버에서 로그아웃 처리: 기본적으로 access_token을 제거하는 방식
      localStorage.removeItem("naverToken"); // 네이버 토큰 삭제
      setIsLoggedIn(false); // 로그인 상태 변경

      // 로그아웃 시간 저장 (naver 로그아웃도 기록)
      saveLogoutTime("naverUser"); // 사용자 ID는 예시로 'naverUser'로 설정, 실제 사용자 ID가 있다면 사용하세요.

      toast(<b>🖐 네이버 로그아웃 되었습니다 🖐</b>, {
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

      navigate("/"); // 로그아웃 후 홈으로 이동
    }
  };

  const saveLogoutTime = async (userId) => {
    const logoutRef = ref(log_in_out_db, "logout/");
    const logoutTime = new Date();
    const utc9Time = new Date(logoutTime.getTime() + 9 * 60 * 60 * 1000); // UTC+9 시간대 변환
    const formattedTime = utc9Time.toISOString().replace("Z", "+09:00"); // 시간 문자열을 UTC+09:00 형식으로 변환

    // 날짜 형식을 YYYY-MM-DD로 변환
    const date = utc9Time.toISOString().split("T")[0];

    try {
      const loginPlatformSnapshot = await get(
        ref(log_in_out_db, `login/${date}`)
      );
      let platform = "UNKNOWN";

      if (loginPlatformSnapshot.exists()) {
        loginPlatformSnapshot.forEach((childSnapshot) => {
          if (childSnapshot.val().user_id === userId) {
            platform = childSnapshot.val().login_platform;
          }
        });
      }

      // 해당 날짜의 로그아웃 횟수 조회
      const dateRef = ref(log_in_out_db, `logout/${date}`);
      const snapshot = await get(dateRef);
      let logoutCount = 0;

      if (snapshot.exists()) {
        logoutCount = snapshot.size; // 해당 날짜의 기존 로그아웃 수
      }

      // 새로운 로그아웃 번호
      const newLogoutNumber = logoutCount + 1;

      // 새로운 로그아웃 정보 저장
      const newLogoutRef = ref(
        log_in_out_db,
        `logout/${date}/${newLogoutNumber}`
      );
      await set(newLogoutRef, {
        logout_platform: platform,
        user_id: userId,
        logout_time: formattedTime,
        accessToken: token,
      });

      console.log("Logout time saved successfully");
    } catch (error) {
      console.error("Error saving logout time:", error);
    }
  };

  return (
    <div className="Footer">
      <ToastContainer />
      <div className="Panel">
        {isLoggedIn ? (
          <>
            <Typography level="body1">
              <Link to="#" onClick={handleLogout}>
                Logout
              </Link>
            </Typography>
            <Typography level="body1">
              <Link to="/mypage">My Page</Link>
            </Typography>
            <Typography level="body1">
              <a href="https://open.kakao.com/o/sPjylDmf">Contact</a>
            </Typography>
          </>
        ) : (
          <>
            <Typography level="body1">
              <Link to="/login">Login</Link>
            </Typography>
            <Typography level="body1">
              <a href="https://open.kakao.com/o/sPjylDmf">Contact</a>
            </Typography>
          </>
        )}
      </div>
      <Typography level="body1">ⓒ {new Date().getFullYear()} hiyoumore</Typography>
    </div>
  );
}

export default Footer;
