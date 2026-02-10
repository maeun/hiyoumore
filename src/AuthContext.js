import React, { createContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(
    () => sessionStorage.getItem("isLoggedIn") === "true"
  );
  const [token, setToken] = useState(
    () => sessionStorage.getItem("token") || ""
  );
  const [refreshToken, setRefreshToken] = useState(
    () => sessionStorage.getItem("refreshToken") || ""
  );
  const [platform, setPlatform] = useState(
    () => sessionStorage.getItem("platform") || ""
  );

  useEffect(() => {
    sessionStorage.setItem("isLoggedIn", isLoggedIn);
    sessionStorage.setItem("token", token);
    sessionStorage.setItem("refreshToken", refreshToken);
    sessionStorage.setItem("platform", platform);
  }, [isLoggedIn, token, refreshToken, platform]);

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn,
        setIsLoggedIn,
        token,
        setToken,
        refreshToken,
        setRefreshToken,
        platform,
        setPlatform,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
