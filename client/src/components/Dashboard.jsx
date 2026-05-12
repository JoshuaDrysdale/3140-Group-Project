import { useEffect, useState } from 'react';
import './Dashboard.css';



export default function Dashboard({ user, initialTab }) {
  const [activeTab, setActiveTab] = useState(initialTab || 'products');
  const [products, setProducts] = useState([]);
  const [users, setUsers] = useState([]);
  const [editingProduct, setEditingProduct] = useState(null);
  const [editingUser, setEditingUser] = useState(null);
  const [message, setMessage] = useState({ text: '', color: '' });

  useEffect(() => {
    fetchProducts();
    fetchUsers();
  }, []);

  useEffect(() => {
    if (initialTab) setActiveTab(initialTab);
  }, [initialTab]);

  const fetchProducts = async () => {
    const res = await fetch('/api/products');
    const data = await res.json();
    setProducts(data);
  };

  const fetchUsers = async () => {
    const res = await fetch('/api/admin/users', {
      headers: { 'x-user-role': user.role }
    });
    const data = await res.json();
    setUsers(data);
  };

const saveProduct = async (product) => {
  const res = await fetch(`/api/admin/products/${product.id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', 'x-user-role': user.role },
    body: JSON.stringify({
      name: product.name,
      price: Number(product.price),
      stock_quantity: Number(product.stock_quantity)
    })
  });
  const data = await res.json();
  if (!res.ok) {
    return setMessage({ text: data.error, color: 'red' });
  }
  setMessage({ text: 'Product updated!', color: 'green' });
  setEditingProduct(null);
  fetchProducts();
};

  const deleteProduct = async (id) => {
    if (!confirm('Delete this product?')) return;
    const res = await fetch(`/api/admin/products/${id}`, {
      method: 'DELETE',
      headers: { 'x-user-role': user.role }
    });
    if (res.ok) { 
      fetchProducts(); setMessage({ text: 'Product deleted.', color: 'green' }); 
    }
  };

  const saveUser = async (u) => {
    const res = await fetch(`/api/edit/${u.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', 'x-user-role': user.role },
      body: JSON.stringify({ name: u.name, email: u.email, role: u.role })
    });
    const data = await res.json();
    if (!res.ok) {
      return setMessage({ text: data.error, color: 'red' });
    }
    setMessage({ text: 'User updated!', color: 'green' });
    setEditingUser(null);
    fetchUsers();
  };

  const deleteUser = async (id) => {
    if (!confirm('Delete this user?')) return;
    const res = await fetch(`/api/admin/users/${id}`, {
      method: 'DELETE',
      headers: { 'x-user-role': user.role }
    });
    if (res.ok) { 
      fetchUsers(); setMessage({ text: 'User deleted.', color: 'green' });
    }
  };

  return (
    <div className="dashboard">
      {/* <div className="dash-header">
        <h1>🛠️ Admin Dashboard</h1>
        <p>Welcome, {user.name}</p> */}
      {/* </div> */}

      {message.text && <p className="dash-message" style={{ color: message.color }}>{message.text}</p>}

      <div className="dash-tabs">
        {/* Only show Products button if products is the active tab */}
        {activeTab === 'products' && (
          <button className="active">
            Products ({products.length})
          </button>
        )}

        {/* Only show Users button if users is the active tab */}
        {activeTab === 'users' && (
          <button className="active">
            Users ({users.length})
          </button>
        )}
      </div>

      {activeTab === 'products' && (
        <div className="dash-table-wrap">
          <table className="dash-table">
            <thead>
              <tr>
                <th>Name</th><th>Price</th><th>Stock</th><th>Category ID</th><th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map(p => (
                <tr key={p.id}>
                  {editingProduct?.id === p.id ? (
                    <>
                        <td><input value={editingProduct.name} onChange={e => setEditingProduct({ ...editingProduct, name: e.target.value })} /></td>
                        <td><input type="number" value={editingProduct.price} onChange={e => setEditingProduct({ ...editingProduct, price: e.target.value })} /></td>
                        <td><input type="number" value={editingProduct.stock_quantity} onChange={e => setEditingProduct({ ...editingProduct, stock_quantity: e.target.value })} /></td>
                        <td>{editingProduct.category_id}</td>
                      <td>
                        <button className="dash-btn save" onClick={() => saveProduct(editingProduct)}>Save</button>
                        <button className="dash-btn cancel" onClick={() => setEditingProduct(null)}>Cancel</button>
                      </td>
                    </>
                  ) : (
                    <>
                          <td>{p.name}</td>
                          <td>${p.price}</td>
                          <td>{p.stock_quantity}</td>
                          <td>{p.category_id}</td>
                      <td>
                        <button className="dash-btn edit" onClick={() => setEditingProduct(p)}>Edit</button>
                        <button className="dash-btn delete" onClick={() => deleteProduct(p.id)}>Delete</button>
                      </td>
                    </>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === 'users' && (
        <div className="dash-table-wrap">
          <table className="dash-table">
            <thead>
              <tr>
                <th>Name</th><th>Email</th><th>Role</th><th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map(u => (
                <tr key={u.id}>
                  {editingUser?.id === u.id ? (
                    <>
                      <td><input value={editingUser.name} onChange={e => setEditingUser({ ...editingUser, name: e.target.value })} /></td>
                      <td><input value={editingUser.email} onChange={e => setEditingUser({ ...editingUser, email: e.target.value })} /></td>
                      <td>
                        <select value={editingUser.role || 'user'} onChange={e => setEditingUser({ ...editingUser, role: e.target.value })}>
                          <option value="user">user</option>
                          <option value="admin">admin</option>
                        </select>
                      </td>
                      <td>
                        <button className="dash-btn save" onClick={() => saveUser(editingUser)}>Save</button>
                        <button className="dash-btn cancel" onClick={() => setEditingUser(null)}>Cancel</button>
                      </td>
                    </>
                  ) : (
                    <>
                      <td>{u.name}</td>
                      <td>{u.email}</td>
                      <td><span className={`role-badge ${u.role}`}>{u.role || 'user'}</span></td>
                      <td>
                        <button className="dash-btn edit" onClick={() => setEditingUser(u)}>Edit</button>
                        <button className="dash-btn delete" onClick={() => deleteUser(u.id)}>Delete</button>
                      </td>
                    </>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}