const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const MONGO_URI = process.env.MONGO_URI;

const userSchema = new mongoose.Schema({
  name: String, email: String, password: String, role: String, phone: String,
  bloodGroup: String, knownMedicalConditions: String, currentMedications: String, age: Number,
  specialization: String, location: String, consultationFee: Number, experience: Number, about: String,
  availableDays: [String], slotDuration: Number, workingHours: { start: String, end: String },
}, { timestamps: true });

const User = mongoose.model('User', userSchema);

const doctors = [
  { name: 'Priya Sharma', email: 'priya@demo.com', specialization: 'Cardiologist', location: 'Mumbai', consultationFee: 800, experience: 12, about: 'Senior cardiologist specializing in preventive cardiology and heart failure management.', availableDays: ['Monday','Tuesday','Wednesday','Thursday','Friday'], workingHours: { start: '09:00', end: '17:00' }, slotDuration: 30 },
  { name: 'Rahul Mehta', email: 'rahul@demo.com', specialization: 'Neurologist', location: 'Delhi', consultationFee: 1200, experience: 15, about: 'Expert in stroke management, epilepsy, and movement disorders.', availableDays: ['Monday','Tuesday','Thursday','Friday'], workingHours: { start: '10:00', end: '18:00' }, slotDuration: 45 },
  { name: 'Ananya Patel', email: 'ananya@demo.com', specialization: 'Dermatologist', location: 'Bangalore', consultationFee: 600, experience: 8, about: 'Specializes in medical and cosmetic dermatology including acne, eczema, and skin rejuvenation.', availableDays: ['Monday','Wednesday','Friday','Saturday'], workingHours: { start: '09:00', end: '16:00' }, slotDuration: 20 },
  { name: 'Vikram Singh', email: 'vikram@demo.com', specialization: 'Orthopedic', location: 'Chennai', consultationFee: 900, experience: 18, about: 'Joint replacement specialist with expertise in knee and hip surgeries.', availableDays: ['Tuesday','Wednesday','Thursday','Friday'], workingHours: { start: '08:00', end: '16:00' }, slotDuration: 30 },
  { name: 'Meera Iyer', email: 'meera@demo.com', specialization: 'Pediatrician', location: 'Hyderabad', consultationFee: 500, experience: 10, about: 'Dedicated pediatrician caring for children from newborns to adolescents.', availableDays: ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'], workingHours: { start: '09:00', end: '19:00' }, slotDuration: 20 },
  { name: 'Arun Kumar', email: 'arun@demo.com', specialization: 'General Physician', location: 'Pune', consultationFee: 300, experience: 7, about: 'General physician providing comprehensive primary care for all age groups.', availableDays: ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'], workingHours: { start: '08:00', end: '20:00' }, slotDuration: 15 },
  { name: 'Demo Doctor', email: 'doctor@demo.com', specialization: 'General Physician', location: 'Cuttack', consultationFee: 400, experience: 5, about: 'Demo doctor account for testing.', availableDays: ['Monday','Tuesday','Wednesday','Thursday','Friday'], workingHours: { start: '09:00', end: '17:00' }, slotDuration: 30 },
];

const patients = [
  { name: 'Demo Patient', email: 'patient@demo.com', age: 28, bloodGroup: 'O+', phone: '9876543210', knownMedicalConditions: 'Mild Hypertension', currentMedications: 'Amlodipine 5mg' },
  { name: 'Raj Kumar', email: 'raj@demo.com', age: 35, bloodGroup: 'A+', phone: '9876543211' },
];

async function seed() {
  await mongoose.connect(MONGO_URI);
  console.log('Connected to MongoDB');

  await User.deleteMany({});
  console.log('Cleared users');

  const hashedPassword = await bcrypt.hash('demo1234', 10);

  for (const doc of doctors) {
    await User.create({ ...doc, password: hashedPassword, role: 'doctor', phone: '9000000000' });
    console.log(`Created doctor: Dr. ${doc.name}`);
  }

  for (const pat of patients) {
    await User.create({ ...pat, password: hashedPassword, role: 'patient' });
    console.log(`Created patient: ${pat.name}`);
  }

  console.log('\n🎉 Seed complete!');
  console.log('Login credentials (password for all): demo1234');
  console.log('Patient: patient@demo.com');
  console.log('Doctor:  doctor@demo.com');
  mongoose.disconnect();
}

seed().catch(console.error);
