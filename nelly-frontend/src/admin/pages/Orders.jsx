import { useState, useEffect } from 'react';
import { ordersAPI } from '../services/adminApi';
import toast from '../../utils/toast';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState(false);

  useEffect(() => {
    fetchOrders();
  }, [page, statusFilter]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const params = {
        status: statusFilter,
        page,
        limit: 20,
      };
      const response = await ordersAPI.getAll(params);
      if (response.data.success) {
        setOrders(response.data.orders);
        setTotalPages(response.data.pages);
      }
    } catch (error) {
      console.error('Failed to fetch orders:', error);
      toast.error('Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  const viewOrderDetails = async (orderId) => {
    try {
      const response = await ordersAPI.getById(orderId);
      if (response.data.success) {
        setSelectedOrder(response.data.order);
        setShowModal(true);
      }
    } catch (error) {
      console.error('Failed to fetch order details:', error);
      toast.error('Failed to load order details');
    }
  };

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      setUpdatingStatus(true);
      const response = await ordersAPI.updateStatus(orderId, newStatus);
      if (response.data.success) {
        toast.success('Order status updated successfully');
        fetchOrders();
        if (selectedOrder && selectedOrder.id === orderId) {
          setSelectedOrder({ ...selectedOrder, status: newStatus });
        }
      } else {
        toast.error(response.data.message || 'Failed to update order status');
      }
    } catch (error) {
      console.error('Failed to update order status:', error);
      toast.error('Failed to update order status');
    } finally {
      setUpdatingStatus(false);
    }
  };

  const getStatusBadge = (status) => {
    const badges = {
      pending: 'warning',
      processing: 'info',
      shipped: 'primary',
      delivered: 'success',
      cancelled: 'danger',
    };
    return badges[status] || 'secondary';
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="orders-page">
      {/* Page Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="mb-1 fw-bold">Orders</h2>
          <p className="text-muted mb-0">Manage customer orders and update status</p>
        </div>
      </div>

      {/* Filters */}
      <div className="card border-0 shadow-sm mb-4">
        <div className="card-body">
          <div className="row g-3 align-items-center">
            <div className="col-auto">
              <label className="fw-semibold me-2">Filter by Status:</label>
            </div>
            <div className="col-auto">
              <select
                className="form-select"
                value={statusFilter}
                onChange={(e) => {
                  setStatusFilter(e.target.value);
                  setPage(1);
                }}
              >
                <option value="all">All Orders</option>
                <option value="pending">Pending</option>
                <option value="processing">Processing</option>
                <option value="shipped">Shipped</option>
                <option value="delivered">Delivered</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Orders Table */}
      <div className="card border-0 shadow-sm">
        <div className="card-body p-0">
          {loading ? (
            <div className="text-center py-5">
              <div className="spinner-border text-dark" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          ) : (
            <>
              <div className="table-responsive">
                <table className="table table-hover mb-0">
                  <thead className="bg-light">
                    <tr>
                      <th className="border-0 px-4 py-3">Order ID</th>
                      <th className="border-0 py-3">Customer</th>
                      <th className="border-0 py-3">Total</th>
                      <th className="border-0 py-3">Status</th>
                      <th className="border-0 py-3">Date</th>
                      <th className="border-0 py-3 text-end">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.length > 0 ? (
                      orders.map((order) => (
                        <tr key={order.id}>
                          <td className="px-4 py-3 fw-semibold">#{order.id}</td>
                          <td className="py-3">
                            <div>{order.customer_name}</div>
                            <small className="text-muted">{order.customer_email}</small>
                          </td>
                          <td className="py-3 fw-semibold">₦{(parseFloat(order.total_price) * 1650).toLocaleString('en-NG', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                          <td className="py-3">
                            <span className={`badge bg-${getStatusBadge(order.status)}`}>
                              {order.status}
                            </span>
                          </td>
                          <td className="py-3 text-muted">{formatDate(order.created_at)}</td>
                          <td className="py-3 text-end">
                            <button
                              onClick={() => viewOrderDetails(order.id)}
                              className="btn btn-sm btn-outline-primary"
                            >
                              <i className="bi bi-eye me-1"></i>
                              View
                            </button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="6" className="text-center py-5 text-muted">
                          No orders found
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="d-flex justify-content-center py-3 border-top">
                  <nav>
                    <ul className="pagination mb-0">
                      <li className={`page-item ${page === 1 ? 'disabled' : ''}`}>
                        <button
                          className="page-link"
                          onClick={() => setPage(page - 1)}
                          disabled={page === 1}
                        >
                          Previous
                        </button>
                      </li>
                      {[...Array(totalPages)].map((_, i) => (
                        <li key={i + 1} className={`page-item ${page === i + 1 ? 'active' : ''}`}>
                          <button className="page-link" onClick={() => setPage(i + 1)}>
                            {i + 1}
                          </button>
                        </li>
                      ))}
                      <li className={`page-item ${page === totalPages ? 'disabled' : ''}`}>
                        <button
                          className="page-link"
                          onClick={() => setPage(page + 1)}
                          disabled={page === totalPages}
                        >
                          Next
                        </button>
                      </li>
                    </ul>
                  </nav>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Order Details Modal */}
      {showModal && selectedOrder && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable">
            <div className="modal-content">
              <div className="modal-header border-0">
                <div>
                  <h5 className="modal-title fw-bold">Order #{selectedOrder.id}</h5>
                  <small className="text-muted">{formatDate(selectedOrder.created_at)}</small>
                </div>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowModal(false)}
                ></button>
              </div>
              <div className="modal-body">
                {/* Customer Info */}
                <div className="mb-4">
                  <h6 className="fw-bold mb-3">Customer Information</h6>
                  <div className="row">
                    <div className="col-md-6">
                      <p className="mb-1"><strong>Name:</strong> {selectedOrder.customer_name}</p>
                      <p className="mb-1"><strong>Email:</strong> {selectedOrder.customer_email}</p>
                    </div>
                    <div className="col-md-6">
                      <p className="mb-1"><strong>Status:</strong> 
                        <span className={`badge bg-${getStatusBadge(selectedOrder.status)} ms-2`}>
                          {selectedOrder.status}
                        </span>
                      </p>
                    </div>
                  </div>
                </div>

                {/* Shipping Address */}
                <div className="mb-4">
                  <h6 className="fw-bold mb-3">Shipping Address</h6>
                  <p className="mb-0">{selectedOrder.shipping_address}</p>
                </div>

                {/* Order Items */}
                <div className="mb-4">
                  <h6 className="fw-bold mb-3">Order Items</h6>
                  <div className="table-responsive">
                    <table className="table table-sm">
                      <thead className="bg-light">
                        <tr>
                          <th>Product</th>
                          <th>Size</th>
                          <th>Color</th>
                          <th>Quantity</th>
                          <th className="text-end">Price</th>
                        </tr>
                      </thead>
                      <tbody>
                        {selectedOrder.items?.map((item, index) => (
                          <tr key={index}>
                            <td>
                              <div className="d-flex align-items-center gap-2">
                                <img
                                  src={item.product_image || 'https://via.placeholder.com/40'}
                                  alt={item.product_name}
                                  style={{ width: '40px', height: '40px', objectFit: 'cover' }}
                                  className="rounded"
                                />
                                <span>{item.product_name}</span>
                              </div>
                            </td>
                            <td>{item.size || '-'}</td>
                            <td>{item.color || '-'}</td>
                            <td>{item.quantity}</td>
                            <td className="text-end">₦{(parseFloat(item.price) * 1650).toLocaleString('en-NG', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Order Summary */}
                <div className="border-top pt-3">
                  <div className="row">
                    <div className="col-md-6 ms-auto">
                      <div className="d-flex justify-content-between mb-2">
                        <span>Subtotal:</span>
                        <span>₦{(parseFloat(selectedOrder.subtotal) * 1650).toLocaleString('en-NG', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                      </div>
                      <div className="d-flex justify-content-between mb-2">
                        <span>Tax:</span>
                        <span>₦{(parseFloat(selectedOrder.tax) * 1650).toLocaleString('en-NG', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                      </div>
                      <div className="d-flex justify-content-between mb-2">
                        <span>Shipping:</span>
                        <span>₦{(parseFloat(selectedOrder.shipping) * 1650).toLocaleString('en-NG', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                      </div>
                      <div className="d-flex justify-content-between fw-bold fs-5 border-top pt-2">
                        <span>Total:</span>
                        <span>₦{(parseFloat(selectedOrder.total_price) * 1650).toLocaleString('en-NG', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Update Status */}
                <div className="mt-4 border-top pt-3">
                  <h6 className="fw-bold mb-3">Update Order Status</h6>
                  <div className="d-flex flex-wrap gap-2">
                    {['pending', 'processing', 'shipped', 'delivered', 'cancelled'].map((status) => (
                      <button
                        key={status}
                        className={`btn btn-sm ${
                          selectedOrder.status === status
                            ? `btn-${getStatusBadge(status)}`
                            : `btn-outline-${getStatusBadge(status)}`
                        }`}
                        onClick={() => updateOrderStatus(selectedOrder.id, status)}
                        disabled={updatingStatus || selectedOrder.status === status}
                      >
                        {status.charAt(0).toUpperCase() + status.slice(1)}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
              <div className="modal-footer border-0">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowModal(false)}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Orders;
