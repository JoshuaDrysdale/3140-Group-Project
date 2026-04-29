import { useNavigate } from 'react-router-dom';
import './Navbar.css';

export default function Navbar({ user, cartCount, onCartClick, onLogout }) {
  const navigate = useNavigate();
  return (
    <nav className="navbar">
      <div className="navbar-logo" onClick={() => navigate('/store')}>🎓 SchoolMart</div>
      <div className="navbar-search">
        <input type="text" placeholder="Search for school supplies..." />
        <button>🔍</button>
      </div>
      <div className="navbar-right">
        <span className="navbar-user">👋 {user.name}</span>
        <button className="cart-btn" onClick={onCartClick}>🛒 Cart {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}</button>
        <button className="logout-btn" onClick={onLogout}>Logout</button>
      </div>
    </nav>
  );
}
