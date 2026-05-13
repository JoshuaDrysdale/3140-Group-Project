import { useRef, useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';

import Login from './components/Login';
import Store from './components/Store';
import Navbar from './components/Navbar';
import Profile from './components/Profile';
import Cart from './components/Cart';
import Checkout from './components/Checkout';
import SubCategory from './components/SubCategory';
import OrderConfirmation from './components/OrderConfirmation';
import OrderHistory from './components/OrderHistory';
import AdminDashboard from './components/AdminDashboard';
import Dashboard from './components/Dashboard';

import './App.css';

function App() {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem('user');
    return stored ? JSON.parse(stored) : null;
  });

  const [cart, setCart] = useState([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [toastMessage, setToastMessage] = useState('');
  const [toastOpen, setToastOpen] = useState(false);
  const toastTimeoutRef = useRef(null);

  // Persist user to localStorage
  useEffect(() => {
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
    } else {
      localStorage.removeItem('user');
    }
  }, [user]);

  // Persist cart to temp_cart so it survives the redirect from Stripe
  useEffect(() => {
    if (cart.length > 0) {
      localStorage.setItem('temp_cart', JSON.stringify(cart));
    }
  }, [cart]);

  const showToast = (message) => {
    setToastMessage(message);
    setToastOpen(true);
    if (toastTimeoutRef.current) clearTimeout(toastTimeoutRef.current);
    toastTimeoutRef.current = setTimeout(() => {
      setToastOpen(false);
    }, 1800);
  };

  const addToCart = (item) => {
    setCart(prev => {
      const existing = prev.find(i => i.id === item.id && i.category === item.category);
      if (existing) {
        showToast(`${item.name} quantity updated`);
        return prev.map(i => i.id === item.id && i.category === item.category
          ? { ...i, qty: i.qty + 1 } : i);
      }
      showToast(`${item.name} added to cart`);
      return [...prev, { ...item, qty: 1 }];
    });
  };

  const removeFromCart = (item) => {
    setCart(prev => {
      const existing = prev.find(i => i.id === item.id && i.category === item.category);
      if (!existing) return prev;
      if (existing.qty === 1) return prev.filter(i => !(i.id === item.id && i.category === item.category));
      return prev.map(i => i.id === item.id && i.category === item.category
        ? { ...i, qty: i.qty - 1 } : i);
    });
  };

  return (
    <BrowserRouter>
      <AppRoutes 
        user={user} 
        setUser={setUser} 
        cart={cart} 
        setCart={setCart} 
        addToCart={addToCart} 
        removeFromCart={removeFromCart} 
        searchQuery={searchQuery} 
        setSearchQuery={setSearchQuery} 
        cartOpen={cartOpen} 
        setCartOpen={setCartOpen} 
        checkoutOpen={checkoutOpen} 
        setCheckoutOpen={setCheckoutOpen} 
        toastMessage={toastMessage} 
        toastOpen={toastOpen} 
      />
    </BrowserRouter>
  );
}

function AppRoutes({ 
  user, setUser, cart, setCart, addToCart, removeFromCart, 
  searchQuery, setSearchQuery, cartOpen, setCartOpen, 
  checkoutOpen, setCheckoutOpen, toastMessage, toastOpen 
}) {
  const navigate = useNavigate();
  const location = useLocation();
  const totalItems = cart.reduce((sum, i) => sum + i.qty, 0);

  // Inside AppRoutes in App.jsx
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    
    if (params.get('checkout') === 'success') {
      console.log("Stripe Success! Moving to confirmation...");

      // 1. Clear the "live" cart state so the UI updates
      setCart([]);
      setCheckoutOpen(false);
      setCartOpen(false);

      // 2. Just go to the confirmation page. 
      // We won't pass state here; OrderConfirmation will check localStorage itself.
      navigate('/order-confirmation', { replace: true });
    }
  }, [location.search]);

  return (
    <div className="App">
        {toastOpen && <div className="toast-notification">{toastMessage}</div>}
        
        {user && (
          <Navbar 
            user={user} 
            cartCount={totalItems} 
            onCartClick={() => setCartOpen(!cartOpen)} 
            onLogout={() => {
              setUser(null);
              setSearchQuery('');
            }}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
          />
        )}
        
        {cartOpen && (
          <Cart 
            cart={cart} 
            onAdd={addToCart} 
            onRemove={removeFromCart} 
            onClose={() => setCartOpen(false)} 
            onCheckout={() => {
              setCheckoutOpen(true);
              setCartOpen(false);
            }}
          />
        )}

        {checkoutOpen && (
          <Checkout
            cart={cart}
            user={user}
            onClose={() => setCheckoutOpen(false)}
          />
        )}

        <Routes>
          <Route path="/profile" element={user ? <Profile user={user} setUser={setUser} /> : <Navigate to="/" />} />
          <Route path="/" element={user ? <Navigate to="/store" /> : <Login onLogin={setUser} />} />
          <Route path="/store" element={user ? <Store onAddToCart={addToCart} searchQuery={searchQuery} onSearchChange={setSearchQuery} /> : <Navigate to="/" />} />
          <Route path="/sub-categories/:id" element={user ? <SubCategory onAddToCart={addToCart} /> : <Navigate to="/" />} />
          <Route path="/history" element={user ? <OrderHistory user={user} onAddToCart={addToCart} /> : <Navigate to="/" />} />
          <Route path="/order-confirmation" element={user ? <OrderConfirmation user={user} /> : <Navigate to="/" />} />
          <Route path="/admin" element={user?.role === 'admin' ? <AdminDashboard user={user} /> : <Navigate to="/store" replace />} />
          <Route path="/dashboard" element={user?.role === 'admin' ? <Dashboard user={user} /> : <Navigate to="/" />} />
          <Route path="/history" element={user ? <OrderHistory user={user} onAddToCart={addToCart} /> : <Navigate to="/" />} />
        </Routes>
      </div>
    );
}

export default App;