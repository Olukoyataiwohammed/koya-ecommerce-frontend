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

const API_BASE_URL =
  "https://azeezolabode.pythonanywhere.com";

export const CartProvider = ({ children }) => {
  const { token } = useAuth();

  const [cart, setCart] = useState({
    items: [],
    total_price: 0,
  });

  const [loading, setLoading] = useState(true);

  // -----------------------------
  // STABLE HEADERS (NO WARNINGS)
  // -----------------------------
  const headers = useMemo(() => {
    return {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };
  }, [token]);

  // -----------------------------
  // FETCH CART
  // -----------------------------
  const fetchCart = useCallback(async () => {
    if (!token) {
      setCart({ items: [], total_price: 0 });
      setLoading(false);
      return;
    }

    try {
      setLoading(true);

      const res = await fetch(`${API_BASE_URL}/cart/`, {
        method: "GET",
        headers,
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || "Failed to fetch cart");
      }

      const data = await res.json();

      setCart(data || { items: [], total_price: 0 });
    } catch (err) {
      console.error("Cart error:", err.message);
      setCart({ items: [], total_price: 0 });
    } finally {
      setLoading(false);
    }
  }, [token, headers]);

  // -----------------------------
  // ADD TO CART
  // -----------------------------
  const addItemToCart = useCallback(
    async (product_id, quantity = 1) => {
      try {
        const res = await fetch(`${API_BASE_URL}/cart/add/`, {
          method: "POST",
          headers,
          body: JSON.stringify({
            product_id,
            quantity: Math.max(quantity, 1),
          }),
        });

        if (!res.ok) {
          const text = await res.text();
          console.error(text);
          return;
        }

        await fetchCart();
      } catch (err) {
        console.error(err);
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
        const res = await fetch(
          `${API_BASE_URL}/cart/item/${itemId}/decrease/`,
          {
            method: "DELETE",
            headers,
          }
        );

        if (!res.ok) {
          const text = await res.text();
          console.error(text);
          return;
        }

        await fetchCart();
      } catch (err) {
        console.error(err);
      }
    },
    [headers, fetchCart]
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
            headers,
          }
        );

        if (!res.ok) {
          const text = await res.text();
          console.error(text);
          return;
        }

        await fetchCart();
      } catch (err) {
        console.error(err);
      }
    },
    [headers, fetchCart]
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
  const placeOrder = useCallback(
    async (orderData) => {
      try {
        const res = await fetch(`${API_BASE_URL}/order/create/`, {
          method: "POST",
          headers,
          body: JSON.stringify(orderData),
        });

        const data = await res.json();

        if (!res.ok) {
          return {
            success: false,
            message: data?.detail || "Order failed",
          };
        }

        setCart({ items: [], total_price: 0 });

        return {
          success: true,
          order: data.order || data,
        };
      } catch (err) {
        return {
          success: false,
          message: "Network error",
        };
      }
    },
    [headers]
  );

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