import "./Header.css";
import { useNavigate } from "react-router-dom"; // useNavigate 훅을 가져옵니다.

function Header() {
  const navigate = useNavigate(); // useNavigate 훅을 사용하여 navigate 함수를 호출합니다.

  const handleImageClick = () => {
    navigate("/"); // 홈 페이지로 이동합니다.
  };

  return (
    <div class="header">
      <div
        class="header_text"
        onClick={handleImageClick} // 이미지를 클릭했을 때 handleImageClick 함수 호출
        style={{ cursor: "pointer" }} // 클릭 가능한 커서 스타일
      >
        <img
          src={process.env.PUBLIC_URL + "/logo192.png"}
          alt="Logo"
          class="logo"
        />
        hiyoumore
      </div>
    </div>
  );
}

export default Header;
