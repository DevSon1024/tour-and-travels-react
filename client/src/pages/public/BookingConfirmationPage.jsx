import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { formatINR } from '../../utils/currency';
import { 
  CheckCircleIcon, 
  DocumentTextIcon, 
  CalendarDaysIcon,
  UserGroupIcon,
  CurrencyRupeeIcon,
  PhoneIcon,
  EnvelopeIcon
} from '@heroicons/react/24/outline';

const BookingConfirmationPage = () => {
  const navigate = useNavigate();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get booking data from localStorage
    const bookingData = localStorage.getItem('latestBooking');
    
    if (bookingData) {
      try {
        const parsedBooking = JSON.parse(bookingData);
        setBooking(parsedBooking);
      } catch (error) {
        console.error('Error parsing booking data:', error);
        navigate('/tours');
      }
    } else {
      // No booking data found, redirect to tours
      navigate('/tours');
    }
    
    setLoading(false);
  }, [navigate]);

  const handlePrintConfirmation = () => {
    window.print();
  };

  const handleDownloadConfirmation = () => {
    // Create a simple text version of the booking confirmation
    const guestDetails = booking.guests && booking.guests.length > 0 
      ? booking.guests.map((guest, index) => 
          `Guest ${index + 1}: ${guest.name} (${guest.email}, ${guest.phone}${guest.age ? `, Age: ${guest.age}` : ''})`
        ).join('\n')
      : 'No guest details available';

    const emergencyContact = booking.emergencyContact && booking.emergencyContact.name
      ? `\nEmergency Contact:\nName: ${booking.emergencyContact.name}\nPhone: ${booking.emergencyContact.phone || 'Not provided'}\nRelationship: ${booking.emergencyContact.relationship || 'Not specified'}`
      : '';

    const confirmationText = `
BOOKING CONFIRMATION
====================

Booking Reference: ${booking.bookingReference}
Tour: ${booking.tourPackage?.title}
Location: ${booking.tourPackage?.location}

Primary Contact Details:
Name: ${booking.customerInfo.name}
Email: ${booking.customerInfo.email}
Phone: ${booking.customerInfo.phone}
${booking.customerInfo.address ? `Address: ${booking.customerInfo.address}` : ''}

Booking Details:
Tour Date: ${new Date(booking.tourDate).toLocaleDateString()}
Number of Guests: ${booking.numberOfGuests}
Total Amount: ${formatINR(booking.totalAmount)}
Status: ${booking.status}

Guest Details:
${guestDetails}
${emergencyContact}

${booking.specialRequests ? `Special Requests: ${booking.specialRequests}` : ''}

Thank you for booking with us!
For any queries, please contact us at support@tourandtravel.com
    `;

    const blob = new Blob([confirmationText], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `booking-confirmation-${booking.bookingReference}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-500 text-lg mb-4">No booking information found.</p>
          <Link 
            to="/tours"
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition duration-300"
          >
            Browse Tours
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-6 max-w-4xl">
        {/* Success Header */}
        <div className="text-center mb-8">
          <CheckCircleIcon className="h-16 w-16 text-green-600 mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Booking Confirmed!</h1>
          <p className="text-gray-600">
            Thank you for your booking. Your tour has been successfully reserved.
          </p>
        </div>

        {/* Booking Details Card */}
        <div className="bg-white rounded-lg shadow-lg border p-8 mb-6">
          {/* Booking Reference */}
          <div className="text-center mb-6 pb-6 border-b">
            <div className="bg-blue-50 inline-block px-4 py-2 rounded-lg">
              <p className="text-sm text-blue-600 font-medium">Booking Reference</p>
              <p className="text-xl font-bold text-blue-800">{booking.bookingReference}</p>
            </div>
          </div>

          {/* Tour Information */}
          <div className="grid md:grid-cols-2 gap-8 mb-8">
            <div>
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <DocumentTextIcon className="h-5 w-5 mr-2 text-blue-600" />
                Tour Details
              </h3>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-600">Tour Name</p>
                  <p className="font-medium">{booking.tourPackage?.title}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Location</p>
                  <p className="font-medium">{booking.tourPackage?.location}</p>
                </div>
                <div className="flex items-center">
                  <CalendarDaysIcon className="h-4 w-4 mr-2 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-600">Tour Date</p>
                    <p className="font-medium">
                      {new Date(booking.tourDate).toLocaleDateString('en-US', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </p>
                  </div>
                </div>
                <div className="flex items-center">
                  <UserGroupIcon className="h-4 w-4 mr-2 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-600">Number of Guests</p>
                    <p className="font-medium">{booking.numberOfGuests}</p>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <EnvelopeIcon className="h-5 w-5 mr-2 text-blue-600" />
                Primary Contact Information
              </h3>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-600">Name</p>
                  <p className="font-medium">{booking.customerInfo.name}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Email</p>
                  <p className="font-medium">{booking.customerInfo.email}</p>
                </div>
                <div className="flex items-center">
                  <PhoneIcon className="h-4 w-4 mr-2 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-600">Phone</p>
                    <p className="font-medium">{booking.customerInfo.phone}</p>
                  </div>
                </div>
                {booking.customerInfo.address && (
                  <div>
                    <p className="text-sm text-gray-600">Address</p>
                    <p className="font-medium">{booking.customerInfo.address}</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Guest Details */}
          {booking.guests && booking.guests.length > 0 && (
            <div className="mb-8">
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <UserGroupIcon className="h-5 w-5 mr-2 text-green-600" />
                Guest Details ({booking.guests.length} guest{booking.guests.length > 1 ? 's' : ''})
              </h3>
              <div className="grid md:grid-cols-2 gap-4">
                {booking.guests.map((guest, index) => (
                  <div key={index} className="bg-gray-50 p-4 rounded-lg border">
                    <h4 className="font-medium text-gray-900 mb-2">Guest {index + 1}</h4>
                    <div className="space-y-2 text-sm">
                      <div>
                        <span className="text-gray-600">Name:</span>
                        <span className="ml-2 font-medium">{guest.name}</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Email:</span>
                        <span className="ml-2 font-medium">{guest.email}</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Phone:</span>
                        <span className="ml-2 font-medium">{guest.phone}</span>
                      </div>
                      {guest.age && (
                        <div>
                          <span className="text-gray-600">Age:</span>
                          <span className="ml-2 font-medium">{guest.age} years</span>
                        </div>
                      )}
                      {guest.idType && (
                        <div>
                          <span className="text-gray-600">ID:</span>
                          <span className="ml-2 font-medium">
                            {guest.idType.replace('_', ' ').toUpperCase()}
                            {guest.idNumber && ` - ${guest.idNumber}`}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Emergency Contact */}
          {booking.emergencyContact && booking.emergencyContact.name && (
            <div className="mb-8">
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <PhoneIcon className="h-5 w-5 mr-2 text-red-600" />
                Emergency Contact
              </h3>
              <div className="bg-red-50 p-4 rounded-lg border border-red-200">
                <div className="space-y-2 text-sm">
                  <div>
                    <span className="text-gray-600">Name:</span>
                    <span className="ml-2 font-medium">{booking.emergencyContact.name}</span>
                  </div>
                  {booking.emergencyContact.phone && (
                    <div>
                      <span className="text-gray-600">Phone:</span>
                      <span className="ml-2 font-medium">{booking.emergencyContact.phone}</span>
                    </div>
                  )}
                  {booking.emergencyContact.relationship && (
                    <div>
                      <span className="text-gray-600">Relationship:</span>
                      <span className="ml-2 font-medium">{booking.emergencyContact.relationship}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Special Requests */}
          {booking.specialRequests && (
            <div className="mb-8">
              <h3 className="text-lg font-semibold mb-3">Special Requests</h3>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-gray-700">{booking.specialRequests}</p>
              </div>
            </div>
          )}

          {/* Emergency Contact */}
          {booking.emergencyContact?.name && (
            <div className="mb-8">
              <h3 className="text-lg font-semibold mb-3">Emergency Contact</h3>
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="grid md:grid-cols-3 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Name</p>
                    <p className="font-medium">{booking.emergencyContact.name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Phone</p>
                    <p className="font-medium">{booking.emergencyContact.phone}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Relationship</p>
                    <p className="font-medium">{booking.emergencyContact.relationship}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Payment Summary */}
          <div className="border-t pt-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold flex items-center">
                <CurrencyRupeeIcon className="h-5 w-5 mr-2 text-green-600" />
                Payment Summary
              </h3>
              <div className="text-right">
                <p className="text-2xl font-bold text-green-600">{formatINR(booking.totalAmount)}</p>
                <p className="text-sm text-gray-600">Total Amount</p>
              </div>
            </div>
            
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-yellow-800">
                    Payment Status: {booking.paymentStatus?.charAt(0).toUpperCase() + booking.paymentStatus?.slice(1)}
                  </p>
                  <p className="text-xs text-yellow-700 mt-1">
                    You will receive payment instructions via email within 24 hours.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-4 justify-center mb-8">
          <button
            onClick={handlePrintConfirmation}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition duration-300 flex items-center"
          >
            <DocumentTextIcon className="h-5 w-5 mr-2" />
            Print Confirmation
          </button>
          
          <button
            onClick={handleDownloadConfirmation}
            className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition duration-300 flex items-center"
          >
            <DocumentTextIcon className="h-5 w-5 mr-2" />
            Download Confirmation
          </button>
          
          <Link
            to="/my-bookings"
            className="bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700 transition duration-300 flex items-center"
          >
            View My Bookings
          </Link>
        </div>

        {/* What's Next */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
          <h3 className="text-lg font-semibold text-blue-900 mb-3">What's Next?</h3>
          <div className="space-y-2 text-blue-800">
            <p>• You will receive a confirmation email with detailed tour information</p>
            <p>• Payment instructions will be sent within 24 hours</p>
            <p>• Our team will contact you 48 hours before the tour date</p>
            <p>• Keep your booking reference handy for any future communication</p>
          </div>
        </div>

        {/* Contact Information */}
        <div className="text-center bg-white rounded-lg shadow-sm border p-6">
          <h3 className="text-lg font-semibold mb-3">Need Help?</h3>
          <p className="text-gray-600 mb-4">
            Our customer support team is here to assist you with any questions.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <a 
              href="mailto:support@tourandtravel.com"
              className="text-blue-600 hover:text-blue-800 flex items-center"
            >
              <EnvelopeIcon className="h-4 w-4 mr-1" />
              support@tourandtravel.com
            </a>
            <a 
              href="tel:+1234567890"
              className="text-blue-600 hover:text-blue-800 flex items-center"
            >
              <PhoneIcon className="h-4 w-4 mr-1" />
              +1 (234) 567-8900
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingConfirmationPage;
