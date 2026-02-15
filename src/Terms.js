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
  textAlign: "left",
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
});

function Terms() {
  return (
    <Container>
      <Helmet>
        <title>이용약관 | hiyoumore</title>
        <meta name="robots" content="noindex" />
      </Helmet>

      <h1>이용약관</h1>

      <h2>제1조 (목적)</h2>
      <p>
        본 약관은 하이유모어(이하 "서비스")가 제공하는 퀴즈 공유 서비스의 이용과
        관련하여 서비스와 이용자 간의 권리, 의무 및 책임 사항을 규정함을 목적으로
        합니다.
      </p>

      <h2>제2조 (서비스 이용)</h2>
      <p>
        ① 서비스는 다양한 카테고리의 퀴즈를 제공하며, 이용자는 퀴즈를 풀고
        친구에게 공유할 수 있습니다.
      </p>
      <p>
        ② 퀴즈 열람 및 공유는 회원가입 없이 이용 가능하며, 일부 기능은 카카오
        또는 네이버 소셜 로그인을 통해 이용할 수 있습니다.
      </p>
      <p>
        ③ 서비스는 무료로 제공되며, 향후 변경될 수 있습니다.
      </p>

      <h2>제3조 (이용자의 의무)</h2>
      <p>
        ① 이용자는 서비스를 악용하거나 타인의 권리를 침해하는 행위를 하여서는 안
        됩니다.
      </p>
      <p>
        ② 이용자는 서비스의 정상적인 운영을 방해하는 행위를 하여서는 안 됩니다.
      </p>
      <p>
        ③ 이용자는 타인의 개인정보를 무단으로 수집, 저장, 공개하는 행위를
        하여서는 안 됩니다.
      </p>

      <h2>제4조 (지적재산권)</h2>
      <p>
        ① 서비스가 제공하는 퀴즈 콘텐츠, 디자인, 로고 등에 대한 지적재산권은
        서비스 운영자에게 있습니다.
      </p>
      <p>
        ② 이용자는 서비스의 콘텐츠를 개인적, 비상업적 용도로만 이용할 수
        있습니다.
      </p>

      <h2>제5조 (면책조항)</h2>
      <p>
        ① 서비스는 퀴즈 콘텐츠의 정확성을 보장하지 않으며, 콘텐츠 이용으로
        발생하는 손해에 대해 책임지지 않습니다.
      </p>
      <p>
        ② 천재지변, 기술적 장애 등 불가항력으로 인한 서비스 중단에 대해 책임지지
        않습니다.
      </p>

      <h2>제6조 (서비스 변경 및 중단)</h2>
      <p>
        서비스 운영자는 운영상, 기술상의 사유로 서비스의 전부 또는 일부를 변경하거나
        중단할 수 있으며, 이 경우 사전에 공지합니다.
      </p>

      <h2>제7조 (약관 변경)</h2>
      <p>
        ① 본 약관은 필요 시 변경될 수 있으며, 변경된 약관은 서비스 내에
        공지합니다.
      </p>
      <p>
        ② 변경된 약관에 동의하지 않는 이용자는 서비스 이용을 중단할 수 있습니다.
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

export default Terms;
