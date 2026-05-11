import { useState, useEffect } from 'react';
import './OrderHistory.css';

export default function OrderHistory({ user }) {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

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
              </div>
              
              <div className="order-items">
                {/* We saved items as JSONB, so we can map through them here */}
                {order.items && order.items.map((item, index) => (
                  <div key={index} className="history-item">
                    <span>{item.name} (x{item.qty})</span>
                    <span>${(item.price * item.qty).toFixed(2)}</span>
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