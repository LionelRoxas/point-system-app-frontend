const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
  name: String,
  points: Number,
  history: [String],
  classCode: String,
  userId: mongoose.Schema.Types.ObjectId,  // Reference to user
});

module.exports = mongoose.model('Student', studentSchema);

