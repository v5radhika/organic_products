import React from 'react';
import { Leaf, Heart, Phone, Mail, MapPin } from 'lucide-react';

const Footer = () => {
  return (
    <footer style={{ background: '#064e3b', color: '#ecfdf5', paddingTop: '4rem', paddingBottom: '2rem', marginTop: '5rem' }}>
      <div className="container grid grid-cols-4 gap-8" style={{ paddingBottom: '3rem', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
        <div>
          <div className="flex items-center gap-2" style={{ marginBottom: '1rem' }}>
            <div style={{ background: '#dcfce7', padding: '8px', borderRadius: '10px' }}>
              <Leaf color="#15803d" size={22} />
            </div>
            <span style={{ fontSize: '1.25rem', fontWeight: '800', fontFamily: 'Outfit', color: 'white' }}>
              Venkatesha Organics
            </span>
          </div>
          <p style={{ fontSize: '0.88rem', color: '#a7f3d0', lineHeight: '1.6' }}>
            Directly from farm to table. 100% natural, unadulterated organic products harvested with traditional care and wisdom.
          </p>
        </div>

        <div>
          <h4 style={{ color: 'white', marginBottom: '1.2rem', fontFamily: 'Outfit' }}>Quick Links</h4>
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.6rem', fontSize: '0.9rem' }}>
            <li><a href="/" style={{ color: '#a7f3d0' }}>Home</a></li>
            <li><a href="/products" style={{ color: '#a7f3d0' }}>Organic Products</a></li>
            <li><a href="/my-orders" style={{ color: '#a7f3d0' }}>Track Orders</a></li>
            <li><a href="/owner-login" style={{ color: '#fef08a' }}>Owner Login Portal</a></li>
          </ul>
        </div>

        <div>
          <h4 style={{ color: 'white', marginBottom: '1.2rem', fontFamily: 'Outfit' }}>Our Promise</h4>
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.6rem', fontSize: '0.88rem', color: '#a7f3d0' }}>
            <li>🌱 100% Chemical Free</li>
            <li>🐄 Traditional A2 Desi Cow Bilona</li>
            <li>🍯 Pure Forest Wild Honey</li>
            <li>🌾 Handcrafted Stone Ground Spices</li>
          </ul>
        </div>

        <div>
          <h4 style={{ color: 'white', marginBottom: '1.2rem', fontFamily: 'Outfit' }}>Farm Contact</h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.88rem', color: '#a7f3d0' }}>
            <div className="flex items-center gap-2"><MapPin size={16} color="#fef08a" /> 108 Organic Way, Mysore, India</div>
            <div className="flex items-center gap-2"><Phone size={16} color="#fef08a" /> +91 98765 43210</div>
            <div className="flex items-center gap-2"><Mail size={16} color="#fef08a" /> owner@venkatesha.com</div>
          </div>
        </div>
      </div>

      <div className="container flex items-center justify-between" style={{ paddingTop: '2rem', fontSize: '0.85rem', color: '#6ee7b7' }}>
        <div>© {new Date().getFullYear()} Venkatesha Organic Products. All rights reserved.</div>
        <div className="flex items-center gap-1">
          Made with <Heart size={14} fill="#ef4444" color="#ef4444" /> for pure organic living
        </div>
      </div>
    </footer>
  );
};

export default Footer;
