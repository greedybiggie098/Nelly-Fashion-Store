import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { ordersAPI, paymentAPI } from '../services/api';
import { usePaystack } from '../hooks/usePaystack';
import toast from '../utils/toast';

const Checkout = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { cartItems, getCartTotal, fetchCart } = useCart();
  const { initializePayment } = usePaystack();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    firstName: user?.name?.split(' ')[0] || '',
    lastName: user?.name?.split(' ')[1] || '',
    email: user?.email || '',
    phone: user?.phone || '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    shippingMethod: 'standard',
  });

  const shippingCosts = {
    standard: 2000,
    express: 4000,
    sameday: 5000,
  };

  const subtotal = getCartTotal() * 1650; // Convert to Naira
  const shipping = shippingCosts[formData.shippingMethod];
  const tax = subtotal * 0.075; // 7.5% VAT
  const total = subtotal + shipping + tax;

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handlePaymentSuccess = async (response) => {
    try {
      // Verify payment with backend
      const verifyResponse = await paymentAPI.verify(response.reference);
      
      if (verifyResponse.data.success) {
        toast.success('Payment successful! Your order has been placed.');
        await fetchCart(); // Refresh cart (should be empty now)
        navigate('/account/orders');
      } else {
        toast.error('Payment verification failed');
      }
    } catch (error) {
      console.error('Payment verification error:', error);
      toast.error('Failed to verify payment');
    } finally {
      setLoading(false);
    }
  };

  const handlePaymentClose = () => {
    setLoading(false);
    toast.info('Payment cancelled');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const shippingAddress = `${formData.address}, ${formData.city}, ${formData.state} ${formData.zipCode}`;
      
      const orderData = {
        subtotal: subtotal / 1650, // Convert back to USD for database
        tax: tax / 1650,
        shipping: shipping / 1650,
        total_price: total / 1650,
        shipping_address: shippingAddress,
      };

      // Create order first
      const response = await ordersAPI.create(orderData);
      
      if (response.data.success) {
        const orderId = response.data.order_id;
        
        // Generate payment reference
        const reference = `NELLY-${orderId}-${Date.now()}`;
        
        // Initialize Paystack payment
        initializePayment({
          email: formData.email,
          amount: total, // Amount in Naira
          reference: reference,
          metadata: {
            order_id: orderId,
            customer_name: `${formData.firstName} ${formData.lastName}`,
            customer_phone: formData.phone,
            shipping_address: shippingAddress,
            cart_items: cartItems.length,
          },
          onSuccess: handlePaymentSuccess,
          onClose: handlePaymentClose,
        });
      } else {
        toast.error(response.data.message || 'Failed to create order');
        setLoading(false);
      }
    } catch (error) {
      toast.error('Failed to process checkout');
      console.error('Checkout error:', error);
      setLoading(false);
    }
  };

  const formatPrice = (price) => {
    return `₦${price.toLocaleString('en-NG', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  if (cartItems.length === 0) {
    return (
      <div className="container py-5">
        <div className="text-center">
          <h3>Your cart is empty</h3>
          <button className="btn btn-dark mt-3" onClick={() => navigate('/collections')}>
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-5">
      <h2 className="fw-bold mb-4">Checkout</h2>
      
      <div className="row">
        <div className="col-lg-8">
          <form onSubmit={handleSubmit}>
            {/* Contact Information */}
            <div className="card border-0 shadow-sm mb-4">
              <div className="card-header bg-white py-3">
                <h6 className="mb-0 fw-bold">Contact Information</h6>
              </div>
              <div className="card-body">
                <div className="row g-3">
                  <div className="col-md-6">
                    <label className="form-label fw-bold">First Name</label>
                    <input
                      type="text"
                      className="form-control rounded-0"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label fw-bold">Last Name</label>
                    <input
                      type="text"
                      className="form-control rounded-0"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="col-12">
                    <label className="form-label fw-bold">Email</label>
                    <input
                      type="email"
                      className="form-control rounded-0"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="col-12">
                    <label className="form-label fw-bold">Phone</label>
                    <input
                      type="tel"
                      className="form-control rounded-0"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Shipping Address */}
            <div className="card border-0 shadow-sm mb-4">
              <div className="card-header bg-white py-3">
                <h6 className="mb-0 fw-bold">Shipping Address</h6>
              </div>
              <div className="card-body">
                <div className="row g-3">
                  <div className="col-12">
                    <label className="form-label fw-bold">Street Address</label>
                    <input
                      type="text"
                      className="form-control rounded-0"
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label fw-bold">City</label>
                    <input
                      type="text"
                      className="form-control rounded-0"
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label fw-bold">State</label>
                    <input
                      type="text"
                      className="form-control rounded-0"
                      name="state"
                      value={formData.state}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label fw-bold">ZIP Code</label>
                    <input
                      type="text"
                      className="form-control rounded-0"
                      name="zipCode"
                      value={formData.zipCode}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Shipping Method */}
            <div className="card border-0 shadow-sm mb-4">
              <div className="card-header bg-white py-3">
                <h6 className="mb-0 fw-bold">Shipping Method</h6>
              </div>
              <div className="card-body">
                <div className="form-check mb-3">
                  <input
                    className="form-check-input"
                    type="radio"
                    name="shippingMethod"
                    id="standard"
                    value="standard"
                    checked={formData.shippingMethod === 'standard'}
                    onChange={handleChange}
                  />
                  <label className="form-check-label d-flex justify-content-between" htmlFor="standard">
                    <span>
                      <strong>Standard Shipping</strong>
                      <small className="text-muted d-block">3-5 business days</small>
                    </span>
                    <span className="fw-bold">₦2,000</span>
                  </label>
                </div>
                <div className="form-check mb-3">
                  <input
                    className="form-check-input"
                    type="radio"
                    name="shippingMethod"
                    id="express"
                    value="express"
                    checked={formData.shippingMethod === 'express'}
                    onChange={handleChange}
                  />
                  <label className="form-check-label d-flex justify-content-between" htmlFor="express">
                    <span>
                      <strong>Express Shipping</strong>
                      <small className="text-muted d-block">1-2 business days</small>
                    </span>
                    <span className="fw-bold">₦4,000</span>
                  </label>
                </div>
                <div className="form-check">
                  <input
                    className="form-check-input"
                    type="radio"
                    name="shippingMethod"
                    id="sameday"
                    value="sameday"
                    checked={formData.shippingMethod === 'sameday'}
                    onChange={handleChange}
                  />
                  <label className="form-check-label d-flex justify-content-between" htmlFor="sameday">
                    <span>
                      <strong>Same Day Delivery</strong>
                      <small className="text-muted d-block">Within Lagos only</small>
                    </span>
                    <span className="fw-bold">₦5,000</span>
                  </label>
                </div>
              </div>
            </div>

            <button
              type="submit"
              className="btn btn-dark w-100 rounded-0 py-3"
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2"></span>
                  Processing Payment...
                </>
              ) : (
                <>
                  <i className="bi bi-lock-fill me-2"></i>
                  Pay {formatPrice(total)} with Paystack
                </>
              )}
            </button>
            
            <div className="text-center mt-3">
              <small className="text-muted">
                <i className="bi bi-shield-check me-1"></i>
                Secure payment powered by Paystack
              </small>
            </div>
          </form>
        </div>

        <div className="col-lg-4">
          <div className="card border-0 shadow-sm sticky-top" style={{ top: '100px' }}>
            <div className="card-header bg-white py-3">
              <h6 className="mb-0 fw-bold">Order Summary</h6>
            </div>
            <div className="card-body">
              <div className="mb-3">
                {cartItems.map((item) => (
                  <div key={item.id} className="d-flex justify-content-between mb-2">
                    <span className="small">
                      {item.name} x {item.quantity}
                    </span>
                    <span className="small">{formatPrice(item.item_total * 1650)}</span>
                  </div>
                ))}
              </div>
              
              <hr />
              
              <div className="d-flex justify-content-between mb-2">
                <span>Subtotal</span>
                <span>{formatPrice(subtotal)}</span>
              </div>
              <div className="d-flex justify-content-between mb-2">
                <span>Shipping</span>
                <span>{formatPrice(shipping)}</span>
              </div>
              <div className="d-flex justify-content-between mb-2">
                <span>VAT (7.5%)</span>
                <span>{formatPrice(tax)}</span>
              </div>
              
              <hr />
              
              <div className="d-flex justify-content-between fw-bold fs-5">
                <span>Total</span>
                <span>{formatPrice(total)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
