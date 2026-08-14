import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Shield, Lock } from 'lucide-react';

const OwnerLogin = () => {
  const { login, loading } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('owner@venkatesha.com');
  const [password, setPassword] = useState('owner123');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    const res = await login(email, password);
    if (res.success) {
      if (res.user.role === 'ROLE_OWNER') {
        navigate('/owner/dashboard');
      } else {
        setError('Access Denied: You do not have Business Owner privileges.');
      }
    } else {
      setError(res.message);
    }
  };

  return (
    <div className="container flex items-center justify-center" style={{ minHeight: '80vh', paddingTop: '3rem', paddingBottom: '3rem' }}>
      <div className="card" style={{ width: '100%', maxWidth: '440px', padding: '2.5rem', borderTop: '6px solid #d97706' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{ background: '#fef3c7', width: '60px', height: '60px', borderRadius: '18px', display: 'flex', alignItems: 'center', justifyCenter: 'center', margin: '0 auto 1rem auto' }}>
            <Shield color="#b45309" size={32} />
          </div>
          <h2 style={{ fontSize: '1.8rem', fontWeight: '800', color: '#78350f' }}>Owner Portal Login</h2>
          <p style={{ color: '#64748b', fontSize: '0.9rem', marginTop: '4px' }}>Restricted access for Venkatesha Farm Business Owner</p>
        </div>

        {error && (
          <div style={{ background: '#fee2e2', color: '#b91c1c', padding: '0.85rem', borderRadius: '10px', fontSize: '0.85rem', marginBottom: '1.25rem' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label className="input-label">Owner Email *</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="input-field" required />
          </div>

          <div className="input-group">
            <label className="input-label">Owner Secret Password *</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="input-field" required />
          </div>

          <button type="submit" disabled={loading} className="btn btn-accent" style={{ width: '100%', padding: '0.85rem', marginTop: '0.5rem', background: '#d97706' }}>
            <Lock size={18} /> {loading ? 'Verifying Credentials...' : 'Sign In as Owner'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default OwnerLogin;
