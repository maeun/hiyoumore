import Providers from './providers';
import ArcadeHeader from '@/src/components/ArcadeHeader';
import TabBar from '@/src/components/TabBar';
import '@/src/fonts.css';
import '@/src/index.css';
import '@/src/App.css';

export const metadata = {
  title: {
    default: 'HIYOUMORE',
    template: '%s | HIYOUMORE',
  },
  description: '427개의 한국어 퀴즈를 풀고 친구와 공유해보세요!',
  metadataBase: new URL('https://hiyoumore.xyz'),
  openGraph: {
    siteName: 'HIYOUMORE',
    locale: 'ko_KR',
    type: 'website',
    images: [{ url: '/meta_img.png' }],
  },
  twitter: {
    card: 'summary_large_image',
    images: ['/meta_img.png'],
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="ko">
      <body>
        <Providers>
          <div className="Main">
            <ArcadeHeader />
            <div className="Content">{children}</div>
            <TabBar />
          </div>
        </Providers>
      </body>
    </html>
  );
}
