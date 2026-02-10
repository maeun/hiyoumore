import login_main_img from "./login_main_img.gif";
import naver_login_btn from "./naver_login_btn.png";
import kakao_login_btn from "./kakao_login_btn.png";
import React from "react";
import { Helmet } from "react-helmet-async";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

function Login() {
  const naver_response_type = "code";
  const naver_clientId = "eV5oSQK9GyDD58KC4_Xl";
  // netlify 배포일 때 아래 거 사용
  const naver_redirectUri =
    "https://hiyoumore.netlify.app/oauth/naver/callback";
  const naver_state = Math.random().toString(36).substring(2);
  localStorage.setItem("naverState", naver_state);

  const kakao_response_type = "code";
  const kakao_clientId = "05d00f0fda1f9c72cd19cc6f219cd58a";
  const kakao_redirectUri =
    "https://hiyoumore.netlify.app/oauth/kakao/callback";

  // github 배포일 때 아래 거 사용
  // const redirectUri = "https://maeun.github.io/hiyoumore/oauth/naver/callback";

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "16px",
        padding: "24px",
        backgroundColor: "#FFFFFF",
        borderRadius: "16px",
        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.08)",
        maxWidth: "360px",
        margin: "0 auto",
      }}
    >
      <Helmet>
        <meta name="robots" content="noindex" />
      </Helmet>
      <img
        src={login_main_img}
        alt="login main"
        style={{ width: "120px", borderRadius: "12px" }}
      />
      <Typography
        variant="h6"
        sx={{ fontFamily: '"Noto Sans KR", sans-serif', fontWeight: 600 }}
      >
        로그인
      </Typography>

      <Button
        variant="outlined"
        href={`https://nid.naver.com/oauth2.0/authorize?response_type=${naver_response_type}&client_id=${naver_clientId}&redirect_uri=${naver_redirectUri}&state=${naver_state}`}
        sx={{
          height: "45px",
          width: "100%",
          color: "#000000",
          borderColor: "#000000",
          borderWidth: "3px",
          backgroundColor: "#FFFFFF",
          "&:hover": {
            borderColor: "#03C75A",
            borderWidth: "3px",
            backgroundColor: "rgba(3, 199, 90, 0.80)",
          },
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <img
          src={naver_login_btn}
          alt="naver login"
          style={{
            height: "85%",
            marginRight: 8,
          }}
        />
        네이버로 로그인하기
      </Button>
      <Button
        variant="outlined"
        href={`https://kauth.kakao.com/oauth/authorize?response_type=${kakao_response_type}&client_id=${kakao_clientId}&redirect_uri=${kakao_redirectUri}`}
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
    </Box>
  );
}

export default Login;
