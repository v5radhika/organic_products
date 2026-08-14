import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import API from '../api/axios';
import { Leaf, ShieldCheck, Truck, Award, ArrowRight, Sparkles } from 'lucide-react';

const Home = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [prodRes, catRes] = await Promise.all([
          API.get('/products?page=0&size=4'),
          API.get('/categories')
        ]);
        if (prodRes.data.success) setFeaturedProducts(prodRes.data.data.content || []);
        if (catRes.data.success) setCategories(catRes.data.data || []);
      } catch (err) {
        console.error('Failed to load home page data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div>
      {/* Hero Section */}
      <section style={{ background: 'linear-gradient(135deg, #064e3b 0%, #15803d 100%)', color: 'white', padding: '5rem 0', borderRadius: '0 0 32px 32px' }}>
        <div className="container grid grid-cols-2 items-center gap-8">
          <div>
            <div className="badge badge-organic" style={{ background: 'rgba(255,255,255,0.15)', color: '#fef08a', marginBottom: '1.25rem', border: '1px solid rgba(255,255,255,0.2)' }}>
              <Sparkles size={14} style={{ marginRight: '6px' }} /> Direct Farm Harvest
            </div>
            <h1 style={{ fontSize: '3.2rem', color: 'white', fontWeight: '800', lineHeight: 1.15, marginBottom: '1.25rem' }}>
              Pure Organic Goodness, Handcrafted for Your Family.
            </h1>
            <p style={{ fontSize: '1.1rem', color: '#dcfce7', marginBottom: '2rem', lineHeight: '1.6' }}>
              Experience authentic A2 Desi Cow Bilona Ghee, cold-pressed oils, wild forest honey, and unpolished grains harvested naturally without chemicals.
            </p>
            <div className="flex items-center gap-4">
              <Link to="/products" className="btn btn-primary" style={{ background: '#d97706', color: 'white', fontSize: '1.05rem', padding: '0.85rem 1.8rem' }}>
                Explore Products <ArrowRight size={18} />
              </Link>
              <Link to="/login" className="btn btn-outline" style={{ borderColor: 'white', color: 'white', padding: '0.85rem 1.8rem' }}>
                Customer Login
              </Link>
            </div>
          </div>
          <div style={{ position: 'relative' }}>
            <img
              src="https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&w=800&q=80"
              alt="Venkatesha Organic Farm"
              style={{ width: '100%', borderRadius: '24px', boxShadow: '0 20px 40px rgba(0,0,0,0.3)', border: '4px solid rgba(255,255,255,0.2)' }}
            />
          </div>
        </div>
      </section>

      {/* Feature Highlights */}
      <section style={{ margin: '-2.5rem 0 4rem 0' }}>
        <div className="container">
          <div className="grid grid-cols-4 gap-4" style={{ background: 'white', padding: '2rem', borderRadius: '20px', boxShadow: 'var(--shadow-lg)' }}>
            <div className="flex items-center gap-3">
              <div style={{ background: '#dcfce7', padding: '12px', borderRadius: '12px' }}><Leaf color="#15803d" size={24} /></div>
              <div><h4 style={{ fontSize: '1rem', fontWeight: '700' }}>100% Organic</h4><p style={{ fontSize: '0.8rem', color: '#64748b' }}>No pesticides or additives</p></div>
            </div>
            <div className="flex items-center gap-3">
              <div style={{ background: '#fef3c7', padding: '12px', borderRadius: '12px' }}><Award color="#d97706" size={24} /></div>
              <div><h4 style={{ fontSize: '1rem', fontWeight: '700' }}>Traditional Bilona</h4><p style={{ fontSize: '0.8rem', color: '#64748b' }}>A2 Desi Cow Ghee</p></div>
            </div>
            <div className="flex items-center gap-3">
              <div style={{ background: '#e0f2fe', padding: '12px', borderRadius: '12px' }}><Truck color="#0284c7" size={24} /></div>
              <div><h4 style={{ fontSize: '1rem', fontWeight: '700' }}>Fresh Delivery</h4><p style={{ fontSize: '0.8rem', color: '#64748b' }}>Direct from farm</p></div>
            </div>
            <div className="flex items-center gap-3">
              <div style={{ background: '#f3e8ff', padding: '12px', borderRadius: '12px' }}><ShieldCheck color="#7e22ce" size={24} /></div>
              <div><h4 style={{ fontSize: '1rem', fontWeight: '700' }}>Guaranteed Quality</h4><p style={{ fontSize: '0.8rem', color: '#64748b' }}>Lab tested purity</p></div>
            </div>
          </div>
        </div>
      </section>

      {/* Product Categories */}
      <section className="container" style={{ marginBottom: '4rem' }}>
        <div className="flex items-center justify-between" style={{ marginBottom: '2rem' }}>
          <div>
            <h2 style={{ fontSize: '2rem', fontWeight: '800' }}>Explore Organic Categories</h2>
            <p style={{ color: '#64748b', fontSize: '0.95rem' }}>Handpicked natural categories for everyday holistic health</p>
          </div>
          <Link to="/products" className="btn btn-outline btn-sm">View All Categories</Link>
        </div>

        <div className="grid grid-cols-4 gap-6">
          {categories.map((cat) => (
            <Link key={cat.id} to={`/products?category=${cat.id}`} className="card" style={{ textDecoration: 'none', padding: '1.5rem', textAlign: 'center' }}>
              <img
                src={cat.imageUrl || 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=600&q=80'}
                alt={cat.name}
                style={{ width: '100px', height: '100px', borderRadius: '50%', objectFit: 'cover', margin: '0 auto 1rem auto' }}
              />
              <h3 style={{ fontSize: '1.1rem', fontWeight: '700', color: '#0f172a', marginBottom: '6px' }}>{cat.name}</h3>
              <p style={{ fontSize: '0.8rem', color: '#64748b', lineHeight: '1.4' }}>{cat.description}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Products Grid */}
      <section className="container" style={{ marginBottom: '4rem' }}>
        <div className="flex items-center justify-between" style={{ marginBottom: '2rem' }}>
          <div>
            <h2 style={{ fontSize: '2rem', fontWeight: '800' }}>Fresh Farm Harvest</h2>
            <p style={{ color: '#64748b', fontSize: '0.95rem' }}>Our most popular certified organic products</p>
          </div>
          <Link to="/products" className="btn btn-primary">Browse Full Store <ArrowRight size={16} /></Link>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '3rem', color: '#64748b' }}>Loading organic harvest...</div>
        ) : (
          <div className="grid grid-cols-4 gap-6">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default Home;
