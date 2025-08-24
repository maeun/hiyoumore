const axios = require("axios");

const clientId = "eV5oSQK9GyDD58KC4_Xl"; // 클라이언트 ID
const clientSecret = "PvmCwwNzMi"; // 클라이언트 시크릿
const serviceProvider = "NAVER";

exports.handler = async (event, context) => {
  const { token, refresh_token } = event.queryStringParameters || {};

  if (!token || !refresh_token) {
    return {
      statusCode: 400, // Bad Request
      body: JSON.stringify({ message: "Missing token or refresh_token" }),
    };
  } else {
    // 네이버 OAuth2 토큰 요청
    try {
      const deleteResponse = await axios.post(
        "https://nid.naver.com/oauth2.0/token",
        null,
        {
          params: {
            grant_type: "delete",
            client_id: clientId,
            client_secret: clientSecret,
            access_token: token,
            service_provider: serviceProvider,
          },
        }
      );

      const { delete_result } = await deleteResponse;

      if (delete_result) {
        return {
          statusCode: 111,
          body: JSON.stringify(deleteResponse.data),
        };
      } else {
        setTimeout(() => 1000);

        const deleteResponse = await axios.post(
          "https://nid.naver.com/oauth2.0/token",
          null,
          {
            params: {
              grant_type: "delete",
              client_id: clientId,
              client_secret: clientSecret,
              access_token: token,
              service_provider: serviceProvider,
            },
          }
        );

        return {
          statusCode: 222,
          body: JSON.stringify(deleteResponse.data),
        };
      }
    } catch (error) {
      setTimeout(() => 1000);

      const deleteResponse = await axios.post(
        "https://nid.naver.com/oauth2.0/token",
        null,
        {
          params: {
            grant_type: "delete",
            client_id: clientId,
            client_secret: clientSecret,
            access_token: token,
            service_provider: serviceProvider,
          },
        }
      );

      if (deleteResponse.data.result == "success") {
        const refreshResponse = await axios.post(
          "https://nid.naver.com/oauth2.0/token",
          null,
          {
            params: {
              grant_type: "refresh_token",
              client_id: clientId,
              client_secret: clientSecret,
              refresh_token: refresh_token,
            },
          }
        );
        return {
          statusCode: 331,
          body: JSON.stringify({
            result: deleteResponse.data.result,
            error: refreshResponse.data.error,
          }),
        };
      } else {
        return {
          statusCode: 332,
          body: JSON.stringify(deleteResponse.data),
        };
      }
    }
  }
};

// const axios = require("axios");

// exports.handler = async (event, context) => {
//   const { token, refresh_token } = event.queryStringParameters;
//   const clientId = "eV5oSQK9GyDD58KC4_Xl"; // 클라이언트 ID
//   const clientSecret = "PvmCwwNzMi"; // 클라이언트 시크릿
//   const serviceProvider = "NAVER";

//   try {
//     // 네이버 OAuth2 토큰 요청
//     const deleteResponse = await axios.post(
//       "https://nid.naver.com/oauth2.0/token",
//       null,
//       {
//         params: {
//           grant_type: "delete",
//           client_id: clientId,
//           client_secret: clientSecret,
//           access_token: token,
//           service_provider: serviceProvider,
//         },
//       }
//     );

//     const { delete_result } = await deleteResponse.data.result;

//     if (delete_result == "success") {
//       try {
//         // 네이버 OAuth2 토큰 요청
//         const refreshResponse = await axios.post(
//           "https://nid.naver.com/oauth2.0/token",
//           null,
//           {
//             params: {
//               grant_type: "refresh_token",
//               client_id: clientId,
//               client_secret: clientSecret,
//               refresh_token: refresh_token,
//             },
//           }
//         );

//         const { refresh_result } = await refreshResponse.data.error;

//         if (refresh_result == "invalid_request") {
//           return {
//             statusCode: 200,
//             body: JSON.stringify({ message: "sign out success" }),
//           };
//         } else {
//           return {
//             statusCode: 444,
//             body: JSON.stringify({ message: "something going wrong" }),
//           };
//         }
//       } catch (error) {}
//     } else {
//       return {
//         statusCode: 555,
//         body: JSON.stringify({ message: "something going wrong 555" }),
//       };
//     }
//   } catch (error) {}
// };
