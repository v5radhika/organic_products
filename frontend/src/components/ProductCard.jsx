import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api/axios';
import { useAuth } from '../context/AuthContext';

const AddProduct = () => {
  const navigate = useNavigate();
  const { isOwner } = useAuth(); // make sure you have this in AuthContext

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    stockQuantity: '',
    categoryId: '',
    organic: true,
  });

  const [imageUrl, setImageUrl] = useState('');
  const [loading, setLoading] = useState(false);

  // Convert selected gallery photo → Base64 URL
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setImageUrl(reader.result); // This becomes product.imageUrl
    };
    reader.readAsDataURL(file);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!imageUrl) {
      alert('Please select a product image');
      return;
    }

    setLoading(true);
    try {
      const productData = {
        ...formData,
        price: Number(formData.price),
        stockQuantity: Number(formData.stockQuantity),
        imageUrl: imageUrl, // ← Important
      };

      await API.post('/products', productData); // change endpoint if needed
      alert('Product added successfully!');
      navigate('/owner/products'); // or wherever you want
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to add product');
    } finally {
      setLoading(false);
    }
  };

  if (!isOwner) {
    return <div>Only Owner can add products</div>;
  }

  return (
    <div style={{ maxWidth: '600px', margin: '2rem auto', padding: '1.5rem' }}>
      <h2 style={{ marginBottom: '1.5rem' }}>Add New Product</h2>

      <form onSubmit={handleSubmit}>
        {/* Image Upload */}
        <div style={{ marginBottom: '1.2rem' }}>
          <label>Product Photo (from Gallery)</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            required
          />
          {imageUrl && (
            <img
              src={imageUrl}
              alt="Preview"
              style={{ width: '180px', marginTop: '10px', borderRadius: '8px' }}
            />
          )}
        </div>

        {/* Other Fields */}
        <div style={{ marginBottom: '1rem' }}>
          <label>Product Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>

        <div style={{ marginBottom: '1rem' }}>
          <label>Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows="3"
            required
          />
        </div>

        <div style={{ marginBottom: '1rem' }}>
          <label>Price (₹)</label>
          <input
            type="number"
            name="price"
            value={formData.price}
            onChange={handleChange}
            required
          />
        </div>

        <div style={{ marginBottom: '1rem' }}>
          <label>Stock Quantity</label>
          <input
            type="number"
            name="stockQuantity"
            value={formData.stockQuantity}
            onChange={handleChange}
            required
          />
        </div>

        <div style={{ marginBottom: '1rem' }}>
          <label>
            <input
              type="checkbox"
              name="organic"
              checked={formData.organic}
              onChange={handleChange}
            />
            {' '}100% Organic
          </label>
        </div>

        <button type="submit" disabled={loading} className="btn btn-primary">
          {loading ? 'Adding...' : 'Add Product'}
        </button>
      </form>
    </div>
  );
};

export default AddProduct;