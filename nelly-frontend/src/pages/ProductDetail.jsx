import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { productsAPI } from '../services/api';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

const ProductDetail = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { isAuthenticated } = useAuth();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    fetchProduct();
  }, [slug]);

  const fetchProduct = async () => {
    try {
      const response = await productsAPI.getBySlug(slug);
      if (response.data.success) {
        const prod = response.data.product;
        setProduct(prod);
        if (prod.sizes && prod.sizes.length > 0) setSelectedSize(prod.sizes[0]);
        if (prod.colors && prod.colors.length > 0) setSelectedColor(prod.colors[0]);
      }
    } catch (error) {
      console.error('Failed to fetch product:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    setAdding(true);
    await addToCart(product, selectedSize, selectedColor, quantity);
    setAdding(false);
  };

  const formatPrice = (price) => {
    return `₦${(price * 1650).toLocaleString('en-NG', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  if (loading) {
    return (
      <div className="container py-5">
        <div className="text-center">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container py-5">
        <div className="text-center">
          <h3>Product not found</h3>
          <button className="btn btn-dark mt-3" onClick={() => navigate('/collections')}>
            Back to Collections
          </button>
        </div>
      </div>
    );
  }

  const displayPrice = product.discount_percentage > 0 ? product.discounted_price : product.price;

  return (
    <div className="container py-5">
      <div className="row">
        <div className="col-md-6 mb-4 mb-md-0 position-sticky" style={{ top: '100px', alignSelf: 'flex-start' }}>
          <img
            src={product.image}
            alt={product.name}
            className="img-fluid w-100"
            style={{ maxHeight: '600px', objectFit: 'cover' }}
          />
        </div>
        <div className="col-md-5 offset-md-1">
          <h1 className="font-serif fw-bold mb-3 display-5">{product.name}</h1>
          
          <div className="mb-4">
            <span className="font-serif fs-3 fw-bold text-dark">{formatPrice(displayPrice)}</span>
            {product.discount_percentage > 0 && (
              <>
                <span className="text-muted text-decoration-line-through ms-3">
                  {formatPrice(product.price)}
                </span>
                <span className="badge bg-danger ms-2">-{product.discount_percentage}%</span>
              </>
            )}
          </div>

          <p className="text-muted mb-4">{product.description}</p>

          {product.sizes && product.sizes.length > 0 && (
            <div className="mb-4">
              <label className="text-uppercase-tracking mb-2 d-block">Size</label>
              <div className="d-flex gap-2">
                {product.sizes.map((size) => (
                  <button
                    key={size}
                    className={`btn ${selectedSize === size ? 'btn-premium' : 'btn-outline-premium'} rounded-0`}
                    style={{ padding: '0.5rem 1rem' }}
                    onClick={() => setSelectedSize(size)}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          )}

          {product.colors && product.colors.length > 0 && (
            <div className="mb-4">
              <label className="text-uppercase-tracking mb-2 d-block">Color</label>
              <div className="d-flex gap-2">
                {product.colors.map((color) => (
                  <button
                    key={color}
                    className={`btn ${selectedColor === color ? 'btn-premium' : 'btn-outline-premium'} rounded-0`}
                    style={{ padding: '0.5rem 1rem' }}
                    onClick={() => setSelectedColor(color)}
                  >
                    {color}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="mb-4">
            <label className="text-uppercase-tracking mb-2 d-block">Quantity</label>
            <div className="input-group border border-dark" style={{ maxWidth: '150px' }}>
              <button
                className="btn btn-light rounded-0 border-0 px-3"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
              >
                -
              </button>
              <input
                type="number"
                className="form-control text-center rounded-0 border-0 bg-transparent"
                value={quantity}
                onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                min="1"
              />
              <button
                className="btn btn-light rounded-0 border-0 px-3"
                onClick={() => setQuantity(quantity + 1)}
              >
                +
              </button>
            </div>
          </div>

          <div className="d-grid gap-2 mt-5">
            <button
              className="btn btn-premium btn-lg w-100"
              onClick={handleAddToCart}
              disabled={adding || product.stock === 0}
            >
              {adding ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2"></span>
                  Adding...
                </>
              ) : product.stock === 0 ? (
                'Out of Stock'
              ) : (
                <>
                  <i className="bi bi-bag-plus me-2"></i>
                  Add to Cart
                </>
              )}
            </button>
          </div>

          <div className="mt-5 pt-4 border-top">
            <p className="mb-3 small text-muted">
              <i className="bi bi-truck me-2"></i>
              <strong>Free Shipping</strong> on orders over ₦50,000
            </p>
            <p className="mb-2">
              <i className="bi bi-arrow-counterclockwise me-2"></i>
              <strong>30-Day Returns</strong> - Easy returns policy
            </p>
            <p className="mb-2">
              <i className="bi bi-shield-check me-2"></i>
              <strong>Secure Payment</strong> - Your data is protected
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
