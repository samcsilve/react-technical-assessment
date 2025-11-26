import { Link } from 'react-router-dom';
import './ProductCard.css';

const ProductCard = ({ product }) => {
  // Handle both images array and single image field for compatibility
  const imageUrl = product.images && Array.isArray(product.images) && product.images.length > 0 
    ? product.images[0] 
    : product.image || null;
  
  const handleImageError = (e) => {
    e.target.style.display = 'none';
    const placeholder = e.target.parentElement.querySelector('.product-image-placeholder');
    if (placeholder) {
      placeholder.style.display = 'flex';
    }
  };

  return (
    <Link to={`/products/${product.id}`} className="product-card">
      <div className="product-image">
        {imageUrl ? (
          <>
            <img 
              src={imageUrl} 
              alt={product.name}
              onError={handleImageError}
              loading="lazy"
            />
            <div className="product-image-placeholder" style={{ display: 'none' }}>
              No Image Available
            </div>
          </>
        ) : (
          <div className="product-image-placeholder">No Image</div>
        )}
      </div>
      <div className="product-info">
        <h3 className="product-name">{product.name}</h3>
        <p className="product-price">${product.price?.toFixed(2)}</p>
        {product.category && (
          <span className="product-category">{product.category}</span>
        )}
      </div>
    </Link>
  );
};

export default ProductCard;

