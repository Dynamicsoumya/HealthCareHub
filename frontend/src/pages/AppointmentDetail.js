import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import { format } from 'date-fns';
import { useAuth } from '../context/AuthContext';

const statusColors = { booked: '#0ea5e9', completed: '#10b981', cancelled: '#f43f5e' };

export default function AppointmentDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [appt, setAppt] = useState(null);
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState(false);

  useEffect(() => {
    axios.get(`/api/appointments/${id}`)
      .then(res => setAppt(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [id]);

  const handleCancel = async () => {
    if (!window.confirm('Cancel this appointment?')) return;
    setCancelling(true);
    try {
      await axios.put(`/api/appointments/${id}/cancel`);
      toast.success('Appointment cancelled');
      navigate(user.role === 'doctor' ? '/doctor/dashboard' : '/patient/dashboard');
    } catch (err) {
      toast.error('Failed to cancel');
      setCancelling(false);
    }
  };

  if (loading) return <div className="loading-screen"><div className="spinner" /></div>;
  if (!appt) return <div className="container" style={{ padding: 48, textAlign: 'center' }}>Appointment not found</div>;

  return (
    <div>
      <div className="page-header">
        <div className="container">
          <h1>Appointment Details</h1>
          <p>Booking ID: {appt.bookingId}</p>
        </div>
      </div>

      <div className="container" style={{ paddingBottom: 48, maxWidth: 700 }}>
        {/* Status Banner */}
        <div style={{
          borderRadius: 16, padding: '16px 24px', marginBottom: 24,
          background: `${statusColors[appt.status]}15`,
          borderLeft: `4px solid ${statusColors[appt.status]}`,
          display: 'flex', alignItems: 'center', gap: 12
        }}>
          <div style={{ fontSize: '1.5rem' }}>
            {appt.status === 'completed' ? '✅' : appt.status === 'cancelled' ? '❌' : '📅'}
          </div>
          <div>
            <div style={{ fontFamily: 'Syne', fontWeight: 700, color: statusColors[appt.status], textTransform: 'capitalize', fontSize: '1.1rem' }}>
              {appt.status}
            </div>
            <div style={{ color: '#64748b', fontSize: '0.875rem' }}>
              {format(new Date(appt.date + 'T00:00:00'), 'EEEE, dd MMMM yyyy')} at {appt.slotTime}
            </div>
          </div>
        </div>

        <div className="card" style={{ marginBottom: 20 }}>
          <h3 style={{ fontFamily: 'Syne', marginBottom: 16 }}>Appointment Info</h3>
          {[
            ['Booking ID', appt.bookingId],
            ['Doctor', `Dr. ${appt.doctor?.name}`],
            ['Specialization', appt.doctor?.specialization],
            ['Date', format(new Date(appt.date + 'T00:00:00'), 'dd MMM yyyy')],
            ['Time', appt.slotTime],
            ['Location', appt.doctor?.location],
            ['Consultation Fee', `₹${appt.doctor?.consultationFee}`],
          ].map(([k, v]) => (
            <div key={k} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid #f1f5f9' }}>
              <span style={{ color: '#64748b', fontSize: '0.875rem' }}>{k}</span>
              <span style={{ fontWeight: 500, fontSize: '0.875rem' }}>{v}</span>
            </div>
          ))}
        </div>

        {/* Patient Info */}
        <div className="card" style={{ marginBottom: 20 }}>
          <h3 style={{ fontFamily: 'Syne', marginBottom: 16 }}>Patient Details</h3>
          {[
            ['Name', appt.patientName],
            ['Age', appt.patientAge],
            ['Phone', appt.patientPhone],
            ['Blood Group', appt.patientBloodGroup],
            ['Medical Conditions', appt.patientMedicalConditions],
            ['Current Medications', appt.patientMedications],
          ].filter(([, v]) => v).map(([k, v]) => (
            <div key={k} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid #f1f5f9', flexWrap: 'wrap', gap: 8 }}>
              <span style={{ color: '#64748b', fontSize: '0.875rem' }}>{k}</span>
              <span style={{ fontWeight: 500, fontSize: '0.875rem', maxWidth: '60%', textAlign: 'right' }}>{v}</span>
            </div>
          ))}
        </div>

        {/* Notes & Prescription */}
        {(appt.notes || appt.prescription) && (
          <div className="card" style={{ marginBottom: 20, background: '#f0fdf4', border: '1px solid #bbf7d0' }}>
            <h3 style={{ fontFamily: 'Syne', marginBottom: 16, color: '#065f46' }}>Doctor's Notes</h3>
            {appt.notes && (
              <div style={{ marginBottom: 16 }}>
                <div style={{ fontSize: '0.8rem', fontWeight: 600, color: '#065f46', marginBottom: 6 }}>CONSULTATION NOTES</div>
                <p style={{ color: '#334155', lineHeight: 1.7 }}>{appt.notes}</p>
              </div>
            )}
            {appt.prescription && (
              <div>
                <div style={{ fontSize: '0.8rem', fontWeight: 600, color: '#065f46', marginBottom: 6 }}>PRESCRIPTION</div>
                <pre style={{ fontFamily: 'DM Sans', color: '#334155', lineHeight: 1.7, whiteSpace: 'pre-wrap' }}>{appt.prescription}</pre>
              </div>
            )}
          </div>
        )}

        {/* Actions */}
        <div style={{ display: 'flex', gap: 12 }}>
          <button className="btn btn-outline" onClick={() => navigate(-1)}>← Back</button>
          {appt.status === 'booked' && (
            <button className="btn btn-danger" disabled={cancelling} onClick={handleCancel}>
              {cancelling ? 'Cancelling...' : '❌ Cancel Appointment'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
