import React, { useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { useLocation, useNavigate } from "react-router-dom";

import Category from "./Category";
import Quiz from "./Quiz";
import { showToast } from "./toastUtils";

function Home({ selectedQuestions, handleSelectedQuestions }) {
  const location = useLocation();
  const navigate = useNavigate();

  // ✅ 콜백에서 navigate("/", { state: { toast: "..." } })로 넘긴 메시지 받기
  const toastMsg = location.state?.toast;

  useEffect(() => {
    if (!toastMsg) return;

    // ✅ 토스트 표시
    showToast(toastMsg);

    // ✅ 뒤로가기/리렌더 시 토스트가 다시 뜨는 것 방지: state 제거
    navigate("/", { replace: true, state: {} });
  }, [toastMsg, navigate]);

  return (
    <div className="PageWrapper">
      <Helmet>
        <title>hiyoumore</title>
        <meta
          name="description"
          content="친구에게 재미있는 퀴즈를 공유해보세요! 다양한 카테고리의 퀴즈를 풀고 친구와 함께 즐기세요."
        />
      </Helmet>

      <Category handleSelectedQuestions={handleSelectedQuestions} />
      <Quiz selectedQuestions={selectedQuestions} />
    </div>
  );
}

export default Home;
