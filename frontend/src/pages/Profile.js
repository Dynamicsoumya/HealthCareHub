import React, { useState } from 'react';
import api from '../api/axios';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';

export default function Profile() {
  const { user, updateUser } = useAuth();
  const [form, setForm] = useState({ ...user });
  const [saving, setSaving] = useState(false);

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const { data } = await api.put('/auth/profile', form);
      updateUser(data);
      toast.success('Profile updated!');
    } catch (err) {
      toast.error('Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const bloodGroups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  return (
    <div>
      <div className="page-header">
        <div className="container">
          <h1>My Profile</h1>
          <p>Manage your account and health information</p>
        </div>
      </div>

      <div className="container" style={{ paddingBottom: 48, maxWidth: 800 }}>
        <form onSubmit={handleSave}>
          {/* Basic Info */}
          <div className="card" style={{ marginBottom: 24 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 24 }}>
              <div style={{
                width: 72, height: 72, borderRadius: '50%',
                background: 'linear-gradient(135deg, #0ea5e9, #f43f5e)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: 'white', fontSize: '2rem', fontFamily: 'Syne', fontWeight: 700
              }}>
                {user.name?.charAt(0)}
              </div>
              <div>
                <h2 style={{ fontFamily: 'Syne', fontSize: '1.4rem' }}>{user.name}</h2>
                <span className={`badge ${user.role === 'doctor' ? 'badge-primary' : 'badge-success'}`} style={{ textTransform: 'capitalize' }}>
                  {user.role === 'doctor' ? '👨‍⚕️ Doctor' : '🧑 Patient'}
                </span>
              </div>
            </div>

            <h3 style={{ fontFamily: 'Syne', marginBottom: 16 }}>Basic Information</h3>
            <div className="grid-2">
              <div className="form-group">
                <label>Full Name</label>
                <input type="text" value={form.name || ''} onChange={set('name')} />
              </div>
              <div className="form-group">
                <label>Phone Number</label>
                <input type="tel" value={form.phone || ''} onChange={set('phone')} />
              </div>
            </div>
            <div className="form-group">
              <label>Email Address</label>
              <input type="email" value={form.email || ''} disabled style={{ background: '#f8fafc', cursor: 'not-allowed' }} />
            </div>
          </div>

          {/* Patient Health */}
          {user.role === 'patient' && (
            <div className="card" style={{ marginBottom: 24 }}>
              <h3 style={{ fontFamily: 'Syne', marginBottom: 4 }}>Health Summary</h3>
              <p style={{ color: '#64748b', fontSize: '0.875rem', marginBottom: 20 }}>This information will be shared with doctors before consultations</p>
              <div className="grid-2">
                <div className="form-group">
                  <label>Age</label>
                  <input type="number" value={form.age || ''} onChange={set('age')} placeholder="30" />
                </div>
                <div className="form-group">
                  <label>Blood Group</label>
                  <select value={form.bloodGroup || ''} onChange={set('bloodGroup')}>
                    <option value="">Select</option>
                    {bloodGroups.map(b => <option key={b}>{b}</option>)}
                  </select>
                </div>
              </div>
              <div className="form-group">
                <label>Known Medical Conditions</label>
                <input type="text" value={form.knownMedicalConditions || ''} onChange={set('knownMedicalConditions')} placeholder="e.g. Diabetes Type 2, Hypertension" />
              </div>
              <div className="form-group">
                <label>Current Medications</label>
                <textarea value={form.currentMedications || ''} onChange={set('currentMedications')} rows={3} placeholder="List medications you are currently taking..." />
              </div>
            </div>
          )}

          {/* Doctor Settings */}
          {user.role === 'doctor' && (
            <div className="card" style={{ marginBottom: 24 }}>
              <h3 style={{ fontFamily: 'Syne', marginBottom: 20 }}>Doctor Settings</h3>
              <div className="grid-2">
                <div className="form-group">
                  <label>Specialization</label>
                  <input type="text" value={form.specialization || ''} onChange={set('specialization')} />
                </div>
                <div className="form-group">
                  <label>Location / City</label>
                  <input type="text" value={form.location || ''} onChange={set('location')} />
                </div>
              </div>
              <div className="grid-2">
                <div className="form-group">
                  <label>Consultation Fee (₹)</label>
                  <input type="number" value={form.consultationFee || ''} onChange={set('consultationFee')} />
                </div>
                <div className="form-group">
                  <label>Experience (years)</label>
                  <input type="number" value={form.experience || ''} onChange={set('experience')} />
                </div>
              </div>
              <div className="form-group">
                <label>About / Bio</label>
                <textarea value={form.about || ''} onChange={set('about')} rows={3} />
              </div>

              <div className="grid-2">
                <div className="form-group">
                  <label>Working Hours Start</label>
                  <input type="time" value={form.workingHours?.start || '09:00'} onChange={e => setForm({ ...form, workingHours: { ...form.workingHours, start: e.target.value } })} />
                </div>
                <div className="form-group">
                  <label>Working Hours End</label>
                  <input type="time" value={form.workingHours?.end || '17:00'} onChange={e => setForm({ ...form, workingHours: { ...form.workingHours, end: e.target.value } })} />
                </div>
              </div>
              <div className="form-group">
                <label>Slot Duration (minutes)</label>
                <select value={form.slotDuration || 30} onChange={set('slotDuration')}>
                  {[15, 20, 30, 45, 60].map(d => <option key={d} value={d}>{d} min</option>)}
                </select>
              </div>
              <div className="form-group">
                <label>Available Days</label>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 8 }}>
                  {days.map(day => {
                    const isSelected = (form.availableDays || []).includes(day);
                    return (
                      <button key={day} type="button"
                        onClick={() => {
                          const curr = form.availableDays || [];
                          setForm({ ...form, availableDays: isSelected ? curr.filter(d => d !== day) : [...curr, day] });
                        }}
                        style={{
                          padding: '6px 14px', borderRadius: 99, border: '1.5px solid', cursor: 'pointer', fontSize: '0.85rem', transition: 'all 0.15s',
                          borderColor: isSelected ? '#0ea5e9' : '#e2e8f0',
                          background: isSelected ? '#0ea5e9' : 'white',
                          color: isSelected ? 'white' : '#475569',
                        }}>
                        {day.slice(0, 3)}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          <button className="btn btn-primary" type="submit" disabled={saving} style={{ padding: '14px 32px', fontSize: '1rem' }}>
            {saving ? 'Saving...' : '💾 Save Changes'}
          </button>
        </form>
      </div>
    </div>
  );
}
