// src/context/CartContext.js
import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  useMemo,
} from "react";
import { useAuth } from "./AuthContext";

const CartContext = createContext();
export const useCart = () => useContext(CartContext);

const API_BASE_URL = "https://azeezolabode.pythonanywhere.com";

export const CartProvider = ({ children }) => {
  const { accessToken, refreshAccessToken, logout } = useAuth();

  const [cart, setCart] = useState({
    items: [],
    cart_total: 0,
  });

  const [loading, setLoading] = useState(false);

  // -----------------------------
  // SAFE HEADERS
  // -----------------------------
  const headers = useMemo(() => {
    return {
      "Content-Type": "application/json",
      ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
    };
  }, [accessToken]);

  // -----------------------------
  // CLEAR CART (SAFE LOCAL RESET)
  // -----------------------------
  const clearCart = useCallback(() => {
    setCart({
      items: [],
      cart_total: 0,
    });
  }, []);

  // -----------------------------
  // FETCH CART
  // -----------------------------
  const fetchCart = useCallback(async () => {
    try {
      setLoading(true);

      let res = await fetch(`${API_BASE_URL}/cart/`, {
        method: "GET",
        headers,
        credentials: "include",
      });

      // TOKEN EXPIRED → REFRESH
      if (res.status === 401 && accessToken) {
        const newToken = await refreshAccessToken();
        if (!newToken) return logout();

        res = await fetch(`${API_BASE_URL}/cart/`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${newToken}`,
          },
          credentials: "include",
        });
      }

      if (!res.ok) {
        console.error("Failed to fetch cart");
        return;
      }

      const data = await res.json();

      setCart({
        items: data.items || [],
        cart_total: data.cart_total || 0,
      });
    } catch (err) {
      console.error("Cart fetch error:", err);
    } finally {
      setLoading(false);
    }
  }, [accessToken, headers, refreshAccessToken, logout]);

  // -----------------------------
  // ADD ITEM
  // -----------------------------
  const addItemToCart = useCallback(
    async (product_id, quantity = 1) => {
      try {
        let res = await fetch(`${API_BASE_URL}/cart/add/`, {
          method: "POST",
          headers,
          credentials: "include",
          body: JSON.stringify({
            product_id,
            quantity: Math.max(quantity, 1),
          }),
        });

        if (res.status === 401 && accessToken) {
          const newToken = await refreshAccessToken();
          if (!newToken) return logout();

          res = await fetch(`${API_BASE_URL}/cart/add/`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${newToken}`,
            },
            credentials: "include",
            body: JSON.stringify({
              product_id,
              quantity,
            }),
          });
        }

        if (!res.ok) {
          const text = await res.text();
          console.error("Add to cart error:", text);
          return;
        }

        await fetchCart();
      } catch (err) {
        console.error("Add cart error:", err);
      }
    },
    [accessToken, headers, fetchCart, refreshAccessToken, logout]
  );

  // -----------------------------
  // REMOVE ITEM
  // -----------------------------
  const removeFromCart = useCallback(
    async (itemId) => {
      try {
        await fetch(`${API_BASE_URL}/cart/item/${itemId}/remove/`, {
          method: "DELETE",
          headers,
          credentials: "include",
        });

        await fetchCart();
      } catch (err) {
        console.error("Remove error:", err);
      }
    },
    [headers, fetchCart]
  );

  // -----------------------------
  // DECREASE ITEM
  // -----------------------------
  const decreaseProductFromCart = useCallback(
    async (itemId) => {
      try {
        await fetch(`${API_BASE_URL}/cart/item/${itemId}/decrease/`, {
          method: "DELETE",
          headers,
          credentials: "include",
        });

        await fetchCart();
      } catch (err) {
        console.error("Decrease error:", err);
      }
    },
    [headers, fetchCart]
  );

  // -----------------------------
  // LOAD CART ON START
  // -----------------------------
  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  return (
    <CartContext.Provider
      value={{
        cart,
        loading,
        addItemToCart,
        fetchCart,
        removeFromCart,
        decreaseProductFromCart,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};