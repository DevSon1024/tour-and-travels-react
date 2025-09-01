import express from 'express';
import {
  createBooking,
  getUserBookings,
} from '../controllers/bookingController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';
import { adminMiddleware } from '../middleware/adminMiddleware.js';


const router = express.Router();

// Authenticated user routes
router.post('/', authMiddleware, createBooking);
router.get('/mybookings', authMiddleware, getUserBookings);

// Admin routes - these should be handled by adminRoutes.js, not here
// Commenting out to avoid conflicts since admin routes are in /api/admin/bookings
// router.get('/', authMiddleware, adminMiddleware, getAllBookings);
// router.put('/:id/status', authMiddleware, adminMiddleware, updateBookingStatus);

export default router;