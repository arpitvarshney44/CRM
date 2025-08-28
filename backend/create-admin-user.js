const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['admin', 'staff'], default: 'staff' },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

const User = mongoose.model('User', userSchema);

async function createAdminUser() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

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
    console.log('Login credentials:');
    console.log('Email: admin@crm.com');
    console.log('Password: admin123');
    
    process.exit(0);
  } catch (error) {
    if (error.code === 11000) {
      console.log('Admin user already exists!');
    } else {
      console.error('Error creating admin user:', error);
    }
    process.exit(1);
  }
}

createAdminUser();