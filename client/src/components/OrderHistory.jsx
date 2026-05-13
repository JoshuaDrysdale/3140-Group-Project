import { useState, useEffect } from 'react';
import './OrderHistory.css';
import './Cart'
import ReviewSection from './ReviewSection';

export default function OrderHistory({ user, onAddToCart }) {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const handleReorder = (orderItems) => {
    // orderItems is the JSON array of products from your DB
    orderItems.forEach(item => {
      onAddToCart(item);
    });
    alert("Items from this order added to your cart!");
  };
  useEffect(() => {
    // 🛑 THE GUARD: If user is null or id is 'undefined', stop here!
    if (!user || !user.id || user.id === 'undefined') {
      console.log("Waiting for user data...");
      return; 
    }

    setLoading(true);
    fetch(`/api/orders/user/${user.id}`)
      .then((res) => {
        if (!res.ok) throw new Error('Server error');
        return res.json();
      })
      .then((data) => {
        setOrders(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Fetch error:", err);
        setOrders([]); 
        setLoading(false);
      });
  }, [user]); // This ensures it runs again once the user is founds

  if (loading) return <div className="history-loader">Loading your orders...</div>;

return (
    <div className="history-page">
      <h1>Order History</h1>
      {orders.length === 0 ? (
        <div className="no-orders">
          <p>You haven't placed any orders yet.</p>
          <button onClick={() => window.location.href='/store'}>Start Shopping</button>
        </div>
      ) : (
        <div className="orders-list">
          {orders.map((order) => (
            <div key={order.id} className="order-card">
              <div className="order-header">
                <div>
                  <span className="order-label">Order placed</span>
                  <p className="order-value">{new Date(order.created_at).toLocaleDateString()}</p>
                </div>
                <div>
                  <span className="order-label">Total</span>
                  <p className="order-value">${Number(order.total_amount).toFixed(2)}</p>
                </div>
                <div>
                  <span className="order-label">Status</span>
                  <span className={`status-badge ${order.status.toLowerCase()}`}>
                    {order.status}
                  </span>
                </div>
                <div className="order-id-section">
                  <span className="order-label">Order #</span>
                  <p className="order-value">{order.id.slice(0, 8).toUpperCase()}</p>
                </div>

                {/* THE REORDER BUTTON - Moved here to cover the whole order */}
                <button 
                  className="reorder-btn" 
                  onClick={() => handleReorder(order.items)}
                >
                  🔄 Reorder
                </button>
              </div>
              
              <div className="order-items">
                {order.items && order.items.map((item, index) => (
                  <div key={index} className="history-item-container">
                    <div className="history-item">
                       <span className="item-details">{item.name} (x{item.qty})</span>
                       <span className="item-price">${(item.price * item.qty).toFixed(2)}</span>
                    </div>

                    {/* Keep reviews attached to each specific item */}
                    <ReviewSection
                        product={{
                          id: item.id || item.product_id,
                          name: item.name || item.product_name
                        }}
                        canReview={true}
                    />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}