import ReviewSection from "./ReviewSection";
import "./ProductCard.css";

export default function ProductModal({ product, onClose, onAddToCart }) {
  if (!product) return null;

  return (
    <div className="product-modal-overlay" onClick={onClose}>
      <div className="product-modal" onClick={(e) => e.stopPropagation()}>
        <button className="product-modal-close" onClick={onClose}>✕</button>

        <div className="product-modal-content">
          <div className="product-modal-image-wrap">
            {product.image_url ? (
              <img src={product.image_url} alt={product.name} className="product-modal-image" />
            ) : (
              <div className="product-image-fallback">
                <span className="fallback-icon">📦</span>
              </div>
            )}
          </div>

          <div className="product-modal-info">
            <h2>{product.name}</h2>
            <p className="product-price">${Number(product.price).toFixed(2)}</p>
            <p className="product-shipping">Free pickup available</p>
            <p className="product-modal-description">
              View product details, add this item to your cart, and leave a review below.
            </p>

            <button className="add-to-cart-btn" onClick={() => onAddToCart(product)}>
              Add to Cart
            </button>

            <ReviewSection product={product} canReview={false} />
          </div>
        </div>
      </div>
    </div>
  );
}