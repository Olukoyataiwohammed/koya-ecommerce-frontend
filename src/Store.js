import React, { useEffect, useState } from "react";
import {
  fetchProducts,
  fetchCategories,
  fetchBrands,
  API_BASE_URL,
} from "./StoreApi";

import { useCart } from "./CartContext";
import { useAuth } from "./AuthContext";
import { useParams } from "react-router-dom";
import "./Commerce.css";

const Store = () => {
  const { addItemToCart, fetchCart } = useCart();
  const { accessToken } = useAuth(); // ✅ FIXED (was token)
  const { slug } = useParams();

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [loadingWishlist, setLoadingWishlist] = useState(null);

  // ❤️ ADD TO WISHLIST
  const addToWishlist = async (productId) => {
    if (!accessToken) {
      alert("Please login to add to wishlist");
      return;
    }

    try {
      setLoadingWishlist(productId);

      const res = await fetch(`${API_BASE_URL}/wishlist/add/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`, // ✅ FIXED
        },
        body: JSON.stringify({ product_id: productId }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        console.warn(data.detail || "Already in wishlist");
      } else {
        console.log("Added to wishlist ❤️");
      }
    } catch (err) {
      console.error("Wishlist error:", err);
    } finally {
      setLoadingWishlist(null);
    }
  };

  useEffect(() => {
    const loadStoreData = async () => {
      try {
        setLoading(true);

        const response = slug
          ? await fetch(
              `${API_BASE_URL}/store/products/category/${slug}/`
            )
          : null;

        const productsData = slug
          ? response.ok
            ? await response.json()
            : []
          : await fetchProducts(accessToken || null); // ✅ FIXED

        const categoriesData = await fetchCategories();
        const brandsData = await fetchBrands();

        setProducts(productsData.results || productsData);
        setCategories(categoriesData.results || categoriesData);
        setBrands(brandsData.results || brandsData);
      } catch (err) {
        console.error("STORE ERROR:", err);
        setError("Failed to load store data");
      } finally {
        setLoading(false);
      }
    };

    loadStoreData();
  }, [slug, accessToken]);

  if (loading) return <p>Loading products...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="container">
      <h2>Store</h2>

      <div className="filters">
        <select>
          <option value="">All Categories</option>
          {categories.map((cat) => (
            <option key={cat.id}>{cat.name}</option>
          ))}
        </select>

        <select>
          <option value="">All Brands</option>
          {brands.map((brand) => (
            <option key={brand.id}>{brand.name}</option>
          ))}
        </select>
      </div>

      <div className="product-grid">
        {products.length === 0 && <p>No products available</p>}

        {products.map((product) => (
          <div
            key={product.id}
            className="product-card bg-dark text-white m-3 p-3"
            style={{ width: "270px", height: "370px" }}
          >
            <img
              className="product-image bg-dark p-3 w-100"
              style={{ width: "200px", height: "200px" }}
              src={
                product.image
                  ? `${API_BASE_URL}${product.image}`
                  : "/placeholder.png"
              }
              alt={product.name}
            />

            <h4 style={{ textAlign: "left" }}>{product.name}</h4>
            <p style={{ textAlign: "left" }}>₦{product.price}</p>

            {/* 🛒 ADD TO CART (FIXED) */}
            <button
              className="price w-100 text-white bg-black"
              onClick={async () => {
                console.log("Adding to cart:", product.id);

                await addItemToCart(product.id, 1);

                // 🔥 ensure UI updates instantly
                fetchCart();
              }}
            >
              Add to Cart
            </button>

            {/* ❤️ WISHLIST */}
            <button
              className="w-100 mt-2"
              onClick={() => addToWishlist(product.id)}
              disabled={loadingWishlist === product.id}
            >
              {loadingWishlist === product.id ? "Adding..." : "❤️ Wishlist"}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Store;