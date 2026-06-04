# 🏥 AMBULA - Healthcare Booking Platform

> Build for Ambula '26 Hackathon — Full Stack MERN Healthcare Platform

[![MERN Stack](https://img.shields.io/badge/Stack-MERN-blue)](https://www.mongodb.com/)

---

## 🚀 Features

### Patient Side
- 🔍 **Browse & Search Doctors** by specialization and location
- 👨‍⚕️ **Doctor Profiles** — name, specialization, fee, experience, 7-day slots
- 📅 **Appointment Booking** — select slot → enter details → get Booking ID (< 2 min)
- 🩺 **Personal Health Summary** — blood group, medical conditions, medications
- 📋 **Appointment History** — view all bookings with status and details
- 📄 **View Consultation Notes & Prescription** after visit

### Doctor Side
- 🔐 **Secure Doctor Login**
- 📊 **Today's Appointments Dashboard** — with filter by date
- 🧑‍⚕️ **Patient Health Summary** visible before consultation
- 📝 **Add Consultation Notes & Prescription** per patient
- ✅ **Mark Appointments as Completed**
- ⚙️ **Configure Working Hours, Slot Duration, Available Days**

### Technical Highlights
- ⚡ **Concurrent Booking Prevention** — MongoDB unique index on `{doctor, date, slotTime}` ensures only one booking succeeds if two patients try the same slot simultaneously. The losing request gets a clear `SLOT_TAKEN` error and is shown the next available slot.
- 🔑 **JWT Authentication** with role-based access control (patient/doctor)
- 🆔 **Unique Booking ID** (format: `AMB-XXXXXXXX`) generated per appointment
- 📱 **Mobile Responsive** — booking flow works smoothly on mobile

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | React 18, React Router v6, Axios, React Hot Toast, date-fns |
| Backend | Node.js, Express.js |
| Database | MongoDB with Mongoose |
| Auth | JWT (JSON Web Tokens) + bcryptjs |
| Fonts | Syne + DM Sans (Google Fonts) |

---

## ⚙️ Setup & Run

### Prerequisites
- Node.js v18+
- MongoDB (local or Atlas)

### 1. Clone and install

```bash
# Backend
cd backend
npm install
cp .env.example .env
# Edit .env with your MONGO_URI

# Frontend
cd ../frontend
npm install
```

### 2. Seed demo data

```bash
cd backend
node seed.js
```

### 3. Start servers

```bash
# Terminal 1 - Backend (port 5000)
cd backend
npm run dev

# Terminal 2 - Frontend (port 3000)
cd frontend
npm start
```

### 4. Open http://localhost:3000

**Demo Credentials:**
| Role | Email | Password |
|------|-------|----------|
| Patient | patient@demo.com | demo1234 |
| Doctor | doctor@demo.com | demo1234 |

---

## 🗃️ Data Model

```
User
├── _id, name, email, password (hashed), role (patient|doctor)
├── phone
│
├── [Patient] age, bloodGroup, knownMedicalConditions, currentMedications
│
└── [Doctor] specialization, location, consultationFee, experience, about,
            availableDays[], workingHours{start,end}, slotDuration

Appointment
├── _id, bookingId (AMB-XXXXXXXX)
├── doctor → User._id
├── patient → User._id
├── date (YYYY-MM-DD), slotTime (HH:MM)
├── status (booked|completed|cancelled)
├── patientName, patientAge, patientPhone (snapshot at booking time)
├── patientBloodGroup, patientMedicalConditions, patientMedications
├── notes (doctor's consultation notes)
└── prescription

Unique Index: { doctor, date, slotTime } → prevents double-booking
```

---

## 🔒 Concurrent Booking — How It Works

When two patients try to book the same slot simultaneously:

1. Both requests arrive at `POST /api/appointments`
2. Both attempt `Appointment.create({ doctor, date, slotTime, ... })`
3. MongoDB's **unique compound index** on `{ doctor, date, slotTime }` allows only one to succeed
4. The second request gets a **duplicate key error (code 11000)**
5. The API returns `{ code: 'SLOT_TAKEN', message: '...' }` with HTTP 409
6. The frontend catches this, **refreshes available slots**, and shows a clear message

This is **optimistic concurrency** — no locks, no queues — just atomic DB-level enforcement.

---

## 📁 Project Structure

```
ambula/
├── backend/
│   ├── models/
│   │   ├── User.js          # Patient + Doctor model
│   │   └── Appointment.js   # Booking model with unique index
│   ├── routes/
│   │   ├── auth.js          # Register, Login, Profile
│   │   ├── doctors.js       # Search, Profile, Slots
│   │   ├── appointments.js  # Book, View, Notes, Cancel
│   │   └── patients.js      # Health summary update
│   ├── middleware/
│   │   └── auth.js          # JWT protect, doctorOnly, patientOnly
│   ├── server.js
│   ├── seed.js
│   └── .env.example
│
└── frontend/src/
    ├── context/AuthContext.js
    ├── pages/
    │   ├── Home.js
    │   ├── Login.js / Register.js
    │   ├── DoctorSearch.js
    │   ├── DoctorProfile.js
    │   ├── BookAppointment.js   ⭐ Core feature
    │   ├── PatientDashboard.js
    │   ├── DoctorDashboard.js   ⭐ Core feature
    │   ├── AppointmentDetail.js
    │   └── Profile.js
    ├── components/Navbar.js
    └── App.js
```

---

## 🌐 API Endpoints

```
POST /api/auth/register      Register patient or doctor
POST /api/auth/login         Login
GET  /api/auth/me            Get current user
PUT  /api/auth/profile       Update profile

GET  /api/doctors            Search doctors (filter: search, specialization, location)
GET  /api/doctors/:id        Doctor profile
GET  /api/doctors/:id/slots  Doctor's available slots for next 7 days

POST /api/appointments           Book appointment (patient only)
GET  /api/appointments/my        Patient's appointments
GET  /api/appointments/today     Doctor's today's appointments
GET  /api/appointments/doctor/all Doctor's all appointments (filter by date)
PUT  /api/appointments/:id/notes  Add notes + prescription (doctor only)
PUT  /api/appointments/:id/cancel Cancel appointment
GET  /api/appointments/:id        Get single appointment
```

---

## 💡 One Feature Left Out (and Why)

**Video Consultation** — While telemedicine would be a great addition, integrating a reliable WebRTC solution within the 14-day constraint would risk stability and distract from perfecting the core appointment booking and consultation notes flow. The platform is designed to be extended with this feature post-launch.

## 🔧 One Improvement With More Time

**Real-time slot updates with WebSockets** — Currently, available slots refresh on page load or after a failed concurrent booking. With Socket.io, the slot grid would update live across all connected clients when a slot is booked, eliminating the race condition window entirely and providing a smoother UX.
