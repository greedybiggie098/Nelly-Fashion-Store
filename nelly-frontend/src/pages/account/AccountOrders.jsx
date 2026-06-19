import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { accountAPI } from '../../services/accountApi';
import toast from '../../utils/toast';

const AccountOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await accountAPI.getOrders();
      if (response.data.success) {
        setOrders(response.data.orders);
      }
    } catch (error) {
      toast.error('Failed to load orders');
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

  const filteredOrders = filter === 'all' 
    ? orders 
    : orders.filter(order => order.status === filter);

  if (loading) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="mb-0">My Orders</h2>
        <div className="btn-group">
          <button
            className={`btn btn-sm ${filter === 'all' ? 'btn-primary' : 'btn-outline-primary'}`}
            onClick={() => setFilter('all')}
          >
            All
          </button>
          <button
            className={`btn btn-sm ${filter === 'pending' ? 'btn-primary' : 'btn-outline-primary'}`}
            onClick={() => setFilter('pending')}
          >
            Pending
          </button>
          <button
            className={`btn btn-sm ${filter === 'processing' ? 'btn-primary' : 'btn-outline-primary'}`}
            onClick={() => setFilter('processing')}
          >
            Processing
          </button>
          <button
            className={`btn btn-sm ${filter === 'delivered' ? 'btn-primary' : 'btn-outline-primary'}`}
            onClick={() => setFilter('delivered')}
          >
            Delivered
          </button>
        </div>
      </div>

      {filteredOrders.length === 0 ? (
        <div className="card shadow-sm">
          <div className="card-body text-center py-5">
            <i className="bi bi-bag-x fs-1 text-muted mb-3"></i>
            <h5>No orders found</h5>
            <p className="text-muted">
              {filter === 'all' 
                ? "You haven't placed any orders yet" 
                : `No ${filter} orders`}
            </p>
            <Link to="/collections" className="btn btn-primary">
              Start Shopping
            </Link>
          </div>
        </div>
      ) : (
        <div className="row g-3">
          {filteredOrders.map((order) => (
            <div key={order.id} className="col-12">
              <div className="card shadow-sm">
                <div className="card-body">
                  <div className="row align-items-center">
                    <div className="col-md-2">
                      <h6 className="mb-1">Order #{order.id}</h6>
                      <small className="text-muted">
                        {new Date(order.created_at).toLocaleDateString()}
                      </small>
                    </div>
                    <div className="col-md-2">
                      <small className="text-muted d-block">Items</small>
                      <strong>{order.total_items}</strong>
                    </div>
                    <div className="col-md-3">
                      <small className="text-muted d-block">Total Amount</small>
                      <strong>₦{parseFloat(order.total_amount).toLocaleString()}</strong>
                    </div>
                    <div className="col-md-2">
                      <span className={`badge ${getStatusBadge(order.status)}`}>
                        {order.status.toUpperCase()}
                      </span>
                    </div>
                    <div className="col-md-3 text-end">
                      <Link
                        to={`/account/order/${order.id}`}
                        className="btn btn-sm btn-outline-primary"
                      >
                        <i className="bi bi-eye me-1"></i>
                        View Details
                      </Link>
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

export default AccountOrders;
