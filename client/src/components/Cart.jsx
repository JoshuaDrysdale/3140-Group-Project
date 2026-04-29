import './Cart.css';

export default function Cart({ cart, onAdd, onRemove, onClose }) {
  const total = cart.reduce((sum, i) => sum + i.price * i.qty, 0);

  return (
    <div className="cart-overlay">
      <div className="cart-sidebar">
        <div className="cart-header">
          <h2>🛒 Your Cart</h2>
          <button onClick={onClose}>✕</button>
        </div>
        {cart.length === 0 ? (
          <p className="cart-empty">Your cart is empty</p>
        ) : (
          <>
            <div className="cart-items">
              {cart.map((item, idx) => (
                <div className="cart-item" key={idx}>
                  <img src={`/images/${item.image}`} alt={item.name} />
                  <div className="cart-item-info">
                    <p className="cart-item-name">{item.name}</p>
                    <p className="cart-item-price">${item.price}</p>
                    <div className="cart-item-controls">
                      <button onClick={() => onRemove(item)}>−</button>
                      <span>{item.qty}</span>
                      <button onClick={() => onAdd(item)}>+</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="cart-footer">
              <div className="cart-total">Total: <strong>${total.toFixed(2)}</strong></div>
              <button className="checkout-btn">Checkout</button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
