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
    total_price: 0,
  });

  const [loading, setLoading] = useState(false);

  // ✅ HEADERS
  const headers = useMemo(() => {
    return {
      "Content-Type": "application/json",
      ...(accessToken && {
        Authorization: `Bearer ${accessToken}`,
      }),
    };
  }, [accessToken]);

  // -----------------------------
  // 🟡 LOCAL CART (GUEST USERS)
  // -----------------------------
  const getLocalCart = () =>
    JSON.parse(localStorage.getItem("cart")) || [];

  const setLocalCart = (items) => {
    localStorage.setItem("cart", JSON.stringify(items));
    setCart({ items, total_price: 0 });
  };

  // -----------------------------
  // FETCH CART
  // -----------------------------
  const fetchCart = useCallback(async () => {
    // 🟡 GUEST USER
    if (!accessToken) {
      const local = getLocalCart();
      setCart({ items: local, total_price: 0 });
      return;
    }

    try {
      setLoading(true);

      let res = await fetch(`${API_BASE_URL}/cart/`, {
        headers,
      });

      // 🔁 HANDLE TOKEN EXPIRY
      if (res.status === 401) {
        const newToken = await refreshAccessToken();
        if (!newToken) return logout();

        res = await fetch(`${API_BASE_URL}/cart/`, {
          headers: {
            Authorization: `Bearer ${newToken}`,
          },
        });
      }

      if (!res.ok) {
        console.error("Failed to fetch cart");
        return;
      }

      const data = await res.json();
      setCart(data || { items: [], total_price: 0 });
    } catch (err) {
      console.error("Cart error:", err);
    } finally {
      setLoading(false);
    }
  }, [accessToken, headers, refreshAccessToken, logout]);

  // -----------------------------
  // ADD TO CART
  // -----------------------------
  const addItemToCart = useCallback(
    async (product_id, quantity = 1) => {
      // 🟡 GUEST USER (NO LOGIN)
      if (!accessToken) {
        const existing = getLocalCart();

        const item = existing.find((i) => i.id === product_id);

        if (item) {
          item.quantity += quantity;
        } else {
          existing.push({ id: product_id, quantity });
        }

        setLocalCart(existing);
        return;
      }

      try {
        let res = await fetch(`${API_BASE_URL}/cart/add/`, {
          method: "POST",
          headers,
          body: JSON.stringify({
            product_id,
            quantity: Math.max(quantity, 1),
          }),
        });

        // 🔁 HANDLE TOKEN EXPIRY
        if (res.status === 401) {
          const newToken = await refreshAccessToken();
          if (!newToken) return logout();

          res = await fetch(`${API_BASE_URL}/cart/add/`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${newToken}`,
            },
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
        console.error("Add error:", err);
      }
    },
    [accessToken, headers, fetchCart, refreshAccessToken, logout]
  );

  // -----------------------------
  // REMOVE ITEM
  // -----------------------------
  const removeFromCart = useCallback(
    async (itemId) => {
      if (!accessToken) {
        const updated = getLocalCart().filter((i) => i.id !== itemId);
        setLocalCart(updated);
        return;
      }

      try {
        await fetch(`${API_BASE_URL}/cart/item/${itemId}/remove/`, {
          method: "DELETE",
          headers,
        });

        await fetchCart();
      } catch (err) {
        console.error(err);
      }
    },
    [accessToken, headers, fetchCart]
  );

  // -----------------------------
  // LOAD CART
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
      }}
    >
      {children}
    </CartContext.Provider>
  );
};