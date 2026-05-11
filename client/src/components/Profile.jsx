import { useState } from 'react';
import './Profile.css';

function Profile({ user, setUser }) {
const [username, setUsername] = useState(user.name || '');
const [email, setEmail] = useState(user.email || '');
  const [message, setMessage] = useState({ text: '', color: '' });

  const handleSave = async () => {
    if (!username && !email) {
      setMessage({ text: 'Please enter a new name or email.', color: 'red' });
      return;
    }
    const updates = {};
    if (username) updates.name = username;
    if (email) updates.email = email;

    try {
      const res = await fetch(`/api/edit/${user.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });
      const data = await res.json();
      if (!res.ok) {
        setMessage({ text: data.error, color: 'red' });
        return;
      }
      setUser(data.user);
      setMessage({ text: data.message, color: 'green' });
    } catch {
      setMessage({ text: 'Something went wrong. Please try again.', color: 'red' });
    }
  };

  return (
    <div className="profile-page">
      <div className="profile-card">
        <div className="profile-banner" />
        <div className="profile-avatar">👤</div>
        <h1>Edit Profile</h1>
        <p className="profile-subtitle">Update your account information below</p>
        <div className="profile-divider" />
        <div className="profile-input">
          <label>Username</label>
          <input value={username} onChange={e => setUsername(e.target.value)} placeholder="Enter new username" />
        </div>
        <div className="profile-input">
          <label>Email</label>
          <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Enter new email" />
        </div>
        <button className="profile-save-btn" onClick={handleSave}>Save Changes</button>
        {message.text && <p className="profile-message" style={{ color: message.color }}>{message.text}</p>}
      </div>
    </div>
  );
}

export default Profile;