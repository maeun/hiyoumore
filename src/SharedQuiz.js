import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import "./SharedQuiz.css";
import Button from "@mui/joy/Button";
import ReactCardFlip from "react-card-flip";
import { Card } from "@mui/joy";
import { ref, get, query, orderByChild, equalTo } from "firebase/database"; // Firebase 관련 함수 추가 import
import { qa_db } from "./firebaseConfig"; // Firebase config import

function SharedQuiz() {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const num = searchParams.get("num");

  const [question, setQuestion] = useState({ que: "", ans: "" });
  const [isFlipped, setIsFlipped] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // handleShare 함수 정의
  const handleShare = (quiz_num) => {
    const share_url = window.location.href;
    const share_text = "😉 이런, 퀴즈가 도착했어요 - " + share_url;

    if (navigator.share) {
      navigator
        .share({
          title: "😉 이런, 퀴즈가 도착했어요",
          url: share_url,
        })
        .then(() => {
          console.log("URL 공유 성공");
        })
        .catch((error) => {
          console.error("URL 공유 실패", error);
        });
    } else {
      const dummyInput = document.createElement("input");
      dummyInput.setAttribute("value", share_text);
      document.body.appendChild(dummyInput);
      dummyInput.select();
      document.execCommand("copy");
      document.body.removeChild(dummyInput);
      alert("퀴즈 URL이 복사되었습니다!");
    }
  };

  const handleFlipCard = () => {
    setIsFlipped(!isFlipped);
  };

  useEffect(() => {
    if (!num) {
      setError("퀴즈 번호가 없습니다.");
      setLoading(false);
      return;
    }

    const fetchQuestionAndAnswer = async () => {
      const QuestionsRef = query(
        ref(qa_db),
        orderByChild("index"),
        equalTo(parseInt(num))
      );
      try {
        const snapshot = await get(QuestionsRef);
        if (snapshot.exists()) {
          snapshot.forEach((childSnapshot) => {
            const questionData = childSnapshot.val();
            setQuestion({ que: questionData.que, ans: questionData.ans });
          });
          setLoading(false);
        } else {
          console.log("No data available");
          setError("퀴즈를 찾을 수 없습니다.");
          setLoading(false);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        setError("데이터를 불러오는 중 오류가 발생했습니다.");
        setLoading(false);
      }
    };

    fetchQuestionAndAnswer();
  }, [num]);

  if (loading) {
    return <div>로딩 중...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="SharedQuiz_Frame">
      <p className="text">
        ☺️친구에게 받은 퀴즈예요☺️
        <br />한 번 맞춰볼까요?
      </p>

      <ReactCardFlip isFlipped={isFlipped} flipDirection="vertical">
        <Card
          sx={{
            height: "180px",
            backgroundColor: "#f2f4fb",
            borderRadius: "8px",
            marginBottom: "30px",
            justifyContent: "center",
            alignItems: "center",
            boxShadow: "0 4px 10px rgba(0, 0, 0, 0.3)",
            transform: "perspective(600px) rotateY(0)",
            transition: "0.6s",
            backfaceVisibility: "hidden",
          }}
          className="Card_Front"
          onClick={handleFlipCard}
        >
          <div className="Card_Back_Ans">
            <p dangerouslySetInnerHTML={{ __html: question.que }} />
          </div>
        </Card>
        <Card
          sx={{
            height: "180px",
            backgroundColor: "#dae1ee",
            borderRadius: "8px",
            marginBottom: "30px",
            justifyContent: "center",
            alignItems: "center",
            boxShadow: "0 4px 10px rgba(0, 0, 0, 0.3)",
            transform: "perspective(600px) rotateY(0)",
            transition: "0.6s",
            backfaceVisibility: "hidden",
          }}
          className="Card_Back"
          onClick={handleFlipCard}
        >
          <div className="Card_Back_Ans">
            <p dangerouslySetInnerHTML={{ __html: question.ans }} />
          </div>
        </Card>
      </ReactCardFlip>
      <Button
        size="lg"
        className="btn"
        color="info"
        onClick={() => handleShare(num)} // 여기서 handleShare 함수 사용
        variant="solid"
      >
        😎 친구에게 공유하기
      </Button>
      <a href="https://maeun.github.io/hiyoumore/">
        <Button
          style={{ width: "100%" }}
          size="lg"
          className="btn"
          color="info"
          variant="solid"
        >
          📝 다른 퀴즈 풀어보기
        </Button>
      </a>
    </div>
  );
}

export default SharedQuiz;
