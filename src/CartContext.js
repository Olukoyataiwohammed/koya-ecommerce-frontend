// src/context/CartContext.js
import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";
import { useAuth } from "./AuthContext";

const CartContext = createContext();
export const useCart = () => useContext(CartContext);

// ✅ Fixed API base URL
const API_BASE_URL = "https://azeezolabode.pythonanywhere.com";

export const CartProvider = ({ children }) => {
  const { token } = useAuth();

  const [cart, setCart] = useState({ items: [], total_price: 0 });
  const [loading, setLoading] = useState(true);

  // ✅ reusable auth headers
  const getHeaders = () => ({
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
  });

  // -----------------------------
  // FETCH CART
  // -----------------------------
  const fetchCart = useCallback(async () => {
    if (!token) {
      setCart({ items: [], total_price: 0 });
      setLoading(false);
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(`${API_BASE_URL}/cart/`, {
        method: "GET",
        headers: getHeaders(),
      });

      if (res.status === 401) {
        console.error("Unauthorized - token expired");
        setCart({ items: [], total_price: 0 });
        return;
      }

      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || "Cart fetch failed");
      }

      const data = await res.json();

      // ✅ safe parsing
      setCart(data.data || data || { items: [], total_price: 0 });
    } catch (err) {
      console.error("Fetch cart error:", err.message);
      setCart({ items: [], total_price: 0 });
    } finally {
      setLoading(false);
    }
  }, [token]);

  // -----------------------------
  // ADD ITEM
  // -----------------------------
  const addItemToCart = useCallback(
    async (product_id, quantity = 1) => {
      try {
        const res = await fetch(`${API_BASE_URL}/cart/add/`, {
          method: "POST",
          headers: getHeaders(),
          body: JSON.stringify({
            product_id,
            quantity: Math.max(quantity, 1),
          }),
        });

        if (!res.ok) {
          const text = await res.text();
          console.error("Add failed:", text);
          return;
        }

        await fetchCart();
      } catch (err) {
        console.error("Add to cart error:", err);
      }
    },
    [fetchCart, token]
  );

  // -----------------------------
  // DECREASE ITEM
  // -----------------------------
  const decreaseProductFromCart = useCallback(
    async (itemId) => {
      try {
        const res = await fetch(
          `${API_BASE_URL}/cart/item/${itemId}/decrease/`,
          {
            method: "DELETE",
            headers: getHeaders(),
          }
        );

        if (!res.ok) {
          const text = await res.text();
          console.error("Decrease failed:", text);
          return;
        }

        await fetchCart();
      } catch (err) {
        console.error("Error decreasing item:", err);
      }
    },
    [fetchCart, token]
  );

  // -----------------------------
  // REMOVE ITEM
  // -----------------------------
  const removeFromCart = useCallback(
    async (itemId) => {
      try {
        const res = await fetch(
          `${API_BASE_URL}/cart/item/${itemId}/remove/`,
          {
            method: "DELETE",
            headers: getHeaders(),
          }
        );

        if (!res.ok) {
          const text = await res.text();
          console.error("Remove failed:", text);
          return;
        }

        await fetchCart();
      } catch (err) {
        console.error("Remove error:", err);
      }
    },
    [fetchCart, token]
  );

  // -----------------------------
  // CLEAR CART (LOCAL ONLY)
  // -----------------------------
  const clearCart = useCallback(() => {
    setCart({ items: [], total_price: 0 });
  }, []);

  // -----------------------------
  // PLACE ORDER
  // -----------------------------
  const placeOrder = async (orderData) => {
    try {
      const res = await fetch(`${API_BASE_URL}/order/create/`, {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify(orderData),
      });

      const data = await res.json();

      if (!res.ok) {
        return {
          success: false,
          message: data?.detail || "Order failed",
        };
      }

      // ✅ clear cart after success
      setCart({ items: [], total_price: 0 });

      return {
        success: true,
        order: data.order || data,
      };
    } catch (error) {
      console.error("ORDER ERROR:", error);
      return { success: false, message: "Network error" };
    }
  };

  // -----------------------------
  // INITIAL LOAD
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
        setCart,
        removeFromCart,
        clearCart,
        placeOrder,
        decreaseProductFromCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};