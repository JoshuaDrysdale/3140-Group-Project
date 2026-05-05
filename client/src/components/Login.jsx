import { useState } from 'react';
import './Login.css';

export default function Login({ onLogin }) {
  const [activeTab, setActiveTab] = useState('login');
  const [loginData, setLoginData] = useState({ email: '', password: '' });
  const [signupData, setSignupData] = useState({ name: '', email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState('');

  const validateEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const validatePassword = (password) => password.length >= 6;

  const validateName = (name) => name.trim().length > 0;

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrors({});
    setStatus('');

    if (!loginData.email || !loginData.password) {
      setErrors({ general: 'Please fill in all fields.' });
      return;
    }

    if (!validateEmail(loginData.email)) {
      setErrors({ email: 'Please enter a valid email address.' });
      return;
    }

    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(loginData)
      });

      const body = await response.json();
      if (!response.ok) {
        setErrors({ general: body.error || 'Login failed.' });
        return;
      }

      onLogin(body.user);
    } catch (error) {
      setErrors({ general: 'Unable to login. Try again later.' });
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setErrors({});
    setStatus('');

    if (!signupData.name || !signupData.email || !signupData.password) {
      setErrors({ general: 'Please fill in all fields.' });
      return;
    }

    if (!validateName(signupData.name)) {
      setErrors({ name: 'Name cannot be empty.' });
      return;
    }

    if (!validateEmail(signupData.email)) {
      setErrors({ email: 'Please enter a valid email address.' });
      return;
    }

    if (!validatePassword(signupData.password)) {
      setErrors({ password: 'Password must be at least 6 characters long.' });
      return;
    }

    try {
      const response = await fetch('/api/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(signupData)
      });

      const body = await response.json();
      if (!response.ok) {
        setErrors({ general: body.error || 'Signup failed.' });
        return;
      }

      setStatus('Account created! Please sign in.');
      setSignupData({ name: '', email: '', password: '' });
      setActiveTab('login');
    } catch (error) {
      setErrors({ general: 'Unable to sign up. Try again later.' });
    }
  };

  return (
    <div className="login-page">
      <div className="left">
        <div className="logo">🎓 SchoolMart</div>
        <h1>Everything you need<br />for academic success</h1>
        <p className="desc">From textbooks to tech, notebooks to backpacks. Your one-stop shop for all school essentials.</p>
        <div className="features">
          <div className="feature">🚚 Free Shipping</div>
          <div className="feature">🔒 Secure Checkout</div>
          <div className="feature">↩️ Easy Returns</div>
          <div className="feature">🎧 24/7 Support</div>
        </div>
      </div>
      <div className="right">
        <div className="card">
          <h2>Welcome back</h2>
          <p className="subtitle">Sign in to continue</p>
          {status && <p className="status">{status}</p>}
          <div className="tabs">
            <div className={`tab ${activeTab === 'login' ? 'active' : ''}`} onClick={() => { setActiveTab('login'); setErrors({}); setStatus(''); }}>Sign In</div>
            <div className={`tab ${activeTab === 'signup' ? 'active' : ''}`} onClick={() => { setActiveTab('signup'); setErrors({}); setStatus(''); }}>Create Account</div>
          </div>
          {activeTab === 'login' && (
            <form onSubmit={handleLogin}>
              <input type="text" placeholder="Email" value={loginData.email} onChange={(e) => { setLoginData({ ...loginData, email: e.target.value }); setErrors({ ...errors, email: '', general: '' }); setStatus(''); }} />
              {errors.email && <p className="error">{errors.email}</p>}
              <input type="password" placeholder="Password" value={loginData.password} onChange={(e) => { setLoginData({ ...loginData, password: e.target.value }); setErrors({ ...errors, general: '' }); setStatus(''); }} />
              <button type="submit" className="main-btn">Sign In</button>
              {errors.general && <p className="error">{errors.general}</p>}
            </form>
          )}
          {activeTab === 'signup' && (
            <form onSubmit={handleSignup}>
              <input type="text" placeholder="Full Name" value={signupData.name} onChange={(e) => { setSignupData({ ...signupData, name: e.target.value }); setErrors({ ...errors, name: '', general: '' }); setStatus(''); }} />
              {errors.name && <p className="error">{errors.name}</p>}
              <input type="text" placeholder="Email" value={signupData.email} onChange={(e) => { setSignupData({ ...signupData, email: e.target.value }); setErrors({ ...errors, email: '', general: '' }); setStatus(''); }} />
              {errors.email && <p className="error">{errors.email}</p>}
              <input type="password" placeholder="Password" value={signupData.password} onChange={(e) => { setSignupData({ ...signupData, password: e.target.value }); setErrors({ ...errors, password: '', general: '' }); setStatus(''); }} />
              {errors.password && <p className="error">{errors.password}</p>}
              <button type="submit" className="main-btn">Create Account</button>
              {errors.general && <p className="error">{errors.general}</p>}
            </form>
          )}
          <p className="divider">OR</p>
          <button className="guest-btn" onClick={() => onLogin({ name: 'Guest', isGuest: true })}>Continue as Guest</button>
        </div>
      </div>
    </div>
  );
}
