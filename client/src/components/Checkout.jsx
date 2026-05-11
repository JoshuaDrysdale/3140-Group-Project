import { useState } from 'react';
import './Checkout.css';

export default function Checkout({ cart, user, onClose }) {
  const [form, setForm] = useState({
    name: user?.name || '',
    email: user?.email || '',
    address: '',
    city: '',
    postalCode: '',
    notes: ''
  });
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0);

  const handleChange = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }));
    setErrors(prev => ({ ...prev, [field]: '' }));
    setServerError('');
  };

  const validate = () => {
    const nextErrors = {};

    if (!form.name.trim()) nextErrors.name = 'Name is required.';
    if (!form.email.trim()) nextErrors.email = 'Email is required.';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) nextErrors.email = 'Please enter a valid email.';
    if (!form.address.trim()) nextErrors.address = 'Address is required.';
    if (!form.city.trim()) nextErrors.city = 'City is required.';
    if (!form.postalCode.trim()) nextErrors.postalCode = 'Postal code is required.';

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!validate()) return;

    setIsLoading(true);
    try {
      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cart, shipping: form }),
      });
      const data = await response.json();

      if (!response.ok) {
        setServerError(data.error || 'Unable to start checkout.');
        setIsLoading(false);
        return;
      }

      window.location.href = data.url;
    } catch (error) {
      setServerError('Unable to start checkout. Please try again.');
      setIsLoading(false);
    }
  };

  return (
    <div className="checkout-overlay">
      <div className="checkout-modal">
        <div className="checkout-header">
          <div>
            <h2>Checkout</h2>
            <p>Review your order and enter shipping details.</p>
          </div>
          <button className="close-btn" onClick={onClose}>✕</button>
        </div>

        <div className="checkout-body">
          <div className="checkout-section order-summary">
            <h3>Order summary</h3>
            <div className="summary-items">
              {cart.map((item, idx) => (
                <div className="summary-item" key={idx}>
                  <div>
                    <p className="summary-name">{item.name}</p>
                    <p className="summary-qty">Qty: {item.qty}</p>
                  </div>
                  <p className="summary-price">${(item.price * item.qty).toFixed(2)}</p>
                </div>
              ))}
            </div>
            <div className="summary-total">
              <span>Total</span>
              <strong>${total.toFixed(2)}</strong>
            </div>
          </div>

          <form className="checkout-section checkout-form" onSubmit={handleSubmit}>
            <h3>Shipping details</h3>
            <label>
              Full name
              <input
                type="text"
                value={form.name}
                onChange={(e) => handleChange('name', e.target.value)}
              />
              {errors.name && <p className="field-error">{errors.name}</p>}
            </label>
            <label>
              Email address
              <input
                type="email"
                value={form.email}
                onChange={(e) => handleChange('email', e.target.value)}
              />
              {errors.email && <p className="field-error">{errors.email}</p>}
            </label>
            <label>
              Address
              <input
                type="text"
                value={form.address}
                onChange={(e) => handleChange('address', e.target.value)}
              />
              {errors.address && <p className="field-error">{errors.address}</p>}
            </label>
            <div className="checkout-row">
              <label>
                City
                <input
                  type="text"
                  value={form.city}
                  onChange={(e) => handleChange('city', e.target.value)}
                />
                {errors.city && <p className="field-error">{errors.city}</p>}
              </label>
              <label>
                Postal code
                <input
                  type="text"
                  value={form.postalCode}
                  onChange={(e) => handleChange('postalCode', e.target.value)}
                />
                {errors.postalCode && <p className="field-error">{errors.postalCode}</p>}
              </label>
            </div>
            <label>
              Order notes
              <textarea
                value={form.notes}
                onChange={(e) => handleChange('notes', e.target.value)}
                rows={3}
              />
            </label>
            {serverError && <p className="field-error">{serverError}</p>}
            <button type="submit" className="place-order-btn" disabled={isLoading}>
              {isLoading ? 'Redirecting…' : 'Pay with Stripe'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
