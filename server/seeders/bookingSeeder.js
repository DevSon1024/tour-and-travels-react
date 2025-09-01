import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Booking from '../models/Booking.js';
import User from '../models/User.js';
import TourPackage from '../models/TourPackage.js';
import connectDB from '../config/db.js';

dotenv.config();

const seedBookings = async () => {
  try {
    await connectDB();
    
    // Clear existing bookings
    await Booking.deleteMany({});
    console.log('Existing bookings cleared');

    // Get sample users and tours
    const users = await User.find({ role: 'user' }).limit(3);
    const tours = await TourPackage.find().limit(5);

    if (users.length === 0) {
      console.log('No users found. Please run user seeder first.');
      return;
    }

    if (tours.length === 0) {
      console.log('No tours found. Please run tour seeder first.');
      return;
    }

    const sampleBookings = [
      {
        user: users[0]._id,
        tourPackage: tours[0]._id,
        tourDate: new Date('2024-12-25'),
        numberOfGuests: 2,
        totalAmount: tours[0].price * 2,
        status: 'pending',
        customerInfo: {
          name: users[0].name,
          email: users[0].email,
          phone: '+91-9876543210',
          address: '123 Main Street, Mumbai, Maharashtra'
        },
        specialRequests: 'Vegetarian meals preferred',
        paymentStatus: 'pending',
        bookingReference: `TRV-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
        emergencyContact: {
          name: 'John Emergency',
          phone: '+91-9876543211',
          relationship: 'Brother'
        }
      },
      {
        user: users[1] ? users[1]._id : users[0]._id,
        tourPackage: tours[1] ? tours[1]._id : tours[0]._id,
        tourDate: new Date('2024-11-30'),
        numberOfGuests: 4,
        totalAmount: (tours[1] ? tours[1].price : tours[0].price) * 4,
        status: 'confirmed',
        customerInfo: {
          name: users[1] ? users[1].name : users[0].name,
          email: users[1] ? users[1].email : users[0].email,
          phone: '+91-9876543220',
          address: '456 Park Avenue, Delhi, Delhi'
        },
        specialRequests: 'Need wheelchair accessibility',
        paymentStatus: 'paid',
        bookingReference: `TRV-${Date.now() + 1000}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
        emergencyContact: {
          name: 'Jane Emergency',
          phone: '+91-9876543221',
          relationship: 'Sister'
        }
      },
      {
        user: users[2] ? users[2]._id : users[0]._id,
        tourPackage: tours[2] ? tours[2]._id : tours[0]._id,
        tourDate: new Date('2024-10-15'),
        numberOfGuests: 1,
        totalAmount: tours[2] ? tours[2].price : tours[0].price,
        status: 'completed',
        customerInfo: {
          name: users[2] ? users[2].name : users[0].name,
          email: users[2] ? users[2].email : users[0].email,
          phone: '+91-9876543230',
          address: '789 Beach Road, Goa, Goa'
        },
        specialRequests: 'Solo traveler, prefer single room',
        paymentStatus: 'paid',
        bookingReference: `TRV-${Date.now() + 2000}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
        emergencyContact: {
          name: 'Bob Emergency',
          phone: '+91-9876543231',
          relationship: 'Father'
        }
      },
      {
        user: users[0]._id,
        tourPackage: tours[3] ? tours[3]._id : tours[0]._id,
        tourDate: new Date('2024-09-20'),
        numberOfGuests: 3,
        totalAmount: (tours[3] ? tours[3].price : tours[0].price) * 3,
        status: 'cancelled',
        customerInfo: {
          name: users[0].name,
          email: users[0].email,
          phone: '+91-9876543240',
          address: '321 Hill Station, Shimla, Himachal Pradesh'
        },
        specialRequests: 'Family trip with kids',
        paymentStatus: 'refunded',
        bookingReference: `TRV-${Date.now() + 3000}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
        emergencyContact: {
          name: 'Alice Emergency',
          phone: '+91-9876543241',
          relationship: 'Mother'
        }
      },
      {
        user: users[1] ? users[1]._id : users[0]._id,
        tourPackage: tours[4] ? tours[4]._id : tours[0]._id,
        tourDate: new Date('2025-01-15'),
        numberOfGuests: 2,
        totalAmount: (tours[4] ? tours[4].price : tours[0].price) * 2,
        status: 'pending',
        customerInfo: {
          name: users[1] ? users[1].name : users[0].name,
          email: users[1] ? users[1].email : users[0].email,
          phone: '+91-9876543250',
          address: '654 Temple Street, Varanasi, Uttar Pradesh'
        },
        specialRequests: 'Spiritual tour, early morning activities',
        paymentStatus: 'pending',
        bookingReference: `TRV-${Date.now() + 4000}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
        emergencyContact: {
          name: 'Charlie Emergency',
          phone: '+91-9876543251',
          relationship: 'Spouse'
        }
      }
    ];

    // Create bookings
    const createdBookings = await Booking.insertMany(sampleBookings);
    console.log(`✅ ${createdBookings.length} sample bookings created successfully!`);

    // Display created bookings
    console.log('\n📋 Created Bookings:');
    createdBookings.forEach((booking, index) => {
      console.log(`${index + 1}. ${booking.bookingReference} - ${booking.status} - ₹${booking.totalAmount}`);
    });

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding bookings:', error);
    process.exit(1);
  }
};

seedBookings();
