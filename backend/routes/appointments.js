const express = require('express');
const router = express.Router();
const Appointment = require('../models/Appointment');
const User = require('../models/User');
const { protect, doctorOnly, patientOnly } = require('../middleware/auth');

// Book appointment (Patient) - concurrency safe via unique index
router.post('/', protect, patientOnly, async (req, res) => {
  try {
    const { doctorId, date, slotTime, patientName, patientAge, patientPhone } = req.body;

    const patient = await User.findById(req.user._id);

    const appointment = await Appointment.create({
      doctor: doctorId,
      patient: req.user._id,
      date,
      slotTime,
      patientName: patientName || patient.name,
      patientAge: patientAge || patient.age,
      patientPhone: patientPhone || patient.phone,
      patientBloodGroup: patient.bloodGroup,
      patientMedicalConditions: patient.knownMedicalConditions,
      patientMedications: patient.currentMedications,
    });

    await appointment.populate('doctor', 'name specialization location consultationFee');
    res.status(201).json(appointment);
  } catch (err) {
    // MongoDB duplicate key error (concurrent booking)
    if (err.code === 11000) {
      return res.status(409).json({
        message: 'This slot was just booked by someone else. Please select the next available slot.',
        code: 'SLOT_TAKEN',
      });
    }
    res.status(500).json({ message: err.message });
  }
});

// Get patient's appointments
router.get('/my', protect, async (req, res) => {
  try {
    const appointments = await Appointment.find({ patient: req.user._id })
      .populate('doctor', 'name specialization location consultationFee')
      .sort({ date: -1, slotTime: -1 });
    res.json(appointments);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get doctor's today's appointments
router.get('/today', protect, doctorOnly, async (req, res) => {
  try {
    const today = new Date().toISOString().split('T')[0];
    const appointments = await Appointment.find({ doctor: req.user._id, date: today })
      .populate('patient', 'name email phone bloodGroup knownMedicalConditions currentMedications age')
      .sort({ slotTime: 1 });
    res.json(appointments);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get all doctor's appointments (for dashboard)
router.get('/doctor/all', protect, doctorOnly, async (req, res) => {
  try {
    const { date } = req.query;
    const query = { doctor: req.user._id };
    if (date) query.date = date;

    const appointments = await Appointment.find(query)
      .populate('patient', 'name email phone bloodGroup knownMedicalConditions currentMedications age')
      .sort({ date: -1, slotTime: 1 });
    res.json(appointments);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Add consultation notes and prescription (Doctor)
router.put('/:id/notes', protect, doctorOnly, async (req, res) => {
  try {
    const { notes, prescription, status } = req.body;
    const appointment = await Appointment.findOne({ _id: req.params.id, doctor: req.user._id });
    if (!appointment) return res.status(404).json({ message: 'Appointment not found' });

    if (notes !== undefined) appointment.notes = notes;
    if (prescription !== undefined) appointment.prescription = prescription;
    if (status) appointment.status = status;

    await appointment.save();
    res.json(appointment);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Cancel appointment
router.put('/:id/cancel', protect, async (req, res) => {
  try {
    const appointment = await Appointment.findOne({
      _id: req.params.id,
      $or: [{ patient: req.user._id }, { doctor: req.user._id }],
    });
    if (!appointment) return res.status(404).json({ message: 'Appointment not found' });
    appointment.status = 'cancelled';
    await appointment.save();
    res.json(appointment);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get single appointment
router.get('/:id', protect, async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id)
      .populate('doctor', 'name specialization location consultationFee phone')
      .populate('patient', 'name email phone');
    if (!appointment) return res.status(404).json({ message: 'Not found' });
    res.json(appointment);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
