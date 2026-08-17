import React, { useState, useEffect } from 'react';
import API from '../../api/axios';
import { Plus, Edit, Trash2, X } from 'lucide-react';

const ProductManagement = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    stockQuantity: '',
    categoryId: '',
    imageUrl: '',
    organic: true,
    active: true,
  });

  // Quick Patch modal
  const [patchModal, setPatchModal] = useState({ open: false, type: '', productId: null, value: '' });

  const fetchProducts = async () => {
    try {
      const [prodRes, catRes] = await Promise.all([
        API.get('/owner/products'),
        API.get('/categories')
      ]);
      if (prodRes.data.success) setProducts(prodRes.data.data);
      if (catRes.data.success) setCategories(catRes.data.data);
    } catch (err) {
      console.error('Failed to fetch owner products:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleOpenAddModal = () => {
    setEditingProduct(null);
    setFormData({
      name: '',
      description: '',
      price: '',
      stockQuantity: '',
      categoryId: categories[0]?.id || '',
      imageUrl: '',
      organic: true,
      active: true,
    });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      description: product.description,
      price: product.price,
      stockQuantity: product.stockQuantity,
      categoryId: product.category?.id || '',
      imageUrl: product.imageUrl || '',
      organic: product.organic,
      active: product.active,
    });
    setIsModalOpen(true);
  };

  const handleSubmitProduct = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...formData,
        price: parseFloat(formData.price),
        stockQuantity: parseInt(formData.stockQuantity, 10),
        categoryId: formData.categoryId ? parseInt(formData.categoryId, 10) : null,
      };

      if (editingProduct) {
        await API.put(`/owner/products/${editingProduct.id}`, payload);
        alert('Product updated successfully!');
      } else {
        await API.post('/owner/products', payload);
        alert('New organic product added successfully!');
      }

      setIsModalOpen(false);
      fetchProducts();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to save product');
    }
  };

  // Deactivate product
  const handleDeactivate = async (id) => {
    if (!window.confirm('Are you sure you want to deactivate this product?')) return;
    try {
      await API.delete(`/owner/products/${id}`);
      alert('Product deactivated!');
      fetchProducts();
    } catch (err) {
      alert('Failed to deactivate product');
    }
  };

  // Activate product
  const handleActivate = async (id) => {
    try {
      await API.put(`/owner/products/${id}`, { active: true });
      alert('Product activated successfully!');
      fetchProducts();
    } catch (err) {
      alert('Failed to activate product');
    }
  };

  const handlePatchSubmit = async (e) => {
    e.preventDefault();
    try {
      if (patchModal.type === 'stock') {
        await API.patch(`/owner/products/${patchModal.productId}/stock`, {
          stockQuantity: parseInt(patchModal.value, 10),
        });
      } else if (patchModal.type === 'price') {
        await API.patch(`/owner/products/${patchModal.productId}/price`, {
          price: parseFloat(patchModal.value),
        });
      }
      setPatchModal({ open: false, type: '', productId: null, value: '' });
      fetchProducts();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update field');
    }
  };

  if (loading) {
    return (
      <div className="container" style={{ padding: '4rem', textAlign: 'center' }}>
        Loading products inventory...
      </div>
    );
  }

  return (
    <div className="container" style={{ paddingTop: '2.5rem', paddingBottom: '4rem' }}>
      <div className="flex items-center justify-between" style={{ marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '2.2rem', fontWeight: '800' }}>Organic Product Inventory Management</h1>
          <p style={{ color: '#64748b' }}>
            Add, update price, manage stock, and upload images for your products
          </p>
        </div>
        <button onClick={handleOpenAddModal} className="btn btn-primary flex items-center gap-2">
          <Plus size={18} /> Add New Product
        </button>
      </div>

      {/* Products Table */}
      <div className="card" style={{ padding: '1rem', overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
          <thead>
            <tr style={{ background: '#f8fafc', borderBottom: '2px solid #e2e8f0', color: '#475569' }}>
              <th style={{ padding: '12px 16px' }}>Product</th>
              <th style={{ padding: '12px 16px' }}>Category</th>
              <th style={{ padding: '12px 16px' }}>Price (₹)</th>
              <th style={{ padding: '12px 16px' }}>Stock Qty</th>
              <th style={{ padding: '12px 16px' }}>Organic</th>
              <th style={{ padding: '12px 16px' }}>Status</th>
              <th style={{ padding: '12px 16px', textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.length === 0 ? (
              <tr>
                <td colSpan="7" style={{ padding: '2rem', textAlign: 'center', color: '#64748b' }}>
                  No products found
                </td>
              </tr>
            ) : (
              products.map((p) => (
                <tr key={p.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                  <td style={{ padding: '12px 16px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <img
                      src={p.imageUrl || 'https://via.placeholder.com/48'}
                      alt={p.name}
                      style={{ width: '48px', height: '48px', borderRadius: '8px', objectFit: 'cover' }}
                    />
                    <div>
                      <div style={{ fontWeight: '700', color: '#0f172a' }}>{p.name}</div>
                      <div style={{ fontSize: '0.78rem', color: '#64748b' }}>ID: #{p.id}</div>
                    </div>
                  </td>
                  <td style={{ padding: '12px 16px', fontWeight: '600', color: '#334155' }}>
                    {p.category?.name || 'General'}
                  </td>
                  <td style={{ padding: '12px 16px' }}>
                    <div className="flex items-center gap-2">
                      <span style={{ fontWeight: '800', color: '#064e3b' }}>₹{p.price}</span>
                      <button
                        onClick={() =>
                          setPatchModal({ open: true, type: 'price', productId: p.id, value: p.price })
                        }
                        style={{
                          background: '#f1f5f9',
                          border: 'none',
                          padding: '2px 6px',
                          borderRadius: '4px',
                          fontSize: '0.7rem',
                          cursor: 'pointer',
                        }}
                      >
                        Edit
                      </button>
                    </div>
                  </td>
                  <td style={{ padding: '12px 16px' }}>
                    <div className="flex items-center gap-2">
                      <span className={`badge ${p.stockQuantity <= 5 ? 'badge-pending' : 'badge-delivered'}`}>
                        {p.stockQuantity} units
                      </span>
                      <button
                        onClick={() =>
                          setPatchModal({
                            open: true,
                            type: 'stock',
                            productId: p.id,
                            value: p.stockQuantity,
                          })
                        }
                        style={{
                          background: '#f1f5f9',
                          border: 'none',
                          padding: '2px 6px',
                          borderRadius: '4px',
                          fontSize: '0.7rem',
                          cursor: 'pointer',
                        }}
                      >
                        Edit
                      </button>
                    </div>
                  </td>
                  <td style={{ padding: '12px 16px' }}>
                    {p.organic ? <span className="badge badge-organic">YES</span> : 'No'}
                  </td>
                  <td style={{ padding: '12px 16px' }}>
                    {p.active ? (
                      <span className="badge badge-delivered">ACTIVE</span>
                    ) : (
                      <span className="badge badge-cancelled">INACTIVE</span>
                    )}
                  </td>
                  <td style={{ padding: '12px 16px', textAlign: 'right' }}>
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => handleOpenEditModal(p)}
                        className="btn btn-secondary btn-sm"
                        style={{ padding: '4px 8px' }}
                      >
                        <Edit size={14} /> Edit
                      </button>

                      {p.active ? (
                        <button
                          onClick={() => handleDeactivate(p.id)}
                          className="btn btn-danger btn-sm"
                          style={{ padding: '4px 8px' }}
                        >
                          <Trash2 size={14} /> Deactivate
                        </button>
                      ) : (
                        <button
                          onClick={() => handleActivate(p.id)}
                          className="btn btn-primary btn-sm"
                          style={{ padding: '4px 8px', background: '#15803d' }}
                        >
                          Activate
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Modal for Add / Edit Product */}
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div
              className="flex items-center justify-between"
              style={{
                marginBottom: '1.5rem',
                borderBottom: '1px solid #e2e8f0',
                paddingBottom: '0.75rem',
              }}
            >
              <h3 style={{ fontSize: '1.3rem', fontWeight: '800' }}>
                {editingProduct ? 'Edit Organic Product' : 'Add New Organic Product'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} style={{ background: 'none' }}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmitProduct}>
              <div className="input-group">
                <label className="input-label">Product Name *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="input-field"
                  required
                />
              </div>

              <div className="input-group">
                <label className="input-label">Description</label>
                <textarea
                  rows="3"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="input-field"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="input-group">
                  <label className="input-label">Price (₹) *</label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    className="input-field"
                    required
                  />
                </div>
                <div className="input-group">
                  <label className="input-label">Stock Quantity *</label>
                  <input
                    type="number"
                    value={formData.stockQuantity}
                    onChange={(e) => setFormData({ ...formData, stockQuantity: e.target.value })}
                    className="input-field"
                    required
                  />
                </div>
              </div>

              <div className="input-group">
                <label className="input-label">Category</label>
                <select
                  value={formData.categoryId}
                  onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                  className="input-field"
                >
                  <option value="">Select Category</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Image Upload */}
              <div className="input-group">
                <label className="input-label">Product Image</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files[0];
                    if (!file) return;

                    if (file.size > 2 * 1024 * 1024) {
                      alert('Image should be less than 2MB');
                      return;
                    }

                    const reader = new FileReader();
                    reader.onloadend = () => {
                      setFormData({ ...formData, imageUrl: reader.result });
                    };
                    reader.readAsDataURL(file);
                  }}
                  className="input-field"
                  style={{ padding: '8px' }}
                />

                {formData.imageUrl && (
                  <div style={{ marginTop: '12px' }}>
                    <img
                      src={formData.imageUrl}
                      alt="Preview"
                      style={{
                        width: '140px',
                        height: '140px',
                        objectFit: 'cover',
                        borderRadius: '10px',
                        border: '1px solid #e2e8f0',
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, imageUrl: '' })}
                      style={{
                        marginLeft: '12px',
                        background: '#fee2e2',
                        color: '#b91c1c',
                        border: 'none',
                        padding: '4px 10px',
                        borderRadius: '6px',
                        fontSize: '0.8rem',
                        cursor: 'pointer',
                      }}
                    >
                      Remove
                    </button>
                  </div>
                )}
              </div>

              <div className="flex items-center gap-6" style={{ margin: '1rem 0' }}>
                <label className="flex items-center gap-2" style={{ cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={formData.organic}
                    onChange={(e) => setFormData({ ...formData, organic: e.target.checked })}
                  />
                  <span style={{ fontWeight: '600', fontSize: '0.9rem' }}>100% Certified Organic</span>
                </label>
                <label className="flex items-center gap-2" style={{ cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={formData.active}
                    onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
                  />
                  <span style={{ fontWeight: '600', fontSize: '0.9rem' }}>Active Product</span>
                </label>
              </div>

              <div className="flex justify-end gap-3" style={{ marginTop: '1.5rem' }}>
                <button type="button" onClick={() => setIsModalOpen(false)} className="btn btn-secondary">
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Save Product
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Quick Patch Stock/Price Modal */}
      {patchModal.open && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: '400px' }}>
            <h3 style={{ fontSize: '1.15rem', fontWeight: '800', marginBottom: '1rem' }}>
              Update Product {patchModal.type === 'stock' ? 'Stock Quantity' : 'Price'}
            </h3>
            <form onSubmit={handlePatchSubmit}>
              <div className="input-group">
                <label className="input-label">
                  New {patchModal.type === 'stock' ? 'Stock Value' : 'Price (₹)'}
                </label>
                <input
                  type="number"
                  step={patchModal.type === 'price' ? '0.01' : '1'}
                  value={patchModal.value}
                  onChange={(e) => setPatchModal({ ...patchModal, value: e.target.value })}
                  className="input-field"
                  required
                />
              </div>
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setPatchModal({ open: false, type: '', productId: null, value: '' })}
                  className="btn btn-secondary btn-sm"
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary btn-sm">
                  Update
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductManagement;