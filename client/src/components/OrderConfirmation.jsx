import { useNavigate } from 'react-router-dom';
import './OrderConfirmation.css';

export default function OrderConfirmation({ user, onClose }) {
  const navigate = useNavigate();
  const orderId = Math.floor(Math.random() * 1000000);

  const handleContinueShopping = () => {
    navigate('/store');
  };

  return (
    <div className="order-confirmation-overlay">
      <div className="order-confirmation-container">
        <div className="success-checkmark">
          <svg
            viewBox="0 0 100 100"
            className="checkmark-circle"
          >
            <circle cx="50" cy="50" r="45" fill="none" stroke="#4CAF50" strokeWidth="3" />
            <path
              d="M 30 50 L 45 65 L 70 35"
              fill="none"
              stroke="#4CAF50"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>

        <h1>Order Confirmed!</h1>
        <p className="confirmation-subtitle">
          Thank you for your purchase, {user?.name}!
        </p>

        <div className="confirmation-details">
          <div className="detail-item">
            <span className="detail-label">Order ID:</span>
            <span className="detail-value">#{orderId}</span>
          </div>
          <div className="detail-item">
            <span className="detail-label">Status:</span>
            <span className="detail-value">Processing</span>
          </div>
          <div className="detail-item">
            <span className="detail-label">Email Confirmation:</span>
            <span className="detail-value">{user?.email}</span>
          </div>
        </div>

        <div className="confirmation-message">
          <p>
            Your order has been successfully placed. You will receive an email confirmation shortly.
          </p>
          <p>
            Your order will be processed and shipped within 2-3 business days.
          </p>
        </div>

        <button className="continue-shopping-btn" onClick={handleContinueShopping}>
          Continue Shopping
        </button>
      </div>
    </div>
  );
}
