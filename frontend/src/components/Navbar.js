import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
    setMenuOpen(false);
  };

  const closeMenu = () => setMenuOpen(false);

  return (
    <nav style={{
      background: 'white', borderBottom: '1px solid #e2e8f0',
      position: 'sticky', top: 0, zIndex: 100,
      boxShadow: '0 2px 12px rgba(0,0,0,0.06)'
    }}>
      <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '68px' }}>
        {/* LEFT: Logo & Brand Name */}
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none', flexShrink: 0 }}>
          <div style={{
            width: 36, height: 36, background: 'linear-gradient(135deg, #0ea5e9, #0284c7)',
            borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center',
            flexShrink: 0
          }}>
            <span style={{ color: 'white', fontSize: '1.1rem' }}>🏥</span>
          </div>
          <span style={{ fontFamily: 'Syne', fontWeight: 800, fontSize: '1.2rem', color: '#0f172a' }} 
            className="nav-brand">
            HealthCare Hub
          </span>
        </Link>

        {/* Hamburger Menu */}
        <button 
          className="hamburger"
          onClick={() => setMenuOpen(!menuOpen)}
          style={{
            display: 'none',
            background: 'none',
            border: 'none',
            fontSize: '1.5rem',
            cursor: 'pointer',
            color: '#0f172a',
            padding: '8px'
          }}
          aria-label="Toggle menu"
        >
          {menuOpen ? '✕' : '☰'}
        </button>

        {/* RIGHT: Navigation Links (3 items) */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <Link to="/doctors" style={{ padding: '8px 16px', fontWeight: 500, color: '#475569', fontSize: '0.95rem', whiteSpace: 'nowrap', textDecoration: 'none' }}>
            Find Doctors
          </Link>

          {user ? (
            <>
              <Link to={user.role === 'doctor' ? '/doctor/dashboard' : '/patient/dashboard'}
                style={{ padding: '8px 16px', fontWeight: 500, color: '#475569', fontSize: '0.95rem', whiteSpace: 'nowrap', textDecoration: 'none' }}>
                {user.role === 'doctor' ? 'My Patients' : 'My Bookings'}
              </Link>
              <Link to="/profile" style={{ padding: '8px 16px', fontWeight: 500, color: '#475569', fontSize: '0.95rem', whiteSpace: 'nowrap', textDecoration: 'none' }}>
                Profile
              </Link>
              <button onClick={handleLogout} style={{
                padding: '6px 14px', borderRadius: '6px', border: '1px solid #e2e8f0',
                background: 'white', color: '#ef4444', fontWeight: 500, fontSize: '0.9rem',
                cursor: 'pointer', transition: 'all 0.15s'
              }} onMouseEnter={e => { e.target.background = '#fef2f2'; e.target.borderColor = '#fed7d7'; }}
                 onMouseLeave={e => { e.target.background = 'white'; e.target.borderColor = '#e2e8f0'; }}>
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="btn btn-primary btn-sm" style={{ whiteSpace: 'nowrap' }}>Login</Link>
              <Link to="/register" className="btn btn-primary btn-sm" style={{ whiteSpace: 'nowrap' }}>Register</Link>
            </>
          )}
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div style={{
            position: 'absolute',
            top: '68px',
            left: 0,
            right: 0,
            background: 'white',
            borderBottom: '1px solid #e2e8f0',
            display: 'flex',
            flexDirection: 'column',
            padding: '16px',
            zIndex: 99,
            boxShadow: '0 4px 12px rgba(0,0,0,0.08)'
          }}>
            <Link to="/doctors" onClick={closeMenu} style={{ padding: '12px', fontWeight: 500, color: '#475569', fontSize: '0.95rem', borderBottom: '1px solid #f1f5f9' }}>
              Find Doctors
            </Link>

            {user ? (
              <>
                <Link to={user.role === 'doctor' ? '/doctor/dashboard' : '/patient/dashboard'} onClick={closeMenu}
                  style={{ padding: '12px', fontWeight: 500, color: '#475569', fontSize: '0.95rem', borderBottom: '1px solid #f1f5f9' }}>
                  Dashboard
                </Link>
                <Link to="/profile" onClick={closeMenu} style={{ padding: '12px', fontWeight: 500, color: '#475569', fontSize: '0.95rem', borderBottom: '1px solid #f1f5f9' }}>
                  Profile
                </Link>
                <button onClick={handleLogout} className="btn btn-outline btn-sm" style={{ width: '100%', marginTop: '8px', justifyContent: 'center' }}>
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="btn btn-primary btn-sm" onClick={closeMenu} style={{ width: '100%', marginBottom: '8px', justifyContent: 'center' }}>
                  Login
                </Link>
                <Link to="/register" className="btn btn-primary btn-sm" onClick={closeMenu} style={{ width: '100%', justifyContent: 'center' }}>
                  Register
                </Link>
              </>
            )}
          </div>
        )}
      </div>

      {/* Mobile styles */}
      <style>{`
        @media (max-width: 768px) {
          .hamburger {
            display: block !important;
          }

          .nav-brand {
            font-size: 0.9rem !important;
            display: inline-block !important;
          }

          .container > div:not(.hamburger):nth-child(3) {
            display: none !important;
          }
        }
      `}</style>
    </nav>
  );
}
