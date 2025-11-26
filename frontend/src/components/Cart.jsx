import { useCart } from '../context/CartContext';
import './Cart.css';

const Cart = () => {
  const { cartItems, updateItem, removeItem, getCartTotal, loading } = useCart();

  if (loading) {
    return <div className="cart-container">Loading cart...</div>;
  }

  if (cartItems.length === 0) {
    return (
      <div className="cart-container">
        <h2>Your Cart</h2>
        <p className="empty-cart">Your cart is empty.</p>
      </div>
    );
  }

  return (
    <div className="cart-container">
      <h2>Your Cart</h2>
      <div className="cart-items">
        {cartItems.map((item) => {
          const product = item.product || {};
          return (
            <div key={item.id} className="cart-item">
              <div className="cart-item-image">
                {product.images && product.images.length > 0 ? (
                  <img src={product.images[0]} alt={product.name} />
                ) : (
                  <div className="image-placeholder">No Image</div>
                )}
              </div>
              <div className="cart-item-info">
                <h3>{product.name || 'Product'}</h3>
                <p className="cart-item-price">${product.price?.toFixed(2) || '0.00'}</p>
              </div>
              <div className="cart-item-controls">
                <div className="quantity-controls">
                  <button
                    onClick={() => updateItem(item.id, item.quantity - 1)}
                    className="quantity-button"
                  >
                    -
                  </button>
                  <span className="quantity">{item.quantity}</span>
                  <button
                    onClick={() => updateItem(item.id, item.quantity + 1)}
                    className="quantity-button"
                  >
                    +
                  </button>
                </div>
                <button
                  onClick={() => removeItem(item.id)}
                  className="remove-button"
                >
                  Remove
                </button>
              </div>
              <div className="cart-item-total">
                ${((product.price || 0) * item.quantity).toFixed(2)}
              </div>
            </div>
          );
        })}
      </div>
      <div className="cart-summary">
        <div className="cart-total">
          <strong>Total: ${getCartTotal().toFixed(2)}</strong>
        </div>
      </div>
    </div>
  );
};

export default Cart;

