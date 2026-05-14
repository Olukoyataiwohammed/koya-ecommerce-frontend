import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { useCart } from "./CartContext";

const API_BASE_URL = "https://azeezolabode.pythonanywhere.com";

const SearchBox = () => {
  const location = useLocation();
  const [products, setProducts] = useState([]);
  const { addItemToCart } = useCart();

  const queryParams = new URLSearchParams(location.search);
  const query = queryParams.get("q");

  
  const getImageUrl = (image) => {
    if (!image) return "/placeholder.png";
    if (image.startsWith("http")) return image;
    return `${API_BASE_URL}${image}`;
  };

  useEffect(() => {
    if (!query) return;

    const fetchProducts = async () => {
      try {
        const res = await fetch(
          `${API_BASE_URL}/store/products/?search=${query}`
        );
        const data = await res.json();

        setProducts(data.results || data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchProducts();
  }, [query]);

  return (
    <div className="container">
      <h2>Search Results for "{query}"</h2>

      <div className="row">
        {products.length === 0 ? (
          <p>No product found</p>
        ) : (
          products.map((product) => (
            <div key={product.id} className="col-md-3">
              <div className="card">

                {/* ✅ FIXED IMAGE */}
                <img
                  className="card-img"
                  src={getImageUrl(product.image)}
                  alt={product.name}
                  style={{ height: "200px", objectFit: "cover" }}
                  onError={(e) => {
                    e.target.src = "/placeholder.png";
                  }}
                />

                <div className="card-body">
                  <h5 className="card-body-name">{product.name}</h5>
                  <p className="card-body-price">₦{product.price}</p>

                  <button
                    className="price w-100 text-white bg-black"
                    onClick={() => addItemToCart(product.id, 1)}
                  >
                    Add to Carts
                  </button>
                </div>

              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default SearchBox;