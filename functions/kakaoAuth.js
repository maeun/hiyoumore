const fetch = require("node-fetch");

exports.handler = async (event, context) => {
  const kakaoRestApiKey = "05d00f0fda1f9c72cd19cc6f219cd58a"; // Netlify의 환경변수에서 가져오기
  const kakaoRedirectUri = "https://hiyoumore.vercel.app/oauth/kakao/callback"; // 리디렉션 URI도 환경변수로 설정
  const code = event.queryStringParameters.code; // 카카오에서 받은 인증 코드

  const url = "https://kauth.kakao.com/oauth/token";
  const headers = {
    "Content-Type": "application/x-www-form-urlencoded",
  };

  const body = new URLSearchParams({
    grant_type: "authorization_code",
    client_id: kakaoRestApiKey,
    redirect_uri: kakaoRedirectUri,
    code: code,
  });

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: headers,
      body: body,
    });
    const data = await response.json();

    // 토큰 데이터를 클라이언트로 반환
    return {
      statusCode: 200,
      body: JSON.stringify(data),
    };
  } catch (error) {
    console.error("카카오 로그인 오류:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "카카오 로그인에 실패했습니다." }),
    };
  }
};
