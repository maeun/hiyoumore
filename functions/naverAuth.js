const axios = require("axios");

exports.handler = async (event, context) => {
  const { code, state } = event.queryStringParameters;
  const clientId = "eV5oSQK9GyDD58KC4_Xl"; // 클라이언트 ID
  const clientSecret = "PvmCwwNzMi"; // 클라이언트 시크릿

  try {
    // 네이버 OAuth2 토큰 요청
    const tokenResponse = await axios.post(
      "https://nid.naver.com/oauth2.0/token",
      null,
      {
        params: {
          grant_type: "authorization_code",
          client_id: clientId,
          client_secret: clientSecret,
          code: code,
          state: state,
          scope: "offline", // refresh_token을 받기 위한 필수 항목
        },
      }
    );

    const { access_token } = await tokenResponse.data;
    const { refresh_token } = await tokenResponse.data;

    if (access_token) {
      // 네이버 사용자 정보 가져오기
      const userResponse = await axios.get(
        "https://openapi.naver.com/v1/nid/me",
        {
          headers: {
            Authorization: `Bearer ${access_token}`,
          },
        }
      );

      return {
        statusCode: 200,
        body: JSON.stringify({
          access_token: access_token, // access_token 전달
          refresh_token: refresh_token,
          user: userResponse.data, // 사용자 정보 전달
        }),
      };
    } else {
      setTimeout(() => 1000);

      const tokenResponse = await axios.post(
        "https://nid.naver.com/oauth2.0/token",
        null,
        {
          params: {
            grant_type: "authorization_code",
            client_id: clientId,
            client_secret: clientSecret,
            code: code,
            state: state,
          },
        }
      );

      const { access_token } = await tokenResponse.data;
      const { refresh_token } = await tokenResponse.data;

      if (access_token) {
        // 네이버 사용자 정보 가져오기
        const userResponse = await axios.get(
          "https://openapi.naver.com/v1/nid/me",
          {
            headers: {
              Authorization: `Bearer ${access_token}`,
            },
          }
        );

        return {
          statusCode: 200,
          body: JSON.stringify({
            access_token: access_token, // access_token 전달
            refresh_token: refresh_token,
            user: userResponse.data, // 사용자 정보 전달
          }),
        };
      } else {
        return {
          statusCode: 400,
          body: JSON.stringify({ error: "Failed to retrieve access token" }),
        };
      }
    }
  } catch (error) {
    setTimeout(() => 1000);
    const tokenResponse = await axios.post(
      "https://nid.naver.com/oauth2.0/token",
      null,
      {
        params: {
          grant_type: "authorization_code",
          client_id: clientId,
          client_secret: clientSecret,
          code: code,
          state: state,
        },
      }
    );

    const { access_token } = await tokenResponse.data;
    const { refresh_token } = await tokenResponse.data;

    if (access_token) {
      // 네이버 사용자 정보 가져오기
      const userResponse = await axios.get(
        "https://openapi.naver.com/v1/nid/me",
        {
          headers: {
            Authorization: `Bearer ${access_token}`,
          },
        }
      );

      return {
        statusCode: 200,
        body: JSON.stringify({
          access_token: access_token, // access_token 전달
          refresh_token: refresh_token,
          user: userResponse.data, // 사용자 정보 전달
        }),
      };
    } else {
      return {
        statusCode: 500,
        body: JSON.stringify({ error: "Internal Server Error" }),
      };
    }
  }
};
