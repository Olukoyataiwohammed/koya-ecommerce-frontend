import React, { useEffect, useState } from "react";

const API_URL = "https://koya-e-commerce-backend-production.up.railway.app";

const Wishlist = () => {
  const [wishlist, setWishlist] = useState([]);

  // 🔐 Get token (adjust if you use another name)
  const token = localStorage.getItem("access");

  // 📥 Fetch wishlist
  const fetchWishlist = async () => {
    try {
      const res = await fetch(`${API_URL}/wishlist/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();
      setWishlist(data);
    } catch (err) {
      console.error("Error fetching wishlist:", err);
    }
  };

  useEffect(() => {
    fetchWishlist();
  }, []);

  // ❌ Remove item
  const removeItem = async (productId) => {
    try {
      await fetch(`${API_URL}/wishlist/remove/${productId}/`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // refresh list
      fetchWishlist();
    } catch (err) {
      console.error("Error removing item:", err);
    }
  };

  return (
    <div>
      <h2>❤️ My Wishlist</h2>

      {wishlist.length === 0 ? (
        <p>No items in wishlist</p>
      ) : (
        wishlist.map((item) => (
          <div key={item.id} style={{ marginBottom: "20px" }}>
            <h4>{item.product.name}</h4>
            <p>₦{item.product.price}</p>

            {item.product.image && (
              <img
                src={item.product.image}
                alt={item.product.name}
                width="100"
              />
            )}

            <br />

            <button onClick={() => removeItem(item.product.id)}>
              Remove ❌
            </button>
          </div>
        ))
      )}
    </div>
  );
};

export default Wishlist;