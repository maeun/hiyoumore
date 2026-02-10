import React, { useEffect, useState, useContext } from "react";
import { Helmet } from "react-helmet-async";
import AuthContext from "./AuthContext";
import { toast, ToastContainer, Bounce } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { useLocation, useNavigate } from "react-router-dom";

function Oauth_Naver_Callback() {
  const { setIsLoggedIn, setToken, setRefreshToken, setPlatform } =
    useContext(AuthContext);
  const [, setUserData] = useState(null);
  const [retry, setRetry] = useState(0); // Track number of retries (0 = no retry, 1 = first retry)
  const location = useLocation();
  const navigate = useNavigate();

  const fetchData = async (code, state) => {
    try {
      console.log("Retry attempt:", retry);

      const response = await fetch(
        `/.netlify/functions/naverAuth?code=${code}&state=${state}`,
        {
          method: "GET",
          headers: {
            Accept: "application/json",
          },
        }
      );

      const data = await response.json();
      console.log(data);

      if (data.access_token && data.refresh_token && data.user) {
        setUserData(data.user.response); // Store user data in state
        setIsLoggedIn(true); // Set login status to true
        setToken(data.access_token); // Store the access token
        setRefreshToken(data.refresh_token);
        setPlatform("naver");

        // Reset retry state after successful login
        setRetry(0); // Make sure retry flag is reset after a successful login

        toast(<b>👋 로그인 되었습니다 👋</b>, {
          position: "top-center",
          autoClose: 900,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
          transition: Bounce,
        });

        navigate("/");
      } else {
        console.error("Failed to retrieve user data:", data);
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  useEffect(() => {
    const query = new URLSearchParams(location.search);
    const code = query.get("code");
    const state = query.get("state");
    const savedState = localStorage.getItem("naverState");

    if (state === savedState) {
      fetchData(code, state); // Start fetching data
    } else {
      console.error("Invalid state");
    }
  }, [location]);

  return (
    <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "50vh", gap: "16px" }}>
      <Helmet>
        <meta name="robots" content="noindex" />
      </Helmet>
      <CircularProgress sx={{ color: "#594b73" }} />
      <Typography sx={{ fontFamily: '"Noto Sans KR", sans-serif' }}>
        로그인 처리 중...
      </Typography>
      <ToastContainer />
    </Box>
  );
}

export default Oauth_Naver_Callback;
