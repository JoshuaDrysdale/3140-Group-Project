import { useRef, useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';

import Login from './components/Login';
import Store from './components/Store';
import Navbar from './components/Navbar';
import Cart from './components/Cart';
import Checkout from './components/Checkout';
import SubCategory from './components/SubCategory';
import OrderConfirmation from './components/OrderConfirmation';

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

  // Persist user to localStorage whenever it changes
  useEffect(() => {
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
    } else {
      localStorage.removeItem('user');
    }
  }, [user]);

  const showToast = (message) => {
    setToastMessage(message);
    setToastOpen(true);
    if (toastTimeoutRef.current) {
      clearTimeout(toastTimeoutRef.current);
    }
    toastTimeoutRef.current = setTimeout(() => {
      setToastOpen(false);
      toastTimeoutRef.current = null;
    }, 1800);
  };

  // Cart Logic
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
      if (existing.qty === 1) return prev.filter(i => !(i.id === item.id && i.category === item.category));
      return prev.map(i => i.id === item.id && i.category === item.category
        ? { ...i, qty: i.qty - 1 } : i);
    });
  };

  const totalItems = cart.reduce((sum, i) => sum + i.qty, 0);

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
        showToast={showToast} 
      />
    </BrowserRouter>
  );
}

function AppRoutes({ user, setUser, cart, setCart, addToCart, removeFromCart, searchQuery, setSearchQuery, cartOpen, setCartOpen, checkoutOpen, setCheckoutOpen, toastMessage, toastOpen, showToast }) {
  const navigate = useNavigate();
  const location = useLocation();
  const totalItems = cart.reduce((sum, i) => sum + i.qty, 0);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.get('checkout') === 'success') {
      setCart([]);
      setCheckoutOpen(false);
      setCartOpen(false);
      window.history.replaceState({}, document.title, '/store');
      navigate('/order-confirmation');
    }
  }, [location.search, navigate, setCart, setCheckoutOpen, setCartOpen]);

  return (
    <div className="App">
        {/* Render Navbar and Cart only if user is logged in */}
        {toastOpen && (
          <div className="toast-notification">{toastMessage}</div>
        )}
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
          {/* Auth Logic: If not logged in, show Login. If logged in, go to Store */}
          <Route 
            path="/" 
            element={user ? <Navigate to="/store" /> : <Login onLogin={setUser} />} 
          />

          {/* Protected Routes */}
          <Route 
            path="/store" 
            element={user ? (
              <Store
                onAddToCart={addToCart}
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
              />
            ) : <Navigate to="/" />}
          />
          
          <Route 
            path="/sub-categories/:id" 
            element={user ? <SubCategory onAddToCart={addToCart} /> : <Navigate to="/" />} 
          />

          <Route 
            path="/order-confirmation" 
            element={user ? <OrderConfirmation user={user} /> : <Navigate to="/" />} 
          />
        </Routes>
      </div>
    );
}

export default App;
