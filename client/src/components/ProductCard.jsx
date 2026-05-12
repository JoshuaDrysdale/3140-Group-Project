import React from "react";
import "./ProductCard.css";

export default function ProductCard({ product, onAddToCart, onViewProduct }) {
  const imageSrc = product.image_url;
  const ratingSeed = Number(product.id) || product.name.length;
  const rating = (4.3 + (ratingSeed % 6) / 10).toFixed(1);

  return (
    <div className="product-card" onClick={() => onViewProduct(product)}>
      <div className="product-image-container">
        {imageSrc ? (
          <img src={imageSrc} alt={product.name} className="product-image" />
        ) : (
          <div className="product-image-fallback">
            <span className="fallback-icon">📦</span>
          </div>
        )}
      </div>

      <div className="product-info">
        <h2 className="product-title">{product.name}</h2>
        <p className="product-rating">{rating} ★ <span>In stock</span></p>
        <p className="product-price">${Number(product.price).toFixed(2)}</p>
        <p className="product-shipping">Click for product details</p>

        <button
          className="add-to-cart-btn"
          onClick={(e) => {
            e.stopPropagation();
            onAddToCart(product);
          }}
        >
          Add to Cart
        </button>
      </div>
    </div>
  );
}