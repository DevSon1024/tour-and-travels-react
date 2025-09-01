import express from 'express';
import {
  createTour,
  getAllTours,
  getTourById,
  updateTour,
  deleteTour,
} from '../controllers/tourController.js';
// Correctly import from both files
import { authMiddleware } from '../middleware/authMiddleware.js';
import { adminMiddleware } from '../middleware/adminMiddleware.js';

const router = express.Router();

// Public routes
router.get('/', getAllTours);
router.get('/:id', getTourById);

// Admin routes - chain the middleware
router.post('/', authMiddleware, adminMiddleware, createTour);
router.put('/:id', authMiddleware, adminMiddleware, updateTour);
router.delete('/:id', authMiddleware, adminMiddleware, deleteTour);

export default router;