import { useState, useEffect } from 'react';
import { ordersAPI } from '../services/api';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await ordersAPI.getAll();
      if (response.data.success) {
        setOrders(response.data.orders);
      }
    } catch (error) {
      console.error('Failed to fetch orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price) => {
    return `₦${(price * 1650).toLocaleString('en-NG', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-NG', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const getStatusBadge = (status) => {
    const badges = {
      pending: 'bg-warning',
      processing: 'bg-info',
      shipped: 'bg-primary',
      delivered: 'bg-success',
      cancelled: 'bg-danger',
    };
    return badges[status] || 'bg-secondary';
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

  return (
    <div className="container py-5">
      <h2 className="fw-bold mb-4">My Orders</h2>

      {orders.length === 0 ? (
        <div className="text-center py-5">
          <i className="bi bi-box-seam display-1 text-muted"></i>
          <h3 className="mt-3">No orders yet</h3>
          <p className="text-muted">Start shopping to see your orders here</p>
        </div>
      ) : (
        <div className="row">
          {orders.map((order) => (
            <div key={order.id} className="col-12 mb-4">
              <div className="card border-0 shadow-sm">
                <div className="card-header bg-white py-3">
                  <div className="row align-items-center">
                    <div className="col-md-3">
                      <small className="text-muted">Order ID</small>
                      <p className="mb-0 fw-bold">#{order.id}</p>
                    </div>
                    <div className="col-md-3">
                      <small className="text-muted">Date</small>
                      <p className="mb-0">{formatDate(order.created_at)}</p>
                    </div>
                    <div className="col-md-3">
                      <small className="text-muted">Total</small>
                      <p className="mb-0 fw-bold">{formatPrice(order.total_price)}</p>
                    </div>
                    <div className="col-md-3">
                      <small className="text-muted">Status</small>
                      <p className="mb-0">
                        <span className={`badge ${getStatusBadge(order.status)}`}>
                          {order.status.toUpperCase()}
                        </span>
                      </p>
                    </div>
                  </div>
                </div>
                <div className="card-body">
                  <h6 className="fw-bold mb-3">Order Items</h6>
                  {order.items && order.items.map((item, index) => (
                    <div key={index} className="d-flex align-items-center mb-3">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="me-3"
                        style={{ width: '60px', height: '60px', objectFit: 'cover' }}
                      />
                      <div className="flex-grow-1">
                        <p className="mb-0 fw-bold">{item.name}</p>
                        <small className="text-muted">
                          Qty: {item.quantity} | Size: {item.size} | Color: {item.color}
                        </small>
                      </div>
                      <p className="mb-0 fw-bold">{formatPrice(item.price)}</p>
                    </div>
                  ))}
                  
                  <hr />
                  
                  <div className="row">
                    <div className="col-md-6">
                      <h6 className="fw-bold mb-2">Shipping Address</h6>
                      <p className="text-muted small mb-0">{order.shipping_address}</p>
                    </div>
                    <div className="col-md-6 text-end">
                      <div className="d-flex justify-content-end mb-1">
                        <span className="me-3">Subtotal:</span>
                        <span>{formatPrice(order.subtotal)}</span>
                      </div>
                      <div className="d-flex justify-content-end mb-1">
                        <span className="me-3">Shipping:</span>
                        <span>{formatPrice(order.shipping)}</span>
                      </div>
                      <div className="d-flex justify-content-end mb-1">
                        <span className="me-3">Tax:</span>
                        <span>{formatPrice(order.tax)}</span>
                      </div>
                      <div className="d-flex justify-content-end fw-bold fs-5">
                        <span className="me-3">Total:</span>
                        <span>{formatPrice(order.total_price)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Orders;
