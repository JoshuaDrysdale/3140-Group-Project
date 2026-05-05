import React from 'react';
import './ProductCard.css';

export default function ProductCard({ product, onAddToCart }) {
  return (
    <div className="product-card">
      <div className="product-image-container">
        {product.image ? (
          <img 
            src={`/images/${product.image}`} 
            alt={product.name} 
            className="product-image"
          />
        ) : (
          /* Elegant CSS-only fallback placeholder */
          <div className="product-image-fallback">
            <span className="fallback-icon">📦</span>
          </div>
        )}
      </div>
      <div className="product-info">
        <h2 className="product-title">{product.name}</h2>
        <p className="product-price">${Number(product.price).toFixed(2)}</p>
        <button 
          className="add-to-cart-btn"
          onClick={() => onAddToCart(product)}
        >
          Add to Cart 🛒
        </button>
      </div>
    </div>
  );
}