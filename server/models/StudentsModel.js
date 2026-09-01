const mongoose = require('mongoose');

const StudentSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true },
  linkedinUrl: { type: String, default: '' },
  languages: { type: [String], default: [], enum: ["English", "Spanish", "French", "German", "Portuguese", "Dutch", "Other"] },
  program: { type: String, enum: ["Web Dev", "UX/UI", "Data Analytics", "Cybersecurity"] },
  background: { type: String, default: '' },
  image: { type: String, default: "https://i.imgur.com/r8bo8u7.png" },
  cohort: { type: mongoose.Schema.Types.ObjectId, ref: 'Cohort', required: true },
  projects: [{ type: Array, default: [] }]
});

const Student = mongoose.model('Student', StudentSchema);

module.exports = Student;