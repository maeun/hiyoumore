import "./Footer.css";
import { Link } from "react-router-dom";
import Typography from "@mui/joy/Typography";
import { useContext } from "react";
import { useNavigate } from "react-router-dom";

import AuthContext from "./AuthContext";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { showToast, showErrorToast } from "./toastUtils";
import { saveLogoutTime } from "./authUtils";
import { supabase } from './supabaseConfig';

function Footer() {
  const { isLoggedIn, user, session, platform } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = async () => {
    // Save logout time before signing out
    if (user && session) {
      await saveLogoutTime(user.id, session.access_token, platform);
    }

    const { error } = await supabase.auth.signOut();

    if (error) {
      showErrorToast('로그아웃 실패');
      console.error('Logout error:', error);
    } else {
      showToast('🖐 로그아웃 되었습니다 🖐');
      navigate('/');
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
