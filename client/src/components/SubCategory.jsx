import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import ProductCard from './ProductCard';

export default function SubCategory({ onAddToCart }) {
  const { id } = useParams(); 
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null); // 1. Added error state

  useEffect(() => {
    setLoading(true);
    setError(null); // Reset error when ID changes

    fetch(`/api/products/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error("Could not fetch products");
        return res.json();
      })
      .then((data) => {
        setProducts(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch products", err);
        setError("Failed to load products. Please try again later."); // 2. Set error
        setLoading(false);
      });
  }, [id]);

  if (loading) return <p>Loading products for {id}...</p>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>; // 3. Display error
  
  // Optional: Handle empty state
  if (products.length === 0) return <p>No products found in {id}.</p>;

  return (
      <div className="subcategory-container">
        <h1 className="subcategory-title">Products in {id}</h1>
        
        {/* Grid container to wrap your product cards */}
        <div className="products">
          {products.map((product) => (
            <ProductCard 
              key={product.id} 
              product={product} 
              onAddToCart={onAddToCart} 
            />
          ))}
        </div>
      </div>
    );
}