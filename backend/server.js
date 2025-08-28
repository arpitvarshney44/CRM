const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const multer = require('multer');
const path = require('path');
const User = require('./models/User');
require('dotenv').config();

const app = express();

// Multer configuration for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, `${req.user._id}-${Date.now()}${path.extname(file.originalname)}`);
  }
});
const upload = multer({ storage });

// Middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads'));

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/leads', require('./routes/leads'));
app.use('/api/clients', require('./routes/clients'));
app.use('/api/expenses', require('./routes/expenses'));
app.use('/api/development', require('./routes/development'));
app.use('/api/events', require('./routes/events'));
app.use('/api/messages', require('./routes/messages'));
app.use('/api/analytics', require('./routes/analytics'));
app.use('/api/users', require('./routes/users'));

// Profile photo upload route
const { auth } = require('./middleware/auth');
app.post('/api/upload-profile', auth, upload.single('profilePhoto'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }
    
    const photoUrl = `/uploads/${req.file.filename}`;
    await User.findByIdAndUpdate(req.user._id, { profilePhoto: photoUrl });
    
    res.json({ photoUrl });
  } catch (error) {
    res.status(500).json({ message: 'Upload failed' });
  }
});

// Create admin user function
async function createAdminUser() {
  try {
    const existingAdmin = await User.findOne({ email: 'crm@sirswasolutions.com' });
    if (existingAdmin) {
      console.log('Admin user already exists');
      return;
    }

    const hashedPassword = await bcrypt.hash('tushar@crmportal', 12);
    const adminUser = new User({
      name: 'Tushar Sirswa',
      email: 'crm@sirswasolutions.com',
      password: hashedPassword,
      role: 'admin',
      isActive: true
    });

    await adminUser.save();
    console.log('Admin user created successfully!');
    console.log('Email: crm@sirswasolutions.com');
    console.log('Password: tushar@crmportal');
  } catch (error) {
    console.error('Error creating admin user:', error);
  }
}

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI)
  .then(async () => {
    console.log('MongoDB Connected');
    await createAdminUser();
  })
  .catch(err => console.log(err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));