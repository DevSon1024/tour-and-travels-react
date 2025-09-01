import mongoose from 'mongoose';

const tourPackageSchema = new mongoose.Schema({
  title: { type: String, required: true, unique: true },
  description: { type: String, required: true },
  location: { type: String, required: true },
  price: { type: Number, required: true },
  duration: { type: Number, required: true }, // in days
  maxGroupSize: { type: Number, required: true },
  images: [{ type: String }],
  transportType: [{ type: String, enum: ['bus', 'train'] }],
  departureTime: { type: String },
  availableSeats: { type: Number },
  amenities: [{ type: String }],
  popularity: { type: Number, default: 0 }, // For sorting by popularity
  featured: { type: Boolean, default: false }, // For recommended tours
  itinerary: [{
    day: { type: Number, required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    activities: [{ type: String }]
  }],
  availableDates: [{ type: Date }],
  inclusions: [{ type: String }],
  exclusions: [{ type: String }],
  difficulty: { type: String, enum: ['Easy', 'Moderate', 'Challenging', 'Extreme'], default: 'Easy' },
  rating: { type: Number, default: 0, min: 0, max: 5 },
  reviewCount: { type: Number, default: 0 }
}, { timestamps: true });

const TourPackage = mongoose.model('TourPackage', tourPackageSchema);
export default TourPackage;