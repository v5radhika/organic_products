import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingBag, Check, AlertCircle } from 'lucide-react';
import API from '../api/axios';
import { useAuth } from '../context/AuthContext';

const ProductCard = ({ product, onCartUpdated }) => {
  const { isCustomer } = useAuth();
  const navigate = useNavigate();

  const handleAddToCart = async (e) => {
    e.preventDefault();
    if (!isCustomer) {
      navigate('/login');
      return;
    }
    try {
      await API.post('/cart', { productId: product.id, quantity: 1 });
      if (onCartUpdated) onCartUpdated();
      alert(`Added "${product.name}" to your cart!`);
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to add item to cart');
    }
  };

  const isLowStock = product.stockQuantity > 0 && product.stockQuantity <= 5;
  const isOutOfStock = product.stockQuantity === 0;

  return (
    <div className="card flex flex-col justify-between" style={{ height: '100%' }}>
      <div style={{ position: 'relative', overflow: 'hidden', height: '220px', background: '#f8fafc' }}>
        <img
          src={product.imageUrl || 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=600&q=80'}
          alt={product.name}
          style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.4s ease' }}
        />
        <div style={{ position: 'absolute', top: '12px', left: '12px', display: 'flex', gap: '6px' }}>
          {product.organic && <span className="badge badge-organic">100% Organic</span>}
        </div>
      </div>

      <div style={{ padding: '1.25rem', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
        <div>
          <div style={{ fontSize: '0.75rem', fontWeight: '700', color: '#15803d', textTransform: 'uppercase', marginBottom: '4px' }}>
            {product.category?.name || 'Organic Farm'}
          </div>
          <Link to={`/products/${product.id}`} style={{ textDecoration: 'none' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: '700', color: '#0f172a', marginBottom: '8px', lineHeight: '1.3' }}>
              {product.name}
            </h3>
          </Link>
          <p style={{ fontSize: '0.85rem', color: '#64748b', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', marginBottom: '14px' }}>
            {product.description}
          </p>
        </div>

        <div>
          <div className="flex items-center justify-between" style={{ marginBottom: '12px' }}>
            <div>
              <span style={{ fontSize: '1.35rem', fontWeight: '800', color: '#064e3b' }}>₹{product.price}</span>
            </div>
            <div>
              {isOutOfStock ? (
                <span className="badge badge-cancelled">Out of Stock</span>
              ) : isLowStock ? (
                <span className="badge badge-pending">Only {product.stockQuantity} left</span>
              ) : (
                <span className="badge badge-delivered">{product.stockQuantity} Available</span>
              )}
            </div>
          </div>

          <button
            onClick={handleAddToCart}
            disabled={isOutOfStock}
            className="btn btn-primary"
            style={{ width: '100%', opacity: isOutOfStock ? 0.6 : 1 }}
          >
            <ShoppingBag size={18} /> {isOutOfStock ? 'Out of Stock' : 'Add to Cart'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
