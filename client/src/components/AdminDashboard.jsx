import './AdminDashboard.css';
import { useState, useEffect } from 'react';

function AdminOrdersView() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const handleStatusChange = async (orderId, newStatus) => {
  try {
    const response = await fetch(`/api/admin/orders/${orderId}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: newStatus }),
    });

    if (response.ok) {
      setOrders(prevOrders => 
        prevOrders.map(order => 
          order.id === orderId ? { ...order, status: newStatus } : order
        )
      );
      console.log(`Order ${orderId} updated to ${newStatus}`);
    }
  } catch (err) {
    console.error("Network error updating status:", err);
  }
};

  useEffect(() => {
    fetch('/api/admin/orders')
      .then((res) => res.json())
      .then((data) => {
        setOrders(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching admin orders:", err);
        setLoading(false);
      });
  }, []);

  if (loading) return <p>Fetching orders from database...</p>;

  return (
    <div className="view-card">
      <h2>All Customer Orders</h2>
      {orders.length === 0 ? (
        <p>No orders found in the system.</p>
      ) : (
        <table className="admin-orders-table">
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Customer</th>
              <th>Email</th>
              <th>Total</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id}>
                <td>#{order.id.toString().slice(0, 8)}</td>
                {/* Notice the .users check—this comes from our SQL Join! */}
                <td>{order.users?.name || 'Guest'}</td>
                <td>{order.users?.email || 'N/A'}</td>
                <td>${Number(order.total_amount).toFixed(2)}</td>
                <td>
                <select 
                    className="status-select"
                    value={order.status} 
                    onChange={(e) => handleStatusChange(order.id, e.target.value)}
                >
                    <option value="Processing">Processing</option>
                    <option value="Shipped">Shipped</option>
                    <option value="Delivered">Delivered</option>
                    <option value="Cancelled">Cancelled</option>
                </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

function AdminProductsView() {
  return <div className="view-card"><h2>Products</h2><p>Manage your inventory here.</p></div>;
}

function AdminUsersView() {
  return <div className="view-card"><h2>Users</h2><p>View registered accounts.</p></div>;
}

export default function AdminDashboard({ user }) {
  const [activeTab, setActiveTab] = useState('orders');

  return (
    <div className="admin-container">
      <header className="admin-header">
        <h1>Admin Control Center</h1>
        <p>Welcome, <strong>{user?.name}</strong></p>
      </header>

      <div className="admin-layout">
        <aside className="admin-sidebar">
          <button 
            className={activeTab === 'orders' ? 'active' : ''} 
            onClick={() => setActiveTab('orders')}
          >
            📦 Orders
          </button>
          <button 
            className={activeTab === 'products' ? 'active' : ''} 
            onClick={() => setActiveTab('products')}
          >
            🏷️ Products
          </button>
          <button 
            className={activeTab === 'users' ? 'active' : ''} 
            onClick={() => setActiveTab('users')}
          >
            👥 Users
          </button>
        </aside>

        <main className="admin-main-content">
          {activeTab === 'orders' && <AdminOrdersView />}
          {activeTab === 'products' && <AdminProductsView />}
          {activeTab === 'users' && <AdminUsersView />}
        </main>
      </div>
    </div>
  );
}