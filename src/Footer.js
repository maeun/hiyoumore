import "./Footer.css";
import { Link } from "react-router-dom";
import Typography from "@mui/joy/Typography";
import { useContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

import AuthContext from "./AuthContext";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { showToast, showErrorToast } from "./toastUtils";
import { saveLogoutTime } from "./authUtils";

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

        saveLogoutTime(response.data.id, token);

        setIsLoggedIn(false);
        navigate("/");

        showToast("🖐 로그아웃 되었습니다 🖐");
      } catch (error) {
        console.error("Logout failed:", error);
        showErrorToast("Logout failed. Please try again.");
      }
    } else if (platform === "naver") {
      // 네이버 로그아웃 처리
      console.log("Naver logout");

      // 네이버에서 로그아웃 처리: 기본적으로 access_token을 제거하는 방식
      localStorage.removeItem("naverToken"); // 네이버 토큰 삭제
      setIsLoggedIn(false); // 로그인 상태 변경

      saveLogoutTime("naverUser", token);

      showToast("🖐 네이버 로그아웃 되었습니다 🖐");

      navigate("/"); // 로그아웃 후 홈으로 이동
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
              <Link to="/terms">Terms</Link>
            </Typography>
            <Typography level="body1">
              <Link to="/privacy">Privacy</Link>
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
              <Link to="/terms">Terms</Link>
            </Typography>
            <Typography level="body1">
              <Link to="/privacy">Privacy</Link>
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
