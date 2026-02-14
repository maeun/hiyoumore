import login_main_img from "./login_main_img.gif";
import kakao_login_btn from "./kakao_login_btn.png";
import React from "react";
import { Helmet } from "react-helmet-async";
import Button from "@mui/material/Button";
import { supabase } from './supabaseConfig';
import { showErrorToast } from './toastUtils';

function Login() {
  const handleKakaoLogin = async () => {
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

  return (
    <div className="login-container">
      <Helmet>
        <meta name="robots" content="noindex" />
      </Helmet>
      <img src={login_main_img} alt="login main" />

      <Button
        variant="outlined"
        onClick={handleKakaoLogin}
        sx={{
          height: "45px",
          width: "100%",
          color: "#000000",
          borderColor: "#000000",
          borderWidth: "3px",
          backgroundColor: "#FFFFFF",
          "&:hover": {
            borderColor: "#fae100",
            borderWidth: "3px",
            backgroundColor: "rgba(250, 225, 0, 0.80)",
          },
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          margin: "0 auto",
        }}
      >
        <img
          src={kakao_login_btn}
          alt="kakao login"
          style={{
            height: "85%",
            marginRight: 8,
          }}
        />
        카카오로 로그인하기
      </Button>
    </div>
  );
}

export default Login;
