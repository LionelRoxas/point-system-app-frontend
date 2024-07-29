const mongoose = require('mongoose');

// Use environment variable for MongoDB URI, fallback to local MongoDB for development
const mongoURI = process.env.MONGODB_URI || 'mongodb+srv://point-system-app-cluste.dih3acx.mongodb.net/';

mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const db = mongoose.connection;
db.once('open', () => {
  console.log('MongoDB connected');
});

db.on('error', (err) => {
  console.error('MongoDB connection error:', err);
});

module.exports = db;

