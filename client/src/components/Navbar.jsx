import { useNavigate, Link } from 'react-router-dom';
import './Navbar.css';

export default function Navbar({
  user,
  cartCount,
  onCartClick,
  onLogout,
  searchQuery,
  onSearchChange
}) {
  const navigate = useNavigate();

  const handleSearchSubmit = (event) => {
    event.preventDefault();
    navigate('/store');
  };

  return (
    <nav className="navbar" aria-label="Main shopping navigation">
      <button className="navbar-logo" onClick={() => navigate('/store')}>
        <span className="logo-mark">S</span>
        <span>SchoolMart</span>
      </button>
      <form className="navbar-search" onSubmit={handleSearchSubmit}>
        <input
          type="search"
          value={searchQuery}
          onChange={(event) => onSearchChange(event.target.value)}
          placeholder="Search notebooks, calculators, backpacks..."
        />
        <button type="submit" aria-label="Search">Search</button>
      </form>
      <div className="navbar-right">
        <span className="navbar-user">Hi, {user.name}</span>
        <Link to="/history" className="nav-link">My Orders</Link>
        {user?.role === 'admin' && (
          <Link to="/admin" className="admin-dashboard-link">
            Admin Panel
          </Link>
        )}
        <button className="cart-btn" onClick={onCartClick}>
          Cart {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
        {/* </button> */}
        {/* <button className="profile-nav-btn" onClick={() => {
          if (user.isGuest) {
            onLogout();
          } else if (user.role === 'admin') {
            navigate('/dashboard');
          } else {
            navigate('/profile');
          }
        }}> */}
          {/* {user.role === 'admin' ? '🛠️ Dashboard' : '👤 Profile'} */}
        </button>
        <button className="logout-btn" onClick={onLogout}>Logout</button>
      </div>
    </nav>
  );
}
