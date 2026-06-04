import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const specializations = [
  { name: 'Cardiologist', icon: '❤️', color: '#fee2e2' },
  { name: 'Dermatologist', icon: '🧴', color: '#fef3c7' },
  { name: 'Neurologist', icon: '🧠', color: '#e0e7ff' },
  { name: 'Orthopedic', icon: '🦴', color: '#d1fae5' },
  { name: 'Pediatrician', icon: '👶', color: '#fce7f3' },
  { name: 'Psychiatrist', icon: '🧘', color: '#ede9fe' },
  { name: 'Gynecologist', icon: '🌸', color: '#fdf4ff' },
  { name: 'General', icon: '🩺', color: '#e0f2fe' },
];

export default function Home() {
  const { user } = useAuth();
  const navigate = useNavigate();

  return (
    <div>
      {/* Hero */}
      <section style={{
        background: 'linear-gradient(135deg, #0f172a 0%, #073a5a 50%, #0ea5e9 100%)',
        padding: '80px 0 100px', color: 'white', position: 'relative', overflow: 'hidden'
      }}>
        <div style={{
          position: 'absolute', top: -100, right: -100, width: 500, height: 500,
          background: 'radial-gradient(circle, rgba(14,165,233,0.2) 0%, transparent 70%)',
          borderRadius: '50%'
        }} />
        <div className="container" style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ maxWidth: 640 }}>
            <div className="badge badge-primary" style={{ marginBottom: 16, background: 'rgba(14,165,233,0.2)', color: '#7dd3fc', display: 'inline-block' }}>
              🏥 Better Healthcare, Better Tomorrow
            </div>
            <h1 style={{ fontSize: '3.5rem', fontFamily: 'Syne', fontWeight: 800, lineHeight: 1.15, marginBottom: 20 }}>
              Find the right doctor,<br />
              <span style={{ color: '#38bdf8' }}>book instantly</span>
            </h1>
            <p style={{ fontSize: '1.2rem', opacity: 0.75, marginBottom: 36, maxWidth: 480 }}>
              Search doctors by specialization and location, view real-time availability, and book your appointment in under 2 minutes.
            </p>
            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
              <Link to="/doctors" className="btn btn-primary" style={{ fontSize: '1rem', padding: '14px 28px' }}>
                🔍 Find a Doctor
              </Link>
              {!user && (
                <Link to="/register" className="btn btn-outline" style={{ fontSize: '1rem', padding: '14px 28px', borderColor: 'rgba(255,255,255,0.4)', color: 'white' }}>
                  Create Account
                </Link>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section style={{ background: 'white', padding: '40px 0', borderBottom: '1px solid #e2e8f0' }}>
        <div className="container">
          <div className="grid-4" style={{ textAlign: 'center' }}>
            {[
              { value: '500+', label: 'Doctors', icon: '👨‍⚕️' },
              { value: '50k+', label: 'Patients Served', icon: '🏥' },
              { value: '25+', label: 'Specializations', icon: '🩺' },
              { value: '< 2 min', label: 'Booking Time', icon: '⚡' },
            ].map(s => (
              <div key={s.label} style={{ padding: '16px' }}>
                <div style={{ fontSize: '2rem', marginBottom: 4 }}>{s.icon}</div>
                <div style={{ fontSize: '2rem', fontFamily: 'Syne', fontWeight: 800, color: '#0ea5e9' }}>{s.value}</div>
                <div style={{ color: '#64748b', fontSize: '0.9rem' }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Specializations */}
      <section style={{ padding: '64px 0' }}>
        <div className="container">
          <h2 style={{ textAlign: 'center', fontSize: '2rem', marginBottom: 8 }}>Browse by Specialization</h2>
          <p style={{ textAlign: 'center', color: '#64748b', marginBottom: 40 }}>Find the specialist you need</p>
          <div className="grid-4">
            {specializations.map(s => (
              <div key={s.name}
                onClick={() => navigate(`/doctors?specialization=${s.name}`)}
                className="card"
                style={{
                  textAlign: 'center', cursor: 'pointer', transition: 'all 0.2s',
                  background: s.color, border: 'none',
                }}
                onMouseOver={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 12px 32px rgba(0,0,0,0.1)'; }}
                onMouseOut={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = ''; }}
              >
                <div style={{ fontSize: '2.5rem', marginBottom: 8 }}>{s.icon}</div>
                <div style={{ fontFamily: 'Syne', fontWeight: 600, fontSize: '0.95rem' }}>{s.name}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section style={{ background: 'white', padding: '64px 0' }}>
        <div className="container">
          <h2 style={{ textAlign: 'center', fontSize: '2rem', marginBottom: 48 }}>How It Works</h2>
          <div className="grid-3">
            {[
              { step: '01', title: 'Search Doctors', desc: 'Browse by specialization and location. View detailed profiles, fees, and availability.', icon: '🔍' },
              { step: '02', title: 'Pick a Slot', desc: 'See real-time availability for the next 7 days. Select the time that works for you.', icon: '📅' },
              { step: '03', title: 'Get Confirmed', desc: 'Enter basic details and receive a unique Booking ID instantly. It\'s that simple!', icon: '✅' },
            ].map(s => (
              <div key={s.step} className="card" style={{ textAlign: 'center' }}>
                <div style={{
                  width: 56, height: 56, borderRadius: '50%',
                  background: 'linear-gradient(135deg, #0ea5e9, #0284c7)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '1.5rem', margin: '0 auto 16px'
                }}>{s.icon}</div>
                <div style={{ color: '#0ea5e9', fontWeight: 700, fontSize: '0.8rem', letterSpacing: 2, marginBottom: 8 }}>STEP {s.step}</div>
                <h3 style={{ fontFamily: 'Syne', fontSize: '1.15rem', marginBottom: 8 }}>{s.title}</h3>
                <p style={{ color: '#64748b', fontSize: '0.9rem' }}>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      {!user && (
        <section style={{ background: 'linear-gradient(135deg, #0ea5e9, #0284c7)', padding: '64px 0', textAlign: 'center', color: 'white' }}>
          <div className="container">
            <h2 style={{ fontSize: '2.2rem', marginBottom: 12 }}>Ready to get started?</h2>
            <p style={{ opacity: 0.85, fontSize: '1.1rem', marginBottom: 32 }}>Join thousands of patients managing their health digitally</p>
            <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link to="/register" className="btn" style={{ background: 'white', color: '#0ea5e9', fontWeight: 700, padding: '14px 32px', fontSize: '1rem' }}>
                Register as Patient
              </Link>
              <Link to="/register?role=doctor" className="btn btn-outline" style={{ borderColor: 'rgba(255,255,255,0.5)', color: 'white', padding: '14px 32px', fontSize: '1rem' }}>
                Join as Doctor
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Responsive styles for Home page */}
      <style>{`
        @media (max-width: 768px) {
          section {
            padding: 40px 0 !important;
          }
        }

        @media (max-width: 480px) {
          section:first-of-type {
            padding: 40px 0 60px !important;
          }

          section h2 {
            font-size: 1.5rem !important;
            margin-bottom: 24px !important;
          }

          section p {
            font-size: 0.9rem !important;
          }

          .grid-4 > div {
            padding: 12px 8px !important;
          }

          .grid-3 > .card {
            padding: 16px !important;
          }
        }
      `}</style>
    </div>
  );
}
