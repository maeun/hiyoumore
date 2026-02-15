import "./Header.css";
import { useNavigate, useLocation } from "react-router-dom";

function Header() {
  const navigate = useNavigate();
  const location = useLocation();

  // Hide header on these pages (they have their own page-specific headers)
  const hideHeaderPages = ['/my-history', '/my-bookmarks', '/my-comments'];
  if (hideHeaderPages.includes(location.pathname)) {
    return null;
  }

  const handleImageClick = () => {
    navigate("/");
  };

  return (
    <div className="header">
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
  );
}

export default Header;
