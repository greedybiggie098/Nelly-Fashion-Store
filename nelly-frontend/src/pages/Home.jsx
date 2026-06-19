import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { productsAPI } from '../services/api';
import ProductCard from '../components/products/ProductCard';
import { motion } from 'framer-motion';

const Home = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFeaturedProducts();
  }, []);

  const fetchFeaturedProducts = async () => {
    try {
      const response = await productsAPI.getAll({ featured: 1 });
      if (response.data.success) {
        setFeaturedProducts(response.data.products.slice(0, 8));
      }
    } catch (error) {
      console.error('Failed to fetch products:', error);
    } finally {
      setLoading(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.2 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
  };

  return (
    <div>
      {/* Hero Section */}
      <section className="position-relative overflow-hidden" style={{ height: '90vh' }}>
        <motion.div 
          initial={{ scale: 1.1 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          className="w-100 h-100 position-absolute top-0 start-0"
        >
          <img
            src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1920&h=1080&fit=crop"
            className="w-100 h-100 object-fit-cover"
            alt="Hero Fashion"
          />
          <div className="position-absolute top-0 start-0 w-100 h-100" style={{ background: 'linear-gradient(to right, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0.2) 100%)' }}></div>
        </motion.div>

        <div className="container position-relative h-100 d-flex align-items-center">
          <div className="row w-100 justify-content-center text-center">
            <div className="col-md-8 text-white">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
              >
                <p className="text-uppercase-tracking mb-3" style={{ letterSpacing: '0.2em' }}>New Season 2026</p>
                <h1 className="font-serif fw-bold display-2 mb-4" style={{ lineHeight: '1.1' }}>
                  Elevate Your<br />Everyday Style.
                </h1>
                <p className="lead mx-auto mb-5" style={{ maxWidth: '500px', opacity: 0.9 }}>
                  Discover the intersection of contemporary design and uncompromising quality.
                </p>
                <div className="d-flex justify-content-center gap-3">
                  <Link to="/collections" className="btn btn-premium-light px-5 py-3 border-light border-2 text-dark" style={{ backgroundColor: 'white' }}>
                    Shop Collection
                  </Link>
                  <Link to="/about" className="btn px-5 py-3 rounded-0 text-uppercase-tracking d-flex align-items-center border-light border-2 text-white" style={{ backgroundColor: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(5px)' }}>
                    Our Story
                  </Link>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Ribbon */}
      <div className="bg-light border-bottom py-5">
        <div className="container">
          <div className="row text-center g-4">
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }} className="col-md-3 col-6">
              <i className="bi bi-box-seam fs-4 mb-3 d-block"></i>
              <span className="text-uppercase-tracking d-block">Free Shipping</span>
              <span className="small text-muted">On all orders over ₦50k</span>
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 }} className="col-md-3 col-6">
              <i className="bi bi-arrow-return-left fs-4 mb-3 d-block"></i>
              <span className="text-uppercase-tracking d-block">Easy Returns</span>
              <span className="small text-muted">30-day return policy</span>
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.3 }} className="col-md-3 col-6">
              <i className="bi bi-shield-check fs-4 mb-3 d-block"></i>
              <span className="text-uppercase-tracking d-block">Secure Payment</span>
              <span className="small text-muted">100% secure checkout</span>
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.4 }} className="col-md-3 col-6">
              <i className="bi bi-gem fs-4 mb-3 d-block"></i>
              <span className="text-uppercase-tracking d-block">Premium Quality</span>
              <span className="small text-muted">Crafted to last</span>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Shop by Category - Edge to Edge */}
      <section className="py-5 my-5 container-fluid px-md-5">
        <div className="text-center mb-5">
          <h2 className="font-serif display-5 fw-bold">Curated Collections</h2>
          <p className="text-muted">Explore our latest arrivals by category</p>
        </div>
        
        <div className="row g-3">
          <div className="col-md-6">
            <Link to="/women" className="text-decoration-none d-block h-100 image-zoom-container">
              <div className="position-relative h-100 bg-dark" style={{ minHeight: '600px' }}>
                <img src="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800&h=1000&fit=crop" className="w-100 h-100 object-fit-cover opacity-75" alt="Women" />
                <div className="position-absolute bottom-0 start-0 p-5 w-100" style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.8), transparent)' }}>
                  <h3 className="font-serif text-white fs-1 mb-2">Women</h3>
                  <span className="text-white link-hover-underline text-uppercase-tracking">Shop Now</span>
                </div>
              </div>
            </Link>
          </div>
          <div className="col-md-6">
            <div className="row g-3 h-100">
              <div className="col-12">
                <Link to="/men" className="text-decoration-none d-block h-100 image-zoom-container">
                  <div className="position-relative h-100 bg-dark" style={{ minHeight: '290px' }}>
                    <img src="https://images.unsplash.com/photo-1617137968427-85924c800a22?w=800&h=500&fit=crop" className="w-100 h-100 object-fit-cover opacity-75" alt="Men" />
                    <div className="position-absolute bottom-0 start-0 p-4 w-100" style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.8), transparent)' }}>
                      <h3 className="font-serif text-white fs-2 mb-2">Men</h3>
                      <span className="text-white link-hover-underline text-uppercase-tracking">Shop Now</span>
                    </div>
                  </div>
                </Link>
              </div>
              <div className="col-6">
                <Link to="/kids" className="text-decoration-none d-block h-100 image-zoom-container">
                  <div className="position-relative h-100 bg-dark" style={{ minHeight: '290px' }}>
                    <img src="https://images.unsplash.com/photo-1514090458221-65bb69cf63e6?w=400&h=500&fit=crop" className="w-100 h-100 object-fit-cover opacity-75" alt="Kids" />
                    <div className="position-absolute bottom-0 start-0 p-4 w-100" style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.8), transparent)' }}>
                      <h3 className="font-serif text-white fs-3 mb-2">Kids</h3>
                      <span className="text-white link-hover-underline text-uppercase-tracking">Shop Now</span>
                    </div>
                  </div>
                </Link>
              </div>
              <div className="col-6">
                <Link to="/sale" className="text-decoration-none d-block h-100 image-zoom-container">
                  <div className="position-relative h-100 bg-dark" style={{ minHeight: '290px' }}>
                    <img src="https://images.unsplash.com/photo-1607083206968-13611e3d76db?w=400&h=500&fit=crop" className="w-100 h-100 object-fit-cover opacity-75" alt="Sale" />
                    <div className="position-absolute bottom-0 start-0 p-4 w-100" style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.8), transparent)' }}>
                      <h3 className="font-serif text-white fs-3 mb-2">Sale</h3>
                      <span className="text-white link-hover-underline text-uppercase-tracking">View Offers</span>
                    </div>
                  </div>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-5 my-5">
        <div className="container">
          <div className="d-flex justify-content-between align-items-end mb-5">
            <div>
              <h2 className="font-serif fw-bold display-6 mb-2">Trending Now</h2>
              <p className="text-muted mb-0">Our most sought-after pieces this season</p>
            </div>
            <Link to="/collections" className="link-hover-underline text-dark text-uppercase-tracking d-none d-md-block">
              View All Products
            </Link>
          </div>

          {loading ? (
            <div className="text-center py-5">
              <div className="spinner-border text-dark" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          ) : (
            <motion.div 
              variants={containerVariants}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: "-100px" }}
              className="row"
            >
              {featuredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </motion.div>
          )}
          
          <div className="text-center mt-5 d-block d-md-none">
            <Link to="/collections" className="btn btn-outline-premium w-100">
              View All Products
            </Link>
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-5 my-5 bg-light">
        <div className="container text-center py-5">
          <div className="row justify-content-center">
            <div className="col-md-6">
              <i className="bi bi-envelope-paper fs-1 text-muted mb-3 d-block"></i>
              <h3 className="font-serif fw-bold mb-3">Join The Club</h3>
              <p className="text-muted mb-5">
                Subscribe to our newsletter to receive exclusive updates, early access to new collections, and styling advice.
              </p>
              <form onSubmit={(e) => e.preventDefault()}>
                <div className="input-group mb-3 border border-dark">
                  <input
                    type="email"
                    className="form-control form-control-lg rounded-0 border-0 bg-transparent"
                    placeholder="Enter your email address"
                    required
                  />
                  <button className="btn btn-premium rounded-0 px-4 border-0" type="submit">
                    Subscribe
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
