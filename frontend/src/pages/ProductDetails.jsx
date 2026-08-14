import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import API from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { ShoppingBag, ArrowLeft, CheckCircle2, ShieldCheck, Leaf, Truck } from 'lucide-react';

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isCustomer } = useAuth();

  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await API.get(`/products/${id}`);
        if (res.data.success) {
          setProduct(res.data.data);
        }
      } catch (err) {
        setError('Product not found or unavailable');
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const handleAddToCart = async () => {
    if (!isCustomer) {
      navigate('/login');
      return;
    }
    try {
      await API.post('/cart', { productId: product.id, quantity });
      alert(`Added ${quantity} x "${product.name}" to your cart!`);
      navigate('/cart');
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to add item to cart');
    }
  };

  if (loading) return <div className="container" style={{ padding: '4rem', textAlign: 'center' }}>Loading product details...</div>;
  if (error || !product) return <div className="container" style={{ padding: '4rem', textAlign: 'center', color: '#ef4444' }}>{error}</div>;

  const isOutOfStock = product.stockQuantity === 0;

  return (
    <div className="container" style={{ paddingTop: '2.5rem', paddingBottom: '4rem' }}>
      <button onClick={() => navigate(-1)} className="btn btn-secondary btn-sm" style={{ marginBottom: '1.5rem' }}>
        <ArrowLeft size={16} /> Back to Products
      </button>

      <div className="card grid grid-cols-2 gap-8" style={{ padding: '2.5rem' }}>
        <div>
          <img
            src={product.imageUrl || 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=600&q=80'}
            alt={product.name}
            style={{ width: '100%', borderRadius: '18px', maxHeight: '420px', objectFit: 'cover' }}
          />
        </div>

        <div className="flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2" style={{ marginBottom: '0.75rem' }}>
              <span className="badge badge-organic">100% Certified Organic</span>
              <span style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: '600' }}>
                Category: {product.category?.name || 'Farm Direct'}
              </span>
            </div>

            <h1 style={{ fontSize: '2.2rem', fontWeight: '800', marginBottom: '1rem', color: '#0f172a' }}>
              {product.name}
            </h1>

            <div style={{ fontSize: '2rem', fontWeight: '800', color: '#064e3b', marginBottom: '1.25rem' }}>
              ₹{product.price}
            </div>

            <p style={{ color: '#475569', fontSize: '1rem', lineHeight: '1.7', marginBottom: '1.75rem' }}>
              {product.description}
            </p>

            <div style={{ background: '#f8fafc', padding: '1.25rem', borderRadius: '14px', marginBottom: '1.75rem', border: '1px solid #e2e8f0' }}>
              <div className="flex items-center justify-between" style={{ marginBottom: '1rem' }}>
                <span style={{ fontWeight: '600', color: '#334155' }}>Availability Status:</span>
                {isOutOfStock ? (
                  <span className="badge badge-cancelled">Out of Stock</span>
                ) : (
                  <span className="badge badge-delivered">{product.stockQuantity} Units In Stock</span>
                )}
              </div>

              {!isOutOfStock && (
                <div className="flex items-center gap-4">
                  <span style={{ fontWeight: '600', color: '#334155' }}>Select Quantity:</span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="btn btn-secondary btn-sm"
                    >
                      -
                    </button>
                    <span style={{ padding: '0 1rem', fontWeight: '700', fontSize: '1.1rem' }}>{quantity}</span>
                    <button
                      onClick={() => setQuantity(Math.min(product.stockQuantity, quantity + 1))}
                      className="btn btn-secondary btn-sm"
                    >
                      +
                    </button>
                  </div>
                </div>
              )}
            </div>

            <button
              onClick={handleAddToCart}
              disabled={isOutOfStock}
              className="btn btn-primary"
              style={{ width: '100%', padding: '0.9rem', fontSize: '1.05rem' }}
            >
              <ShoppingBag size={20} /> Add to Cart (₹{(product.price * quantity).toFixed(2)})
            </button>
          </div>

          <div className="flex items-center gap-6" style={{ marginTop: '2rem', paddingTop: '1.5rem', borderTop: '1px solid #e2e8f0', color: '#64748b', fontSize: '0.85rem' }}>
            <div className="flex items-center gap-2"><ShieldCheck size={18} color="#15803d" /> Authentic Guarantee</div>
            <div className="flex items-center gap-2"><Truck size={18} color="#0284c7" /> Fast Direct Delivery</div>
            <div className="flex items-center gap-2"><Leaf size={18} color="#d97706" /> Sustainable Farm</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
