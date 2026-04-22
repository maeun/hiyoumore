'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from './supabaseConfig';
import { showErrorToast } from './toastUtils';
import CircularProgress from '@mui/material/CircularProgress';

function AuthCallback() {
  const router = useRouter();

  useEffect(() => {
    // Supabase automatically exchanges code for session
    supabase.auth.getSession().then(({ data: { session }, error }) => {
      if (error) {
        showErrorToast('로그인 실패');
        console.error('Auth callback error:', error);
        router.push('/login');
      } else if (session) {
        // Navigate with query parameter to trigger toast on homepage
        router.push('/?loginSuccess=true');
      } else {
        showErrorToast('세션을 찾을 수 없습니다');
        router.push('/login');
      }
    });
  }, [router]);

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <CircularProgress sx={{ color: '#594b73' }} />
    </div>
  );
}

export default AuthCallback;
