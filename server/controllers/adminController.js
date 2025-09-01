import asyncHandler from 'express-async-handler';
import Tour from '../models/TourPackage.js';
import Booking from '../models/Booking.js';
import User from '../models/User.js';
import crypto from 'crypto';

// @desc    Get dashboard statistics
// @route   GET /api/admin/stats
// @access  Private/Admin
export const getDashboardStats = asyncHandler(async (req, res) => {
  try {
    const [totalTours, totalBookings, totalUsers, pendingBookings] = await Promise.all([
      Tour.countDocuments(),
      Booking.countDocuments(),
      User.countDocuments({ role: 'user' }),
      Booking.countDocuments({ status: 'pending' })
    ]);

    // Calculate total revenue
    const revenueResult = await Booking.aggregate([
      { $match: { status: { $in: ['confirmed', 'completed'] } } },
      { $group: { _id: null, total: { $sum: '$totalAmount' } } }
    ]);
    const totalRevenue = revenueResult[0]?.total || 0;

    // Calculate active users (users who made bookings in last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const activeUsers = await Booking.distinct('user', {
      createdAt: { $gte: thirtyDaysAgo }
    }).then(users => users.length);

    res.json({
      totalTours,
      totalBookings,
      totalUsers,
      pendingBookings,
      totalRevenue,
      activeUsers
    });
  } catch (error) {
    res.status(500);
    throw new Error('Failed to fetch dashboard stats');
  }
});

// @desc    Get recent activity
// @route   GET /api/admin/activity
// @access  Private/Admin
export const getRecentActivity = asyncHandler(async (req, res) => {
  try {
    const recentBookings = await Booking.find()
      .populate('user', 'name')
      .populate('tourPackage', 'title')
      .sort({ createdAt: -1 })
      .limit(5);

    const recentUsers = await User.find({ role: 'user' })
      .sort({ createdAt: -1 })
      .limit(3);

    const activity = [];

    // Add booking activities
    recentBookings.forEach(booking => {
      activity.push({
        icon: '📋',
        message: `New booking by ${booking.user?.name} for ${booking.tourPackage?.title}`,
        time: getTimeAgo(booking.createdAt)
      });
    });

    // Add user registration activities
    recentUsers.forEach(user => {
      activity.push({
        icon: '👤',
        message: `New user registration: ${user.email}`,
        time: getTimeAgo(user.createdAt)
      });
    });

    // Sort by time and limit to 10
    activity.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    
    res.json(activity.slice(0, 10));
  } catch (error) {
    res.status(500);
    throw new Error('Failed to fetch recent activity');
  }
});

// @desc    Get all tours for admin
// @route   GET /api/admin/tours
// @access  Private/Admin
export const getAllTours = asyncHandler(async (req, res) => {
  try {
    const tours = await Tour.find().sort({ createdAt: -1 });
    res.json(tours);
  } catch (error) {
    res.status(500);
    throw new Error('Failed to fetch tours');
  }
});

// @desc    Create new tour
// @route   POST /api/admin/tours
// @access  Private/Admin
export const createTour = asyncHandler(async (req, res) => {
  try {
    const {
      name,
      title,
      location,
      price,
      duration,
      description,
      images,
      itinerary,
      inclusions,
      exclusions,
      featured,
      status,
      maxGroupSize,
      difficulty
    } = req.body;

    // Validate required fields
    const tourTitle = title || name; // Support both 'name' and 'title' from frontend
    if (!tourTitle || !location || !price || !duration || !maxGroupSize) {
      res.status(400);
      throw new Error('Please provide all required fields: title/name, location, price, duration, and maxGroupSize');
    }

    // Validate numeric fields
    if (isNaN(price) || price <= 0) {
      res.status(400);
      throw new Error('Price must be a valid positive number');
    }

    if (isNaN(duration) || duration <= 0) {
      res.status(400);
      throw new Error('Duration must be a valid positive number');
    }

    if (isNaN(maxGroupSize) || maxGroupSize <= 0) {
      res.status(400);
      throw new Error('Max group size must be a valid positive number');
    }

    // Check if tour with same title already exists
    const existingTour = await Tour.findOne({ title: tourTitle });
    if (existingTour) {
      res.status(400);
      throw new Error('A tour with this title already exists');
    }

    // Prepare tour data with proper field mapping
    const tourData = {
      title: tourTitle,
      location: location.trim(),
      price: Number(price),
      duration: Number(duration),
      maxGroupSize: Number(maxGroupSize),
      description: description || '',
      images: Array.isArray(images) && images.length > 0 
        ? images.filter(img => img && img.trim()) 
        : [],
      itinerary: Array.isArray(itinerary) ? itinerary.filter(item => item.title && item.title.trim()) : [],
      inclusions: Array.isArray(inclusions) ? inclusions.filter(item => item && item.trim()) : [],
      exclusions: Array.isArray(exclusions) ? exclusions.filter(item => item && item.trim()) : [],
      featured: Boolean(featured),
      difficulty: difficulty || 'Easy',
      rating: 0,
      reviewCount: 0,
      popularity: 0,
      availableSeats: Number(maxGroupSize), // Initialize available seats to max group size
      transportType: [],
      amenities: [],
      availableDates: []
    };

    const tour = await Tour.create(tourData);
    
    res.status(201).json({
      success: true,
      message: 'Tour created successfully',
      data: tour
    });
  } catch (error) {
    if (error.code === 11000) {
      // Handle duplicate key error
      res.status(400);
      throw new Error('A tour with this title already exists');
    }
    
    // If it's a validation error from Mongoose
    if (error.name === 'ValidationError') {
      const validationErrors = Object.values(error.errors).map(err => err.message);
      res.status(400);
      throw new Error(`Validation Error: ${validationErrors.join(', ')}`);
    }
    
    res.status(400);
    throw new Error(error.message || 'Failed to create tour');
  }
});

