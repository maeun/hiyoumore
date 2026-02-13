import React from "react";
import { Helmet } from "react-helmet-async";
import Typography from "@mui/joy/Typography";
import { styled } from "@mui/system";
import tokens from "./tokens";

const Container = styled("div")({
  padding: "24px 20px 40px",
  maxWidth: "500px",
  margin: "0 auto",
  fontFamily: tokens.fonts.category,
  color: tokens.colors.black,
  lineHeight: 1.8,
  "& h1": {
    fontSize: "1.4rem",
    fontWeight: 700,
    color: tokens.colors.primary,
    marginBottom: "20px",
    textAlign: "center",
  },
  "& h2": {
    fontSize: "1.1rem",
    fontWeight: 700,
    color: tokens.colors.primary,
    marginTop: "28px",
    marginBottom: "8px",
  },
  "& p": {
    fontSize: "0.9rem",
    marginBottom: "8px",
    color: "#333",
  },
  "& ul": {
    fontSize: "0.9rem",
    color: "#333",
    paddingLeft: "20px",
    marginBottom: "8px",
  },
  "& li": {
    marginBottom: "4px",
  },
});

function Privacy() {
  return (
    <Container>
      <Helmet>
        <title>개인정보처리방침 | hiyoumore</title>
        <meta name="robots" content="noindex" />
      </Helmet>

      <h1>개인정보처리방침</h1>

      <p>
        하이유모어(이하 "서비스")는 이용자의 개인정보를 소중히 여기며, 관련 법령에
        따라 개인정보를 보호하고 있습니다. 본 방침은 서비스가 수집하는 개인정보의
        항목, 목적, 보유 기간 등을 안내합니다.
      </p>

      <h2>제1조 (수집하는 개인정보)</h2>
      <p>서비스는 소셜 로그인 시 다음 정보를 수집합니다.</p>
      <ul>
        <li>카카오 로그인: 닉네임, 이메일, 프로필 이미지</li>
        <li>자동 수집: 로그인/로그아웃 시간</li>
      </ul>

      <h2>제2조 (수집 목적)</h2>
      <p>수집된 개인정보는 다음 목적으로 이용됩니다.</p>
      <ul>
        <li>이용자 인증 및 서비스 제공</li>
        <li>서비스 이용 현황 파악 및 개선</li>
      </ul>

      <h2>제3조 (보유 기간)</h2>
      <p>
        ① 수집된 개인정보는 서비스 이용 기간 동안 보유하며, 이용자가 삭제를
        요청하거나 서비스가 종료될 경우 지체 없이 파기합니다.
      </p>
      <p>
        ② 로그인/로그아웃 기록은 서비스 운영 목적으로 보관되며, 동일한 기준에
        따라 파기합니다.
      </p>

      <h2>제4조 (제3자 제공)</h2>
      <p>
        서비스는 이용자의 개인정보를 제3자에게 제공하지 않습니다. 다만, 소셜
        로그인 과정에서 카카오의 OAuth 인증 서비스를 이용하며, 해당
        플랫폼의 개인정보처리방침이 적용됩니다.
      </p>

      <h2>제5조 (이용자 권리)</h2>
      <p>이용자는 언제든지 다음 권리를 행사할 수 있습니다.</p>
      <ul>
        <li>수집된 개인정보의 열람 요청</li>
        <li>개인정보의 정정 및 삭제 요청</li>
        <li>개인정보 처리 정지 요청</li>
      </ul>
      <p>
        위 요청은 아래 연락처를 통해 접수하실 수 있으며, 요청 접수 후 지체 없이
        처리합니다.
      </p>

      <h2>제6조 (연락처)</h2>
      <p>
        개인정보 관련 문의는 아래 카카오톡 오픈채팅을 통해 접수하실 수 있습니다.
      </p>
      <p>
        <a
          href="https://open.kakao.com/o/sPjylDmf"
          style={{ color: tokens.colors.primary, textDecoration: "underline" }}
        >
          카카오톡 오픈채팅 문의
        </a>
      </p>

      <Typography
        level="body-sm"
        sx={{ mt: 4, textAlign: "center", color: tokens.colors.textMuted }}
      >
        시행일: 2025년 2월 13일
      </Typography>
    </Container>
  );
}

export default Privacy;
