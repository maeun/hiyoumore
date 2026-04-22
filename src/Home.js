'use client';

import React, { useEffect } from "react";
import { useRouter, useSearchParams } from 'next/navigation';

import Category from "./Category";
import Quiz from "./Quiz";
import { showToast } from "./toastUtils";

function Home({ selectedQuestions, handleSelectedQuestions }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const loginSuccess = searchParams.get('loginSuccess');

  useEffect(() => {
    if (!loginSuccess) return;
    showToast('👋 로그인 되었습니다 👋');
    router.replace('/');
  }, [loginSuccess, router]);

  return (
    <div className="PageWrapper">
      <Category handleSelectedQuestions={handleSelectedQuestions} />
      <Quiz selectedQuestions={selectedQuestions} />
    </div>
  );
}

export default Home;
