'use client';

import { useState } from 'react';
import createCache from '@emotion/cache';
import { CacheProvider } from '@emotion/react';
import { AuthProvider } from '@/src/AuthContext';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function createEmotionCache() {
  return createCache({ key: 'css', prepend: true });
}

export default function Providers({ children }) {
  const [emotionCache] = useState(() => createEmotionCache());

  return (
    <CacheProvider value={emotionCache}>
      <AuthProvider>
        {children}
        <ToastContainer
          autoClose={2000}
          newestOnTop
          closeOnClick
          pauseOnFocusLoss={false}
          pauseOnHover
          draggable
          theme="dark"
        />
      </AuthProvider>
    </CacheProvider>
  );
}
