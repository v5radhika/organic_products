import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Leaf, UserPlus } from 'lucide-react';

const Register = () => {
  const { register, loading } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    phone: '',
    address: '',
    role: 'ROLE_CUSTOMER',
  });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    const res = await register(formData);
    if (res.success) {
      alert('Registration successful! Real-time notification sent to farm owner.');
      navigate('/');
    } else {
      setError(res.message);
    }
  };

  return (
    <div className="container flex items-center justify-center" style={{ minHeight: '80vh', paddingTop: '3rem', paddingBottom: '3rem' }}>
      <div className="card" style={{ width: '100%', maxWidth: '520px', padding: '2.5rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{ background: '#dcfce7', width: '56px', height: '56px', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyCenter: 'center', margin: '0 auto 1rem auto' }}>
            <Leaf color="#15803d" size={30} />
          </div>
          <h2 style={{ fontSize: '1.8rem', fontWeight: '800' }}>Register Account</h2>
          <p style={{ color: '#64748b', fontSize: '0.9rem', marginTop: '4px' }}>Join Venkatesha Organic Products community</p>
        </div>

        {error && (
          <div style={{ background: '#fee2e2', color: '#b91c1c', padding: '0.85rem', borderRadius: '10px', fontSize: '0.85rem', marginBottom: '1.25rem' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label className="input-label">Full Name *</label>
            <input type="text" name="fullName" value={formData.fullName} onChange={handleChange} placeholder="Ramesh Kumar" className="input-field" required />
          </div>

          <div className="input-group">
            <label className="input-label">Email Address *</label>
            <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="ramesh@gmail.com" className="input-field" required />
          </div>

          <div className="input-group">
            <label className="input-label">Password * (min 6 chars)</label>
            <input type="password" name="password" value={formData.password} onChange={handleChange} placeholder="••••••••" className="input-field" required minLength={6} />
          </div>

          <div className="input-group">
            <label className="input-label">Contact Phone</label>
            <input type="text" name="phone" value={formData.phone} onChange={handleChange} placeholder="+91 98765 43210" className="input-field" />
          </div>

          <div className="input-group">
            <label className="input-label">Delivery Address</label>
            <textarea name="address" rows="2" value={formData.address} onChange={handleChange} placeholder="House number, street, city..." className="input-field" />
          </div>

          <button type="submit" disabled={loading} className="btn btn-primary" style={{ width: '100%', padding: '0.85rem', marginTop: '0.5rem' }}>
            <UserPlus size={18} /> {loading ? 'Creating Account...' : 'Register Account'}
          </button>
        </form>

        <div style={{ borderTop: '1px solid #e2e8f0', marginTop: '1.75rem', paddingTop: '1.25rem', textAlign: 'center', fontSize: '0.88rem', color: '#64748b' }}>
          Already have an account?{' '}
          <Link to="/login" style={{ fontWeight: '700', color: '#15803d' }}>
            Sign In Here
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
