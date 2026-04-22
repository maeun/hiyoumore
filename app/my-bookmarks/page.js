import MyBookmarks from '@/src/MyBookmarks';

export const metadata = {
  title: '저장 목록',
  robots: { index: false },
};

export default function MyBookmarksPage() {
  return <MyBookmarks />;
}
