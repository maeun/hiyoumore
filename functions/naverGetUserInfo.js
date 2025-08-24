const axios = require("axios");

exports.handler = async (event, context) => {
  const { token } = event.queryStringParameters;

  try {
    if (token) {
      // 네이버 사용자 정보 가져오기
      const userResponse = await axios.get(
        "https://openapi.naver.com/v1/nid/me",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("User data fetched successfully");

      return {
        statusCode: 200,
        body: JSON.stringify(userResponse.data),
      };
    } else {
      console.error("NO TOKEN!!!");

      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Failed to retrieve access token" }),
      };
    }
  } catch (error) {
    console.error("Error fetching token or user data:", error);

    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Internal Server Error" }),
    };
  }
};
