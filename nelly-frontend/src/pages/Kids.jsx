import { useState, useEffect } from 'react';
import { productsAPI } from '../services/api';
import ProductCard from '../components/products/ProductCard';

const Kids = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await productsAPI.getAll({ category: 'kids' });
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
      <section className="py-5" style={{ background: 'linear-gradient(135deg, #ffeb3b 0%, #ff9800 50%, #ff5722 100%)', color: 'white' }}>
        <div className="container text-center">
          <h1 className="display-2 fw-bold">
            <i className="bi bi-star-fill me-3"></i>
            Kids Collection
            <i className="bi bi-star-fill ms-3"></i>
          </h1>
          <p className="lead fs-4">Fun, Fashion & Comfort!</p>
        </div>
      </section>

      <section className="py-5">
        <div className="container">
          {loading ? (
            <div className="text-center py-5">
              <div className="spinner-border" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          ) : (
            <div className="row">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Kids;
