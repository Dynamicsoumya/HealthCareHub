import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import DoctorSearch from './pages/DoctorSearch';
import DoctorProfile from './pages/DoctorProfile';
import BookAppointment from './pages/BookAppointment';
import PatientDashboard from './pages/PatientDashboard';
import DoctorDashboard from './pages/DoctorDashboard';
import Profile from './pages/Profile';
import AppointmentDetail from './pages/AppointmentDetail';
import './index.css';

const PrivateRoute = ({ children, role }) => {
  const { user, loading } = useAuth();
  if (loading) return <div className="loading-screen"><div className="spinner" /></div>;
  if (!user) return <Navigate to="/login" />;
  if (role && user.role !== role) return <Navigate to="/" />;
  return children;
};

function AppRoutes() {
  const { user } = useAuth();
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={user ? <Navigate to={user.role === 'doctor' ? '/doctor/dashboard' : '/patient/dashboard'} /> : <Login />} />
        <Route path="/register" element={user ? <Navigate to="/" /> : <Register />} />
        <Route path="/doctors" element={<DoctorSearch />} />
        <Route path="/doctors/:id" element={<DoctorProfile />} />
        <Route path="/book/:doctorId" element={<PrivateRoute role="patient"><BookAppointment /></PrivateRoute>} />
        <Route path="/patient/dashboard" element={<PrivateRoute role="patient"><PatientDashboard /></PrivateRoute>} />
        <Route path="/doctor/dashboard" element={<PrivateRoute role="doctor"><DoctorDashboard /></PrivateRoute>} />
        <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />
        <Route path="/appointments/:id" element={<PrivateRoute><AppointmentDetail /></PrivateRoute>} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Toaster position="top-right" toastOptions={{ duration: 4000 }} />
        <AppRoutes />
      </BrowserRouter>
    </AuthProvider>
  );
}
