import { useCart } from "./CartContext";

import CheckoutButton from "./CheckoutButton";




const Cart = () => {
  const { cart, loading, removeFromCart, decreaseProductFromCart } = useCart();

  console.log("CART STATE IN UI:", cart);
  console.log("cart.total_price type:", typeof cart.cart_total, cart.cart_total);


  if (loading) return <p>Loading...</p>;
  if (!cart || !cart.items || cart.items.length === 0){
      return <p>KOYA Cart is empty</p>;
  } 

  return (
    <div>
    <h2>Restaurant Cart</h2>
    {cart.items.map((cartItem) => (
      <div key={cartItem.id}>
        <p>{cartItem.product.name}</p>
        <p>Qty: {cartItem.quantity}</p>
        <img
          src={`https://azeezolabode.pythonanywhere.com${cartItem.product?.image}`}
          alt={cartItem.product.name}
          width={100}
        />
        <p>₦{Number(cartItem.product.price).toFixed(2)}</p>
        <div className="d-flex gap-3">
          <button onClick={() => removeFromCart(cartItem.id)}>Remove</button>
          <button onClick={() => decreaseProductFromCart(cartItem.id)}>➖</button>
        </div>
      </div>
    ))}
    <h3>Total: ₦{Number(cart.cart_total || 0).toFixed(2)}</h3>

    {/* Only show guest form when checkout is clicked */}
    <CheckoutButton showGuestFormInline={false} />
  </div>

  );
};

export default Cart;
