import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { accountAPI } from '../../services/accountApi';
import { useAuth } from '../../context/AuthContext';
import { useWishlist } from '../../context/WishlistContext';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import EmptyState from '../../components/ui/EmptyState';
import SkeletonLoader from '../../components/ui/SkeletonLoader';
import './Dashboard.css';

const Dashboard = () => {
  const { user } = useAuth();
  const { wishlistCount } = useWishlist();
  const [stats, setStats] = useState({
    totalOrders: 0,
    pendingOrders: 0,
    completedOrders: 0,
    totalAddresses: 0,
  });
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [ordersRes, addressesRes] = await Promise.all([
        accountAPI.getOrders(),
        accountAPI.getAddresses(),
      ]);

      if (ordersRes.data.success) {
        const orders = ordersRes.data.orders;
        setRecentOrders(orders.slice(0, 5));
        setStats(prev => ({
          ...prev,
          totalOrders: orders.length,
          pendingOrders: orders.filter(o => o.status === 'pending').length,
          completedOrders: orders.filter(o => o.status === 'delivered').length,
        }));
      }

      if (addressesRes.data.success) {
        setStats(prev => ({
          ...prev,
          totalAddresses: addressesRes.data.addresses.length,
        }));
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const variants = {
      pending: 'warning',
      processing: 'info',
      shipped: 'primary',
      delivered: 'success',
      cancelled: 'danger',
    };
    return variants[status] || 'default';
  };

  if (loading) {
    return (
      <div className="dashboard-loading">
        <div className="stats-grid">
          {[1, 2, 3, 4].map((i) => (
            <SkeletonLoader key={i} variant="card" />
          ))}
        </div>
        <SkeletonLoader variant="rect" height="400px" />
      </div>
    );
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: [0.4, 0, 0.2, 1]
      }
    }
  };

  return (
    <motion.div 
      className="account-dashboard"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      {/* Welcome Banner */}
      <motion.div variants={itemVariants}>
        <div className="welcome-banner">
          <div className="welcome-banner-bg">
            <div className="welcome-banner-shape shape-1"></div>
            <div className="welcome-banner-shape shape-2"></div>
            <div className="welcome-banner-shape shape-3"></div>
          </div>
          <div className="welcome-banner-content">
            <div className="welcome-banner-text">
              <div className="welcome-banner-greeting">
                <span className="greeting-icon">👋</span>
                <span>Welcome back</span>
              </div>
              <h1 className="welcome-banner-title">{user?.name}</h1>
              <p className="welcome-banner-description">
                Here's what's happening with your account today
              </p>
            </div>
            <div className="welcome-banner-illustration">
              <i className="bi bi-bag-heart-fill"></i>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Profile Overview Card */}
      <motion.div variants={itemVariants}>
        <div className="profile-overview-card">
          <div className="profile-overview-content">
            <div className="profile-overview-avatar">
              {user?.avatar ? (
                <img
                  src={`${import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'}/${user.avatar}`}
                  alt={user.name}
                  className="profile-avatar-image"
                />
              ) : (
                <div className="profile-avatar-placeholder">
                  {user?.name?.charAt(0).toUpperCase()}
                </div>
              )}
              <div className="profile-avatar-badge">
                <i className="bi bi-check-circle-fill"></i>
              </div>
            </div>
            <div className="profile-overview-info">
              <h3 className="profile-overview-name">{user?.name}</h3>
              <p className="profile-overview-email">
                <i className="bi bi-envelope me-2"></i>
                {user?.email}
              </p>
              {user?.phone && (
                <p className="profile-overview-phone">
                  <i className="bi bi-telephone me-2"></i>
                  {user.phone}
                </p>
              )}
              <div className="profile-overview-badge-container">
                <span className="profile-badge profile-badge-verified">
                  <i className="bi bi-patch-check-fill me-1"></i>
                  Verified Account
                </span>
                {user?.role === 'admin' && (
                  <span className="profile-badge profile-badge-admin">
                    <i className="bi bi-shield-fill-check me-1"></i>
                    Admin
                  </span>
                )}
              </div>
            </div>
          </div>
          <div className="profile-overview-actions">
            <Link to="/account/profile">
              <Button variant="primary" size="md">
                <i className="bi bi-person-circle me-2"></i>
                View Full Profile
              </Button>
            </Link>
            <Link to="/account/settings">
              <Button variant="outline" size="md">
                <i className="bi bi-gear me-2"></i>
                Settings
              </Button>
            </Link>
          </div>
        </div>
      </motion.div>

      {/* Stats Cards */}
      <motion.div className="stats-grid" variants={containerVariants}>
        <motion.div variants={itemVariants} whileHover={{ y: -8, scale: 1.02, transition: { duration: 0.3 } }}>
          <div className="stat-card stat-card-primary">
            <div className="stat-card-glow"></div>
            <div className="stat-card-content">
              <div className="stat-card-label">Total Orders</div>
              <motion.div 
                className="stat-card-value"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.5 }}
              >
                {stats.totalOrders}
              </motion.div>
            </div>
            <div className="stat-card-watermark">
              <i className="bi bi-bag-check-fill"></i>
            </div>
          </div>
        </motion.div>

        <motion.div variants={itemVariants} whileHover={{ y: -8, scale: 1.02, transition: { duration: 0.3 } }}>
          <div className="stat-card stat-card-warning">
            <div className="stat-card-glow"></div>
            <div className="stat-card-content">
              <div className="stat-card-label">Pending Orders</div>
              <motion.div 
                className="stat-card-value"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.5 }}
              >
                {stats.pendingOrders}
              </motion.div>
            </div>
            <div className="stat-card-watermark">
              <i className="bi bi-clock-history"></i>
            </div>
          </div>
        </motion.div>

        <motion.div variants={itemVariants} whileHover={{ y: -8, scale: 1.02, transition: { duration: 0.3 } }}>
          <div className="stat-card stat-card-danger">
            <div className="stat-card-glow"></div>
            <div className="stat-card-content">
              <div className="stat-card-label">Wishlist Items</div>
              <motion.div 
                className="stat-card-value"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.5 }}
              >
                {wishlistCount}
              </motion.div>
            </div>
            <div className="stat-card-watermark">
              <i className="bi bi-heart-fill"></i>
            </div>
          </div>
        </motion.div>

        <motion.div variants={itemVariants} whileHover={{ y: -8, scale: 1.02, transition: { duration: 0.3 } }}>
          <div className="stat-card stat-card-success">
            <div className="stat-card-glow"></div>
            <div className="stat-card-content">
              <div className="stat-card-label">Saved Addresses</div>
              <motion.div 
                className="stat-card-value"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.5 }}
              >
                {stats.totalAddresses}
              </motion.div>
            </div>
            <div className="stat-card-watermark">
              <i className="bi bi-geo-alt-fill"></i>
            </div>
          </div>
        </motion.div>
      </motion.div>

      {/* Recent Orders & Quick Actions */}
      <div className="dashboard-content-grid">
        {/* Recent Orders */}
        <motion.div variants={itemVariants}>
          <div className="dashboard-section">
            <div className="section-header">
              <div className="section-title">
                <div className="section-icon">
                  <i className="bi bi-clock-history"></i>
                </div>
                <div>
                  <h3>Recent Orders</h3>
                  <p>Your latest order activity</p>
                </div>
              </div>
              <Link to="/account/orders">
                <Button variant="ghost" size="sm">
                  View All <i className="bi bi-arrow-right ms-1"></i>
                </Button>
              </Link>
            </div>

            <div className="section-body">
              {recentOrders.length === 0 ? (
                <EmptyState
                  icon="bi-bag-x"
                  title="No orders yet"
                  description="Start shopping to see your orders here"
                  action={
                    <Link to="/collections">
                      <Button variant="primary">
                        <i className="bi bi-shop me-2"></i>
                        Browse Products
                      </Button>
                    </Link>
                  }
                />
              ) : (
                <div className="orders-table-container">
                  <table className="orders-table">
                    <thead>
                      <tr>
                        <th>Order</th>
                        <th>Date</th>
                        <th>Items</th>
                        <th>Total</th>
                        <th>Status</th>
                        <th></th>
                      </tr>
                    </thead>
                    <tbody>
                      {recentOrders.map((order, index) => (
                        <motion.tr 
                          key={order.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.1 * index, duration: 0.3 }}
                          whileHover={{ backgroundColor: 'rgba(0,0,0,0.02)' }}
                        >
                          <td className="order-id">#{order.id}</td>
                          <td>{new Date(order.created_at).toLocaleDateString()}</td>
                          <td>{order.total_items}</td>
                          <td className="order-total">₦{parseFloat(order.total_amount).toLocaleString()}</td>
                          <td>
                            <Badge variant={getStatusBadge(order.status)} size="sm">
                              {order.status}
                            </Badge>
                          </td>
                          <td>
                            <Link to={`/account/order/${order.id}`}>
                              <Button variant="ghost" size="sm">
                                <i className="bi bi-eye"></i>
                              </Button>
                            </Link>
                          </td>
                        </motion.tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </motion.div>

        {/* Quick Actions */}
        <motion.div variants={itemVariants}>
          <div className="dashboard-section">
            <div className="section-header">
              <div className="section-title">
                <div className="section-icon">
                  <i className="bi bi-lightning-charge-fill"></i>
                </div>
                <div>
                  <h3>Quick Actions</h3>
                  <p>Manage your account</p>
                </div>
              </div>
            </div>

            <div className="section-body">
              <div className="quick-actions-list">
                {[
                  { to: '/account/profile', icon: 'bi-person-circle', title: 'Update Profile', desc: 'Edit personal info', color: 'primary' },
                  { to: '/account/addresses', icon: 'bi-geo-alt-fill', title: 'Manage Addresses', desc: 'Delivery locations', color: 'success' },
                  { to: '/account/wishlist', icon: 'bi-heart-fill', title: 'View Wishlist', desc: `${wishlistCount} items saved`, color: 'danger' },
                  { to: '/account/change-password', icon: 'bi-shield-lock-fill', title: 'Security', desc: 'Update password', color: 'warning' },
                ].map((action, index) => (
                  <motion.div
                    key={action.to}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 * index, duration: 0.3 }}
                    whileHover={{ x: 4, transition: { duration: 0.2 } }}
                  >
                    <Link to={action.to} className="quick-action-item">
                      <div className={`quick-action-icon quick-action-icon-${action.color}`}>
                        <i className={`bi ${action.icon}`}></i>
                      </div>
                      <div className="quick-action-content">
                        <h4>{action.title}</h4>
                        <p>{action.desc}</p>
                      </div>
                      <i className="bi bi-chevron-right quick-action-arrow"></i>
                    </Link>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Dashboard;
