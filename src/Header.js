import "./Header.css";
import { useNavigate, useLocation } from "react-router-dom";

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
          <div
            className="back_button"
            onClick={handleBackClick}
          >
            ← 뒤로
          </div>
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
