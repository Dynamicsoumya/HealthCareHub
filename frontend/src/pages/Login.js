import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const user = await login(form.email, form.password);
      toast.success(`Welcome back, ${user.name}!`);
      navigate(user.role === 'doctor' ? '/doctor/dashboard' : '/patient/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '90vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
      <div className="card" style={{ width: '100%', maxWidth: 440 }}>
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{ fontSize: '3rem', marginBottom: 8 }}>🏥</div>
          <h1 style={{ fontFamily: 'Syne', fontSize: '1.8rem', marginBottom: 4 }}>Welcome back</h1>
          <p style={{ color: '#64748b' }}>Sign in to your HealthCare Hub account</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Email Address</label>
            <input type="email" placeholder="your@email.com" value={form.email}
              onChange={e => setForm({ ...form, email: e.target.value })} required />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input type="password" placeholder="••••••••" value={form.password}
              onChange={e => setForm({ ...form, password: e.target.value })} required />
          </div>
          <button className="btn btn-primary" type="submit" disabled={loading}
            style={{ width: '100%', justifyContent: 'center', padding: '14px' }}>
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <div style={{ marginTop: 24, textAlign: 'center', padding: '16px', background: '#f8fafc', borderRadius: 10 }}>
          <p style={{ fontSize: '0.85rem', color: '#64748b', marginBottom: 8 }}>Demo credentials:</p>
          <p style={{ fontSize: '0.8rem', color: '#475569' }}>Patient: patient@demo.com / demo1234</p>
          <p style={{ fontSize: '0.8rem', color: '#475569' }}>Doctor: doctor@demo.com / demo1234</p>
        </div>

        <p style={{ textAlign: 'center', marginTop: 20, color: '#64748b', fontSize: '0.9rem' }}>
          Don't have an account? <Link to="/register" style={{ color: '#0ea5e9', fontWeight: 600 }}>Register here</Link>
        </p>
      </div>
    </div>
  );
}