// @desc    Update tour
// @route   PUT /api/admin/tours/:id
// @access  Private/Admin
export const updateTour = asyncHandler(async (req, res) => {
  try {
    const {
      name,
      title,
      location,
      price,
      duration,
      description,
      images,
      itinerary,
      inclusions,
      exclusions,
      featured,
      status,
      maxGroupSize,
      difficulty
    } = req.body;

    // Support both 'name' and 'title' from frontend
    const tourTitle = title || name;
    
    // Validate required fields if provided
    if (tourTitle && !tourTitle.trim()) {
      res.status(400);
      throw new Error('Tour title cannot be empty');
    }

    if (price !== undefined && (isNaN(price) || price <= 0)) {
      res.status(400);
      throw new Error('Price must be a valid positive number');
    }

    if (duration !== undefined && (isNaN(duration) || duration <= 0)) {
      res.status(400);
      throw new Error('Duration must be a valid positive number');
    }

    if (maxGroupSize !== undefined && (isNaN(maxGroupSize) || maxGroupSize <= 0)) {
      res.status(400);
      throw new Error('Max group size must be a valid positive number');
    }

    // Prepare update data with proper field mapping
    const updateData = {};
    if (tourTitle) updateData.title = tourTitle.trim();
    if (location) updateData.location = location.trim();
    if (price !== undefined) updateData.price = Number(price);
    if (duration !== undefined) updateData.duration = Number(duration);
    if (maxGroupSize !== undefined) updateData.maxGroupSize = Number(maxGroupSize);
    if (description !== undefined) updateData.description = description;
    if (Array.isArray(images)) updateData.images = images.filter(img => img && img.trim());
    if (Array.isArray(itinerary)) updateData.itinerary = itinerary.filter(item => item.title && item.title.trim());
    if (Array.isArray(inclusions)) updateData.inclusions = inclusions.filter(item => item && item.trim());
    if (Array.isArray(exclusions)) updateData.exclusions = exclusions.filter(item => item && item.trim());
    if (featured !== undefined) updateData.featured = Boolean(featured);
    if (status !== undefined) updateData.status = status;
    if (difficulty !== undefined) updateData.difficulty = difficulty;

    const tour = await Tour.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!tour) {
      res.status(404);
      throw new Error('Tour not found');
    }

    res.json({
      success: true,
      message: 'Tour updated successfully',
      data: tour
    });
  } catch (error) {
    if (error.code === 11000) {
      res.status(400);
      throw new Error('A tour with this title already exists');
    }
    
    if (error.name === 'ValidationError') {
      const validationErrors = Object.values(error.errors).map(err => err.message);
      res.status(400);
      throw new Error(`Validation Error: ${validationErrors.join(', ')}`);
    }
    
    res.status(400);
    throw new Error(error.message || 'Failed to update tour');
  }
});

