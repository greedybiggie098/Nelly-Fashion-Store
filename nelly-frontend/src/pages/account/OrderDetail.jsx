import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { accountAPI } from '../../services/accountApi';
import toast from '../../utils/toast';

const OrderDetail = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrderDetails();
  }, [id]);

  const fetchOrderDetails = async () => {
    try {
      const response = await accountAPI.getOrderDetails(id);
      if (response.data.success) {
        setOrder(response.data.order);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error('Failed to load order details');
    } finally {
      setLoading(false);
    }
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
      <div className="text-center py-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="card shadow-sm">
        <div className="card-body text-center py-5">
          <i className="bi bi-exclamation-circle fs-1 text-danger mb-3"></i>
          <h5>Order not found</h5>
          <Link to="/account/orders" className="btn btn-primary">
            Back to Orders
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="mb-0">Order Details</h2>
        <Link to="/account/orders" className="btn btn-outline-secondary">
          <i className="bi bi-arrow-left me-2"></i>
          Back to Orders
        </Link>
      </div>

      {/* Order Info */}
      <div className="card shadow-sm mb-4">
        <div className="card-body">
          <div className="row">
            <div className="col-md-3">
              <h6 className="text-muted mb-1">Order ID</h6>
              <p className="mb-0">#{order.id}</p>
            </div>
            <div className="col-md-3">
              <h6 className="text-muted mb-1">Order Date</h6>
              <p className="mb-0">{new Date(order.created_at).toLocaleDateString()}</p>
            </div>
            <div className="col-md-3">
              <h6 className="text-muted mb-1">Status</h6>
              <span className={`badge ${getStatusBadge(order.status)}`}>
                {order.status.toUpperCase()}
              </span>
            </div>
            <div className="col-md-3">
              <h6 className="text-muted mb-1">Total Amount</h6>
              <p className="mb-0 fw-bold">₦{parseFloat(order.total_amount).toLocaleString()}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Shipping Address */}
      <div className="card shadow-sm mb-4">
        <div className="card-header bg-white">
          <h5 className="mb-0">Shipping Address</h5>
        </div>
        <div className="card-body">
          <p className="mb-1"><strong>{order.shipping_name}</strong></p>
          <p className="mb-1">{order.shipping_address}</p>
          <p className="mb-1">{order.shipping_city}, {order.shipping_state}</p>
          <p className="mb-1">{order.shipping_country} - {order.shipping_postal_code}</p>
          <p className="mb-0"><i className="bi bi-telephone me-2"></i>{order.shipping_phone}</p>
        </div>
      </div>

      {/* Order Items */}
      <div className="card shadow-sm">
        <div className="card-header bg-white">
          <h5 className="mb-0">Order Items</h5>
        </div>
        <div className="card-body">
          <div className="table-responsive">
            <table className="table">
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Price</th>
                  <th>Quantity</th>
                  <th>Subtotal</th>
                </tr>
              </thead>
              <tbody>
                {order.items?.map((item) => (
                  <tr key={item.id}>
                    <td>
                      <div className="d-flex align-items-center">
                        <img
                          src={item.image}
                          alt={item.name}
                          style={{ width: '60px', height: '60px', objectFit: 'cover' }}
                          className="rounded me-3"
                        />
                        <div>
                          <Link
                            to={`/product/${item.slug}`}
                            className="text-decoration-none text-dark"
                          >
                            {item.name}
                          </Link>
                        </div>
                      </div>
                    </td>
                    <td>₦{parseFloat(item.price).toLocaleString()}</td>
                    <td>{item.quantity}</td>
                    <td>₦{(parseFloat(item.price) * item.quantity).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr>
                  <td colSpan="3" className="text-end"><strong>Subtotal:</strong></td>
                  <td><strong>₦{parseFloat(order.subtotal).toLocaleString()}</strong></td>
                </tr>
                <tr>
                  <td colSpan="3" className="text-end">VAT (7.5%):</td>
                  <td>₦{parseFloat(order.vat).toLocaleString()}</td>
                </tr>
                <tr>
                  <td colSpan="3" className="text-end"><strong>Total:</strong></td>
                  <td><strong className="text-primary">₦{parseFloat(order.total_amount).toLocaleString()}</strong></td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetail;
