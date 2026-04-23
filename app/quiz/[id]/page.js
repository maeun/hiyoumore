import { cache } from 'react';
import { createClient } from '@supabase/supabase-js';
import SharedQuiz from '@/src/SharedQuiz';

const fetchQuiz = cache(async (id) => {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );
  const { data, error } = await supabase
    .from('quizzes')
    .select('question, answer, index')
    .eq('index', parseInt(id))
    .single();

  if (error || !data) return null;
  return data;
});

export async function generateMetadata({ params }) {
  const quiz = await fetchQuiz(params.id);
  if (!quiz) {
    return { title: '퀴즈를 찾을 수 없어요' };
  }
  const question = quiz.question?.replace(/<[^>]*>/g, '') ?? '';
  const preview = question.substring(0, 80);
  const ellipsis = question.length > 80 ? '...' : '';
  return {
    title: question.substring(0, 60) || 'FRIEND CHALLENGE',
    description: `"${preview}${ellipsis}" - 친구가 보낸 퀴즈를 맞춰보세요!`,
    openGraph: {
      title: '친구가 보낸 퀴즈 | HIYOUMORE',
      description: `"${preview}${ellipsis}" - 맞춰보세요!`,
      images: [{ url: '/meta_img.png' }],
      type: 'article',
    },
    twitter: {
      card: 'summary_large_image',
      title: '친구가 보낸 퀴즈 | HIYOUMORE',
      description: `"${preview}${ellipsis}" - 맞춰보세요!`,
    },
  };
}

export default async function QuizPage({ params }) {
  const quiz = await fetchQuiz(params.id);
  return <SharedQuiz quizData={quiz} quizId={params.id} />;
}
