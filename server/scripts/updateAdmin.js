import dotenv from 'dotenv';
import connectDB from '../config/db.js';
import User from '../models/User.js';

// Load environment variables
dotenv.config();

// Connect to Database
connectDB();

const updateAdminCredentials = async () => {
  try {
    // Find existing admin user
    const adminUser = await User.findOne({ role: 'admin' });
    
    if (!adminUser) {
      console.log('❌ No admin user found. Run createAdmin.js first.');
      process.exit(1);
    }

    console.log('Current admin email:', adminUser.email);
    
    // UPDATE THESE CREDENTIALS TO YOUR DESIRED VALUES
    const newEmail = 'newadmin@travelnest.com';     // Change this
    const newPassword = 'newadmin123';              // Change this
    const newName = 'New Admin User';               // Change this

    // Update admin credentials
    adminUser.email = newEmail;
    adminUser.password = newPassword;  // This will be hashed automatically by the User model
    adminUser.name = newName;
    
    await adminUser.save();

    console.log('✅ Admin credentials updated successfully!');
    console.log('New Email:', adminUser.email);
    console.log('New Name:', adminUser.name);
    console.log('Role:', adminUser.role);
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error updating admin credentials:', error.message);
    process.exit(1);
  }
};

updateAdminCredentials();
