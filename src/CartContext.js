// src/context/CartContext.js
import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import { useAuth } from "./AuthContext";

const CartContext = createContext();
export const useCart = () => useContext(CartContext);

const API_BASE_URL = "http://127.0.0.1:8000";

export const CartProvider = ({ children }) => {
  const { token } = useAuth(); 
  const [cart, setCart] = useState({ items: [], total_price: 0 });
  const [loading, setLoading] = useState(true);
  console.log("CartProvider token:", token);


  const fetchCart = useCallback(async () => {
  console.log(" fetchCart CALLED, token =", token);
  setLoading(true);
  try {
    const headers = {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };

    const res = await fetch(`${API_BASE_URL}/cart/`, {
      method: "GET",
      headers,
      credentials: "include",
    });

    const data = await res.json();
    console.log("CART DATA:", data);
    setCart(data || { items: [], total_price: 0 });


    
  } catch (err) {
    console.error("Fetch cart error", err);
    setCart({ items: [], total_price: 0 });
  } finally {
    setLoading(false);
  }
}, [token]);


  
  const addItemToCart = useCallback(
    async (product_id, quantity = 1) => {
      try {
        const headers = {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        };

        const res = await fetch(`${API_BASE_URL}/cart/add/`, {
          method: "POST",
          headers,
          credentials: "include",
          body: JSON.stringify({ product_id: product_id, quantity: Math.max(quantity, 1) }),
        });

        if (!res.ok) {
          console.error("Failed to add item", res.status);
          return;
        }

        
        await fetchCart();

      } catch (err) {
        console.error("Add to cart error", err);
      }
    },
    [token, fetchCart]
  );

const decreaseProductFromCart = useCallback(
  async (itemId) => {
    try {
      const res = await fetch(`${API_BASE_URL}/cart/item/${itemId}/decrease/`, {
        method: "DELETE",
        credentials: "include",
      });

      if (!res.ok) {
        console.error("Failed to decrease item", res.status);
        return;
      }

      await fetchCart(); // refresh cart state
    } catch (err) {
      console.error("Error decreasing item", err);
    }
  },
  [fetchCart]
);
  
  


  const removeFromCart = useCallback(
  async (itemId) => {
    await fetch(`${API_BASE_URL}/cart/item/${itemId}/remove/`, {
      method: "DELETE",
      credentials: "include",
    });

    await fetchCart();
  },
  [fetchCart]
);

  
  const clearCart = useCallback(() => {
    setCart({ items: [], total_price: 0 });
  }, []);

  
 

  const placeOrder = async (orderData) => {
    try {
      const headers = {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      };

      const res = await fetch(`${API_BASE_URL}/order/create/`, {
        method: "POST",
        headers,
        credentials: "include",
        body: JSON.stringify(orderData),
      });

      const data = await res.json();

      if (!res.ok) {
        return {
          success: false,
          message: data?.detail || "Order failed",
        };
    }

    // Clear cart after success
    setCart({ items: [], total_price: 0 });

      return { success: true, order: data };
    } catch (error) {
      console.error("ORDER ERROR:", error);
      return { success: false, message: "Network error" };
    }
  };

  useEffect(() => {
    console.log("Refetching cart, token =", token);
    fetchCart();
    //
  }, [fetchCart]); // refetch whenever user changes


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
