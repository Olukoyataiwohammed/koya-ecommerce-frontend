import React from "react";
import { useCart } from "./CartContext";
import CheckoutButton from "./CheckoutButton";

const API_BASE = "https://azeezolabode.pythonanywhere.com";

const Cart = () => {
  const { cart, loading, removeFromCart, decreaseProductFromCart } = useCart();

  console.log("CART STATE IN UI:", cart);

  if (loading) {
    return <p>Loading cart...</p>;
  }

  if (!cart?.items || cart.items.length === 0) {
    return <p>🛒 Your cart is empty</p>;
  }

  return (
    <div>
      <h2>🛍️ KOYA Cart</h2>

      {cart.items.map((item) => {
        // ✅ supports BOTH formats: {product: {...}} OR flat item
        const product = item?.product ?? item;

        return (
          <div
            key={item?.id}
            style={{
              border: "1px solid #ddd",
              padding: "10px",
              marginBottom: "10px",
            }}
          >
            {/* PRODUCT NAME */}
            <h4>
              {product?.name || "Unnamed product"}
            </h4>

            {/* QUANTITY */}
            <p>Qty: {item?.quantity || 1}</p>

            {/* IMAGE */}
            {product?.image ? (
              <img
                src={
                  product.image.startsWith("http")
                    ? product.image
                    : `${API_BASE}${product.image}`
                }
                alt={product?.name || "product"}
                width="100"
              />
            ) : (
              <p>No image</p>
            )}

            {/* PRICE */}
            <p>
              ₦{Number(product?.price || 0).toFixed(2)}
            </p>

            {/* ACTIONS */}
            <div style={{ display: "flex", gap: "10px" }}>
              <button onClick={() => removeFromCart(item.id)}>
                Remove ❌
              </button>

              <button
                onClick={() => decreaseProductFromCart(item.id)}
                disabled={(item?.quantity || 0) <= 1}
              >
                ➖ Decrease
              </button>
            </div>
          </div>
        );
      })}

      {/* TOTAL (supports both backend keys) */}
      <h3>
        Total: ₦
        {Number(cart?.cart_total ?? cart?.total_price ?? 0).toFixed(2)}
      </h3>

      <CheckoutButton showGuestFormInline={false} />
    </div>
  );
};

export default Cart;