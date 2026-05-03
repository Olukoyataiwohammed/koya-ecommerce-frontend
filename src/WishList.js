import React, { useEffect, useState, useCallback } from "react";
import { useAuth } from "./AuthContext";

const API_URL = "https://azeezolabode.pythonanywhere.com";

const Wishlist = () => {
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const { accessToken, refreshAccessToken, logout } = useAuth();

  const fetchWishlist = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      if (!accessToken) {
        setWishlist([]);
        setLoading(false);
        return;
      }

      let res = await fetch(`${API_URL}/wishlist/`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      // 🔥 HANDLE TOKEN EXPIRY PROPERLY
      if (res.status === 401) {
        const newToken = await refreshAccessToken();

        if (!newToken) {
          logout();
          return;
        }

        // retry request
        res = await fetch(`${API_URL}/wishlist/`, {
          headers: {
            Authorization: `Bearer ${newToken}`,
          },
        });
      }

      if (!res.ok) {
        setWishlist([]);
        setError("Failed to load wishlist.");
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
      setError("Network error. Try again.");
    } finally {
      setLoading(false);
    }
  }, [accessToken, refreshAccessToken, logout]);

  useEffect(() => {
    fetchWishlist();
  }, [fetchWishlist]);

  const removeItem = async (productId) => {
    try {
      if (!accessToken) return;

      let res = await fetch(
        `${API_URL}/wishlist/remove/${productId}/`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      // 🔁 retry if expired
      if (res.status === 401) {
        const newToken = await refreshAccessToken();
        if (!newToken) return logout();

        await fetch(
          `${API_URL}/wishlist/remove/${productId}/`,
          {
            method: "DELETE",
            headers: {
              Authorization: `Bearer ${newToken}`,
            },
          }
        );
      }

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