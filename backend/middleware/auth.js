const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Not authorized, no token' });
  }
  try {
    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'ambula_secret_key');
    req.user = await User.findById(decoded.id).select('-password');
    next();
  } catch {
    res.status(401).json({ message: 'Token invalid or expired' });
  }
};

const doctorOnly = (req, res, next) => {
  if (req.user?.role !== 'doctor') return res.status(403).json({ message: 'Doctor access only' });
  next();
};

const patientOnly = (req, res, next) => {
  if (req.user?.role !== 'patient') return res.status(403).json({ message: 'Patient access only' });
  next();
};

module.exports = { protect, doctorOnly, patientOnly };
