import HomeClient from './home-client';

export const metadata = {
  title: 'HIYOUMORE — 오늘의 퀴즈',
  description: '427개의 한국어 퀴즈를 풀고 친구와 공유해보세요! 동물, 상식, 음식, 역사 등 다양한 카테고리.',
  openGraph: {
    title: 'HIYOUMORE — 오늘의 퀴즈',
    description: '427개의 한국어 퀴즈를 풀고 친구와 공유해보세요!',
    type: 'website',
  },
};

export default function HomePage() {
  return <HomeClient />;
}
