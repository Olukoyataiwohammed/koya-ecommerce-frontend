import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { useCart } from "./CartContext";

const SearchBox = () => {
  const location = useLocation();
  const [products, setProducts] = useState([]);
  const { addItemToCart } = useCart();

  const queryParams = new URLSearchParams(location.search);
  const query = queryParams.get("q");

  useEffect(() => {
    if (!query) return; 

    const fetchProducts = async () => {
      try {
        const res = await fetch(`https://azeezolabode.pythonanywhere.com/store/products/?search=${query}`);
        const data = await res.json();
        setProducts(data);
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
                <img className="card-img"
                  src={`${process.env.REACT_APP_API_URL}${product.image}`}
                  alt={product.name}
                  style={{ height: "200px", objectFit: "cover" }}
                />
                <div className="card-body">
                  <h5 className="card-body-name">{product.name}</h5>
                  <p className="card-body-price">₦{product.price}</p>
                  <button className="price  w-100 text-white bg-black" onClick={() => addItemToCart(product.id, 1)}>
                    Add to Cart
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