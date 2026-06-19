import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';

const Cart = () => {
  const { cartItems, loading, updateQuantity, removeFromCart, getCartTotal } = useCart();

  const formatPrice = (price) => {
    return `₦${(price * 1650).toLocaleString('en-NG', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  if (loading) {
    return (
      <div className="container py-5">
        <div className="text-center">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="container py-5">
        <div className="text-center">
          <i className="bi bi-bag-x display-1 text-muted"></i>
          <h3 className="mt-3">Your cart is empty</h3>
          <p className="text-muted">Add some products to get started</p>
          <Link to="/collections" className="btn btn-dark rounded-0 px-5 mt-3">
            Shop Now
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-5">
      <h2 className="fw-bold mb-4">Shopping Cart</h2>
      
      <div className="row">
        <div className="col-lg-8">
          {cartItems.map((item) => (
            <div key={item.id} className="card mb-3 border-0 shadow-sm">
              <div className="card-body">
                <div className="row align-items-center">
                  <div className="col-md-2">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="img-fluid"
                      style={{ height: '100px', objectFit: 'cover' }}
                    />
                  </div>
                  <div className="col-md-4">
                    <h6 className="fw-bold mb-1">{item.name}</h6>
                    <p className="text-muted small mb-0">
                      Size: {item.size} | Color: {item.color}
                    </p>
                  </div>
                  <div className="col-md-2">
                    <p className="fw-bold mb-0">{formatPrice(item.price)}</p>
                  </div>
                  <div className="col-md-2">
                    <div className="input-group input-group-sm">
                      <button
                        className="btn btn-outline-secondary"
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        disabled={item.quantity <= 1}
                      >
                        -
                      </button>
                      <input
                        type="text"
                        className="form-control text-center"
                        value={item.quantity}
                        readOnly
                      />
                      <button
                        className="btn btn-outline-secondary"
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      >
                        +
                      </button>
                    </div>
                  </div>
                  <div className="col-md-2 text-end">
                    <p className="fw-bold mb-2">{formatPrice(item.item_total)}</p>
                    <button
                      className="btn btn-sm btn-link text-danger p-0"
                      onClick={() => removeFromCart(item.id)}
                    >
                      <i className="bi bi-trash"></i> Remove
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="col-lg-4">
          <div className="card border-0 shadow-sm">
            <div className="card-body">
              <h5 className="fw-bold mb-4">Order Summary</h5>
              
              <div className="d-flex justify-content-between mb-2">
                <span>Subtotal</span>
                <span>{formatPrice(getCartTotal())}</span>
              </div>
              <hr />
              <div className="d-flex justify-content-between mb-4">
                <span className="fw-bold">Total</span>
                <span className="fw-bold fs-5">{formatPrice(getCartTotal())}</span>
              </div>

              <div className="alert alert-info mb-3">
                <i className="bi bi-info-circle me-2"></i>
                <small>Payment feature coming soon. Please contact us for orders.</small>
              </div>

              <Link to="/collections" className="btn btn-dark w-100 rounded-0 py-2">
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
