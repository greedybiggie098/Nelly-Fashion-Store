import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useWishlist } from '../../context/WishlistContext';
import Avatar from '../ui/Avatar';
import Badge from '../ui/Badge';
import './AccountSidebar.css';

const AccountSidebar = ({ isOpen, toggleSidebar }) => {
  const location = useLocation();
  const { user, logout } = useAuth();
  const { wishlistCount } = useWishlist();

  const isActive = (path) => {
    if (path === '/account') {
      return location.pathname === '/account';
    }
    return location.pathname.startsWith(path);
  };

  const menuItems = [
    { path: '/account', icon: 'bi-grid-fill', label: 'Dashboard', badge: null },
    ...(user?.role === 'admin' ? [{ path: '/admin/dashboard', icon: 'bi-speedometer2', label: 'Admin Dashboard', badge: null }] : []),
    { path: '/account/profile', icon: 'bi-person-fill', label: 'My Profile', badge: null },
    { path: '/account/orders', icon: 'bi-bag-check-fill', label: 'My Orders', badge: null },
    { path: '/account/wishlist', icon: 'bi-heart-fill', label: 'Wishlist', badge: wishlistCount },
    { path: '/account/addresses', icon: 'bi-geo-alt-fill', label: 'Addresses', badge: null },
    { path: '/account/settings', icon: 'bi-gear-fill', label: 'Settings', badge: null },
    { path: '/account/change-password', icon: 'bi-shield-lock-fill', label: 'Security', badge: null },
  ];

  const handleLogout = async () => {
    await logout();
  };

  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="account-sidebar-overlay"
          onClick={toggleSidebar}
        ></div>
      )}

      {/* Sidebar */}
      <aside className={`account-sidebar ${isOpen ? 'account-sidebar-open' : ''}`}>
        {/* Logo/Brand */}
        <div className="account-sidebar-header">
          <Link to="/" className="account-sidebar-brand">
            <div className="account-sidebar-logo">
              <i className="bi bi-bag-heart-fill"></i>
            </div>
            <div>
              <h3 className="account-sidebar-brand-title">NELLY</h3>
              <p className="account-sidebar-brand-subtitle">Fashion Store</p>
            </div>
          </Link>
        </div>

        {/* Menu Items */}
        <nav className="account-sidebar-nav">
          <ul className="account-sidebar-menu">
            {menuItems.map((item) => (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={`account-sidebar-menu-item ${
                    isActive(item.path) ? 'account-sidebar-menu-item-active' : ''
                  }`}
                  onClick={() => window.innerWidth < 992 && toggleSidebar()}
                >
                  <div className="account-sidebar-menu-item-content">
                    <i className={`bi ${item.icon}`}></i>
                    <span>{item.label}</span>
                  </div>
                  {item.badge > 0 && (
                    <Badge variant="danger" size="sm">
                      {item.badge}
                    </Badge>
                  )}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Logout */}
        <div className="account-sidebar-footer">
          <button
            onClick={handleLogout}
            className="account-sidebar-logout"
          >
            <i className="bi bi-box-arrow-right"></i>
            <span>Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default AccountSidebar;
