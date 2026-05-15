import React, { createContext, useContext, useState } from "react";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [authTokens, setAuthTokens] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("authTokens")) || null;
    } catch {
      return null;
    }
  });

  // -----------------------------
  // LOGIN
  // -----------------------------
  const login = (tokens) => {
    setAuthTokens(tokens);
    localStorage.setItem("authTokens", JSON.stringify(tokens));
  };

  // -----------------------------
  // LOGOUT
  // -----------------------------
  const logout = () => {
    setAuthTokens(null);
    localStorage.removeItem("authTokens");
    window.location.href = "/login";
  };

  // -----------------------------
  // REFRESH TOKEN
  // -----------------------------
  const refreshAccessToken = async () => {
    const refresh = authTokens?.refresh;

    if (!refresh) {
      logout();
      return null;
    }

    try {
      const res = await fetch(
        "https://azeezolabode.pythonanywhere.com/api/token/refresh/",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ refresh }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        logout();
        return null;
      }

      const newTokens = {
        access: data.access,
        refresh,
      };

      setAuthTokens(newTokens);
      localStorage.setItem("authTokens", JSON.stringify(newTokens));

      return data.access;
    } catch (err) {
      console.error("Refresh error:", err);
      logout();
      return null;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        authTokens,
        accessToken: authTokens?.access,
        refreshToken: authTokens?.refresh,
        login,
        logout,
        refreshAccessToken,
        isAuthenticated: !!authTokens,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);