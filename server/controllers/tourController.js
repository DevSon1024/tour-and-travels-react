import asyncHandler from 'express-async-handler';
import TourPackage from '../models/TourPackage.js';

/**
 * @desc    Create a new tour package
 * @route   POST /api/tours
 * @access  Private/Admin
 */
export const createTour = asyncHandler(async (req, res) => {
  const { 
    title, 
    description, 
    location, 
    price, 
    duration, 
    maxGroupSize, 
    images,
    transportType,
    departureTime,
    availableSeats,
    amenities,
    featured
  } = req.body;

  const tour = new TourPackage({
    title,
    description,
    location,
    price,
    duration,
    maxGroupSize,
    images,
    transportType,
    departureTime,
    availableSeats,
    amenities,
    featured,
    popularity: 0, // Initialize popularity to 0
  });

  const createdTour = await tour.save();
  res.status(201).json(createdTour);
});

/**
 * @desc    Get all tour packages
 * @route   GET /api/tours
 * @access  Public
 */
export const getAllTours = asyncHandler(async (req, res) => {
  const tours = await TourPackage.find({});
  res.json(tours);
});

/**
 * @desc    Get a single tour package by ID
 * @route   GET /api/tours/:id
 * @access  Public
 */
export const getTourById = asyncHandler(async (req, res) => {
  const tour = await TourPackage.findById(req.params.id);

  if (tour) {
    res.json(tour);
  } else {
    res.status(404);
    throw new Error('Tour package not found');
  }
});

/**
 * @desc    Update a tour package
 * @route   PUT /api/tours/:id
 * @access  Private/Admin
 */
export const updateTour = asyncHandler(async (req, res) => {
  const { 
    title, 
    description, 
    location, 
    price, 
    duration, 
    maxGroupSize, 
    images,
    transportType,
    departureTime,
    availableSeats,
    amenities,
    featured,
    popularity
  } = req.body;
  const tour = await TourPackage.findById(req.params.id);

  if (tour) {
    tour.title = title || tour.title;
    tour.description = description || tour.description;
    tour.location = location || tour.location;
    tour.price = price || tour.price;
    tour.duration = duration || tour.duration;
    tour.maxGroupSize = maxGroupSize || tour.maxGroupSize;
    tour.images = images || tour.images;
    tour.transportType = transportType || tour.transportType;
    tour.departureTime = departureTime || tour.departureTime;
    tour.availableSeats = availableSeats !== undefined ? availableSeats : tour.availableSeats;
    tour.amenities = amenities || tour.amenities;
    tour.featured = featured !== undefined ? featured : tour.featured;
    tour.popularity = popularity !== undefined ? popularity : tour.popularity;

    const updatedTour = await tour.save();
    res.json(updatedTour);
  } else {
    res.status(404);
    throw new Error('Tour package not found');
  }
});

/**
 * @desc    Delete a tour package
 * @route   DELETE /api/tours/:id
 * @access  Private/Admin
 */
export const deleteTour = asyncHandler(async (req, res) => {
  const tour = await TourPackage.findById(req.params.id);

  if (tour) {
    await tour.deleteOne();
    res.json({ message: 'Tour package removed successfully' });
  } else {
    res.status(404);
    throw new Error('Tour package not found');
  }
});