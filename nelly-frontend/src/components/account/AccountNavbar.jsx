import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { Link, useLocation } from 'react-router-dom';
import Badge from '../ui/Badge';
import './AccountNavbar.css';

const AccountNavbar = ({ toggleSidebar }) => {
  const { getCartCount } = useCart();
  const { wishlistCount } = useWishlist();
  const location = useLocation();

  const getPageTitle = () => {
    const path = location.pathname;
    if (path === '/account') return 'Dashboard';
    if (path.includes('/profile')) return 'My Profile';
    if (path.includes('/orders')) return 'My Orders';
    if (path.includes('/wishlist')) return 'Wishlist';
    if (path.includes('/addresses')) return 'Addresses';
    if (path.includes('/settings')) return 'Settings';
    if (path.includes('/change-password')) return 'Security';
    return 'My Account';
  };

  return (
    <nav className="account-navbar">
      <div className="account-navbar-container">
        {/* Left Side */}
        <div className="account-navbar-left">
          {/* Mobile Menu Toggle */}
          <button
            className="account-navbar-toggle"
            onClick={toggleSidebar}
          >
            <i className="bi bi-list"></i>
          </button>

          {/* Page Title */}
          <div className="account-navbar-title">
            <h5>{getPageTitle()}</h5>
          </div>
        </div>

        {/* Right Side */}
        <div className="account-navbar-right">
          {/* Wishlist */}
          <Link
            to="/account/wishlist"
            className="account-navbar-action"
          >
            <i className="bi bi-heart-fill"></i>
            <span className="account-navbar-action-label">Wishlist</span>
            {wishlistCount > 0 && (
              <Badge variant="danger" size="sm">
                {wishlistCount}
              </Badge>
            )}
          </Link>

          {/* Cart */}
          <Link
            to="/cart"
            className="account-navbar-action"
          >
            <i className="bi bi-bag-fill"></i>
            <span className="account-navbar-action-label">Cart</span>
            {getCartCount() > 0 && (
              <Badge variant="primary" size="sm">
                {getCartCount()}
              </Badge>
            )}
          </Link>

          {/* Back to Store */}
          <Link
            to="/"
            className="account-navbar-store-btn"
          >
            <i className="bi bi-shop"></i>
            <span>Store</span>
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default AccountNavbar;
