import { Link } from 'react-router-dom';
import { useWishlist } from '../../context/WishlistContext';
import { useCart } from '../../context/CartContext';
import toast from '../../utils/toast';

const Wishlist = () => {
  const { wishlist, loading, removeFromWishlist } = useWishlist();
  const { addToCart } = useCart();

  const handleMoveToCart = async (item) => {
    const success = await addToCart(item.product_id, 1);
    if (success) {
      await removeFromWishlist(item.product_id);
      toast.success('Moved to cart!');
    }
  };

  if (loading) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div>
      <h2 className="mb-4">My Wishlist</h2>

      {wishlist.length === 0 ? (
        <div className="card shadow-sm">
          <div className="card-body text-center py-5">
            <i className="bi bi-heart fs-1 text-muted mb-3"></i>
            <h5>Your wishlist is empty</h5>
            <p className="text-muted">Save your favorite items here</p>
            <Link to="/collections" className="btn btn-primary">
              Browse Products
            </Link>
          </div>
        </div>
      ) : (
        <>
          <p className="text-muted mb-4">{wishlist.length} item(s) in your wishlist</p>
          <div className="row g-4">
            {wishlist.map((item) => (
              <div key={item.id} className="col-md-6 col-lg-4">
                <div className="card shadow-sm h-100">
                  <Link to={`/product/${item.slug}`}>
                    <img
                      src={item.image}
                      alt={item.name}
                      className="card-img-top"
                      style={{ height: '250px', objectFit: 'cover' }}
                    />
                  </Link>
                  <div className="card-body">
                    <div className="d-flex justify-content-between align-items-start mb-2">
                      <Link
                        to={`/product/${item.slug}`}
                        className="text-decoration-none text-dark"
                      >
                        <h6 className="card-title mb-1">{item.name}</h6>
                      </Link>
                      <button
                        className="btn btn-sm btn-outline-danger"
                        onClick={() => removeFromWishlist(item.product_id)}
                      >
                        <i className="bi bi-x-lg"></i>
                      </button>
                    </div>
                    <p className="text-muted small mb-2">{item.category_name}</p>
                    <p className="fw-bold text-primary mb-3">
                      ₦{parseFloat(item.price).toLocaleString()}
                    </p>
                    {item.stock > 0 ? (
                      <button
                        className="btn btn-primary btn-sm w-100"
                        onClick={() => handleMoveToCart(item)}
                      >
                        <i className="bi bi-cart-plus me-2"></i>
                        Move to Cart
                      </button>
                    ) : (
                      <button className="btn btn-secondary btn-sm w-100" disabled>
                        Out of Stock
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default Wishlist;
