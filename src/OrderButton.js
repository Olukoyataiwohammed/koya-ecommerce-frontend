import { useCart } from "./CartContext";
import { useNavigate } from "react-router-dom";
import usePaystack from "./UsePayStack";
import { useState } from "react";

export default function OrderButton({ form, newAddress, useNewAddress, token }) {
  usePaystack();

  const { cart, clearCart } = useCart();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handlePlaceOrder = async () => {
    if (!cart || !cart.items || cart.items.length === 0) {
      alert("No items in cart");
      return;
    }

    if (!useNewAddress && !form.address_id) {
      alert("Please select a saved address");
      return;
    }

    if (useNewAddress && (!newAddress.address || newAddress.address.trim() === "")) {
      alert("Please fill in your delivery address");
      return;
    }

    // ✅ FIX: Ensure correct structure sent to backend
    const formattedItems = cart.items.map((item) => ({
      product: item.product.id,   // 👈 VERY IMPORTANT
      quantity: item.quantity,
    }));

    const payload = useNewAddress
      ? {
          payment_method: form.payment_method.toLowerCase(),
          full_name: newAddress.full_name,
          phone: newAddress.phone,
          address: newAddress.address,
          city: newAddress.city,
          state: newAddress.state,
          country: newAddress.country,
          postal_code: newAddress.postal_code,
          items: formattedItems,
        }
      : {
          payment_method: form.payment_method.toLowerCase(),
          address_id: Number(form.address_id),
          items: formattedItems,
        };

    try {
      setLoading(true);

      // -----------------------------
      // STEP 1: CREATE ORDER
      // -----------------------------
      const res = await fetch("https://azeezolabode.pythonanywhere.com/order/create/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token ? `Bearer ${token}` : "",
        },
        credentials: "include",
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.error || "Order failed");
        return;
      }

      const order = data.order;

      if (!order || !order.id) {
        alert("Order created but no ID returned");
        return;
      }

      // -----------------------------
      // NON-CARD PAYMENT
      // -----------------------------
      if (form.payment_method.toLowerCase() !== "card") {
        clearCart();
        alert("Order placed successfully!");
        navigate("/orders", { state: { orderId: order.id } });
        return;
      }

      // -----------------------------
      // STEP 2: CREATE PAYMENT
      // -----------------------------
      const paymentRes = await fetch("https://azeezolabode.pythonanywhere.com/order/payment/create/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ order: order.id }),
      });

      const paymentData = await paymentRes.json();

      if (!paymentRes.ok) {
        alert(paymentData.error || "Payment initialization failed");
        return;
      }

      const { reference, amount, email } = paymentData;

      // -----------------------------
      // STEP 3: PAYSTACK
      // -----------------------------
      if (!window.PaystackPop) {
        alert("Payment service not loaded");
        return;
      }

      const handler = window.PaystackPop.setup({
        key: "pk_test_0c95805407498620ce8b9d51b011b604570938e4",
        email: email,
        amount: Number(amount),
        currency: "NGN",
        reference: reference,

        callback: function (response) {
          verifyPayment(response.reference, order.id);
        },

        onClose: function () {
          alert("Payment cancelled");
        },
      });

      handler.openIframe();

    } catch (err) {
      console.error(err);
      alert("Network error");
    } finally {
      setLoading(false);
    }
  };

  // -----------------------------
  // VERIFY PAYMENT
  // -----------------------------
  async function verifyPayment(reference, orderId) {
    try {
      const verifyRes = await fetch("https://azeezolabode.pythonanywhere.com/order/payment/verify/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ reference }),
      });

      const verifyData = await verifyRes.json();

      if (!verifyRes.ok) {
        alert(verifyData.error || "Payment verification failed");
        return;
      }

      clearCart();
      alert("Payment successful!");
      navigate("/orders", { state: { orderId } });

    } catch (err) {
      console.error(err);
      alert("Verification error");
    }
  }

  return (
    <button
      type="button"
      onClick={handlePlaceOrder}
      disabled={loading}
      style={{ marginTop: "20px" }}
    >
      {loading ? "Processing..." : "Place Order"}
    </button>
  );
}