import React, { useState, useEffect, useCallback } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import api from '../api/axios';

const DoctorCard = ({ doctor }) => (
  <div className="card" style={{ transition: 'all 0.2s' }}
    onMouseOver={e => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = '0 12px 40px rgba(14,165,233,0.12)'; }}
    onMouseOut={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = ''; }}>
    <div style={{ display: 'flex', gap: 16, marginBottom: 16 }}>
      <div style={{
        width: 64, height: 64, borderRadius: '50%',
        background: 'linear-gradient(135deg, #0ea5e9, #0284c7)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        color: 'white', fontSize: '1.5rem', fontFamily: 'Syne', fontWeight: 700, flexShrink: 0
      }}>
        {doctor.name?.charAt(0)}
      </div>
      <div>
        <h3 style={{ fontFamily: 'Syne', fontSize: '1.05rem', marginBottom: 2 }}>Dr. {doctor.name}</h3>
        <span className="badge badge-primary" style={{ fontSize: '0.75rem' }}>{doctor.specialization}</span>
      </div>
    </div>

    <div style={{ fontSize: '0.875rem', color: '#475569', marginBottom: 16 }}>
      <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap' }}>
        <span>📍 {doctor.location}</span>
        <span>⏱️ {doctor.experience} yrs exp</span>
        <span>💰 ₹{doctor.consultationFee}</span>
      </div>
      {doctor.about && (
        <p style={{ marginTop: 8, color: '#64748b', fontSize: '0.85rem', lineHeight: 1.5 }}>
          {doctor.about.slice(0, 100)}{doctor.about.length > 100 ? '...' : ''}
        </p>
      )}
    </div>

    <div style={{ display: 'flex', gap: 10 }}>
      <Link to={`/doctors/${doctor._id}`} className="btn btn-outline btn-sm" style={{ flex: 1, justifyContent: 'center' }}>
        View Profile
      </Link>
      <Link to={`/book/${doctor._id}`} className="btn btn-primary btn-sm" style={{ flex: 1, justifyContent: 'center' }}>
        Book Now
      </Link>
    </div>
  </div>
);

export default function DoctorSearch() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [specialization, setSpecialization] = useState(searchParams.get('specialization') || '');
  const [location, setLocation] = useState(searchParams.get('location') || '');
  const [displayCount, setDisplayCount] = useState(6); // Show 6 cards initially

  const specializations = ['', 'Cardiologist', 'Dermatologist', 'Neurologist', 'Orthopedic', 'Pediatrician', 'Psychiatrist', 'Gynecologist', 'General Physician', 'ENT', 'Ophthalmologist'];

  const fetchDoctors = useCallback(async () => {
    setLoading(true);
    try {
      const params = {};
      if (search) params.search = search;
      if (specialization) params.specialization = specialization;
      if (location) params.location = location;
      const { data } = await api.get('/doctors', { params });
      setDoctors(data);
      setDisplayCount(6); // Reset to 6 when searching
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [search, specialization, location]);

  useEffect(() => { fetchDoctors(); }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    setSearchParams({ search, specialization, location });
    fetchDoctors();
  };

  const displayedDoctors = doctors.slice(0, displayCount);
  const hasMore = displayCount < doctors.length;

  return (
    <div>
      <div className="page-header">
        <div className="container">
          <h1>Find Doctors</h1>
          <p>Search from our network of verified healthcare professionals</p>
        </div>
      </div>

      <div className="container" style={{ paddingBottom: 48 }}>
        {/* Search Bar */}
        <div className="card" style={{ marginBottom: 32 }}>
          <form onSubmit={handleSearch}>
            <div className="grid-3" style={{ gap: 16, marginBottom: 16 }}>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label>Search by name or specialty</label>
                <input type="text" placeholder="e.g. Dr. Sharma, Cardiologist..."
                  value={search} onChange={e => setSearch(e.target.value)} />
              </div>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label>Specialization</label>
                <select value={specialization} onChange={e => setSpecialization(e.target.value)}>
                  <option value="">All Specializations</option>
                  {specializations.filter(s => s).map(s => <option key={s}>{s}</option>)}
                </select>
              </div>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label>Location / City</label>
                <input type="text" placeholder="Mumbai, Delhi..."
                  value={location} onChange={e => setLocation(e.target.value)} />
              </div>
            </div>
            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
              <button type="submit" className="btn btn-primary" style={{ flex: 1, minWidth: '160px', justifyContent: 'center' }}>🔍 Search Doctors</button>
              <button type="button" className="btn btn-outline" onClick={() => { setSearch(''); setSpecialization(''); setLocation(''); }} style={{ flex: 1, minWidth: '160px', justifyContent: 'center' }}>
                Clear Filters
              </button>
            </div>
          </form>
        </div>

        {/* Results */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '60px 0' }}><div className="spinner" style={{ margin: '0 auto' }} /></div>
        ) : doctors.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '80px 0', color: '#64748b' }}>
            <div style={{ fontSize: '4rem', marginBottom: 16 }}>🔍</div>
            <h3 style={{ fontFamily: 'Syne', marginBottom: 8 }}>No doctors found</h3>
            <p>Try adjusting your search filters</p>
          </div>
        ) : (
          <>
            <p style={{ color: '#64748b', marginBottom: 20, fontWeight: 500 }}>
              {doctors.length} doctor{doctors.length !== 1 ? 's' : ''} found 
              {displayCount < doctors.length && ` • Showing ${displayCount} of ${doctors.length}`}
            </p>
            <div className="grid-3">
              {displayedDoctors.map(d => <DoctorCard key={d._id} doctor={d} />)}
            </div>

            {/* Load More Button */}
            {hasMore && (
              <div style={{ textAlign: 'center', marginTop: 32 }}>
                <button 
                  onClick={() => setDisplayCount(prev => prev + 6)}
                  className="btn btn-primary"
                  style={{ padding: '12px 32px', minHeight: '44px' }}>
                  📥 Load More Doctors ({doctors.length - displayCount} more)
                </button>
              </div>
            )}

            {/* All Loaded Message */}
            {!hasMore && doctors.length > 6 && (
              <div style={{ textAlign: 'center', marginTop: 32, color: '#64748b', fontSize: '0.9rem' }}>
                ✅ All {doctors.length} doctors are now displayed
              </div>
            )}
          </>
        )}
      </div>

      {/* Responsive styles */}
      <style>{`
        @media (max-width: 1024px) {
          .grid-3 {
            grid-template-columns: repeat(2, 1fr) !important;
          }
        }

        @media (max-width: 768px) {
          .grid-3 {
            grid-template-columns: 1fr !important;
          }

          .card form .grid-3 {
            grid-template-columns: 1fr !important;
          }

          button[type="submit"],
          button[type="button"] {
            min-height: 44px;
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
