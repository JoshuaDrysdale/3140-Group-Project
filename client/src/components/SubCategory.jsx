import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import ProductCard from './ProductCard';
import ProductModal from './ProductModal';

export default function SubCategory({ onAddToCart }) {
  const { id } = useParams(); 
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null); // 1. Added error state
  const [selectedProduct, setSelectedProduct] = useState(null);

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

  const title = id.replaceAll("-", " ");

  if (loading) return <p className="page-state">Loading products for {title}...</p>;
  if (error) return <p className="page-state">{error}</p>; // 3. Display error
  
  // Optional: Handle empty state
  if (products.length === 0) return <p className="page-state">No products found in {title}.</p>;

  return (
      <div className="subcategory-container">
        <div className="subcategory-header">
          <p className="subcategory-kicker">Department</p>
          <h1 className="subcategory-title">{title}</h1>
          <span>{products.length} items available</span>
        </div>
        
        {/* Grid container to wrap your product cards */}
        <div className="products">
          {products.map((product) => (
            <ProductCard 
              key={product.id} 
              product={product} 
              onAddToCart={onAddToCart} 
              onViewProduct={setSelectedProduct}
            />
          ))}
        </div>

        <ProductModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
          onAddToCart={onAddToCart}
        />
      </div>
    );
}
