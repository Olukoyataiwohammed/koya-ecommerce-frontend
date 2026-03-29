import React, { createContext, useContext, useState } from "react";


const AuthContext = createContext(null); 

export const AuthProvider = ({ children }) => {
  const [authTokens, setAuthTokens] = useState(
    JSON.parse(localStorage.getItem("authTokens")) || null
  );

  const [cartItems, setCartItems] = useState(
    JSON.parse(localStorage.getItem("cartItems")) || []
  );

  const login = (token) => {
  const tokenObj = { token }; 

  setAuthTokens(tokenObj);
  localStorage.setItem("authTokens", JSON.stringify(tokenObj));
};


  const logout = () => {
    setAuthTokens(null);
    localStorage.removeItem("authTokens");
    setCartItems([]);
    localStorage.removeItem("cartItems");
  };

  

  

  return (
    <AuthContext.Provider
      value={{
        authTokens,
        token: authTokens?.token, 
        login,
        logout,
        isAuthenticated: !!authTokens,
        cartItems,
      }}
    >

      {children}
    </AuthContext.Provider>
  );
};

// ✅ Custom hook to use context
export const useAuth = () => useContext(AuthContext);
