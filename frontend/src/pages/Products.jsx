import { useState, useEffect } from 'react';
import { getProducts } from '../services/api';
import ProductCard from '../components/ProductCard';
import './Products.css';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await getProducts();
      if (response.data.success) {
        const productsData = response.data.data.products || [];
        // Debug: Log first product to check image structure
        if (productsData.length > 0) {
          console.log('First product:', productsData[0]);
          console.log('First product images:', productsData[0].images);
        }
        setProducts(productsData);
      } else {
        setError('Failed to load products.');
      }
    } catch (err) {
      setError(
        err.response?.data?.message || 
        'Failed to load products. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="products-container">
        <div className="loading">Loading products...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="products-container">
        <div className="error">
          <p>{error}</p>
          <button onClick={fetchProducts} className="retry-button">
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="products-container">
      <h1>Products</h1>
      {products.length === 0 ? (
        <p className="no-products">No products available.</p>
      ) : (
        <div className="products-grid">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Products;

