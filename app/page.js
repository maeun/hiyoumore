'use client';

import { useState } from 'react';
import Home from '@/src/Home';

export default function HomePage() {
  const [selectedQuestions, setSelectedQuestions] = useState([]);
  return (
    <Home
      selectedQuestions={selectedQuestions}
      handleSelectedQuestions={setSelectedQuestions}
    />
  );
}
