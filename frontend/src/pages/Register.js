import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [role, setRole] = useState(searchParams.get('role') || 'patient');
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: '', email: '', password: '', phone: '',
    // Patient
    bloodGroup: '', knownMedicalConditions: '', currentMedications: '', age: '',
    // Doctor
    specialization: '', location: '', consultationFee: '', experience: '', about: '',
  });

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password.length < 6) return toast.error('Password must be at least 6 characters');
    setLoading(true);
    try {
      const user = await register({ ...form, role });
      toast.success(`Welcome to HealthCare Hub, ${user.name}!`);
      navigate(role === 'doctor' ? '/doctor/dashboard' : '/patient/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const bloodGroups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
  const specializations = ['Cardiologist', 'Dermatologist', 'Neurologist', 'Orthopedic', 'Pediatrician', 'Psychiatrist', 'Gynecologist', 'General Physician', 'ENT', 'Ophthalmologist', 'Diabetologist', 'Pulmonologist'];

  return (
    <div style={{ minHeight: '90vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
      <div className="card" style={{ width: '100%', maxWidth: 540 }}>
        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <div style={{ fontSize: '2.5rem', marginBottom: 8 }}>🏥</div>
          <h1 style={{ fontFamily: 'Syne', fontSize: '1.8rem', marginBottom: 16 }}>Create Account</h1>

          {/* Role Toggle */}
          <div style={{ display: 'flex', background: '#f1f5f9', borderRadius: 12, padding: 4, gap: 4 }}>
            {['patient', 'doctor'].map(r => (
              <button key={r} type="button" onClick={() => setRole(r)}
                style={{
                  flex: 1, padding: '10px', borderRadius: 10, border: 'none', cursor: 'pointer',
                  fontFamily: 'DM Sans', fontWeight: 600, fontSize: '0.95rem', transition: 'all 0.2s',
                  background: role === r ? 'white' : 'transparent',
                  color: role === r ? '#0ea5e9' : '#64748b',
                  boxShadow: role === r ? '0 2px 8px rgba(0,0,0,0.1)' : 'none',
                }}>
                {r === 'patient' ? '🧑 Patient' : '👨‍⚕️ Doctor'}
              </button>
            ))}
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid-2">
            <div className="form-group">
              <label>Full Name *</label>
              <input type="text" placeholder="John Doe" value={form.name} onChange={set('name')} required />
            </div>
            <div className="form-group">
              <label>Phone Number</label>
              <input type="tel" placeholder="+91 9999999999" value={form.phone} onChange={set('phone')} />
            </div>
          </div>
          <div className="form-group">
            <label>Email Address *</label>
            <input type="email" placeholder="your@email.com" value={form.email} onChange={set('email')} required />
          </div>
          <div className="form-group">
            <label>Password *</label>
            <input type="password" placeholder="Min 6 characters" value={form.password} onChange={set('password')} required />
          </div>

          {role === 'patient' && (
            <>
              <div style={{ borderTop: '1px solid #e2e8f0', margin: '16px 0', paddingTop: 16 }}>
                <p style={{ fontFamily: 'Syne', fontWeight: 600, marginBottom: 16, color: '#475569' }}>Health Summary (Optional)</p>
              </div>
              <div className="grid-2">
                <div className="form-group">
                  <label>Age</label>
                  <input type="number" placeholder="25" value={form.age} onChange={set('age')} />
                </div>
                <div className="form-group">
                  <label>Blood Group</label>
                  <select value={form.bloodGroup} onChange={set('bloodGroup')}>
                    <option value="">Select</option>
                    {bloodGroups.map(b => <option key={b}>{b}</option>)}
                  </select>
                </div>
              </div>
              <div className="form-group">
                <label>Known Medical Conditions</label>
                <input type="text" placeholder="e.g. Diabetes, Hypertension" value={form.knownMedicalConditions} onChange={set('knownMedicalConditions')} />
              </div>
              <div className="form-group">
                <label>Current Medications</label>
                <input type="text" placeholder="e.g. Metformin 500mg" value={form.currentMedications} onChange={set('currentMedications')} />
              </div>
            </>
          )}

          {role === 'doctor' && (
            <>
              <div style={{ borderTop: '1px solid #e2e8f0', margin: '16px 0', paddingTop: 16 }}>
                <p style={{ fontFamily: 'Syne', fontWeight: 600, marginBottom: 16, color: '#475569' }}>Professional Details</p>
              </div>
              <div className="grid-2">
                <div className="form-group">
                  <label>Specialization *</label>
                  <select value={form.specialization} onChange={set('specialization')} required>
                    <option value="">Select</option>
                    {specializations.map(s => <option key={s}>{s}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label>Location / City *</label>
                  <input type="text" placeholder="Mumbai" value={form.location} onChange={set('location')} required />
                </div>
              </div>
              <div className="grid-2">
                <div className="form-group">
                  <label>Consultation Fee (₹) *</label>
                  <input type="number" placeholder="500" value={form.consultationFee} onChange={set('consultationFee')} required />
                </div>
                <div className="form-group">
                  <label>Experience (years) *</label>
                  <input type="number" placeholder="5" value={form.experience} onChange={set('experience')} required />
                </div>
              </div>
              <div className="form-group">
                <label>About (Bio)</label>
                <textarea placeholder="Brief description of your practice..." value={form.about} onChange={set('about')} rows={3} style={{ resize: 'vertical' }} />
              </div>
            </>
          )}

          <button className="btn btn-primary" type="submit" disabled={loading}
            style={{ width: '100%', justifyContent: 'center', padding: '14px', marginTop: 8 }}>
            {loading ? 'Creating account...' : `Create ${role === 'patient' ? 'Patient' : 'Doctor'} Account`}
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: 20, color: '#64748b', fontSize: '0.9rem' }}>
          Already have an account? <Link to="/login" style={{ color: '#0ea5e9', fontWeight: 600 }}>Sign in</Link>
        </p>
      </div>
    </div>
  );
}
