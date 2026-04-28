import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { fetchProducts, API_BASE_URL } from "./StoreApi";
import { useCart } from "./CartContext";
import { useAuth } from "./AuthContext";

const ProductDetails = () => {
  const { slug } = useParams();
  const { addItemToCart } = useCart();
  const { token } = useAuth();

  const [product, setProduct] = useState(null);
  const [loadingWishlist, setLoadingWishlist] = useState(false);

  useEffect(() => {
    const loadProduct = async () => {
      const data = await fetchProducts();
      const allProducts = data.results || data;

      const found = allProducts.find(
        (p) => p.slug === slug || p.id.toString() === slug
      );

      setProduct(found);
    };

    loadProduct();
  }, [slug]);

  // ❤️ Add to wishlist
  const addToWishlist = async () => {
    if (!token) {
      alert("Please login to add to wishlist");
      return;
    }

    try {
      setLoadingWishlist(true);

      const res = await fetch(`${API_BASE_URL}/wishlist/add/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ product_id: product.id }),
      });

      let data = {};
      try {
        data = await res.json();
      } catch {}

      if (!res.ok) {
        alert(data.detail || "Already in wishlist");
      } else {
        alert("Added to wishlist ❤️");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingWishlist(false);
    }
  };

  if (!product) return <p>Loading product...</p>;

  return (
    <div style={{ padding: "20px" }}>
      <h2>{product.name}</h2>

      {/* 🖼 Image */}
      <img
        src={
          product.image
            ? `${API_BASE_URL}${product.image}`
            : "/placeholder.png"
        }
        alt={product.name}
        style={{ width: "300px", height: "300px" }}
      />

      <p>₦{product.price}</p>

      {/* 🛒 Add to Cart */}
      <button onClick={() => addItemToCart(product.id, 1)}>
        Add to Cart
      </button>

      {/* ❤️ Wishlist */}
      <button onClick={addToWishlist} disabled={loadingWishlist}>
        {loadingWishlist ? "Adding..." : "❤️ "}
      </button>
    </div>
  );
};

export default ProductDetails;