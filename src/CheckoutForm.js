import { useEffect } from "react";
export default function CheckoutForm({
  addresses = [],
  form,
  setForm,
  useNewAddress,
  setUseNewAddress,
  newAddress,
  setNewAddress,
}) {

  useEffect(() => {
    console.log("ADDRESSES:", addresses);
console.log("useNewAddress:", useNewAddress);
    if (!useNewAddress && addresses.length > 0 && !form.address_id) {
      setForm((prev) => ({ ...prev, address_id: addresses[0].id }));
    }
  }, [addresses, useNewAddress, form.address_id, setForm]);
  return (
    <div>
      <h3>Delivery Address</h3>

      {/* Saved addresses */}
      {addresses.length > 0 && !useNewAddress && (
        <>

          <select
            value={form.address_id || ""}
            onChange={(e) =>
            setForm((prev) => ({
              ...prev,
              address_id: Number(e.target.value),
              }))
            }
          >
          
            <option value="">Select Address</option>
            {addresses.map((addr) => (
              <option key={addr.id} value={addr.id}>
                {addr.full_name} - {addr.city}, {addr.state}
              </option>
            ))}
          </select>

          <br />
          <button
            style={{ marginTop: "10px" }}
            onClick={() => setUseNewAddress(true)}
          >
            Enter New Address
          </button>
        </>
      )}

      {/* New address form */}
      {(useNewAddress || addresses.length === 0) && (
        <div style={{ marginTop: "15px" }}>
          
          <input
            placeholder="Full Name"
            value={newAddress.full_name || ""}
            onChange={(e) => {
              setNewAddress((prev) => ({
                ...prev,
                full_name: e.target.value,
              }));
              setUseNewAddress(true);
            }}
          />

          <input
            placeholder="Phone"
            value={newAddress.phone || ""}
            onChange={(e) => {
              setNewAddress((prev) => ({
                ...prev,
                phone: e.target.value,
              }));
              setUseNewAddress(true);
            }}
          />

          <input
            placeholder="Address Line"
            value={newAddress.address || ""}
            onChange={(e) => {
              setNewAddress((prev) => ({
                ...prev,
                address: e.target.value,
              }));
              setUseNewAddress(true);
            }}
          />

          <input
            placeholder="City"
            value={newAddress.city || ""}
            onChange={(e) => {
              setNewAddress((prev) => ({
                ...prev,
                city: e.target.value,
              }));
              setUseNewAddress(true);
            }}
          />

          <input
            placeholder="State"
            value={newAddress.state || ""}
            onChange={(e) => {
              setNewAddress((prev) => ({
                ...prev,
                state: e.target.value,
              }));
              setUseNewAddress(true);
            }}
          />

          <input
            placeholder="Country"
            value={newAddress.country || ""}
            onChange={(e) => {
              setNewAddress((prev) => ({
                ...prev,
                country: e.target.value,
              }));
              setUseNewAddress(true);
            }}
          />

          <input
            placeholder="Postal Code"
            value={newAddress.postal_code || ""}
            onChange={(e) => {
              setNewAddress((prev) => ({
                ...prev,
                postal_code: e.target.value,
              }));
              setUseNewAddress(true);
            }}
          />

          <label style={{ display: "block", marginTop: "10px" }}>
            <input
              type="checkbox"
              checked={newAddress.is_default || false}
              onChange={(e) => {
                setNewAddress((prev) => ({
                  ...prev,
                  is_default: e.target.checked,
                }));
                setUseNewAddress(true);
              }}
            />
            Set as default address
          </label>

          {addresses.length > 0 && (
            <button
              style={{ marginTop: "10px" }}
              onClick={() => setUseNewAddress(false)}
            >
              Use Saved Address
            </button>
          )}
        </div>
      )}

      {/* Payment method */}
      <h3 style={{ marginTop: "25px" }}>Payment Method</h3>
      <select
        value={form.payment_method || "CARD"}
        onChange={(e) =>
          setForm((prev) => ({
            ...prev,
            payment_method: e.target.value,
          }))
        }
      >
        <option value="CARD">Card</option>
        <option value="CASH">Cash on Delivery</option>
        <option value="BANK">Bank Transfer</option>
      </select>
    </div>
  );
}