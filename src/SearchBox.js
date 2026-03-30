import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

const SearchBox = () => {
  const location = useLocation();
  const [products, setProducts] = useState([]);

  const queryParams = new URLSearchParams(location.search);
  const query = queryParams.get("q");

  useEffect(() => {
    if (!query) return;

    const fetchProducts = async () => {
      try {
        const res = await fetch(`${process.env.REACT_APP_API_URL}/store/products/?search=${query}`);
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
                <img
                  src={`${process.env.REACT_APP_API_URL}${product.image}`}
                  alt={product.name}
                  style={{ height: "200px", objectFit: "cover" }}
                />
                <div className="card-body">
                  <h5>{product.name}</h5>
                  <p>₦{product.price}</p>
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