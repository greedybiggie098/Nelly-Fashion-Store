import { useAuth } from '../../context/AuthContext';
import { Link, useLocation } from 'react-router-dom';
import Avatar from '../../components/ui/Avatar';
import './AdminNavbar.css';

const AdminNavbar = ({ toggleSidebar }) => {
  const { user } = useAuth();
  const location = useLocation();

  const getPageTitle = () => {
    const path = location.pathname;
    if (path === '/admin/dashboard') return 'Dashboard';
    if (path.includes('/products')) return 'Products';
    if (path.includes('/orders')) return 'Orders';
    if (path.includes('/users')) return 'Users';
    if (path.includes('/categories')) return 'Categories';
    if (path.includes('/contacts')) return 'Contacts';
    return 'Admin Panel';
  };

  return (
    <nav className="admin-navbar">
      <div className="admin-navbar-container">
        {/* Left Side */}
        <div className="admin-navbar-left">
          {/* Mobile Menu Toggle */}
          <button
            className="admin-navbar-toggle"
            onClick={toggleSidebar}
          >
            <i className="bi bi-list"></i>
          </button>

          {/* Page Title */}
          <div className="admin-navbar-title">
            <h5>{getPageTitle()}</h5>
          </div>
        </div>

        {/* Right Side */}
        <div className="admin-navbar-right">
          {/* View Store */}
          <Link
            to="/"
            className="admin-navbar-store-btn"
            target="_blank"
          >
            <i className="bi bi-shop"></i>
            <span>View Store</span>
          </Link>

          {/* Admin Profile */}
          <div className="admin-navbar-profile">
            <Avatar 
              src={user?.avatar ? `${import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'}/${user.avatar}` : null}
              alt={user?.name}
              size="md"
              fallback={user?.name?.charAt(0).toUpperCase()}
            />
            <div className="admin-navbar-profile-info">
              <div className="admin-navbar-profile-name">{user?.name}</div>
              <div className="admin-navbar-profile-role">Administrator</div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default AdminNavbar;
