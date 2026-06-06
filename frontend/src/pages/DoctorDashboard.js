import React, { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { format } from 'date-fns';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';

export default function DoctorDashboard() {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedAppt, setSelectedAppt] = useState(null);
  const [notes, setNotes] = useState('');
  const [prescription, setPrescription] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchAppointments();
  }, [selectedDate]);

  const fetchAppointments = async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/appointments/doctor/all', { params: { date: selectedDate } });
      setAppointments(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const openAppt = (appt) => {
    setSelectedAppt(appt);
    setNotes(appt.notes || '');
    setPrescription(appt.prescription || '');
  };

  const saveNotes = async (status) => {
    setSaving(true);
    try {
      await api.put(`/appointments/${selectedAppt._id}/notes`, { notes, prescription, status });
      toast.success('Notes saved successfully');
      fetchAppointments();
      setSelectedAppt(null);
    } catch (err) {
      toast.error('Failed to save notes');
    } finally {
      setSaving(false);
    }
  };

  const stats = {
    total: appointments.length,
    booked: appointments.filter(a => a.status === 'booked').length,
    completed: appointments.filter(a => a.status === 'completed').length,
    cancelled: appointments.filter(a => a.status === 'cancelled').length,
  };
  const safeFormatDate = (dateStr) => {
  const date = new Date(dateStr);
  if (!dateStr || isNaN(date.getTime())) return '';
  return format(date, 'dd MMM');
};

  return (
    <div>
      <div className="page-header">
        <div className="container">
          <h1>Doctor Dashboard</h1>
          <p>Dr. {user.name} • {user.specialization} • {user.location}</p>
        </div>
      </div>

      <div className="container" style={{ paddingBottom: 48 }}>
        {/* Stats */}
        <div className="grid-4" style={{ marginBottom: 28 }}>
          {[
            { label: 'Total', value: stats.total, icon: '📋', color: '#e0f2fe' },
            { label: 'Upcoming', value: stats.booked, icon: '⏰', color: '#fef9c3' },
            { label: 'Completed', value: stats.completed, icon: '✅', color: '#d1fae5' },
            { label: 'Cancelled', value: stats.cancelled, icon: '❌', color: '#fee2e2' },
          ].map(s => (
            <div key={s.label} className="card" style={{ background: s.color, border: 'none', textAlign: 'center' }}>
              <div style={{ fontSize: '2rem', marginBottom: 2 }}>{s.icon}</div>
              <div style={{ fontFamily: 'Syne', fontSize: '2rem', fontWeight: 800 }}>{s.value}</div>
              <div style={{ color: '#475569', fontSize: '0.85rem' }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Date filter */}
        <div className="card" style={{ marginBottom: 24, display: 'flex', gap: 16, alignItems: 'center', flexWrap: 'wrap' }}>
          <label style={{ fontWeight: 600, color: '#475569' }}>📅 Select Date:</label>
          <input type="date" value={selectedDate}
            onChange={e => setSelectedDate(e.target.value)}
            style={{ padding: '8px 14px', borderRadius: 8, border: '1.5px solid #e2e8f0', fontFamily: 'DM Sans', fontSize: '0.95rem' }} />
          <button className="btn btn-outline btn-sm" onClick={() => setSelectedDate(new Date().toISOString().split('T')[0])}>Today</button>
          <span style={{ color: '#64748b', fontSize: '0.9rem' }}>
          {selectedDate === new Date().toISOString().split('T')[0]
  ? "Today's"
  : `${safeFormatDate(selectedDate)} appointments`
}
          </span>
        </div>

        <div style={{ display: 'flex', gap: 24, alignItems: 'start', flexWrap: 'wrap' }}>
          {/* Appointments List */}
          <div style={{ flex: '1', minWidth: 0 }}>
            {loading ? (
              <div style={{ textAlign: 'center', padding: 48 }}><div className="spinner" style={{ margin: '0 auto' }} /></div>
            ) : appointments.length === 0 ? (
              <div className="card" style={{ textAlign: 'center', padding: '48px', color: '#64748b' }}>
                <div style={{ fontSize: '3rem', marginBottom: 12 }}>📅</div>
                <p>No appointments on this date</p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {appointments.sort((a, b) => a.slotTime.localeCompare(b.slotTime)).map(appt => (
                  <div key={appt._id} className="card" style={{
                    padding: '16px', cursor: 'pointer', transition: 'all 0.2s',
                    borderLeft: `4px solid ${appt.status === 'completed' ? '#10b981' : appt.status === 'cancelled' ? '#f43f5e' : '#0ea5e9'}`,
                    outline: selectedAppt?._id === appt._id ? '2px solid #0ea5e9' : 'none',
                  }}
                    onClick={() => openAppt(appt)}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12, flexWrap: 'wrap' }}>
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                          <div style={{
                            width: 36, height: 36, borderRadius: '50%',
                            background: 'linear-gradient(135deg, #0ea5e9, #0284c7)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            color: 'white', fontWeight: 700, fontSize: '0.85rem',
                            flexShrink: 0
                          }}>
                            {appt.patientName?.charAt(0)}
                          </div>
                          <div>
                            <h4 style={{ fontFamily: 'Syne', fontSize: '0.95rem' }}>{appt.patientName}</h4>
                            <div style={{ fontSize: '0.8rem', color: '#64748b' }}>Age: {appt.patientAge} • {appt.patientPhone}</div>
                          </div>
                        </div>
                        <div style={{ display: 'flex', gap: 12, fontSize: '0.825rem', color: '#475569', marginTop: 4, flexWrap: 'wrap' }}>
                          <span>⏰ {appt.slotTime}</span>
                          {appt.patientBloodGroup && <span>🩸 {appt.patientBloodGroup}</span>}
                          {appt.patientMedicalConditions && <span>📋 {appt.patientMedicalConditions.slice(0, 30)}</span>}
                        </div>
                      </div>
                      <span className={`badge ${appt.status === 'completed' ? 'badge-success' : appt.status === 'cancelled' ? 'badge-danger' : 'badge-primary'}`} style={{ textTransform: 'capitalize' }}>
                        {appt.status}
                      </span>
                    </div>
                    {appt.notes && (
                      <div style={{ marginTop: 8, padding: '8px 10px', background: '#f8fafc', borderRadius: 8, fontSize: '0.825rem', color: '#475569' }}>
                        📝 {appt.notes.slice(0, 80)}...
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Notes Panel */}
          {selectedAppt && (
            <div className="card" style={{ width: 340, flexShrink: 0, position: 'sticky', top: 80 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                <h3 style={{ fontFamily: 'Syne', fontSize: '1rem' }}>Consultation Notes</h3>
                <button onClick={() => setSelectedAppt(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b', fontSize: '1.2rem' }}>✕</button>
              </div>

              {/* Patient Health */}
              <div style={{ background: '#f0f9ff', borderRadius: 10, padding: 12, marginBottom: 16 }}>
                <div style={{ fontWeight: 600, fontSize: '0.8rem', color: '#0284c7', marginBottom: 8 }}>PATIENT HEALTH SUMMARY</div>
                <div style={{ fontSize: '0.825rem', color: '#334155', lineHeight: 1.8 }}>
                  <div>👤 {selectedAppt.patientName}, Age {selectedAppt.patientAge}</div>
                  <div>📞 {selectedAppt.patientPhone}</div>
                  {selectedAppt.patientBloodGroup && <div>🩸 Blood: {selectedAppt.patientBloodGroup}</div>}
                  {selectedAppt.patientMedicalConditions && <div>📋 Conditions: {selectedAppt.patientMedicalConditions}</div>}
                  {selectedAppt.patientMedications && <div>💊 Medications: {selectedAppt.patientMedications}</div>}
                </div>
              </div>

              <div className="form-group">
                <label>Consultation Notes</label>
                <textarea value={notes} onChange={e => setNotes(e.target.value)}
                  rows={4} style={{ resize: 'vertical' }}
                  placeholder="Patient complaints, observations, diagnosis..." />
              </div>
              <div className="form-group">
                <label>Prescription</label>
                <textarea value={prescription} onChange={e => setPrescription(e.target.value)}
                  rows={4} style={{ resize: 'vertical' }}
                  placeholder="Tab. Paracetamol 500mg - 1-0-1 x 5 days..." />
              </div>

              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                <button className="btn btn-success btn-sm" disabled={saving} onClick={() => saveNotes('completed')} style={{ flex: 1, justifyContent: 'center', minHeight: '44px' }}>
                  {saving ? '...' : '✅ Complete'}
                </button>
                <button className="btn btn-outline btn-sm" disabled={saving} onClick={() => saveNotes('booked')} style={{ flex: 1, justifyContent: 'center', minHeight: '44px' }}>
                  💾 Save
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Responsive styles */}
      <style>{`
        @media (max-width: 1200px) {
          .card[style*="width: 340"] {
            width: 100% !important;
            max-width: 340px;
            position: relative !important;
            top: 0 !important;
          }
        }

        @media (max-width: 768px) {
          .grid-4 {
            grid-template-columns: repeat(2, 1fr) !important;
          }

          [style*="display: flex"][style*="gap: 24"][style*="align-items: start"] {
            flex-direction: column !important;
          }

          .card[style*="width: 340"] {
            width: 100% !important;
          }

          .page-header p {
            font-size: 0.9rem !important;
          }
        }

        @media (max-width: 480px) {
          .grid-4 {
            grid-template-columns: 1fr !important;
          }

          .page-header h1 {
            font-size: 1.5rem !important;
          }
        }
      `}</style>
    </div>
  );
}
