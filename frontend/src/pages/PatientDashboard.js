import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { format } from 'date-fns';
import { useAuth } from '../context/AuthContext';

const statusColors = { booked: 'badge-primary', completed: 'badge-success', cancelled: 'badge-danger' };

export default function PatientDashboard() {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    axios.get('/api/appointments/my')
      .then(res => setAppointments(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const filtered = filter === 'all' ? appointments : appointments.filter(a => a.status === filter);
  const upcoming = appointments.filter(a => a.status === 'booked' && a.date >= new Date().toISOString().split('T')[0]);

  return (
    <div>
      <div className="page-header">
        <div className="container">
          <h1>My Health Dashboard</h1>
          <p>Welcome back, {user.name} 👋</p>
        </div>
      </div>

      <div className="container" style={{ paddingBottom: 48 }}>
        {/* Stats */}
        <div className="grid-4" style={{ marginBottom: 32 }}>
          {[
            { label: 'Total Bookings', value: appointments.length, icon: '📅', color: '#e0f2fe' },
            { label: 'Upcoming', value: upcoming.length, icon: '⏰', color: '#d1fae5' },
            { label: 'Completed', value: appointments.filter(a => a.status === 'completed').length, icon: '✅', color: '#fef3c7' },
            { label: 'Cancelled', value: appointments.filter(a => a.status === 'cancelled').length, icon: '❌', color: '#fee2e2' },
          ].map(s => (
            <div key={s.label} className="card" style={{ background: s.color, border: 'none', textAlign: 'center' }}>
              <div style={{ fontSize: '2rem', marginBottom: 4 }}>{s.icon}</div>
              <div style={{ fontFamily: 'Syne', fontSize: '2rem', fontWeight: 800 }}>{s.value}</div>
              <div style={{ color: '#475569', fontSize: '0.85rem' }}>{s.label}</div>
            </div>
          ))}
        </div>

        <div className="grid-2" style={{ gap: 32, alignItems: 'start' }}>
          {/* Health Summary */}
          <div>
            <div className="card" style={{ marginBottom: 24 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, flexWrap: 'wrap', gap: 8 }}>
                <h3 style={{ fontFamily: 'Syne' }}>Health Summary</h3>
                <Link to="/profile" className="btn btn-outline btn-sm">Edit</Link>
              </div>
              {[
                ['🩸 Blood Group', user.bloodGroup || 'Not set'],
                ['📋 Medical Conditions', user.knownMedicalConditions || 'None'],
                ['💊 Medications', user.currentMedications || 'None'],
                ['📞 Phone', user.phone || 'Not set'],
                ['🎂 Age', user.age ? `${user.age} years` : 'Not set'],
              ].map(([k, v]) => (
                <div key={k} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid #f1f5f9', flexWrap: 'wrap', gap: 8 }}>
                  <span style={{ color: '#64748b', fontSize: '0.875rem' }}>{k}</span>
                  <span style={{ fontWeight: 500, fontSize: '0.875rem', color: v.includes('Not set') || v === 'None' ? '#94a3b8' : '#0f172a' }}>{v}</span>
                </div>
              ))}
            </div>

            <Link to="/doctors" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', padding: '14px', minHeight: '44px' }}>
              🔍 Book New Appointment
            </Link>
          </div>

          {/* Appointments */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, flexWrap: 'wrap', gap: 8 }}>
              <h3 style={{ fontFamily: 'Syne' }}>Appointments</h3>
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                {['all', 'booked', 'completed', 'cancelled'].map(f => (
                  <button key={f} onClick={() => setFilter(f)}
                    style={{
                      padding: '5px 12px', borderRadius: 99, border: 'none', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 500, transition: 'all 0.2s',
                      background: filter === f ? '#0ea5e9' : '#f1f5f9',
                      color: filter === f ? 'white' : '#64748b',
                      minHeight: '32px'
                    }}>
                    {f}
                  </button>
                ))}
              </div>
            </div>

            {loading ? (
              <div style={{ textAlign: 'center', padding: 32 }}><div className="spinner" style={{ margin: '0 auto' }} /></div>
            ) : filtered.length === 0 ? (
              <div className="card" style={{ textAlign: 'center', padding: '40px', color: '#64748b' }}>
                <div style={{ fontSize: '3rem', marginBottom: 12 }}>📅</div>
                <p>No appointments found</p>
                <Link to="/doctors" className="btn btn-primary btn-sm" style={{ marginTop: 12 }}>Book Now</Link>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {filtered.map(appt => (
                  <div key={appt._id} className="card" style={{ padding: '16px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8, flexWrap: 'wrap', gap: 8 }}>
                      <div>
                        <h4 style={{ fontFamily: 'Syne', fontSize: '1rem' }}>Dr. {appt.doctor?.name}</h4>
                        <span style={{ color: '#64748b', fontSize: '0.85rem' }}>{appt.doctor?.specialization}</span>
                      </div>
                      <span className={`badge ${statusColors[appt.status]}`} style={{ textTransform: 'capitalize' }}>{appt.status}</span>
                    </div>
                    <div style={{ display: 'flex', gap: 16, fontSize: '0.85rem', color: '#475569', marginBottom: 10, flexWrap: 'wrap' }}>
                      <span>📅 {format(new Date(appt.date + 'T00:00:00'), 'dd MMM yyyy')}</span>
                      <span>⏰ {appt.slotTime}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 8 }}>
                      <span style={{ fontFamily: 'Syne', fontWeight: 600, fontSize: '0.8rem', color: '#94a3b8', letterSpacing: 1 }}>
                        #{appt.bookingId}
                      </span>
                      <Link to={`/appointments/${appt._id}`} className="btn btn-outline btn-sm">View Details</Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Responsive styles */}
      <style>{`
        @media (max-width: 1024px) {
          .grid-2 {
            gap: 24px !important;
          }
        }

        @media (max-width: 768px) {
          .grid-2 {
            grid-template-columns: 1fr !important;
            gap: 16px !important;
          }

          .grid-4 {
            grid-template-columns: repeat(2, 1fr) !important;
          }
        }

        @media (max-width: 480px) {
          .grid-4 {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}
