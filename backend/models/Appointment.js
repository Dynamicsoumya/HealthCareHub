const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const appointmentSchema = new mongoose.Schema(
  {
    bookingId: { type: String, default: () => 'AMB-' + uuidv4().slice(0, 8).toUpperCase(), unique: true },
    doctor: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    patient: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },

    // Patient details snapshot
    patientName: String,
    patientAge: Number,
    patientPhone: String,
    patientBloodGroup: String,
    patientMedicalConditions: String,
    patientMedications: String,

    date: { type: String, required: true }, // "YYYY-MM-DD"
    slotTime: { type: String, required: true }, // "HH:MM"
    status: {
      type: String,
      enum: ['booked', 'completed', 'cancelled'],
      default: 'booked',
    },
    notes: { type: String }, // Doctor's consultation notes
    prescription: { type: String }, // Doctor's prescription
  },
  { timestamps: true }
);

// Compound unique index to prevent double booking the same slot
appointmentSchema.index({ doctor: 1, date: 1, slotTime: 1 }, { unique: true });

module.exports = mongoose.model('Appointment', appointmentSchema);
