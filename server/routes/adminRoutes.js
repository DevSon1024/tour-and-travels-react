import express from 'express';
import {
  getDashboardStats,
  getRecentActivity,
  getAllTours,
  createTour,
  updateTour,
  deleteTour,
  getAllBookings,
  updateBookingStatus,
  deleteBooking,
  getAllUsers,
  updateUserStatus,
  deleteUser,
  resetUserPassword,
  getAnalytics,
  getBookingTrends,
  getRevenueTrends
} from '../controllers/adminController.js';
import { getBookingById } from '../controllers/bookingController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

// Apply authentication and admin middleware to all routes
router.use(protect);
router.use(admin);

// Dashboard routes
router.get('/stats', getDashboardStats);
router.get('/activity', getRecentActivity);

// Tour management routes
router.get('/tours', getAllTours);
router.post('/tours', createTour);
router.put('/tours/:id', updateTour);
router.delete('/tours/:id', deleteTour);

// Booking management routes
router.get('/bookings', getAllBookings);
router.get('/bookings/:id', getBookingById);
router.put('/bookings/:id/status', updateBookingStatus);
router.delete('/bookings/:id', deleteBooking);

// User management routes
router.get('/users', getAllUsers);
router.put('/users/:id/status', updateUserStatus);
router.delete('/users/:id', deleteUser);
router.post('/users/:id/reset-password', resetUserPassword);

// Analytics routes
router.get('/analytics', getAnalytics);
router.get('/analytics/booking-trends', getBookingTrends);
router.get('/analytics/revenue-trends', getRevenueTrends);

export default router;
