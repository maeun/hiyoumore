import "./Header.css";
import { useNavigate, useLocation } from "react-router-dom";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import IconButton from '@mui/material/IconButton';

function Header() {
  const navigate = useNavigate();
  const location = useLocation();

  // Pages that should show back button instead of logo
  const backButtonPages = ['/my-history', '/my-bookmarks', '/my-comments'];
  const showBackButton = backButtonPages.includes(location.pathname);

  const handleImageClick = () => {
    navigate("/"); // 홈 페이지로 이동합니다.
  };

  const handleBackClick = () => {
    navigate(-1); // 이전 페이지로 이동합니다.
  };

  return (
    <div className="header">
      {showBackButton ? (
        <div className="header_with_back">
          <IconButton
            onClick={handleBackClick}
            sx={{
              color: 'white',
              marginRight: '8px',
              '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.1)' }
            }}
            aria-label="뒤로가기"
          >
            <ArrowBackIcon />
          </IconButton>
          <div
            className="header_text"
            onClick={handleImageClick}
            style={{ cursor: "pointer" }}
          >
            <img
              src={process.env.PUBLIC_URL + "/logo192.png"}
              alt="Logo"
              className="logo"
            />
            hiyoumore
          </div>
        </div>
      ) : (
        <div
          className="header_text"
          onClick={handleImageClick}
          style={{ cursor: "pointer" }}
        >
          <img
            src={process.env.PUBLIC_URL + "/logo192.png"}
            alt="Logo"
            className="logo"
          />
          hiyoumore
        </div>
      )}
    </div>
  );
}

export default Header;
