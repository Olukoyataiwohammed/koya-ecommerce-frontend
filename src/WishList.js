import React, { useEffect, useState, useCallback } from "react";

const API_URL = "https://azeezolabode.pythonanywhere.com";

const Wishlist = () => {
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const getToken = () => localStorage.getItem("access");

  const fetchWishlist = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const token = getToken();

      if (!token) {
        setWishlist([]);
        setLoading(false);
        return;
      }

      const res = await fetch(`${API_URL}/wishlist/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.status === 401) {
        localStorage.removeItem("access");
        setWishlist([]);
        setError("Session expired. Please login again.");
        setLoading(false);
        return;
      }

      if (!res.ok) {
        setWishlist([]);
        setError("Failed to load wishlist.");
        setLoading(false);
        return;
      }

      const data = await res.json();

      const list =
        Array.isArray(data)
          ? data
          : data?.results || data?.data || [];

      setWishlist(Array.isArray(list) ? list : []);
    } catch (err) {
      console.error(err);
      setWishlist([]);
      setError("Network error. Try again.");
    } finally {
      setLoading(false);
    }
  }, []); // keep empty is OK because getToken reads live localStorage

  useEffect(() => {
    fetchWishlist();
  }, [fetchWishlist]);

  const removeItem = async (productId) => {
    try {
      const token = getToken();
      if (!token) return;

      await fetch(`${API_URL}/wishlist/remove/${productId}/`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      fetchWishlist();
    } catch (err) {
      console.error("Remove error:", err);
    }
  };

  if (loading) return <p>Loading wishlist...</p>;

  return (
    <div>
      <h2>❤️ My Wishlist</h2>

      {error && <p style={{ color: "red" }}>{error}</p>}

      {!Array.isArray(wishlist) || wishlist.length === 0 ? (
        <p>No items in wishlist</p>
      ) : (
        wishlist.map((item) => (
          <div key={item?.id} style={{ marginBottom: 20 }}>
            <h4>{item?.product?.name || "Unnamed product"}</h4>
            <p>₦{item?.product?.price || "0"}</p>

            {item?.product?.image && (
              <img
                src={`${API_URL}${item.product.image}`}
                alt={item?.product?.name || "product"}
                width="100"
                onError={(e) => (e.target.style.display = "none")}
              />
            )}

            <br />

            <button onClick={() => removeItem(item?.product?.id)}>
              Remove ❌
            </button>
          </div>
        ))
      )}
    </div>
  );
};

export default Wishlist;