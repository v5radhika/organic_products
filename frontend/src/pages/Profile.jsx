import React from 'react';
import { useAuth } from '../context/AuthContext';
import { User, Mail, Phone, MapPin, Shield } from 'lucide-react';

const Profile = () => {
  const { user } = useAuth();

  if (!user) return null;

  return (
    <div className="container" style={{ paddingTop: '2.5rem', paddingBottom: '4rem' }}>
      <div className="card" style={{ maxWidth: '600px', margin: '0 auto', padding: '2.5rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{ background: '#dcfce7', width: '70px', height: '70px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem auto' }}>
            <User color="#15803d" size={36} />
          </div>
          <h2 style={{ fontSize: '1.8rem', fontWeight: '800' }}>{user.fullName}</h2>
          <span className="badge badge-organic" style={{ marginTop: '6px' }}>{user.role}</span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
          <div className="flex items-center gap-3" style={{ background: '#f8fafc', padding: '1rem', borderRadius: '12px' }}>
            <Mail color="#15803d" size={20} />
            <div>
              <div style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: '600' }}>EMAIL ADDRESS</div>
              <div style={{ fontWeight: '700', color: '#0f172a' }}>{user.email}</div>
            </div>
          </div>

          <div className="flex items-center gap-3" style={{ background: '#f8fafc', padding: '1rem', borderRadius: '12px' }}>
            <Phone color="#15803d" size={20} />
            <div>
              <div style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: '600' }}>CONTACT PHONE</div>
              <div style={{ fontWeight: '700', color: '#0f172a' }}>{user.phone || 'Not provided'}</div>
            </div>
          </div>

          <div className="flex items-center gap-3" style={{ background: '#f8fafc', padding: '1rem', borderRadius: '12px' }}>
            <MapPin color="#15803d" size={20} />
            <div>
              <div style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: '600' }}>SHIPPING ADDRESS</div>
              <div style={{ fontWeight: '700', color: '#0f172a' }}>{user.address || 'Not provided'}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
