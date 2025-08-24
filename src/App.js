import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"; // HashRouter -> BrowserRouter
import "./App.css";

import Header from "./Header";
import Category from "./Category";
import Quiz from "./Quiz";
import SharedQuiz from "./SharedQuiz";
import Login from "./Login";
import Oauth_Naver_Callback from "./Oauth_Naver_Callback";
import Oauth_Kakao_Callback from "./Oauth_Kakao_Callback";
import Mypage from "./Mypage";
import Footer from "./Footer";

import { AuthProvider } from "./AuthContext";

function App() {
  const [selectedQuestions, setSelectedQuestions] = useState([]);

  const handleSelectedQuestions = (questions) => {
    setSelectedQuestions(questions);
  };

  return (
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
            </Routes>
          </div>
          <Footer id="footer" />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
