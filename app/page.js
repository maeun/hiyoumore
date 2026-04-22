'use client';

import { Suspense, useState } from 'react';
import Home from '@/src/Home';

export default function HomePage() {
  const [selectedQuestions, setSelectedQuestions] = useState([]);
  return (
    <Suspense fallback={null}>
      <Home
        selectedQuestions={selectedQuestions}
        handleSelectedQuestions={setSelectedQuestions}
      />
    </Suspense>
  );
}
