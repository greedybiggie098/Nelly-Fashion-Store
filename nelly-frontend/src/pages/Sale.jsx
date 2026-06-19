import { useState, useEffect } from 'react';
import { productsAPI } from '../services/api';
import ProductCard from '../components/products/ProductCard';

const Sale = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await productsAPI.getAll();
      if (response.data.success) {
        // Filter products with discounts
        const saleProducts = response.data.products.filter(p => p.discount_percentage > 0);
        setProducts(saleProducts);
      }
    } catch (error) {
      console.error('Failed to fetch products:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <section className="bg-danger text-white py-5">
        <div className="container text-center">
          <h1 className="display-2 fw-bold text-uppercase">Mega Sale Event</h1>
          <p className="lead">Up to 75% off - Limited time only!</p>
        </div>
      </section>

      <section className="py-5">
        <div className="container">
          <h2 className="fw-bold mb-4">
            Sale Items{' '}
            <span className="badge bg-danger ms-2">{products.length} Products</span>
          </h2>
          
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
              <p className="text-muted">No sale items available at the moment</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Sale;
