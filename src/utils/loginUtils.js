import { supabase } from '../supabaseConfig';
import { showErrorToast } from '../toastUtils';

/**
 * Direct Kakao OAuth Login
 *
 * Initiates Kakao login without navigating to /login route
 * Redirects to Kakao OAuth, then back to /auth/callback
 *
 * Usage:
 * import { handleKakaoLogin } from './utils/loginUtils';
 * <button onClick={handleKakaoLogin}>Login</button>
 */
export const handleKakaoLogin = async () => {
  const { error } = await supabase.auth.signInWithOAuth({
    provider: 'kakao',
    options: {
      redirectTo: `${window.location.origin}/auth/callback`
    }
  });

  if (error) {
    showErrorToast('로그인 실패');
    console.error('Login error:', error);
  }
};
