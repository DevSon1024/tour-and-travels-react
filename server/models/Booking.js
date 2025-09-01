import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  tourPackage: { type: mongoose.Schema.Types.ObjectId, ref: 'TourPackage', required: true },
  bookingDate: { type: Date, default: Date.now },
  tourDate: { type: Date, required: true },
  numberOfGuests: { type: Number, required: true },
  status: { type: String, enum: ['pending', 'confirmed', 'cancelled'], default: 'pending' },
  totalAmount: { type: Number, required: true },
  guests: [{
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    age: { type: Number },
    address: { type: String },
    idType: { type: String, enum: ['passport', 'aadhar', 'driving_license', 'voter_id'] },
    idNumber: { type: String }
  }],
  // Keep customerInfo for backward compatibility and primary contact
  customerInfo: {
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    address: { type: String }
  },
  specialRequests: { type: String },
  paymentStatus: { type: String, enum: ['pending', 'paid', 'failed', 'refunded'], default: 'pending' },
  bookingReference: { type: String, unique: true },
  emergencyContact: {
    name: { type: String },
    phone: { type: String },
    relationship: { type: String }
  }
}, { timestamps: true });

const Booking = mongoose.model('Booking', bookingSchema);
export default Booking;