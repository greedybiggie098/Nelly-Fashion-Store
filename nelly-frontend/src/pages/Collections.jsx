import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { productsAPI } from '../services/api';
import ProductCard from '../components/products/ProductCard';

const Collections = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchProducts();
  }, [filter]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const params = filter !== 'all' ? { category: filter } : {};
      const response = await productsAPI.getAll(params);
      if (response.data.success) {
        setProducts(response.data.products);
      }
    } catch (error) {
      console.error('Failed to fetch products:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {/* Hero */}
      <section className="bg-dark text-white py-5 mt-4">
        <div className="container text-center py-5">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="font-serif display-3 fw-bold mb-3"
          >
            Our Collections
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="lead text-white-50"
          >
            Discover curated fashion collections for every style and occasion
          </motion.p>
        </div>
      </section>

      {/* Filters */}
      <section className="py-4 bg-light">
        <div className="container">
          <div className="d-flex justify-content-center gap-3 flex-wrap">
            <button
              className={`btn ${filter === 'all' ? 'btn-premium' : 'btn-outline-premium'}`}
              onClick={() => setFilter('all')}
            >
              All
            </button>
            <button
              className={`btn ${filter === 'women' ? 'btn-premium' : 'btn-outline-premium'}`}
              onClick={() => setFilter('women')}
            >
              Women
            </button>
            <button
              className={`btn ${filter === 'men' ? 'btn-premium' : 'btn-outline-premium'}`}
              onClick={() => setFilter('men')}
            >
              Men
            </button>
            <button
              className={`btn ${filter === 'kids' ? 'btn-premium' : 'btn-outline-premium'}`}
              onClick={() => setFilter('kids')}
            >
              Kids
            </button>
            <button
              className={`btn ${filter === 'accessories' ? 'btn-premium' : 'btn-outline-premium'}`}
              onClick={() => setFilter('accessories')}
            >
              Accessories
            </button>
          </div>
        </div>
      </section>

      {/* Products */}
      <section className="py-5">
        <div className="container">
          {loading ? (
            <div className="text-center py-5">
              <div className="spinner-border" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          ) : products.length > 0 ? (
            <div className="row">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="text-center py-5">
              <p className="text-muted">No products found</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Collections;
