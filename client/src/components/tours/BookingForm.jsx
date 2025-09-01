import React, { useState } from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import api from '../../api/api';
import LoadingSpinner from '../common/LoadingSpinner';
import { formatINR } from '../../utils/currency';

const BookingForm = ({ tour, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    numberOfGuests: 1,
    tourDate: '',
    customerInfo: {
      name: '',
      email: '',
      phone: '',
      address: ''
    },
    guests: [{
      name: '',
      email: '',
      phone: '',
      age: '',
      address: ''
    }],
    specialRequests: '',
    emergencyContact: {
      name: '',
      phone: '',
      relationship: ''
    }
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [step, setStep] = useState(1);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else if (name === 'numberOfGuests') {
      const numGuests = parseInt(value) || 1;
      setFormData(prev => {
        const newGuests = [...prev.guests];
        
        // Add or remove guest entries based on number of guests
        if (numGuests > newGuests.length) {
          // Add new guest entries
          for (let i = newGuests.length; i < numGuests; i++) {
            newGuests.push({
              name: '',
              email: '',
              phone: '',
              age: '',
              address: ''
            });
          }
        } else if (numGuests < newGuests.length) {
          // Remove excess guest entries
          newGuests.splice(numGuests);
        }
        
        return {
          ...prev,
          numberOfGuests: numGuests,
          guests: newGuests
        };
      });
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleGuestChange = (guestIndex, field, value) => {
    setFormData(prev => ({
      ...prev,
      guests: prev.guests.map((guest, index) => 
        index === guestIndex 
          ? { ...guest, [field]: value }
          : guest
      )
    }));
  };

  const validateStep = (currentStep) => {
    switch (currentStep) {
      case 1:
        return formData.numberOfGuests > 0 && formData.tourDate;
      case 2:
        return formData.customerInfo.name && 
               formData.customerInfo.email && 
               formData.customerInfo.phone;
      case 3:
        // Validate all guests have required details
        return formData.guests.every(guest => 
          guest.name && guest.email && guest.phone
        );
      case 4:
        return true; // Optional step (emergency contact)
      default:
        return false;
    }
  };

  const nextStep = () => {
    if (validateStep(step)) {
      setStep(step + 1);
      setError('');
    } else {
      setError('Please fill in all required fields');
    }
  };

  const prevStep = () => {
    setStep(step - 1);
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateStep(3)) {
      setError('Please fill in all required guest details');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const bookingData = {
        tourPackageId: tour._id,
        numberOfGuests: parseInt(formData.numberOfGuests),
        tourDate: formData.tourDate,
        customerInfo: formData.customerInfo,
        guests: formData.guests,
        specialRequests: formData.specialRequests,
        emergencyContact: formData.emergencyContact
      };

      const response = await api.post('/bookings', bookingData);
      
      // Store booking data in localStorage for confirmation page
      localStorage.setItem('latestBooking', JSON.stringify(response.data));
      
      onSuccess();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create booking. Please try again.');
      console.error('Booking error:', err);
    } finally {
      setLoading(false);
    }
  };

  const totalAmount = tour.price * formData.numberOfGuests;

  const getAvailableDates = () => {
    if (!tour.availableDates || tour.availableDates.length === 0) {
      // If no specific dates, allow booking for future dates
      const today = new Date();
      today.setDate(today.getDate() + 1); // Tomorrow onwards
      return today.toISOString().split('T')[0];
    }
    return tour.availableDates;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-2xl font-bold text-gray-900">Book Your Tour</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>

        {/* Progress Indicator */}
        <div className="px-6 py-4 bg-gray-50">
          <div className="flex items-center justify-between">
            {[1, 2, 3, 4].map((stepNumber) => (
              <div key={stepNumber} className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  step >= stepNumber 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-200 text-gray-600'
                }`}>
                  {stepNumber}
                </div>
                <span className={`ml-2 text-sm ${
                  step >= stepNumber ? 'text-blue-600' : 'text-gray-500'
                }`}>
                  {stepNumber === 1 && 'Tour Details'}
                  {stepNumber === 2 && 'Personal Info'}
                  {stepNumber === 3 && 'Guest Details'}
                  {stepNumber === 4 && 'Review & Book'}
                </span>
                {stepNumber < 4 && (
                  <div className={`w-12 h-0.5 mx-4 ${
                    step > stepNumber ? 'bg-blue-600' : 'bg-gray-200'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          {error && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          )}

          {/* Step 1: Tour Details */}
          {step === 1 && (
            <div className="space-y-6">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-semibold text-lg mb-2">{tour.title}</h3>
                <p className="text-gray-600">{tour.location}</p>
                <p className="text-2xl font-bold text-blue-600 mt-2">{formatINR(tour.price)} per person</p>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Number of Guests *
                  </label>
                  <select
                    name="numberOfGuests"
                    value={formData.numberOfGuests}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  >
                    {[...Array(tour.maxGroupSize)].map((_, i) => (
                      <option key={i + 1} value={i + 1}>
                        {i + 1} {i + 1 === 1 ? 'Guest' : 'Guests'}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tour Date *
                  </label>
                  {tour.availableDates && tour.availableDates.length > 0 ? (
                    <select
                      name="tourDate"
                      value={formData.tourDate}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    >
                      <option value="">Select a date</option>
                      {tour.availableDates.map((date, index) => (
                        <option key={index} value={date}>
                          {new Date(date).toLocaleDateString('en-US', {
                            weekday: 'long',
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <input
                      type="date"
                      name="tourDate"
                      value={formData.tourDate}
                      onChange={handleInputChange}
                      min={getAvailableDates()}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  )}
                </div>
              </div>

              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-medium">Total Amount:</span>
                  <span className="text-2xl font-bold text-blue-600">
                    {formatINR(totalAmount)}
                  </span>
                </div>
                <p className="text-sm text-gray-600 mt-1">
                  {formData.numberOfGuests} × {formatINR(tour.price)} per person
                </p>
              </div>
            </div>
          )}

          {/* Step 2: Personal Information */}
          {step === 2 && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold mb-4">Personal Information</h3>
              
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    name="customerInfo.name"
                    value={formData.customerInfo.name}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    name="customerInfo.email"
                    value={formData.customerInfo.email}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    name="customerInfo.phone"
                    value={formData.customerInfo.phone}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Address
                  </label>
                  <input
                    type="text"
                    name="customerInfo.address"
                    value={formData.customerInfo.address}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Special Requests or Dietary Requirements
                </label>
                <textarea
                  name="specialRequests"
                  value={formData.specialRequests}
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Any special requirements, dietary restrictions, or requests..."
                />
              </div>
            </div>
          )}

          {/* Step 3: Guest Details */}
          {step === 3 && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold mb-4">Guest Details</h3>
              <p className="text-sm text-gray-600 mb-4">
                Please provide details for all {formData.numberOfGuests} guest{formData.numberOfGuests > 1 ? 's' : ''}:
              </p>
              
              {formData.guests.map((guest, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4 space-y-4">
                  <h4 className="font-medium text-gray-900">Guest {index + 1}</h4>
                  
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        value={guest.name}
                        onChange={(e) => handleGuestChange(index, 'name', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        value={guest.email}
                        onChange={(e) => handleGuestChange(index, 'email', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Phone Number *
                      </label>
                      <input
                        type="tel"
                        value={guest.phone}
                        onChange={(e) => handleGuestChange(index, 'phone', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Age
                      </label>
                      <input
                        type="number"
                        value={guest.age}
                        onChange={(e) => handleGuestChange(index, 'age', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        min="1"
                        max="120"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Address
                      </label>
                      <input
                        type="text"
                        value={guest.address}
                        onChange={(e) => handleGuestChange(index, 'address', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>

                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Step 4: Emergency Contact & Review */}
          {step === 4 && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-4">Emergency Contact (Optional)</h3>
                <div className="grid md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Contact Name
                    </label>
                    <input
                      type="text"
                      name="emergencyContact.name"
                      value={formData.emergencyContact.name}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      name="emergencyContact.phone"
                      value={formData.emergencyContact.phone}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Relationship
                    </label>
                    <input
                      type="text"
                      name="emergencyContact.relationship"
                      value={formData.emergencyContact.relationship}
                      onChange={handleInputChange}
                      placeholder="e.g., Spouse, Parent, Friend"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>
              </div>

              {/* Booking Summary */}
              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="text-lg font-semibold mb-4">Booking Summary</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Tour:</span>
                    <span className="font-medium">{tour.title}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Date:</span>
                    <span className="font-medium">
                      {formData.tourDate && new Date(formData.tourDate).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Guests:</span>
                    <span className="font-medium">{formData.numberOfGuests}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Primary Contact:</span>
                    <span className="font-medium">{formData.customerInfo.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Email:</span>
                    <span className="font-medium">{formData.customerInfo.email}</span>
                  </div>
                  {formData.guests.length > 0 && (
                    <div className="mt-3">
                      <span className="text-sm font-medium text-gray-700">Guest Details:</span>
                      <div className="mt-2 space-y-1">
                        {formData.guests.map((guest, index) => (
                          <div key={index} className="text-sm text-gray-600">
                            {index + 1}. {guest.name || 'Not provided'} 
                            {guest.age && ` (Age: ${guest.age})`}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  <hr className="my-2" />
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total Amount:</span>
                    <span className="text-blue-600">{formatINR(totalAmount)}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-8 pt-6 border-t">
            <div>
              {step > 1 && (
                <button
                  type="button"
                  onClick={prevStep}
                  className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition duration-300"
                >
                  Previous
                </button>
              )}
            </div>

            <div>
              {step < 4 ? (
                <button
                  type="button"
                  onClick={nextStep}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-300"
                >
                  Next
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={loading}
                  className="px-8 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                >
                  {loading ? (
                    <>
                      <LoadingSpinner size="sm" className="mr-2" />
                      Processing...
                    </>
                  ) : (
                    'Confirm Booking'
                  )}
                </button>
              )}
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BookingForm;
