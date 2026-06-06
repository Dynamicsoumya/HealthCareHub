import React, { useState, useEffect, useCallback } from "react";
import { Link, useSearchParams } from "react-router-dom";
import api from "../api/axios";

const DoctorCard = ({ doctor }) => (
  <div
    className="card"
    style={{ transition: "all 0.2s" }}
  >
    <div style={{ display: "flex", gap: 16, marginBottom: 16 }}>
      <div
        style={{
          width: 64,
          height: 64,
          borderRadius: "50%",
          background: "linear-gradient(135deg, #0ea5e9, #0284c7)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "white",
          fontSize: "1.5rem",
          fontFamily: "Syne",
          fontWeight: 700,
          flexShrink: 0,
        }}
      >
        {doctor.name?.charAt(0)}
      </div>
      <div>
        <h3
          style={{ fontFamily: "Syne", fontSize: "1.05rem", marginBottom: 2 }}
        >
          Dr. {doctor.name}
        </h3>
        <span className="badge badge-primary" style={{ fontSize: "0.75rem" }}>
          {doctor.specialization}
        </span>
      </div>
    </div>

    <div style={{ fontSize: "0.875rem", color: "#475569", marginBottom: 16 }}>
      <div style={{ display: "flex", gap: 20, flexWrap: "wrap" }}>
        <span>📍 {doctor.location}</span>
        <span>⏱️ {doctor.experience} yrs exp</span>
        <span>💰 ₹{doctor.consultationFee}</span>
      </div>
      {doctor.about && (
        <p
          style={{
            marginTop: 8,
            color: "#64748b",
            fontSize: "0.85rem",
            lineHeight: 1.5,
          }}
        >
          {doctor.about.slice(0, 100)}
          {doctor.about.length > 100 ? "..." : ""}
        </p>
      )}
    </div>

    <div style={{ display: "flex", gap: 10 }}>
      <Link
        to={`/doctors/${doctor._id}`}
        className="btn btn-outline btn-sm"
        style={{ flex: 1, justifyContent: "center" }}
      >
        View Profile
      </Link>
      <Link
        to={`/book/${doctor._id}`}
        className="btn btn-primary btn-sm"
        style={{ flex: 1, justifyContent: "center" }}
      >
        Book Now
      </Link>
    </div>
  </div>
);

export default function DoctorSearch() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState(searchParams.get("search") || "");
  const [specialization, setSpecialization] = useState(
    searchParams.get("specialization") || "",
  );
  const [location, setLocation] = useState(searchParams.get("location") || "");
  const [pageSize, setPageSize] = useState(0);
  const [displayCount, setDisplayCount] = useState(0);

  const specializations = [
    "",
    "Cardiologist",
    "Dermatologist",
    "Neurologist",
    "Orthopedic",
    "Pediatrician",
    "Psychiatrist",
    "Gynecologist",
    "General Physician",
    "ENT",
    "Ophthalmologist",
  ];

  const fetchDoctors = useCallback(async () => {
    setLoading(true);
    try {
      const params = {};
      if (search) params.search = search;
      if (specialization) params.specialization = specialization;
      if (location) params.location = location;
      const { data } = await api.get("/doctors", { params });
      setDoctors(data);
      const initialSize = Math.min(6, data.length);
      setPageSize(initialSize);
      setDisplayCount(initialSize);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [search, specialization, location]);

  useEffect(() => {
    fetchDoctors();
  }, []);
  useEffect(() => {
    if (!doctors.length) return;

    const initialSize = Math.min(6, doctors.length);
    setPageSize(initialSize);
    setDisplayCount(initialSize);
  }, [doctors]);

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
                <input
                  type="text"
                  placeholder="e.g. Dr. Sharma, Cardiologist..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label>Specialization</label>
                <select
                  value={specialization}
                  onChange={(e) => setSpecialization(e.target.value)}
                >
                  <option value="">All Specializations</option>
                  {specializations
                    .filter((s) => s)
                    .map((s) => (
                      <option key={s}>{s}</option>
                    ))}
                </select>
              </div>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label>Location / City</label>
                <input
                  type="text"
                  placeholder="Mumbai, Delhi..."
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                />
              </div>
            </div>
            <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
              <button
                type="submit"
                className="btn btn-primary"
                style={{ flex: 1, minWidth: "160px", justifyContent: "center" }}
              >
                🔍 Search Doctors
              </button>
              <button
                type="button"
                className="btn btn-outline"
                onClick={() => {
                  setSearch("");
                  setSpecialization("");
                  setLocation("");
                }}
                style={{ flex: 1, minWidth: "160px", justifyContent: "center" }}
              >
                Clear Filters
              </button>
            </div>
          </form>
        </div>

        {/* Results */}
        {loading ? (
          <div style={{ textAlign: "center", padding: "60px 0" }}>
            <div className="spinner" style={{ margin: "0 auto" }} />
          </div>
        ) : doctors.length === 0 ? (
          <div
            style={{ textAlign: "center", padding: "80px 0", color: "#64748b" }}
          >
            <div style={{ fontSize: "4rem", marginBottom: 16 }}>🔍</div>
            <h3 style={{ fontFamily: "Syne", marginBottom: 8 }}>
              No doctors found
            </h3>
            <p>Try adjusting your search filters</p>
          </div>
        ) : (
          <>
            <p style={{ color: "#64748b", marginBottom: 20, fontWeight: 500 }}>
              {doctors.length} doctor{doctors.length !== 1 ? "s" : ""} found
              {displayCount < doctors.length &&
                ` • Showing ${displayCount} of ${doctors.length}`}
            </p>
            <div className="doctor-grid">
              {displayedDoctors.map((d) => (
                <DoctorCard key={d._id} doctor={d} />
              ))}
            </div>

            {/* Load More Button */}
            {hasMore && (
              <div style={{ textAlign: "center", marginTop: 32 }}>
                <button
                  onClick={() => setDisplayCount((prev) => prev + 6)}
                  className="btn btn-primary"
                  style={{ padding: "12px 32px", minHeight: "44px" }}
                >
                  📥 Load More Doctors ({doctors.length - displayCount} more)
                </button>
              </div>
            )}

            {/* All Loaded Message */}
            {!hasMore && doctors.length > 6 && (
              <div
                style={{
                  textAlign: "center",
                  marginTop: 32,
                  color: "#64748b",
                  fontSize: "0.9rem",
                }}
              >
                ✅ All {doctors.length} doctors are now displayed
              </div>
            )}
          </>
        )}
      </div>

      {/* Responsive styles */}
      <style>{`
 .doctor-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;
}

@media (max-width: 1024px) {
  .doctor-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 768px) {
  .doctor-grid {
    display: flex !important;
    flex-direction: column !important;
    gap: 16px;
    width: 100%;
  }
}
`}</style>
    </div>
  );
}
