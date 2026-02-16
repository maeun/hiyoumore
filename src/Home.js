import React, { useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { useLocation, useNavigate } from "react-router-dom";
import Category from "./Category";
import Quiz from "./Quiz";
import { showToast } from "./toastUtils";

function Home({ selectedQuestions, handleSelectedQuestions }) {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const msg = location.state?.toast;
    if (msg) {
      showToast(msg);

      // state 제거 (뒤로가기 시 다시 안 뜨게)
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location, navigate]);

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
