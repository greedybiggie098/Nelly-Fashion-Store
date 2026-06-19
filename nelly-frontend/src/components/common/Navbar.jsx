import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { useState, useEffect, useRef } from 'react';

const Navbar = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const { getCartCount } = useCart();
  const { wishlistCount } = useWishlist();
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const closeDropdown = () => {
    setDropdownOpen(false);
  };

  const closeMobileMenu = () => {
    const navbarContent = document.getElementById('navbarContent');
    if (navbarContent && navbarContent.classList.contains('show')) {
      const toggler = document.querySelector('.navbar-toggler');
      if (toggler && window.getComputedStyle(toggler).display !== 'none') {
        toggler.click();
      }
    }
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };

    if (dropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [dropdownOpen]);

  return (
    <nav className="navbar navbar-expand-lg glass-nav sticky-top py-3" style={{ zIndex: 1030 }}>
      <div className="container">
        <Link className="navbar-brand d-flex align-items-center" to="/" onClick={closeMobileMenu}>
          <img 
            src="/nelly-icon.svg" 
            alt="NELLY" 
            style={{ height: '40px', width: '40px', marginRight: '10px' }}
          />
          <span className="font-serif fs-3 fw-bold" style={{ letterSpacing: '-0.02em' }}>NELLY</span>
        </Link>
        <button
          className="navbar-toggler border-0"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarContent"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarContent">
          <ul className="navbar-nav mx-auto mb-2 mb-lg-0 text-uppercase-tracking gap-4 text-center">
            <li className="nav-item px-2">
              <Link className="nav-link" to="/" onClick={closeMobileMenu}>
                Home
              </Link>
            </li>
            <li className="nav-item px-2">
              <Link className="nav-link link-hover-underline" to="/collections" onClick={closeMobileMenu}>
                Collections
              </Link>
            </li>
            <li className="nav-item px-2">
              <Link className="nav-link link-hover-underline" to="/sale" onClick={closeMobileMenu}>
                Sale
              </Link>
            </li>
            <li className="nav-item px-2">
              <Link className="nav-link link-hover-underline" to="/about" onClick={closeMobileMenu}>
                About
              </Link>
            </li>
            <li className="nav-item px-2">
              <Link className="nav-link link-hover-underline" to="/contact" onClick={closeMobileMenu}>
                Contact
              </Link>
            </li>
          </ul>

          <div className="d-flex align-items-center justify-content-center gap-3 mt-3 mt-lg-0">
            {isAuthenticated ? (
              <>
                <div className="dropdown position-relative" ref={dropdownRef}>
                  <button
                    className="btn btn-link text-dark text-decoration-none p-0 border-0 d-flex align-items-center gap-2"
                    type="button"
                    onClick={toggleDropdown}
                    aria-expanded={dropdownOpen}
                    style={{ background: 'none' }}
                  >
                    {user?.avatar ? (
                      <img
                        src={`${import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'}/${user.avatar}`}
                        alt={user.name}
                        className="rounded-circle border border-2 border-light shadow-sm"
                        style={{ 
                          width: '40px', 
                          height: '40px', 
                          objectFit: 'cover',
                          cursor: 'pointer'
                        }}
                      />
                    ) : (
                      <div
                        className="rounded-circle d-inline-flex align-items-center justify-content-center border border-2 border-light shadow-sm"
                        style={{ 
                          width: '40px', 
                          height: '40px', 
                          fontSize: '1rem',
                          fontWeight: '600',
                          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                          color: 'white',
                          cursor: 'pointer'
                        }}
                      >
                        {user?.name?.charAt(0).toUpperCase()}
                      </div>
                    )}
                    <i className="bi bi-chevron-down small"></i>
                  </button>
                  <ul className={`dropdown-menu dropdown-menu-end shadow-lg border-0 ${dropdownOpen ? 'show' : ''}`} style={{ minWidth: '180px', maxWidth: '220px', marginTop: '0.5rem' }}>
                    {/* Admin Dashboard - Only for Admins */}
                    {user?.role === 'admin' && (
                      <li>
                        <Link className="dropdown-item py-2 px-3 d-flex align-items-center" to="/admin/dashboard" onClick={() => { closeDropdown(); closeMobileMenu(); }}>
                          <i className="bi bi-speedometer2 me-2" style={{ fontSize: '1rem', color: '#667eea' }}></i>
                          <span className="fw-medium" style={{ fontSize: '0.875rem' }}>Admin Dashboard</span>
                        </Link>
                      </li>
                    )}
                    
                    {/* Logout */}
                    <li>
                      <button 
                        className="dropdown-item py-2 px-3 d-flex align-items-center text-danger w-100 border-0 bg-transparent text-start" 
                        onClick={() => { closeDropdown(); closeMobileMenu(); handleLogout(); }}
                        style={{ cursor: 'pointer' }}
                      >
                        <i className="bi bi-box-arrow-right me-2" style={{ fontSize: '1rem' }}></i>
                        <span className="fw-medium" style={{ fontSize: '0.875rem' }}>Logout</span>
                      </button>
                    </li>
                  </ul>
                </div>

                {/* Cart Icon */}
                <Link to="/cart" className="text-dark fs-5 position-relative" onClick={closeMobileMenu}>
                  <i className="bi bi-bag"></i>
                  {getCartCount() > 0 && (
                    <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger" style={{ fontSize: '0.6rem' }}>
                      {getCartCount()}
                    </span>
                  )}
                </Link>
              </>
            ) : (
              <Link to="/login" className="btn btn-premium px-4 text-decoration-none border-0" style={{ boxShadow: 'none' }} onClick={closeMobileMenu}>
                Login
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