// @desc    Delete tour
// @route   DELETE /api/admin/tours/:id
// @access  Private/Admin
export const deleteTour = asyncHandler(async (req, res) => {
  try {
    const tour = await Tour.findById(req.params.id);

    if (!tour) {
      res.status(404);
      throw new Error('Tour not found');
    }

    // Check if tour has active bookings
    const activeBookings = await Booking.countDocuments({
      tour: req.params.id,
      status: { $in: ['pending', 'confirmed'] }
    });

    if (activeBookings > 0) {
      res.status(400);
      throw new Error('Cannot delete tour with active bookings');
    }

    await Tour.findByIdAndDelete(req.params.id);
    res.json({ message: 'Tour deleted successfully' });
  } catch (error) {
    res.status(400);
    throw new Error('Failed to delete tour');
  }
});

// @desc    Get all bookings for admin
// @route   GET /api/admin/bookings
// @access  Private/Admin
export const getAllBookings = asyncHandler(async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate('user', 'name email')
      .populate('tourPackage', 'title location price duration images')
      .sort({ createdAt: -1 });
    
    res.json(bookings);
  } catch (error) {
    res.status(500);
    throw new Error('Failed to fetch bookings');
  }
});

// @desc    Update booking status
// @route   PUT /api/admin/bookings/:id/status
// @access  Private/Admin
export const updateBookingStatus = asyncHandler(async (req, res) => {
  try {
    const { status } = req.body;
    
    if (!['pending', 'confirmed', 'cancelled', 'completed'].includes(status)) {
      res.status(400);
      throw new Error('Invalid status');
    }

    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    ).populate('user', 'name email').populate('tourPackage', 'title location');

    if (!booking) {
      res.status(404);
      throw new Error('Booking not found');
    }

    const statusMessages = {
      'confirmed': 'approved',
      'completed': 'completed',
      'cancelled': 'cancelled',
      'pending': 'set to pending'
    };

    res.status(200).json({
      success: true,
      message: `Booking ${statusMessages[status]} successfully`,
      booking
    });
  } catch (error) {
    res.status(400);
    throw new Error('Failed to update booking status');
  }
});

// @desc    Delete booking
// @route   DELETE /api/admin/bookings/:id
// @access  Private/Admin
export const deleteBooking = asyncHandler(async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      res.status(404);
      throw new Error('Booking not found');
    }

    await Booking.findByIdAndDelete(req.params.id);
    res.status(200).json({ 
      success: true,
      message: 'Booking deleted successfully' 
    });
  } catch (error) {
    res.status(400);
    throw new Error('Failed to delete booking');
  }
});

// @desc    Get all users for admin
// @route   GET /api/admin/users
// @access  Private/Admin
export const getAllUsers = asyncHandler(async (req, res) => {
  try {
    const users = await User.find()
      .select('-password')
      .sort({ createdAt: -1 });
    
    res.json(users);
  } catch (error) {
    res.status(500);
    throw new Error('Failed to fetch users');
  }
});

// @desc    Update user status
// @route   PUT /api/admin/users/:id/status
// @access  Private/Admin
export const updateUserStatus = asyncHandler(async (req, res) => {
  try {
    const { status } = req.body;
    
    if (!['active', 'inactive'].includes(status)) {
      res.status(400);
      throw new Error('Invalid status');
    }

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    ).select('-password');

    if (!user) {
      res.status(404);
      throw new Error('User not found');
    }

    res.json(user);
  } catch (error) {
    res.status(400);
    throw new Error('Failed to update user status');
  }
});

// @desc    Delete user
// @route   DELETE /api/admin/users/:id
// @access  Private/Admin
export const deleteUser = asyncHandler(async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      res.status(404);
      throw new Error('User not found');
    }

    if (user.role === 'admin') {
      res.status(400);
      throw new Error('Cannot delete admin user');
    }

    // Check if user has active bookings
    const activeBookings = await Booking.countDocuments({
      user: req.params.id,
      status: { $in: ['pending', 'confirmed'] }
    });

    if (activeBookings > 0) {
      res.status(400);
      throw new Error('Cannot delete user with active bookings');
    }

    await User.findByIdAndDelete(req.params.id);
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(400);
    throw new Error('Failed to delete user');
  }
});

// @desc    Reset user password
// @route   POST /api/admin/users/:id/reset-password
// @access  Private/Admin
export const resetUserPassword = asyncHandler(async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      res.status(404);
      throw new Error('User not found');
    }

    // Generate new password
    const newPassword = crypto.randomBytes(8).toString('hex');
    user.password = newPassword;
    await user.save();

    res.json({ 
      message: 'Password reset successfully',
      newPassword // In production, this should be sent via email
    });
  } catch (error) {
    res.status(400);
    throw new Error('Failed to reset password');
  }
});

