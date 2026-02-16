import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from './supabaseConfig';
import { showErrorToast } from './toastUtils';
import CircularProgress from '@mui/material/CircularProgress';

function AuthCallback() {
  const navigate = useNavigate();

  useEffect(() => {
    // Supabase automatically exchanges code for session
    supabase.auth.getSession().then(({ data: { session }, error }) => {
      if (error) {
        showErrorToast('로그인 실패');
        console.error('Auth callback error:', error);
        navigate('/login');
      } else if (session) {
        // Navigate with state to trigger toast on homepage
        navigate('/', { state: { loginSuccess: true } });
      } else {
        showErrorToast('세션을 찾을 수 없습니다');
        navigate('/login');
      }
    });
  }, [navigate]);

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <CircularProgress sx={{ color: '#594b73' }} />
    </div>
  );
}

export default AuthCallback;
