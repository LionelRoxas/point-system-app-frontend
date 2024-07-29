const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  classCode: { type: String, required: true }  // Add classCode field
});

module.exports = mongoose.model('User', userSchema);

