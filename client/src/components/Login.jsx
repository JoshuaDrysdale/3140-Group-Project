import { useState } from 'react';
import './Login.css';

export default function Login({ onLogin }) {
  const [activeTab, setActiveTab] = useState('login');
  const [loginData, setLoginData] = useState({ email: '', password: '' });
  const [signupData, setSignupData] = useState({ name: '', email: '', password: '' });

  const handleLogin = (e) => {
    e.preventDefault();
    const storedUser = JSON.parse(localStorage.getItem('user'));
    if (!storedUser) { alert('No account found'); return; }
    if (loginData.email === storedUser.email && loginData.password === storedUser.password) {
      onLogin(storedUser);
    } else { alert('Invalid login'); }
  };

  const handleSignup = (e) => {
    e.preventDefault();
    if (!signupData.name || !signupData.email || !signupData.password) { alert('Fill all fields'); return; }
    localStorage.setItem('user', JSON.stringify(signupData));
    alert('Account created!');
    setActiveTab('login');
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
          <div className="tabs">
            <div className={`tab ${activeTab === 'login' ? 'active' : ''}`} onClick={() => setActiveTab('login')}>Sign In</div>
            <div className={`tab ${activeTab === 'signup' ? 'active' : ''}`} onClick={() => setActiveTab('signup')}>Create Account</div>
          </div>
          {activeTab === 'login' && (
            <form onSubmit={handleLogin}>
              <input type="text" placeholder="Email" value={loginData.email} onChange={(e) => setLoginData({ ...loginData, email: e.target.value })} />
              <input type="password" placeholder="Password" value={loginData.password} onChange={(e) => setLoginData({ ...loginData, password: e.target.value })} />
              <button type="submit" className="main-btn">Sign In</button>
            </form>
          )}
          {activeTab === 'signup' && (
            <form onSubmit={handleSignup}>
              <input type="text" placeholder="Full Name" value={signupData.name} onChange={(e) => setSignupData({ ...signupData, name: e.target.value })} />
              <input type="text" placeholder="Email" value={signupData.email} onChange={(e) => setSignupData({ ...signupData, email: e.target.value })} />
              <input type="password" placeholder="Password" value={signupData.password} onChange={(e) => setSignupData({ ...signupData, password: e.target.value })} />
              <button type="submit" className="main-btn">Create Account</button>
            </form>
          )}
          <p className="divider">OR CONTINUE WITH</p>
          <div className="socials">
            <button className="social-btn">
              <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/google/google-original.svg" alt="Google" />
              Google
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
