import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Arcade components
import ArcadeHeader from "./components/ArcadeHeader";
import TabBar from "./components/TabBar";

// Page components
import Home from "./Home";
import SharedQuiz from "./SharedQuiz";
import Login from "./Login";
import AuthCallback from "./AuthCallback";
import Mypage from "./Mypage";
import MyBookmarks from "./MyBookmarks";
import MyHistory from "./MyHistory";
import MyComments from "./MyComments";
import Info from "./Info";
import Terms from "./Terms";
import Privacy from "./Privacy";
import NotFound from "./NotFound";

import { AuthProvider } from "./AuthContext";

function AppContent({ selectedQuestions, handleSelectedQuestions }) {
  return (
    <>
      <div className="Main">
        <ArcadeHeader />
        <div className="Content">
          <Routes>
            <Route
              path="/"
              element={
                <Home
                  selectedQuestions={selectedQuestions}
                  handleSelectedQuestions={handleSelectedQuestions}
                />
              }
            />
            <Route path="/shared-quiz" element={<SharedQuiz />} />
            <Route
              path="/login"
              element={
                <div className="PageWrapper">
                  <Login />
                </div>
              }
            />
            <Route path="/auth/callback" element={<AuthCallback />} />
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
              path="/info"
              element={
                <div className="PageWrapper">
                  <Info />
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
            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>
        <TabBar />
      </div>

      {/* ✅ ToastContainer는 앱 전체에서 1번만, 항상 렌더되게 */}
      <ToastContainer
        autoClose={2000}
        newestOnTop
        closeOnClick
        pauseOnFocusLoss={false}
        pauseOnHover
        draggable
        theme="dark"
      />
    </>
  );
}

function App() {
  const [selectedQuestions, setSelectedQuestions] = useState([]);

  const handleSelectedQuestions = (questions) => {
    setSelectedQuestions(questions);
  };

  return (
    <AuthProvider>
      <Router basename="/">
        <AppContent
          selectedQuestions={selectedQuestions}
          handleSelectedQuestions={handleSelectedQuestions}
        />
      </Router>
    </AuthProvider>
  );
}

export default App;
