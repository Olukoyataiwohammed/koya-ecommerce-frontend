import React from "react";
import { useCart } from "./CartContext";
import CheckoutButton from "./CheckoutButton";

const Cart = () => {
  const { cart, loading, removeFromCart, decreaseProductFromCart } = useCart();

  console.log("CART STATE IN UI:", cart);

  // ⏳ Loading state
  if (loading) {
    return <p>Loading cart...</p>;
  }

  // 🧺 Empty cart safe check
  if (!cart?.items || cart.items.length === 0) {
    return <p>🛒 Your cart is empty</p>;
  }

  return (
    <div>
      <h2>🛍️ KOYA Cart</h2>

      {cart.items.map((item) => {
        const product = item?.product; // safer reference

        return (
          <div
            key={item?.id}
            style={{
              border: "1px solid #ddd",
              padding: "10px",
              marginBottom: "10px",
            }}
          >
            {/* PRODUCT NAME (SAFE) */}
            <h4>
              {product?.name || "Product not available"}
            </h4>

            {/* QUANTITY */}
            <p>Qty: {item?.quantity || 1}</p>

            {/* IMAGE SAFE */}
            {product?.image ? (
              <img
                src={`https://azeezolabode.pythonanywhere.com${product.image}`}
                alt={product?.name || "product"}
                width="100"
              />
            ) : (
              <p>No image</p>
            )}

            {/* PRICE SAFE */}
            <p>
              ₦{Number(product?.price || 0).toFixed(2)}
            </p>

            {/* ACTION BUTTONS */}
            <div style={{ display: "flex", gap: "10px" }}>
              <button onClick={() => removeFromCart(item.id)}>
                Remove ❌
              </button>

              <button onClick={() => decreaseProductFromCart(item.id)}>
                ➖ Decrease
              </button>
            </div>
          </div>
        );
      })}

      {/* TOTAL PRICE SAFE */}
      <h3>
        Total: ₦{Number(cart?.total_price || 0).toFixed(2)}
      </h3>

      <CheckoutButton showGuestFormInline={false} />
    </div>
  );
};

export default Cart;