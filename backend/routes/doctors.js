const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Appointment = require('../models/Appointment');
const { protect } = require('../middleware/auth');

// Search doctors by specialization and/or location
router.get('/', async (req, res) => {
  try {
    const { specialization, location, search } = req.query;
    const query = { role: 'doctor' };

    if (specialization) query.specialization = { $regex: specialization, $options: 'i' };
    if (location) query.location = { $regex: location, $options: 'i' };
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { specialization: { $regex: search, $options: 'i' } },
        { location: { $regex: search, $options: 'i' } },
      ];
    }

    const doctors = await User.find(query).select('-password');
    res.json(doctors);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get doctor by ID with available slots for next 7 days
router.get('/:id/slots', async (req, res) => {
  try {
    const doctor = await User.findById(req.params.id).select('-password');
    if (!doctor || doctor.role !== 'doctor') return res.status(404).json({ message: 'Doctor not found' });

    const slots = {};
    const today = new Date();

    for (let d = 0; d < 7; d++) {
      const date = new Date(today);
      date.setDate(today.getDate() + d);
      const dayName = date.toLocaleDateString('en-US', { weekday: 'long' });

      if (!doctor.availableDays.includes(dayName)) {
        slots[date.toISOString().split('T')[0]] = [];
        continue;
      }

      const dateStr = date.toISOString().split('T')[0];
      const bookedAppointments = await Appointment.find({
        doctor: doctor._id,
        date: dateStr,
        status: { $ne: 'cancelled' },
      }).select('slotTime');

      const bookedTimes = new Set(bookedAppointments.map((a) => a.slotTime));

      // Generate time slots
      const timeSlots = [];
      const [startH, startM] = (doctor.workingHours?.start || '09:00').split(':').map(Number);
      const [endH, endM] = (doctor.workingHours?.end || '17:00').split(':').map(Number);
      const duration = doctor.slotDuration || 30;

      let current = startH * 60 + startM;
      const end = endH * 60 + endM;

      while (current + duration <= end) {
        const h = Math.floor(current / 60).toString().padStart(2, '0');
        const m = (current % 60).toString().padStart(2, '0');
        const timeStr = `${h}:${m}`;

        // For today, skip past slots
        const now = new Date();
        let isPast = false;
        if (d === 0) {
          isPast = now.getHours() * 60 + now.getMinutes() >= current;
        }

        timeSlots.push({
          time: timeStr,
          available: !bookedTimes.has(timeStr) && !isPast,
        });
        current += duration;
      }

      slots[dateStr] = timeSlots;
    }

    res.json({ doctor, slots });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get doctor profile
router.get('/:id', async (req, res) => {
  try {
    const doctor = await User.findById(req.params.id).select('-password');
    if (!doctor || doctor.role !== 'doctor') return res.status(404).json({ message: 'Doctor not found' });
    res.json(doctor);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
