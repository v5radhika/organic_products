import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import API from '../api/axios';
import { Search, Filter, RefreshCw } from 'lucide-react';

const Products = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(0);

  const selectedCategory = searchParams.get('category') || '';
  const searchQuery = searchParams.get('query') || '';
  const page = parseInt(searchParams.get('page') || '0', 10);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await API.get('/categories');
        if (res.data.success) setCategories(res.data.data);
      } catch (err) {
        console.error('Failed to fetch categories:', err);
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        if (selectedCategory) params.append('categoryId', selectedCategory);
        if (searchQuery) params.append('query', searchQuery);
        params.append('page', page);
        params.append('size', '12');

        const res = await API.get(`/products?${params.toString()}`);
        if (res.data.success) {
          setProducts(res.data.data.content || []);
          setTotalPages(res.data.data.totalPages || 0);
        }
      } catch (err) {
        console.error('Failed to fetch products:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [selectedCategory, searchQuery, page]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const val = e.target.search.value;
    const newParams = new URLSearchParams(searchParams);
    if (val) newParams.set('query', val);
    else newParams.delete('query');
    newParams.set('page', '0');
    setSearchParams(newParams);
  };

  const handleCategorySelect = (catId) => {
    const newParams = new URLSearchParams(searchParams);
    if (catId) newParams.set('category', catId);
    else newParams.delete('category');
    newParams.set('page', '0');
    setSearchParams(newParams);
  };

  return (
    <div className="container" style={{ paddingTop: '2.5rem', paddingBottom: '4rem' }}>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2.4rem', fontWeight: '800', marginBottom: '0.5rem' }}>Organic Product Store</h1>
        <p style={{ color: '#64748b' }}>Browse our farm-fresh certified organic products</p>
      </div>

      {/* Filter and Search Bar */}
      <div className="card" style={{ padding: '1.25rem', marginBottom: '2rem' }}>
        <div className="flex items-center justify-between gap-4" style={{ flexWrap: 'wrap' }}>
          {/* Search Input */}
          <form onSubmit={handleSearchSubmit} className="flex items-center gap-2" style={{ flex: 1, minWidth: '280px' }}>
            <div style={{ position: 'relative', width: '100%' }}>
              <input
                type="text"
                name="search"
                defaultValue={searchQuery}
                placeholder="Search organic ghee, honey, oil, spices..."
                className="input-field"
                style={{ paddingLeft: '2.5rem' }}
              />
              <Search size={18} color="#94a3b8" style={{ position: 'absolute', left: '12px', top: '12px' }} />
            </div>
            <button type="submit" className="btn btn-primary">Search</button>
          </form>

          {/* Category Filter Pills */}
          <div className="flex items-center gap-2" style={{ flexWrap: 'wrap' }}>
            <button
              onClick={() => handleCategorySelect('')}
              className={`btn btn-sm ${!selectedCategory ? 'btn-primary' : 'btn-secondary'}`}
            >
              All Products
            </button>
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => handleCategorySelect(cat.id.toString())}
                className={`btn btn-sm ${selectedCategory === cat.id.toString() ? 'btn-primary' : 'btn-secondary'}`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Product Grid */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '4rem', color: '#64748b' }}>
          <RefreshCw size={28} className="spin" style={{ marginBottom: '1rem' }} />
          <div>Fetching fresh organic products...</div>
        </div>
      ) : products.length === 0 ? (
        <div className="card" style={{ padding: '3rem', textAlign: 'center' }}>
          <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>No products found</h3>
          <p style={{ color: '#64748b' }}>Try adjusting your search query or selecting a different category filter.</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-4 gap-6" style={{ marginBottom: '2.5rem' }}>
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2">
              <button
                disabled={page === 0}
                onClick={() => {
                  const newParams = new URLSearchParams(searchParams);
                  newParams.set('page', (page - 1).toString());
                  setSearchParams(newParams);
                }}
                className="btn btn-secondary btn-sm"
              >
                Previous
              </button>
              <span style={{ fontSize: '0.9rem', color: '#475569', fontWeight: '600' }}>
                Page {page + 1} of {totalPages}
              </span>
              <button
                disabled={page >= totalPages - 1}
                onClick={() => {
                  const newParams = new URLSearchParams(searchParams);
                  newParams.set('page', (page + 1).toString());
                  setSearchParams(newParams);
                }}
                className="btn btn-secondary btn-sm"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Products;
