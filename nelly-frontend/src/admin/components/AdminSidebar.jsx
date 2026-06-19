import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './AdminSidebar.css';

const AdminSidebar = ({ isOpen, toggleSidebar }) => {
  const location = useLocation();
  const { logout } = useAuth();

  const isActive = (path) => location.pathname === path;

  const menuItems = [
    { path: '/admin/dashboard', icon: 'bi-grid-fill', label: 'Dashboard', color: 'primary' },
    { path: '/admin/products', icon: 'bi-box-seam-fill', label: 'Products', color: 'blue' },
    { path: '/admin/orders', icon: 'bi-cart-check-fill', label: 'Orders', color: 'green' },
    { path: '/admin/users', icon: 'bi-people-fill', label: 'Users', color: 'yellow' },
    { path: '/admin/categories', icon: 'bi-tags-fill', label: 'Categories', color: 'pink' },
    { path: '/admin/contacts', icon: 'bi-envelope-fill', label: 'Contacts', color: 'red' },
  ];

  const handleLogout = async () => {
    await logout();
  };

  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="admin-sidebar-overlay"
          onClick={toggleSidebar}
        ></div>
      )}

      {/* Sidebar */}
      <aside className={`admin-sidebar ${isOpen ? 'admin-sidebar-open' : ''}`}>
        {/* Logo/Brand */}
        <div className="admin-sidebar-header">
          <Link to="/admin/dashboard" className="admin-sidebar-brand">
            <div className="admin-sidebar-logo">
              <img 
                src="/nelly-icon.svg" 
                alt="NELLY" 
              />
            </div>
            <div>
              <h3 className="admin-sidebar-brand-title">NELLY</h3>
              <p className="admin-sidebar-brand-subtitle">Admin Panel</p>
            </div>
          </Link>
        </div>

        {/* Menu Items */}
        <nav className="admin-sidebar-nav">
          <ul className="admin-sidebar-menu">
            {menuItems.map((item) => (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={`admin-sidebar-menu-item ${
                    isActive(item.path) ? 'admin-sidebar-menu-item-active' : ''
                  }`}
                  onClick={() => window.innerWidth < 992 && toggleSidebar()}
                >
                  <div className="admin-sidebar-menu-item-content">
                    <div className={`admin-sidebar-menu-icon admin-sidebar-menu-icon-${item.color}`}>
                      <i className={`bi ${item.icon}`}></i>
                    </div>
                    <span>{item.label}</span>
                  </div>
                  {isActive(item.path) && (
                    <i className="bi bi-chevron-right"></i>
                  )}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Footer */}
        <div className="admin-sidebar-footer">
          <button
            onClick={handleLogout}
            className="admin-sidebar-logout"
          >
            <i className="bi bi-box-arrow-right"></i>
            <span>Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default AdminSidebar;
