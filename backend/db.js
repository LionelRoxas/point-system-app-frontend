const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/point-system', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const db = mongoose.connection;
db.once('open', () => {
  console.log('MongoDB connected');
});

module.exports = db;

