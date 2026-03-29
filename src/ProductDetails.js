import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { fetchProducts  } from "./StoreApi";

import React from 'react'

const ProductDetails = () => {
    const { slug } = useParams();
    const [product, setProduct] = useState(null);

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

  if (!product) return <p>Product not found</p>;
  return (
    <div>
        <h2>{product.name}</h2>
        
        <p>₦{product.price}</p>
        <button>Add to Cart</button>
    </div>
  )
}

export default ProductDetails
