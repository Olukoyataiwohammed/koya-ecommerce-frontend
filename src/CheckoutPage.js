import { useEffect, useState } from "react";
import { useAuth } from "./AuthContext";
import CheckoutForm from "./CheckoutForm";
import OrderButton from "./OrderButton";

export default function CheckoutPage() {
  const { token } = useAuth();

  const [addresses, setAddresses] = useState([]);
  const [useNewAddress, setUseNewAddress] = useState(false);

  const [form, setForm] = useState({
    address_id: "",
    payment_method: "CARD",
  });

  const [newAddress, setNewAddress] = useState({
    full_name: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    country: "",
    postal_code: "",
    is_default: false,
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) {
      setLoading(false);
      return;
    }

    fetch(`${process.env.REACT_APP_API_URL}/auth/addresses/`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        const safeData = Array.isArray(data) ? data : [];
        setAddresses(safeData);
        if (safeData.length === 0) setUseNewAddress(true);
        setLoading(false);
      })
      .catch(() => {
        setAddresses([]);
        setUseNewAddress(true);
        setLoading(false);
      });
  }, [token]);

  if (loading) return <p>Loading checkout...</p>;

  return (
    <div>
      <h2>Checkout</h2>

      <CheckoutForm
        addresses={addresses}
        form={form}
        setForm={setForm}
        useNewAddress={useNewAddress}
        setUseNewAddress={setUseNewAddress}
        newAddress={newAddress}
        setNewAddress={setNewAddress}
      />

      <OrderButton
        form={form}
        newAddress={newAddress}
        useNewAddress={useNewAddress}
        token={token}
      />
    </div>
  );
}