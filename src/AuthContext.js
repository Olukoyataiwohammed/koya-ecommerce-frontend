import React, { createContext, useContext, useState } from "react";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [authTokens, setAuthTokens] = useState(
    JSON.parse(localStorage.getItem("authTokens")) || null
  );

  const [cartItems, setCartItems] = useState(
    JSON.parse(localStorage.getItem("cartItems")) || []
  );

  // ✅ LOGIN (store BOTH tokens)
  const login = (tokens) => {
    setAuthTokens(tokens);
    localStorage.setItem("authTokens", JSON.stringify(tokens));
  };

  // ✅ LOGOUT
  const logout = () => {
    setAuthTokens(null);
    localStorage.removeItem("authTokens");
    setCartItems([]);
    localStorage.removeItem("cartItems");
    window.location.href = "/login";
  };

  // ✅ REFRESH TOKEN FUNCTION
  const refreshAccessToken = async () => {
    try {
      const res = await fetch(
        "https://azeezolabode.pythonanywhere.com/api/token/refresh/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            refresh: authTokens?.refresh,
          }),
        }
      );

      const data = await res.json();

      if (res.ok) {
        const newTokens = {
          access: data.access,
          refresh: authTokens.refresh, // keep old refresh
        };

        setAuthTokens(newTokens);
        localStorage.setItem("authTokens", JSON.stringify(newTokens));

        return data.access;
      } else {
        logout();
      }
    } catch (err) {
      console.error("Refresh error:", err);
      logout();
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
        cartItems,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);