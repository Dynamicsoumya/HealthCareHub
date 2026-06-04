import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { format, addDays } from 'date-fns';

export default function DoctorProfile() {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(null);
  const [weekDates, setWeekDates] = useState([]);

  useEffect(() => {
    const dates = Array.from({ length: 7 }, (_, i) => {
      const d = addDays(new Date(), i);
      return { date: format(d, 'yyyy-MM-dd'), label: format(d, 'EEE'), day: format(d, 'd'), month: format(d, 'MMM') };
    });
    setWeekDates(dates);
    setSelectedDate(dates[0].date);

    axios.get(`/api/doctors/${id}/slots`)
      .then(res => setData(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="loading-screen"><div className="spinner" /></div>;
  if (!data) return <div className="container" style={{ padding: '60px 0', textAlign: 'center' }}>Doctor not found</div>;

  const { doctor, slots } = data;
  const currentSlots = slots[selectedDate] || [];
  const availableCount = currentSlots.filter(s => s.available).length;

  return (
    <div>
      <div className="page-header">
        <div className="container">
          <div style={{ display: 'flex', alignItems: 'center', gap: 24, flexWrap: 'wrap' }}>
            <div style={{
              width: 96, height: 96, borderRadius: '50%',
              background: 'linear-gradient(135deg, #38bdf8, #0284c7)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: 'white', fontSize: '2.5rem', fontFamily: 'Syne', fontWeight: 700
            }}>
              {doctor.name?.charAt(0)}
            </div>
            <div>
              <h1>Dr. {doctor.name}</h1>
              <p>{doctor.specialization} • {doctor.location} • {doctor.experience} years experience</p>
              <div style={{ display: 'flex', gap: 12, marginTop: 12 }}>
                <span className="badge" style={{ background: 'rgba(255,255,255,0.15)', color: 'white' }}>💰 ₹{doctor.consultationFee} fee</span>
                <span className="badge" style={{ background: 'rgba(16,185,129,0.3)', color: '#6ee7b7' }}>✅ Verified</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container" style={{ paddingBottom: 48 }}>
        <div className="grid-2" style={{ gap: 32, alignItems: 'start' }}>
          {/* Left: Info */}
          <div>
            {doctor.about && (
              <div className="card" style={{ marginBottom: 24 }}>
                <h3 style={{ fontFamily: 'Syne', marginBottom: 12 }}>About</h3>
                <p style={{ color: '#475569', lineHeight: 1.7 }}>{doctor.about}</p>
              </div>
            )}

            <div className="card">
              <h3 style={{ fontFamily: 'Syne', marginBottom: 16 }}>Details</h3>
              {[
                ['🩺 Specialization', doctor.specialization],
                ['📍 Location', doctor.location],
                ['⏱️ Experience', `${doctor.experience} years`],
                ['💰 Fee', `₹${doctor.consultationFee}`],
                ['📅 Available Days', (doctor.availableDays || []).join(', ')],
                ['⏰ Hours', `${doctor.workingHours?.start || '09:00'} – ${doctor.workingHours?.end || '17:00'}`],
                ['⌛ Slot Duration', `${doctor.slotDuration || 30} minutes`],
              ].map(([k, v]) => (
                <div key={k} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid #f1f5f9', flexWrap: 'wrap', gap: 8 }}>
                  <span style={{ color: '#64748b', fontSize: '0.9rem' }}>{k}</span>
                  <span style={{ fontWeight: 500, fontSize: '0.9rem', textAlign: 'right', maxWidth: '60%' }}>{v}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Slots */}
          <div className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, flexWrap: 'wrap', gap: 8 }}>
              <h3 style={{ fontFamily: 'Syne' }}>Available Slots</h3>
              <span className={`badge ${availableCount > 0 ? 'badge-success' : 'badge-danger'}`}>
                {availableCount} slots free
              </span>
            </div>

            {/* Date Picker */}
            <div style={{ display: 'flex', gap: 8, overflowX: 'auto', paddingBottom: 8, marginBottom: 20, WebkitOverflowScrolling: 'touch' }}>
              {weekDates.map(d => (
                <button key={d.date} onClick={() => setSelectedDate(d.date)}
                  style={{
                    minWidth: 64, padding: '10px 8px', borderRadius: 12, border: '1.5px solid',
                    cursor: 'pointer', textAlign: 'center', transition: 'all 0.2s',
                    borderColor: selectedDate === d.date ? '#0ea5e9' : '#e2e8f0',
                    background: selectedDate === d.date ? '#0ea5e9' : 'white',
                    color: selectedDate === d.date ? 'white' : '#475569',
                    flexShrink: 0
                  }}>
                  <div style={{ fontSize: '0.7rem', fontWeight: 600 }}>{d.label}</div>
                  <div style={{ fontSize: '1.1rem', fontFamily: 'Syne', fontWeight: 700 }}>{d.day}</div>
                  <div style={{ fontSize: '0.7rem' }}>{d.month}</div>
                </button>
              ))}
            </div>

            {/* Time Slots */}
            {currentSlots.length === 0 ? (
              <p style={{ textAlign: 'center', color: '#64748b', padding: '24px 0' }}>No slots on this day</p>
            ) : (
              <div className="slot-grid">
                {currentSlots.map(slot => (
                  <div key={slot.time}
                    className={`slot-btn ${slot.available ? 'available' : 'booked'}`}>
                    {slot.time}
                  </div>
                ))}
              </div>
            )}

            <Link to={`/book/${doctor._id}`} className="btn btn-primary"
              style={{ width: '100%', justifyContent: 'center', marginTop: 20 }}>
              📅 Book Appointment
            </Link>
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

          .page-header {
            padding: 40px 0 30px !important;
          }

          .page-header .card {
            flex-direction: column !important;
            text-align: center !important;
          }
        }

        @media (max-width: 480px) {
          .page-header h1 {
            font-size: 1.5rem !important;
          }

          .page-header p {
            font-size: 0.9rem !important;
          }
        }
      `}</style>
    </div>
  );
}
