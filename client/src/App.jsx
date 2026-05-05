import { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

// Components from both branches
import Login from './components/Login';
import Store from './components/Store';
import CategoryPage from './components/CategoryPage';
import Navbar from './components/Navbar';
import Cart from './components/Cart';
import CategoryList from './components/CategoryList';
import SubCategory from './components/SubCategory';

import './App.css';

function App() {
  const [user, setUser] = useState(null);
  const [cart, setCart] = useState([]);
  const [cartOpen, setCartOpen] = useState(false);

  // Cart Logic
  const addToCart = (item) => {
    setCart(prev => {
      const existing = prev.find(i => i.id === item.id && i.category === item.category);
      if (existing) {
        return prev.map(i => i.id === item.id && i.category === item.category
          ? { ...i, qty: i.qty + 1 } : i);
      }
      return [...prev, { ...item, qty: 1 }];
    });
    setCartOpen(true);
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
        {user && (
          <Navbar 
            user={user} 
            cartCount={totalItems} 
            onCartClick={() => setCartOpen(!cartOpen)} 
            onLogout={() => setUser(null)} 
          />
        )}
        
        {cartOpen && (
          <Cart 
            cart={cart} 
            onAdd={addToCart} 
            onRemove={removeFromCart} 
            onClose={() => setCartOpen(false)} 
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
            element={user ? <Store /> : <Navigate to="/" />} 
          />
          
          <Route 
            path="/categories" 
            element={user ? <CategoryList /> : <Navigate to="/" />} 
          />

          <Route 
            path="/category/:category" 
            element={user ? <CategoryPage onAddToCart={addToCart} cart={cart} /> : <Navigate to="/" />} 
          />

          <Route 
            path="/sub-categories/:id" 
            element={user ? <SubCategory onAddToCart={addToCart} /> : <Navigate to="/" />} 
          />  
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;