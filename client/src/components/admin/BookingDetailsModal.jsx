import React, { useState, useEffect } from 'react';
import bookingService from '../../api/bookingService';
import { toast } from 'react-hot-toast';

const BookingDetailsModal = ({ booking, onClose, onStatusUpdate }) => {
  const [fullBookingDetails, setFullBookingDetails] = useState(booking);
  const [loading, setLoading] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState(false);

  // Fetch full booking details with tour information
  useEffect(() => {
    const fetchFullBookingDetails = async () => {
      if (booking?._id) {
        try {
          setLoading(true);
          const fullDetails = await bookingService.getBookingDetailsForAdmin(booking._id);
          setFullBookingDetails(fullDetails);
        } catch (error) {
          console.error('Error fetching full booking details:', error);
          // Fallback to the booking prop if API call fails
          setFullBookingDetails(booking);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchFullBookingDetails();
  }, [booking]);

  const getStatusBadge = (status) => {
    const statusConfig = {
      pending: { bg: 'bg-yellow-100', text: 'text-yellow-800', icon: '⏳' },
      confirmed: { bg: 'bg-green-100', text: 'text-green-800', icon: '✅' },
      cancelled: { bg: 'bg-red-100', text: 'text-red-800', icon: '❌' },
      completed: { bg: 'bg-blue-100', text: 'text-blue-800', icon: '🎯' }
    };
    
    const config = statusConfig[status] || statusConfig.pending;
    
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.bg} ${config.text}`}>
        {config.icon} {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  const handleStatusChange = async (newStatus) => {
    setUpdatingStatus(true);
    
    try {
      const response = await bookingService.updateBookingStatusAdmin(fullBookingDetails._id, newStatus);
      
      // Check if the response indicates success
      if (response && (response.status === newStatus || response._id)) {
        // Update local state
        setFullBookingDetails(prev => ({ ...prev, status: newStatus }));
        
        // Call parent component's update function
        if (onStatusUpdate) {
          onStatusUpdate(fullBookingDetails._id, newStatus);
        }
        
        // Show success message
        const statusMessages = {
          'confirmed': 'approved',
          'completed': 'completed', 
          'cancelled': 'cancelled'
        };
        
        toast.success(`Booking ${statusMessages[newStatus] || newStatus} successfully!`, {
          duration: 3000,
          position: 'top-center',
        });
        
        // Close modal after successful update
        setTimeout(() => {
          onClose();
        }, 1000);
      } else {
        throw new Error('Invalid response from server');
      }
    } catch (error) {
      console.error('Error updating booking status:', error);
      
      // Show specific error message
      const errorMessage = error.response?.data?.message || error.message || 'Failed to update booking status';
      toast.error(errorMessage, {
        duration: 4000,
        position: 'top-center',
      });
    } finally {
      setUpdatingStatus(false);
    }
  };

  const currentBooking = fullBookingDetails || booking;
  const tourPackage = currentBooking?.tourPackage;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-gray-900">
              Booking Details
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {loading && (
            <div className="flex justify-center items-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <span className="ml-2 text-gray-600">Loading tour details...</span>
            </div>
          )}

          {/* Tour Information Section */}
          {tourPackage && (
            <div className="bg-blue-50 p-6 rounded border border-blue-200">
              <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                <span className="text-2xl mr-2">🏞️</span>
                Tour Information
              </h3>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Tour Basic Info */}
                <div className="space-y-4">
                  <div>
                    <span className="text-sm font-medium text-gray-600">Tour Name:</span>
                    <p className="text-lg font-semibold text-gray-900">{tourPackage.title}</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-600">Location:</span>
                    <p className="text-sm text-gray-900 flex items-center">
                      <span className="mr-1">📍</span>
                      {tourPackage.location}
                    </p>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <span className="text-sm font-medium text-gray-600">Duration:</span>
                      <p className="text-sm text-gray-900">{tourPackage.duration} days</p>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-600">Difficulty:</span>
                      <p className="text-sm text-gray-900">{tourPackage.difficulty}</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <span className="text-sm font-medium text-gray-600">Price per Guest:</span>
                      <p className="text-lg font-bold text-green-600">₹{tourPackage.price?.toLocaleString()}</p>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-600">Total Price:</span>
                      <p className="text-lg font-bold text-green-600">₹{currentBooking.totalAmount?.toLocaleString()}</p>
                    </div>
                  </div>
                  {tourPackage.rating > 0 && (
                    <div>
                      <span className="text-sm font-medium text-gray-600">Rating:</span>
                      <p className="text-sm text-gray-900 flex items-center">
                        <span className="text-yellow-500 mr-1">⭐</span>
                        {tourPackage.rating.toFixed(1)} ({tourPackage.reviewCount} reviews)
                      </p>
                    </div>
                  )}
                </div>

                {/* Tour Images and Description */}
                <div className="space-y-4">
                  {tourPackage.images && tourPackage.images.length > 0 && (
                    <div>
                      <span className="text-sm font-medium text-gray-600 block mb-2">Tour Images:</span>
                      <div className="grid grid-cols-2 gap-2">
                        {tourPackage.images.slice(0, 4).map((image, index) => (
                          <img
                            key={index}
                            src={image}
                            alt={`${tourPackage.title} ${index + 1}`}
                            className="w-full h-20 object-cover rounded-lg border"
                            onError={(e) => {
                              e.target.src = '/api/placeholder/150/80';
                            }}
                          />
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {tourPackage.description && (
                    <div>
                      <span className="text-sm font-medium text-gray-600">Description:</span>
                      <p className="text-sm text-gray-700 mt-1 leading-relaxed">
                        {tourPackage.description.length > 200 
                          ? `${tourPackage.description.substring(0, 200)}...` 
                          : tourPackage.description}
                      </p>
                    </div>
                  )}

                  {/* Tour Dates */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <span className="text-sm font-medium text-gray-600">Start Date:</span>
                      <p className="text-sm text-gray-900">
                        {currentBooking.tourDate ? new Date(currentBooking.tourDate).toLocaleDateString() : 'Not specified'}
                      </p>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-600">End Date:</span>
                      <p className="text-sm text-gray-900">
                        {currentBooking.tourDate && tourPackage.duration 
                          ? new Date(new Date(currentBooking.tourDate).getTime() + (tourPackage.duration - 1) * 24 * 60 * 60 * 1000).toLocaleDateString()
                          : 'Not specified'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Tour Inclusions/Exclusions */}
              {(tourPackage.inclusions?.length > 0 || tourPackage.exclusions?.length > 0) && (
                <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                  {tourPackage.inclusions?.length > 0 && (
                    <div className="bg-green-50 p-4 rounded-lg">
                      <h4 className="font-semibold text-green-800 mb-2 flex items-center">
                        <span className="mr-1">✅</span>
                        Inclusions
                      </h4>
                      <ul className="text-sm text-green-700 space-y-1">
                        {tourPackage.inclusions.slice(0, 5).map((item, index) => (
                          <li key={index} className="flex items-start">
                            <span className="mr-2 text-green-500">•</span>
                            {item}
                          </li>
                        ))}
                        {tourPackage.inclusions.length > 5 && (
                          <li className="text-green-600 font-medium">+{tourPackage.inclusions.length - 5} more...</li>
                        )}
                      </ul>
                    </div>
                  )}
                  
                  {tourPackage.exclusions?.length > 0 && (
                    <div className="bg-red-50 p-4 rounded-lg">
                      <h4 className="font-semibold text-red-800 mb-2 flex items-center">
                        <span className="mr-1">❌</span>
                        Exclusions
                      </h4>
                      <ul className="text-sm text-red-700 space-y-1">
                        {tourPackage.exclusions.slice(0, 5).map((item, index) => (
                          <li key={index} className="flex items-start">
                            <span className="mr-2 text-red-500">•</span>
                            {item}
                          </li>
                        ))}
                        {tourPackage.exclusions.length > 5 && (
                          <li className="text-red-600 font-medium">+{tourPackage.exclusions.length - 5} more...</li>
                        )}
                      </ul>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Booking Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <span className="text-xl mr-2">📋</span>
                Booking Information
              </h3>
              <div className="space-y-3">
                <div>
                  <span className="text-sm font-medium text-gray-500">Booking ID:</span>
                  <p className="text-sm text-gray-900">#{currentBooking.bookingId || currentBooking._id?.slice(-6)}</p>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-500">Status:</span>
                  <div className="mt-1">{getStatusBadge(currentBooking.status)}</div>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-500">Booking Date:</span>
                  <p className="text-sm text-gray-900">{new Date(currentBooking.createdAt).toLocaleDateString()}</p>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-500">Travel Date:</span>
                  <p className="text-sm text-gray-900">
                    {currentBooking.tourDate ? new Date(currentBooking.tourDate).toLocaleDateString() : 'Not specified'}
                  </p>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-500">Number of Guests:</span>
                  <p className="text-sm text-gray-900">{currentBooking.numberOfGuests || 1}</p>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-500">Total Amount:</span>
                  <p className="text-lg font-bold text-green-600">₹{currentBooking.totalAmount?.toLocaleString()}</p>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <span className="text-xl mr-2">👤</span>
                Primary Contact Information
              </h3>
              <div className="space-y-3">
                <div>
                  <span className="text-sm font-medium text-gray-500">Name:</span>
                  <p className="text-sm text-gray-900">{currentBooking.customerInfo?.name || currentBooking.user?.name}</p>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-500">Email:</span>
                  <p className="text-sm text-gray-900">{currentBooking.customerInfo?.email || currentBooking.user?.email}</p>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-500">Phone:</span>
                  <p className="text-sm text-gray-900">{currentBooking.customerInfo?.phone}</p>
                </div>
                {currentBooking.customerInfo?.address && (
                  <div>
                    <span className="text-sm font-medium text-gray-500">Address:</span>
                    <p className="text-sm text-gray-900">{currentBooking.customerInfo.address}</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Special Requests */}
          {currentBooking.specialRequests && (
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Special Requests</h3>
              <p className="text-sm text-gray-700">{currentBooking.specialRequests}</p>
            </div>
          )}

          {/* Guest Details */}
          {currentBooking.guests && currentBooking.guests.length > 0 && (
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <span className="text-xl mr-2">👥</span>
                Guest Details ({currentBooking.guests.length} guests)
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {currentBooking.guests.map((guest, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-3 bg-white">
                    <h4 className="font-medium text-gray-900 mb-2">Guest {index + 1}</h4>
                    <div className="space-y-1 text-sm">
                      <div>
                        <span className="font-medium text-gray-600">Name:</span>
                        <span className="ml-2 text-gray-900">{guest.name}</span>
                      </div>
                      <div>
                        <span className="font-medium text-gray-600">Email:</span>
                        <span className="ml-2 text-gray-900">{guest.email}</span>
                      </div>
                      <div>
                        <span className="font-medium text-gray-600">Phone:</span>
                        <span className="ml-2 text-gray-900">{guest.phone}</span>
                      </div>
                      {guest.age && (
                        <div>
                          <span className="font-medium text-gray-600">Age:</span>
                          <span className="ml-2 text-gray-900">{guest.age} years</span>
                        </div>
                      )}
                      {guest.address && (
                        <div>
                          <span className="font-medium text-gray-600">Address:</span>
                          <span className="ml-2 text-gray-900">{guest.address}</span>
                        </div>
                      )}

                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Emergency Contact */}
          {currentBooking.emergencyContact && currentBooking.emergencyContact.name && (
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <span className="text-xl mr-2">🚨</span>
                Emergency Contact
              </h3>
              <div className="space-y-2 text-sm">
                <div>
                  <span className="font-medium text-gray-600">Name:</span>
                  <span className="ml-2 text-gray-900">{currentBooking.emergencyContact.name}</span>
                </div>
                {currentBooking.emergencyContact.phone && (
                  <div>
                    <span className="font-medium text-gray-600">Phone:</span>
                    <span className="ml-2 text-gray-900">{currentBooking.emergencyContact.phone}</span>
                  </div>
                )}
                {currentBooking.emergencyContact.relationship && (
                  <div>
                    <span className="font-medium text-gray-600">Relationship:</span>
                    <span className="ml-2 text-gray-900">{currentBooking.emergencyContact.relationship}</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Status Update Actions */}
          <div className="bg-blue-50 p-4 rounded-lg">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <span className="text-xl mr-2">⚙️</span>
              Update Status
            </h3>
            <div className="flex flex-wrap gap-3">
              {currentBooking.status === 'pending' && (
                <>
                  <button
                    onClick={() => handleStatusChange('confirmed')}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200"
                  >
                    ✅ Approve Booking
                  </button>
                  <button
                    onClick={() => handleStatusChange('cancelled')}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200"
                  >
                    ❌ Reject Booking
                  </button>
                </>
              )}
              
              {currentBooking.status === 'confirmed' && (
                <button
                  onClick={() => handleStatusChange('completed')}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
                >
                  🎯 Mark as Completed
                </button>
              )}
              
              {currentBooking.status === 'completed' && (
                <p className="text-green-600 font-medium">✅ This booking has been completed</p>
              )}
              
              {currentBooking.status === 'cancelled' && (
                <p className="text-red-600 font-medium">❌ This booking has been cancelled</p>
              )}
            </div>
          </div>
        </div>

        <div className="p-6 border-t border-gray-200">
          <div className="flex justify-end">
            <button
              onClick={onClose}
              className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors duration-200"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingDetailsModal;
