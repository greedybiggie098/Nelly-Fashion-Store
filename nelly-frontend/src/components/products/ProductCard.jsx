import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const ProductCard = ({ product }) => {
  const displayPrice = product.discount_percentage > 0 
    ? product.discounted_price 
    : product.price;

  const formatPrice = (price) => {
    return `₦${(price * 1650).toLocaleString('en-NG', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="col-md-3 col-sm-6 mb-4"
    >
      <div className="card h-100 border-0 rounded-0 bg-transparent">
        <Link to={`/product/${product.slug}`} className="text-decoration-none">
          <div className="position-relative image-zoom-container bg-light" style={{ aspectRatio: '3/4' }}>
            <img
              src={product.image}
              className="w-100 h-100 object-fit-cover"
              alt={product.name}
            />
            {product.discount_percentage > 0 && (
              <span className="badge bg-dark rounded-0 position-absolute top-0 start-0 m-3 px-2 py-1">
                -{product.discount_percentage}%
              </span>
            )}
            {product.is_featured && (
              <span className="badge bg-white text-dark rounded-0 border position-absolute top-0 end-0 m-3 px-2 py-1">
                Featured
              </span>
            )}
          </div>
          <div className="card-body px-0 pt-3 pb-0 text-center">
            <h6 className="text-uppercase-tracking text-dark mb-2">
              {product.name}
            </h6>
            <div className="mb-0">
              <span className="text-dark font-serif fs-5">
                {formatPrice(displayPrice)}
              </span>
              {product.discount_percentage > 0 && (
                <span className="text-muted text-decoration-line-through small ms-2">
                  {formatPrice(product.price)}
                </span>
              )}
            </div>
          </div>
        </Link>
      </div>
    </motion.div>
  );
};

export default ProductCard;
