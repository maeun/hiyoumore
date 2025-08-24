import React, { createContext, useState } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [token, setToken] = useState("");
  const [refreshToken, setRefreshToken] = useState("");
  const [platform, setPlatform] = useState("");

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
