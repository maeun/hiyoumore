import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"; // HashRouter -> BrowserRouter
import { HelmetProvider, Helmet } from "react-helmet-async";
import "./App.css";

import Header from "./Header";
import Category from "./Category";
import Quiz from "./Quiz";
import SharedQuiz from "./SharedQuiz";
import Login from "./Login";
import Oauth_Naver_Callback from "./Oauth_Naver_Callback";
import Oauth_Kakao_Callback from "./Oauth_Kakao_Callback";
import Mypage from "./Mypage";
import Terms from "./Terms";
import Privacy from "./Privacy";
import Footer from "./Footer";

import { AuthProvider } from "./AuthContext";

function App() {
  const [selectedQuestions, setSelectedQuestions] = useState([]);

  const handleSelectedQuestions = (questions) => {
    setSelectedQuestions(questions);
  };

  return (
    <HelmetProvider>
    <AuthProvider>
      <Router basename="/">
        <div className="Main">
          <Header />
          <div className="Content">
            <Routes>
              <Route
                path="/"
                element={
                  <div className="PageWrapper">
                    <Helmet>
                      <title>hiyoumore</title>
                      <meta name="description" content="친구에게 재미있는 퀴즈를 공유해보세요! 다양한 카테고리의 퀴즈를 풀고 친구와 함께 즐기세요." />
                    </Helmet>
                    <Category
                      handleSelectedQuestions={handleSelectedQuestions}
                    />
                    <Quiz selectedQuestions={selectedQuestions} />
                  </div>
                }
              />
              <Route
                path="/shared-quiz"
                element={
                  <div className="PageWrapper">
                    <SharedQuiz />
                  </div>
                }
              />
              <Route
                path="/login"
                element={
                  <div className="PageWrapper">
                    <Login />
                  </div>
                }
              />
              <Route
                path="/oauth/naver/callback"
                element={
                  <div>
                    <Oauth_Naver_Callback />
                  </div>
                }
              />
              <Route
                path="/oauth/kakao/callback"
                element={
                  <div>
                    <Oauth_Kakao_Callback />
                  </div>
                }
              />
              <Route
                path="/mypage"
                element={
                  <div>
                    <Mypage />
                  </div>
                }
              />
              <Route
                path="/terms"
                element={
                  <div className="PageWrapper">
                    <Terms />
                  </div>
                }
              />
              <Route
                path="/privacy"
                element={
                  <div className="PageWrapper">
                    <Privacy />
                  </div>
                }
              />
            </Routes>
          </div>
          <Footer id="footer" />
        </div>
      </Router>
    </AuthProvider>
    </HelmetProvider>
  );
}

export default App;
