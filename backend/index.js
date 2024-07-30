const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const db = require('./db');
const User = require('./models/User');
const Student = require('./models/Student');
const crypto = require('crypto');

const app = express();
app.use(express.json());
app.use(cors({
  origin: 'https://lionelroxas.github.io' // Replace with your actual GitHub Pages URL
}));

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (token == null) return res.sendStatus(401);

  jwt.verify(token, 'your_jwt_secret', (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};

// Function to generate a class code
const generateClassCode = () => crypto.randomBytes(3).toString('hex').toUpperCase();

app.post('/register', async (req, res) => {
  const { email, password } = req.body;

  // Check if email already exists
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return res.status(400).json({ message: 'Email already registered' });
  }

  // Create new user
  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = new User({
    email,
    password: hashedPassword,
    classCode: generateClassCode()  // Or however you generate the class code
  });

  try {
    await newUser.save();
    res.status(201).json({ message: 'User registered successfully', classCode: newUser.classCode });
  } catch (error) {
    res.status(500).json({ message: 'Registration failed' });
  }
});

app.post('/login', async (req, res) => {
  const { email, password } = req.body;
  console.log('Login attempt:', { email, password });
  const user = await User.findOne({ email });
  if (user == null) {
    console.log('User not found');
    return res.status(400).json({ message: 'Cannot find user' });
  }
  try {
    console.log('Stored password:', user.password);
    const passwordMatch = await bcrypt.compare(password, user.password);
    console.log('Password match result:', passwordMatch);
    if (passwordMatch) {
      // Log the class code for debugging
      console.log('Class Code:', user.classCode);

      const token = jwt.sign({ email: user.email, classCode: user.classCode, id: user._id }, 'your_jwt_secret', { expiresIn: '1h' });
      res.json({ token, classCode: user.classCode });
    } else {
      res.status(403).json({ message: 'Incorrect password' });
    }
  } catch (error) {
    console.error('Login failed:', error);
    res.status(500).json({ message: 'Login failed' });
  }
});

app.post('/students', authenticateToken, async (req, res) => {
  const { name, points, classCode } = req.body;
  const newStudent = new Student({
    name,
    points,
    history: [],
    classCode,
    userId: req.user.id  // Associate student with the logged-in user
  });
  try {
    const savedStudent = await newStudent.save();
    res.json(savedStudent);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/students', authenticateToken, async (req, res) => {
  try {
    const students = await Student.find({ classCode: req.query.classCode });
    res.json(students);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/students/:id/addPoints', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { points, reason } = req.body;
    const student = await Student.findById(id);
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }
    student.points += points;
    student.history.push(reason);
    await student.save();
    res.json(student);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.delete('/students/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    await Student.deleteOne({ _id: id });
    res.json({ message: 'Student removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.post('/validateClassCode', async (req, res) => {
  const { classCode } = req.body;
  const user = await User.findOne({ classCode });
  if (user) {
    res.status(200).json({ valid: true });
  } else {
    res.status(400).json({ valid: false });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

