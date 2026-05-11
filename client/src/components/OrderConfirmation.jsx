import { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './OrderConfirmation.css';

export default function OrderConfirmation({ user }) {
  const navigate = useNavigate();
  const hasSaved = useRef(false);
  const [displayData, setDisplayData] = useState(null);

  useEffect(() => {
    // 1. Try to find the cart in localStorage
    const savedCartRaw = localStorage.getItem('temp_cart');
    
    if (!savedCartRaw || !user || hasSaved.current) return;

    const savedCart = JSON.parse(savedCartRaw);
    const totalAmount = savedCart.reduce((sum, item) => sum + (item.price * item.qty), 0);

    // Set local state so the UI shows the right price
    setDisplayData({ items: savedCart, total: totalAmount });

    // 2. LOCK and Save to DB
    hasSaved.current = true;

    const saveToDB = async () => {
      try {
        const response = await fetch('/api/orders', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userId: user.id,
            sessionId: `order_${Date.now()}`,
            total: totalAmount,
            items: savedCart
          }),
        });

        if (response.ok) {
          console.log("✅ Order saved successfully!");
          // 3. ONLY delete the temp_cart after a successful DB write
          localStorage.removeItem('temp_cart');
        }
      } catch (err) {
        console.error("Database save error:", err);
      }
    };

    saveToDB();
  }, [user]);

  if (!displayData && !hasSaved.current) {
    return <div className="order-confirmation-container"><h2>Loading order...</h2></div>;
  }

  return (
    <div className="order-confirmation-overlay">
      <div className="order-confirmation-container">
        <h1>Order Confirmed!</h1>
        <div className="confirmation-details">
          <div className="detail-item">
            <span className="detail-label">Amount Paid:</span>
            <span className="detail-value">${(displayData?.total || 0).toFixed(2)}</span>
          </div>
        </div>
        <p>Your order for {displayData?.items?.length} items is processing.</p>
        <button className="continue-shopping-btn" onClick={() => navigate('/store')}>
          Continue Shopping
        </button>
      </div>
    </div>
  );
}