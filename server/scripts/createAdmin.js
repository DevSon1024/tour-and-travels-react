import dotenv from 'dotenv';
import connectDB from '../config/db.js';
import User from '../models/User.js';

// Load environment variables
dotenv.config();

// Connect to Database
connectDB();

const createAdminUser = async () => {
  try {
    // Check if admin already exists
    const adminExists = await User.findOne({ role: 'admin' });
    
    if (adminExists) {
      console.log('❌ Admin user already exists:', adminExists.email);
      console.log('Delete the existing admin first or update their credentials directly in MongoDB');
      process.exit(1);
    }

    // Create new admin user - CHANGE THESE CREDENTIALS
    const adminUser = await User.create({
      name: 'Admin User',
      email: 'jayeshpatil0244@gmail.com',  // Change this email
      password: '280804',           // Change this password
      role: 'admin'
    });

    console.log('✅ Admin user created successfully!');
    console.log('Email:', adminUser.email);
    console.log('Role:', adminUser.role);
    console.log('ID:', adminUser._id);
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error creating admin user:', error.message);
    process.exit(1);
  }
};

createAdminUser();
