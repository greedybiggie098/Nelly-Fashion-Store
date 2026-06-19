import { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { dashboardAPI } from '../services/adminApi';
import { useAuth } from '../../context/AuthContext';
import toast from '../../utils/toast';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import EmptyState from '../../components/ui/EmptyState';
import SkeletonLoader from '../../components/ui/SkeletonLoader';
import './Dashboard.css';

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  const chartData = useMemo(() => {
    if (!stats?.monthly_revenue) return [];
    const last6Months = [];
    for (let i = 5; i >= 0; i--) {
      const d = new Date();
      d.setMonth(d.getMonth() - i);
      const monthStr = d.toISOString().substring(0, 7); // YYYY-MM
      const monthName = d.toLocaleString('default', { month: 'short' });
      
      const found = stats.monthly_revenue.find(m => m.month === monthStr);
      last6Months.push({
        name: monthName,
        revenue: found ? parseFloat(found.revenue) : 0
      });
    }
    return last6Months;
  }, [stats]);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const response = await dashboardAPI.getStats();
      if (response.data.success) {
        setStats(response.data.stats);
      }
    } catch (error) {
      console.error('Failed to fetch stats:', error);
      toast.error('Failed to load dashboard statistics');
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
      <div className="admin-dashboard-loading">
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
      className="admin-dashboard"
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
                <span>Welcome back, Admin</span>
              </div>
              <h1 className="welcome-banner-title">{user?.name}</h1>
              <p className="welcome-banner-description">
                Here's what's happening with your store today
              </p>
            </div>
            <div className="welcome-banner-illustration">
              <i className="bi bi-shield-check"></i>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Stats Cards */}
      <motion.div className="stats-grid" variants={containerVariants}>
        <motion.div variants={itemVariants} whileHover={{ y: -8, scale: 1.02, transition: { duration: 0.3 } }}>
          <div className="stat-card stat-card-success">
            <div className="stat-card-glow"></div>
            <div className="stat-card-content">
              <div className="stat-card-label">Total Revenue</div>
              <motion.div 
                className="stat-card-value"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.5 }}
              >
                ₦{(parseFloat(stats?.total_revenue || 0) * 1650).toLocaleString('en-NG', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
              </motion.div>
            </div>
            <div className="stat-card-watermark">
              <i className="bi bi-currency-dollar"></i>
            </div>
          </div>
        </motion.div>

        <motion.div variants={itemVariants} whileHover={{ y: -8, scale: 1.02, transition: { duration: 0.3 } }}>
          <div className="stat-card stat-card-primary">
            <div className="stat-card-glow"></div>
            <div className="stat-card-content">
              <div className="stat-card-label">Total Orders</div>
              <motion.div 
                className="stat-card-value"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.5 }}
              >
                {stats?.total_orders || 0}
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
              <div className="stat-card-label">Total Users</div>
              <motion.div 
                className="stat-card-value"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.5 }}
              >
                {stats?.total_users || 0}
              </motion.div>
            </div>
            <div className="stat-card-watermark">
              <i className="bi bi-people-fill"></i>
            </div>
          </div>
        </motion.div>

        <motion.div variants={itemVariants} whileHover={{ y: -8, scale: 1.02, transition: { duration: 0.3 } }}>
          <div className="stat-card stat-card-danger">
            <div className="stat-card-glow"></div>
            <div className="stat-card-content">
              <div className="stat-card-label">Total Products</div>
              <motion.div 
                className="stat-card-value"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.5 }}
              >
                {stats?.total_products || 0}
              </motion.div>
            </div>
            <div className="stat-card-watermark">
              <i className="bi bi-box-seam-fill"></i>
            </div>
          </div>
        </motion.div>
      </motion.div>

      {/* NEW: Chart Section */}
      <motion.div variants={itemVariants} style={{ marginBottom: '1.5rem' }}>
        <div className="dashboard-section chart-section">
          <div className="section-header">
            <div className="section-title">
              <div className="section-icon">
                <i className="bi bi-graph-up-arrow"></i>
              </div>
              <div>
                <h3>Revenue Overview</h3>
                <p>Monthly revenue performance</p>
              </div>
            </div>
          </div>
          <div className="section-body" style={{ height: '350px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#7C3AED" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#7C3AED" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748B', fontSize: 12}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748B', fontSize: 12}} dx={-10} tickFormatter={(value) => `₦${(value * 1650).toLocaleString()}`} />
                <CartesianGrid vertical={false} stroke="rgba(226, 232, 240, 0.5)" strokeDasharray="3 3" />
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: '1px solid rgba(255,255,255,0.5)', background: 'rgba(255,255,255,0.8)', backdropFilter: 'blur(10px)', boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.05)' }}
                  formatter={(value) => [`₦${(value * 1650).toLocaleString()}`, 'Revenue']}
                />
                <Area type="monotone" dataKey="revenue" stroke="#7C3AED" strokeWidth={3} fillOpacity={1} fill="url(#colorRevenue)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
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
                  <p>Latest customer orders</p>
                </div>
              </div>
              <Link to="/admin/orders">
                <Button variant="ghost" size="sm">
                  View All <i className="bi bi-arrow-right ms-1"></i>
                </Button>
              </Link>
            </div>

            <div className="section-body">
              {stats?.recent_orders?.length > 0 ? (
                <div className="orders-table-container">
                  <table className="orders-table">
                    <thead>
                      <tr>
                        <th>Order</th>
                        <th>Customer</th>
                        <th>Total</th>
                        <th>Status</th>
                        <th>Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {stats.recent_orders.map((order, index) => (
                        <motion.tr 
                          key={order.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.1 * index, duration: 0.3 }}
                          whileHover={{ backgroundColor: 'rgba(0,0,0,0.02)' }}
                        >
                          <td className="order-id">#{order.id}</td>
                          <td>{order.customer_name}</td>
                          <td className="order-total">₦{(parseFloat(order.total_price) * 1650).toLocaleString()}</td>
                          <td>
                            <Badge variant={getStatusBadge(order.status)} size="sm">
                              {order.status}
                            </Badge>
                          </td>
                          <td>{new Date(order.created_at).toLocaleDateString()}</td>
                        </motion.tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <EmptyState
                  icon="bi-cart-x"
                  title="No orders yet"
                  description="Orders will appear here once customers start purchasing"
                />
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
                  <p>Manage your store</p>
                </div>
              </div>
            </div>

            <div className="section-body">
              <div className="quick-actions-list">
                {[
                  { to: '/admin/products/create', icon: 'bi-plus-circle', title: 'Add Product', desc: 'Create new product', color: 'primary' },
                  { to: '/admin/orders', icon: 'bi-cart-check-fill', title: 'View Orders', desc: 'Manage all orders', color: 'success' },
                  { to: '/admin/users', icon: 'bi-people-fill', title: 'Manage Users', desc: 'User management', color: 'warning' },
                  { to: '/admin/categories', icon: 'bi-tags-fill', title: 'Categories', desc: 'Organize products', color: 'danger' },
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