// @desc    Get analytics data
// @route   GET /api/admin/analytics
// @access  Private/Admin
export const getAnalytics = asyncHandler(async (req, res) => {
  try {
    const { period = '30d' } = req.query;
    
    // Calculate date range
    const now = new Date();
    let startDate = new Date();
    
    switch (period) {
      case '7d':
        startDate.setDate(now.getDate() - 7);
        break;
      case '30d':
        startDate.setDate(now.getDate() - 30);
        break;
      case '90d':
        startDate.setDate(now.getDate() - 90);
        break;
      case '1y':
        startDate.setFullYear(now.getFullYear() - 1);
        break;
      default:
        startDate.setDate(now.getDate() - 30);
    }

    // Get top tours
    const topTours = await Booking.aggregate([
      { $match: { createdAt: { $gte: startDate } } },
      { $group: {
        _id: '$tour',
        bookingCount: { $sum: 1 },
        revenue: { $sum: '$totalAmount' }
      }},
      { $lookup: {
        from: 'tours',
        localField: '_id',
        foreignField: '_id',
        as: 'tourInfo'
      }},
      { $unwind: '$tourInfo' },
      { $project: {
        name: '$tourInfo.name',
        bookingCount: 1,
        revenue: 1,
        averageRating: '$tourInfo.rating',
        growth: { $literal: Math.floor(Math.random() * 20) - 5 } // Mock growth data
      }},
      { $sort: { bookingCount: -1 } },
      { $limit: 10 }
    ]);

    // Calculate monthly stats
    const monthlyRevenue = await Booking.aggregate([
      { $match: { 
        createdAt: { $gte: startDate },
        status: { $in: ['confirmed', 'completed'] }
      }},
      { $group: { _id: null, total: { $sum: '$totalAmount' } }}
    ]);

    const monthlyBookings = await Booking.countDocuments({
      createdAt: { $gte: startDate }
    });

    const newCustomers = await User.countDocuments({
      createdAt: { $gte: startDate },
      role: 'user'
    });

    // Mock conversion rate calculation
    const totalVisitors = monthlyBookings * 10; // Assuming 10 visitors per booking
    const conversionRate = totalVisitors > 0 ? ((monthlyBookings / totalVisitors) * 100).toFixed(1) : 0;

    res.json({
      topTours,
      monthlyStats: {
        totalRevenue: monthlyRevenue[0]?.total || 0,
        totalBookings: monthlyBookings
      },
      customerStats: {
        newCustomers,
        conversionRate
      }
    });
  } catch (error) {
    res.status(500);
    throw new Error('Failed to fetch analytics');
  }
});

// @desc    Get booking trends
// @route   GET /api/admin/analytics/booking-trends
// @access  Private/Admin
export const getBookingTrends = asyncHandler(async (req, res) => {
  try {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const trends = await Booking.aggregate([
      { $match: { createdAt: { $gte: thirtyDaysAgo } } },
      { $group: {
        _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
        count: { $sum: 1 }
      }},
      { $sort: { _id: 1 } }
    ]);

    res.json(trends);
  } catch (error) {
    res.status(500);
    throw new Error('Failed to fetch booking trends');
  }
});

// @desc    Get revenue trends
// @route   GET /api/admin/analytics/revenue-trends
// @access  Private/Admin
export const getRevenueTrends = asyncHandler(async (req, res) => {
  try {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const trends = await Booking.aggregate([
      { $match: { 
        createdAt: { $gte: thirtyDaysAgo },
        status: { $in: ['confirmed', 'completed'] }
      }},
      { $group: {
        _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
        revenue: { $sum: '$totalAmount' }
      }},
      { $sort: { _id: 1 } }
    ]);

    res.json(trends);
  } catch (error) {
    res.status(500);
    throw new Error('Failed to fetch revenue trends');
  }
});

// Helper function to calculate time ago
const getTimeAgo = (date) => {
  const now = new Date();
  const diffInMinutes = Math.floor((now - date) / (1000 * 60));
  
  if (diffInMinutes < 1) return 'Just now';
  if (diffInMinutes < 60) return `${diffInMinutes} minutes ago`;
  
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) return `${diffInHours} hours ago`;
  
  const diffInDays = Math.floor(diffInHours / 24);
  return `${diffInDays} days ago`;
};
