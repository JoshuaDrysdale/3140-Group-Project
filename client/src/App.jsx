import { useRef, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

import Login from './components/Login';
import Store from './components/Store';
import Navbar from './components/Navbar';
import Profile from './components/Profile';
import Cart from './components/Cart';
import Checkout from './components/Checkout';
import SubCategory from './components/SubCategory';

import './App.css';

function App() {
  const [user, setUser] = useState(null);
  const [cart, setCart] = useState([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [toastMessage, setToastMessage] = useState('');
  const [toastOpen, setToastOpen] = useState(false);
  const toastTimeoutRef = useRef(null);

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
            path="/profile"
            element={user ? <Profile user={user} setUser={setUser} /> : <Navigate to="/" />}
          />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
