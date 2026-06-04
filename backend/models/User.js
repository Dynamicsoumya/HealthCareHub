const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['patient', 'doctor'], required: true },
    phone: { type: String },

    // Patient-specific
    bloodGroup: { type: String },
    knownMedicalConditions: { type: String },
    currentMedications: { type: String },
    age: { type: Number },

    // Doctor-specific
    specialization: { type: String },
    location: { type: String },
    consultationFee: { type: Number },
    experience: { type: Number },
    about: { type: String },
    availableDays: {
      type: [String],
      default: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
    },
    slotDuration: { type: Number, default: 30 }, // minutes
    workingHours: {
      start: { type: String, default: '09:00' },
      end: { type: String, default: '17:00' },
    },
  },
  { timestamps: true }
);

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

userSchema.methods.comparePassword = async function (password) {
  return bcrypt.compare(password, this.password);
};

module.exports = mongoose.model('User', userSchema);
