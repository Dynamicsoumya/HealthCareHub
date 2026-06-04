import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import { format, addDays } from 'date-fns';
import { useAuth } from '../context/AuthContext';

export default function BookAppointment() {
  const { doctorId } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [booking, setBooking] = useState(false);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedSlot, setSelectedSlot] = useState('');
  const [weekDates, setWeekDates] = useState([]);
  const [step, setStep] = useState(1); // 1=select slot, 2=confirm details, 3=success
  const [bookedAppointment, setBookedAppointment] = useState(null);
  const [form, setForm] = useState({
    patientName: user?.name || '',
    patientAge: user?.age || '',
    patientPhone: user?.phone || '',
  });

  useEffect(() => {
    const dates = Array.from({ length: 7 }, (_, i) => {
      const d = addDays(new Date(), i);
      return { date: format(d, 'yyyy-MM-dd'), label: format(d, 'EEE'), day: format(d, 'd'), month: format(d, 'MMM') };
    });
    setWeekDates(dates);
    setSelectedDate(dates[0].date);

    axios.get(`/api/doctors/${doctorId}/slots`)
      .then(res => setData(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [doctorId]);

  const handleBook = async () => {
    if (!selectedSlot) return toast.error('Please select a time slot');
    if (!form.patientName || !form.patientPhone) return toast.error('Name and phone are required');

    setBooking(true);
    try {
      const { data: appt } = await axios.post('/api/appointments', {
        doctorId,
        date: selectedDate,
        slotTime: selectedSlot,
        ...form,
      });
      setBookedAppointment(appt);
      setStep(3);
      toast.success('Appointment booked successfully!');
    } catch (err) {
      if (err.response?.data?.code === 'SLOT_TAKEN') {
        toast.error('⚠️ This slot was just booked! Refreshing available slots...');
        // Refresh slots
        const res = await axios.get(`/api/doctors/${doctorId}/slots`);
        setData(res.data);
        setSelectedSlot('');
        setStep(1);
      } else {
        toast.error(err.response?.data?.message || 'Booking failed');
      }
    } finally {
      setBooking(false);
    }
  };

  if (loading) return <div className="loading-screen"><div className="spinner" /></div>;
  if (!data) return <div className="container" style={{ padding: '60px 0' }}>Doctor not found</div>;

  const { doctor, slots } = data;
  const currentSlots = slots[selectedDate] || [];

  // Step 3: Success
  if (step === 3 && bookedAppointment) {
    return (
      <div style={{ minHeight: '90vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
        <div className="card" style={{ maxWidth: 500, width: '100%', textAlign: 'center' }}>
          <div style={{ fontSize: '4rem', marginBottom: 16 }}>🎉</div>
          <h2 style={{ fontFamily: 'Syne', fontSize: '1.8rem', marginBottom: 8, color: '#10b981' }}>Booking Confirmed!</h2>
          <p style={{ color: '#64748b', marginBottom: 24 }}>Your appointment has been successfully booked.</p>

          <div style={{ background: 'linear-gradient(135deg, #0ea5e9, #0284c7)', borderRadius: 16, padding: 24, color: 'white', marginBottom: 24 }}>
            <div style={{ fontSize: '0.85rem', opacity: 0.8, marginBottom: 4 }}>BOOKING ID</div>
            <div style={{ fontFamily: 'Syne', fontSize: '1.6rem', fontWeight: 800, letterSpacing: 2, marginBottom: 16 }}>
              {bookedAppointment.bookingId}
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, textAlign: 'left' }}>
              <div><div style={{ fontSize: '0.75rem', opacity: 0.7 }}>DOCTOR</div><div style={{ fontWeight: 600 }}>Dr. {doctor.name}</div></div>
              <div><div style={{ fontSize: '0.75rem', opacity: 0.7 }}>SPECIALTY</div><div style={{ fontWeight: 600 }}>{doctor.specialization}</div></div>
              <div><div style={{ fontSize: '0.75rem', opacity: 0.7 }}>DATE</div><div style={{ fontWeight: 600 }}>{format(new Date(selectedDate + 'T00:00:00'), 'dd MMM yyyy')}</div></div>
              <div><div style={{ fontSize: '0.75rem', opacity: 0.7 }}>TIME</div><div style={{ fontWeight: 600 }}>{selectedSlot}</div></div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: 12 }}>
            <button className="btn btn-outline" style={{ flex: 1, justifyContent: 'center' }}
              onClick={() => navigate('/patient/dashboard')}>
              View My Appointments
            </button>
            <button className="btn btn-primary" style={{ flex: 1, justifyContent: 'center' }}
              onClick={() => navigate('/doctors')}>
              Book Another
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="page-header">
        <div className="container">
          <h1>Book Appointment</h1>
          <p>Dr. {doctor.name} • {doctor.specialization} • ₹{doctor.consultationFee}</p>
        </div>
      </div>

      <div className="container" style={{ paddingBottom: 48 }}>
        {/* Progress */}
        <div style={{ display: 'flex', gap: 0, marginBottom: 32, background: 'white', borderRadius: 12, padding: '4px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)', border: '1px solid #e2e8f0', flexWrap: 'wrap' }}>
          {['Select Time Slot', 'Confirm Details'].map((label, i) => (
            <div key={label} style={{
              flex: 1, padding: '12px', textAlign: 'center', borderRadius: 10,
              background: step === i + 1 ? '#0ea5e9' : 'transparent',
              color: step === i + 1 ? 'white' : '#64748b',
              fontWeight: step === i + 1 ? 600 : 400, cursor: 'pointer', transition: 'all 0.2s',
              fontSize: '0.9rem',
              minHeight: '44px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }} onClick={() => i + 1 < step && setStep(i + 1)}>
              <span style={{ marginRight: 6 }}>{i + 1}.</span>{label}
            </div>
          ))}
        </div>

        {step === 1 && (
          <div className="card">
            <h3 style={{ fontFamily: 'Syne', marginBottom: 20 }}>Select a Date</h3>
            <div style={{ display: 'flex', gap: 10, marginBottom: 28, overflowX: 'auto', paddingBottom: 4, WebkitOverflowScrolling: 'touch' }}>
              {weekDates.map(d => (
                <button key={d.date} onClick={() => { setSelectedDate(d.date); setSelectedSlot(''); }}
                  style={{
                    minWidth: 72, padding: '12px 8px', borderRadius: 14, border: '2px solid',
                    cursor: 'pointer', textAlign: 'center', transition: 'all 0.2s',
                    borderColor: selectedDate === d.date ? '#0ea5e9' : '#e2e8f0',
                    background: selectedDate === d.date ? '#0ea5e9' : 'white',
                    color: selectedDate === d.date ? 'white' : '#475569',
                    flexShrink: 0,
                    minHeight: '44px'
                  }}>
                  <div style={{ fontSize: '0.7rem', fontWeight: 600, marginBottom: 2 }}>{d.label}</div>
                  <div style={{ fontSize: '1.3rem', fontFamily: 'Syne', fontWeight: 800 }}>{d.day}</div>
                  <div style={{ fontSize: '0.7rem' }}>{d.month}</div>
                </button>
              ))}
            </div>

            <h3 style={{ fontFamily: 'Syne', marginBottom: 16 }}>Available Times</h3>
            {currentSlots.length === 0 ? (
              <p style={{ color: '#64748b', padding: '20px 0' }}>No slots available on this day</p>
            ) : (
              <div className="slot-grid" style={{ marginBottom: 24 }}>
                {currentSlots.map(slot => (
                  <button key={slot.time} disabled={!slot.available}
                    onClick={() => slot.available && setSelectedSlot(slot.time)}
                    className={`slot-btn ${!slot.available ? 'booked' : selectedSlot === slot.time ? 'selected' : 'available'}`}>
                    {slot.time}
                  </button>
                ))}
              </div>
            )}

            <button className="btn btn-primary" disabled={!selectedSlot}
              onClick={() => setStep(2)} style={{ padding: '14px 32px', width: '100%', justifyContent: 'center' }}>
              Continue →
            </button>
          </div>
        )}

        {step === 2 && (
          <div className="grid-2" style={{ gap: 24, alignItems: 'start' }}>
            {/* Booking summary */}
            <div className="card" style={{ background: 'linear-gradient(135deg, #0f172a, #073a5a)', color: 'white' }}>
              <h3 style={{ fontFamily: 'Syne', marginBottom: 16 }}>Booking Summary</h3>
              {[
                ['👨‍⚕️ Doctor', `Dr. ${doctor.name}`],
                ['🩺 Specialty', doctor.specialization],
                ['📅 Date', format(new Date(selectedDate + 'T00:00:00'), 'EEEE, dd MMM yyyy')],
                ['⏰ Time', selectedSlot],
                ['💰 Fee', `₹${doctor.consultationFee}`],
                ['📍 Location', doctor.location],
              ].map(([k, v]) => (
                <div key={k} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid rgba(255,255,255,0.1)', flexWrap: 'wrap', gap: 8 }}>
                  <span style={{ opacity: 0.7, fontSize: '0.85rem' }}>{k}</span>
                  <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>{v}</span>
                </div>
              ))}

              {/* Patient health preview */}
              {(user?.bloodGroup || user?.knownMedicalConditions) && (
                <div style={{ marginTop: 16, padding: '12px', background: 'rgba(255,255,255,0.08)', borderRadius: 10 }}>
                  <div style={{ fontSize: '0.75rem', opacity: 0.7, marginBottom: 8 }}>HEALTH SUMMARY (shared with doctor)</div>
                  {user.bloodGroup && <div style={{ fontSize: '0.85rem' }}>🩸 Blood Group: {user.bloodGroup}</div>}
                  {user.knownMedicalConditions && <div style={{ fontSize: '0.85rem', marginTop: 4 }}>📋 Conditions: {user.knownMedicalConditions}</div>}
                  {user.currentMedications && <div style={{ fontSize: '0.85rem', marginTop: 4 }}>💊 Medications: {user.currentMedications}</div>}
                </div>
              )}
            </div>

            {/* Patient details */}
            <div className="card">
              <h3 style={{ fontFamily: 'Syne', marginBottom: 20 }}>Patient Details</h3>
              <div className="form-group">
                <label>Full Name *</label>
                <input type="text" value={form.patientName} onChange={e => setForm({ ...form, patientName: e.target.value })} required />
              </div>
              <div className="grid-2">
                <div className="form-group">
                  <label>Age *</label>
                  <input type="number" value={form.patientAge} onChange={e => setForm({ ...form, patientAge: e.target.value })} required />
                </div>
                <div className="form-group">
                  <label>Phone Number *</label>
                  <input type="tel" value={form.patientPhone} onChange={e => setForm({ ...form, patientPhone: e.target.value })} required />
                </div>
              </div>

              <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                <button className="btn btn-outline" onClick={() => setStep(1)} style={{ flex: 1, justifyContent: 'center', minHeight: '44px' }}>← Back</button>
                <button className="btn btn-primary" disabled={booking}
                  onClick={handleBook} style={{ flex: 2, justifyContent: 'center', padding: '14px', minHeight: '44px' }}>
                  {booking ? 'Booking...' : '✅ Confirm Booking'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Responsive styles */}
      <style>{`
        @media (max-width: 768px) {
          .grid-2 {
            grid-template-columns: 1fr !important;
            gap: 16px !important;
          }

          .page-header p {
            font-size: 0.9rem !important;
            flex-wrap: wrap !important;
          }
        }

        @media (max-width: 480px) {
          .page-header h1 {
            font-size: 1.5rem !important;
          }

          .page-header p {
            font-size: 0.85rem !important;
          }
        }
      `}</style>
    </div>
  );
}
