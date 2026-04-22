'use client';

import React from "react";

import Category from "./Category";
import Quiz from "./Quiz";

function Home({ selectedQuestions, handleSelectedQuestions }) {
  return (
    <div className="PageWrapper">
      <Category handleSelectedQuestions={handleSelectedQuestions} />
      <Quiz selectedQuestions={selectedQuestions} />
    </div>
  );
}

export default Home;
