import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-dark text-white py-5 mt-auto" style={{ backgroundColor: 'var(--color-off-black) !important' }}>
      <div className="container">
        <div className="row g-4">
          <div className="col-md-3">
            <div className="d-flex align-items-center mb-3">
              <img 
                src="/nelly-icon.svg" 
                alt="NELLY" 
                style={{ height: '50px', width: '50px', marginRight: '12px' }}
              />
              <h5 className="font-serif fw-bold fs-4 mb-0" style={{ letterSpacing: '-0.02em' }}>NELLY</h5>
            </div>
            <p className="text-white-50 small">
              Redefining Nigerian fashion with contemporary style and cultural heritage.
            </p>
            <div className="d-flex gap-3 mt-3">
              <a href="#" className="text-white">
                <i className="bi bi-facebook"></i>
              </a>
              <a href="#" className="text-white">
                <i className="bi bi-instagram"></i>
              </a>
              <a href="#" className="text-white">
                <i className="bi bi-twitter-x"></i>
              </a>
            </div>
          </div>
          <div className="col-md-3">
            <h6 className="text-uppercase-tracking mb-4 text-white-50">Quick Links</h6>
            <ul className="list-unstyled text-white-50 small">
              <li className="mb-2">
                <Link to="/about" className="text-reset text-decoration-none">
                  About Us
                </Link>
              </li>
              <li className="mb-2">
                <Link to="/contact" className="text-reset text-decoration-none">
                  Contact
                </Link>
              </li>
              <li className="mb-2">
                <a href="#" className="text-reset text-decoration-none">
                  Shipping & Returns
                </a>
              </li>
              <li className="mb-2">
                <a href="#" className="text-reset text-decoration-none">
                  Size Guide
                </a>
              </li>
            </ul>
          </div>
          <div className="col-md-3">
            <h6 className="text-uppercase-tracking mb-4 text-white-50">Customer Care</h6>
            <ul className="list-unstyled text-white-50 small">
              <li className="mb-2">
                <a href="#" className="text-reset text-decoration-none">
                  FAQ
                </a>
              </li>
              <li className="mb-2">
                <a href="#" className="text-reset text-decoration-none">
                  Privacy Policy
                </a>
              </li>
              <li className="mb-2">
                <a href="#" className="text-reset text-decoration-none">
                  Terms of Service
                </a>
              </li>
              <li className="mb-2">
                <a href="#" className="text-reset text-decoration-none">
                  Sustainability
                </a>
              </li>
            </ul>
          </div>
          <div className="col-md-3">
            <h6 className="text-uppercase-tracking mb-4 text-white-50">Contact</h6>
            <ul className="list-unstyled text-white-50 small">
              <li className="mb-2">
                <i className="bi bi-geo-alt me-2"></i> Victoria Island, Lagos
              </li>
              <li className="mb-2">
                <i className="bi bi-envelope me-2"></i> hello@nelly.ng
              </li>
              <li className="mb-2">
                <i className="bi bi-telephone me-2"></i> +234 801 234 5678
              </li>
            </ul>
          </div>
        </div>
        <hr className="border-secondary my-4" />
        <div className="row align-items-center">
          <div className="col-md-6 text-center text-md-start small text-white-50">
            &copy; {new Date().getFullYear()} NELLY Fashion. All rights reserved.
          </div>
          <div className="col-md-6 text-center text-md-end fs-5 text-white-50">
            <i className="bi bi-credit-card me-2"></i>
            <i className="bi bi-paypal me-2"></i>
            <i className="bi bi-apple"></i>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
