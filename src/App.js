import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"; // HashRouter -> BrowserRouter
import { HelmetProvider, Helmet } from "react-helmet-async";
import "./App.css";

import Header from "./Header";
import Category from "./Category";
import Quiz from "./Quiz";
import SharedQuiz from "./SharedQuiz";
import Login from "./Login";
import AuthCallback from "./AuthCallback";
import Mypage from "./Mypage";
import MyBookmarks from "./MyBookmarks";
import MyHistory from "./MyHistory";
import MyComments from "./MyComments";
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
                element={<SharedQuiz />}
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
                path="/auth/callback"
                element={
                  <div>
                    <AuthCallback />
                  </div>
                }
              />
              <Route
                path="/mypage"
                element={
                  <div className="PageWrapper">
                    <Mypage />
                  </div>
                }
              />
              <Route
                path="/my-bookmarks"
                element={
                  <div className="PageWrapper">
                    <MyBookmarks />
                  </div>
                }
              />
              <Route
                path="/my-history"
                element={
                  <div className="PageWrapper">
                    <MyHistory />
                  </div>
                }
              />
              <Route
                path="/my-comments"
                element={
                  <div className="PageWrapper">
                    <MyComments />
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
