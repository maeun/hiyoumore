import MyComments from '@/src/MyComments';

export const metadata = {
  title: '내 댓글',
  robots: { index: false },
};

export default function MyCommentsPage() {
  return <MyComments />;
}
