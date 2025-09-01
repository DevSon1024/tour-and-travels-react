import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../api/api';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import BookingForm from '../../components/tours/BookingForm';
import AutoImageSlider from '../../components/common/AutoImageSlider';
import TourItinerary from '../../components/tours/TourItinerary';
import TourInclusions from '../../components/tours/TourInclusions';
import ReviewSection from '../../components/tours/ReviewSection';
import { useAuth } from '../../context/AuthContext';
import { formatINR } from '../../utils/currency';
import { 
  MapPinIcon, 
  ClockIcon, 
  UserGroupIcon, 
  StarIcon,
  CalendarDaysIcon,
  CurrencyRupeeIcon
} from '@heroicons/react/24/outline';

const EnhancedTourDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [tour, setTour] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    const fetchTour = async () => {
      try {
        setLoading(true);
        const { data } = await api.get(`/tours/${id}`);
        setTour(data);
      } catch (err) {
        setError('Failed to fetch tour details.');
        console.error('Error fetching tour:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchTour();
  }, [id]);

  const handleBookNow = () => {
    if (!user) {
      navigate('/login');
      return;
    }
    setShowBookingForm(true);
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'Easy': return 'text-green-600 bg-green-100';
      case 'Moderate': return 'text-yellow-600 bg-yellow-100';
      case 'Challenging': return 'text-orange-600 bg-orange-100';
      case 'Extreme': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const renderStars = (rating) => {
    return [...Array(5)].map((_, index) => (
      <StarIcon
        key={index}
        className={`h-5 w-5 ${
          index < Math.floor(rating) 
            ? 'text-yellow-400 fill-current' 
            : 'text-gray-300'
        }`}
      />
    ));
  };

  if (loading) return <LoadingSpinner />;
  if (error) return (
    <div className="container mx-auto px-6 py-8">
      <div className="text-center">
        <p className="text-red-500 text-lg">{error}</p>
        <button 
          onClick={() => navigate('/tours')}
          className="mt-4 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition duration-300"
        >
          Back to Tours
        </button>
      </div>
    </div>
  );
  if (!tour) return (
    <div className="container mx-auto px-6 py-8">
      <div className="text-center">
        <p className="text-gray-500 text-lg">Tour not found.</p>
        <button 
          onClick={() => navigate('/tours')}
          className="mt-4 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition duration-300"
        >
          Back to Tours
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="relative h-96 overflow-hidden">
        {tour.images && tour.images.length > 0 ? (
          <AutoImageSlider
            images={tour.images}
            autoSlideInterval={5000}
            showNavigation={true}
            showDots={true}
            className="w-full h-96"
            imageClassName="w-full h-96 object-cover"
            alt={tour.title}
          />
        ) : (
          <div className="w-full h-96 bg-gray-200 flex items-center justify-center">
            <div className="text-center text-gray-500">
              <svg className="mx-auto h-16 w-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <p className="mt-4 text-lg">No Image Available</p>
            </div>
          </div>
        )}
        <div className="absolute inset-0 bg-black bg-opacity-40 flex items-end">
          <div className="container mx-auto px-6 pb-8">
            <div className="text-white">
              <h1 className="text-4xl md:text-5xl font-bold mb-2">{tour.title}</h1>
              <div className="flex items-center space-x-4 text-lg">
                <div className="flex items-center">
                  <MapPinIcon className="h-5 w-5 mr-1" />
                  {tour.location}
                </div>
                <div className="flex items-center">
                  {renderStars(tour.rating)}
                  <span className="ml-2">({tour.reviewCount} reviews)</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Quick Info Cards */}
            <div className="grid md:grid-cols-4 gap-4 mb-8">
              <div className="bg-white p-4 rounded-lg shadow-sm border">
                <ClockIcon className="h-6 w-6 text-blue-600 mb-2" />
                <p className="text-sm text-gray-600">Duration</p>
                <p className="font-semibold">{tour.duration} days</p>
              </div>
              <div className="bg-white p-4 rounded-lg shadow-sm border">
                <UserGroupIcon className="h-6 w-6 text-blue-600 mb-2" />
                <p className="text-sm text-gray-600">Group Size</p>
                <p className="font-semibold">Up to {tour.maxGroupSize}</p>
              </div>
              <div className="bg-white p-4 rounded-lg shadow-sm border">
                <CalendarDaysIcon className="h-6 w-6 text-blue-600 mb-2" />
                <p className="text-sm text-gray-600">Available Seats</p>
                <p className="font-semibold">{tour.availableSeats || 'Unlimited'}</p>
              </div>
              <div className="bg-white p-4 rounded-lg shadow-sm border">
                <div className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(tour.difficulty)}`}>
                  {tour.difficulty}
                </div>
                <p className="text-sm text-gray-600 mt-1">Difficulty</p>
              </div>
            </div>

            {/* Navigation Tabs */}
            <div className="bg-white rounded-lg shadow-sm border mb-6">
              <div className="border-b">
                <nav className="flex space-x-8 px-6">
                  {[
                    { id: 'overview', label: 'Overview' },
                    { id: 'itinerary', label: 'Itinerary' },
                    { id: 'inclusions', label: 'What\'s Included' },
                    { id: 'dates', label: 'Available Dates' },
                    { id: 'reviews', label: 'Reviews' }
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${
                        activeTab === tab.id
                          ? 'border-blue-500 text-blue-600'
                          : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </nav>
              </div>

              {/* Tab Content */}
              <div className="p-6">
                {activeTab === 'overview' && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-xl font-semibold mb-3">About This Tour</h3>
                      <p className="text-gray-700 leading-relaxed">{tour.description}</p>
                    </div>
                    
                    {tour.amenities && tour.amenities.length > 0 && (
                      <div>
                        <h3 className="text-xl font-semibold mb-3">Amenities</h3>
                        <div className="grid md:grid-cols-2 gap-2">
                          {tour.amenities.map((amenity, index) => (
                            <div key={index} className="flex items-center">
                              <div className="w-2 h-2 bg-blue-600 rounded-full mr-3"></div>
                              <span className="text-gray-700">{amenity}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {tour.transportType && tour.transportType.length > 0 && (
                      <div>
                        <h3 className="text-xl font-semibold mb-3">Transportation</h3>
                        <div className="flex flex-wrap gap-2">
                          {tour.transportType.map((transport, index) => (
                            <span 
                              key={index}
                              className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium"
                            >
                              {transport.charAt(0).toUpperCase() + transport.slice(1)}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {activeTab === 'itinerary' && (
                  <TourItinerary itinerary={tour.itinerary} />
                )}

                {activeTab === 'inclusions' && (
                  <TourInclusions 
                    inclusions={tour.inclusions} 
                    exclusions={tour.exclusions} 
                  />
                )}

                {activeTab === 'dates' && (
                  <div>
                    <h3 className="text-xl font-semibold mb-4">Available Tour Dates</h3>
                    {tour.availableDates && tour.availableDates.length > 0 ? (
                      <div className="grid md:grid-cols-3 gap-3">
                        {tour.availableDates.map((date, index) => (
                          <div 
                            key={index}
                            className="bg-gray-50 p-3 rounded-lg border text-center"
                          >
                            <p className="font-medium text-gray-900">
                              {new Date(date).toLocaleDateString('en-US', {
                                weekday: 'short',
                                year: 'numeric',
                                month: 'short',
                                day: 'numeric'
                              })}
                            </p>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-600">Available dates will be updated soon. Please contact us for more information.</p>
                    )}
                  </div>
                )}

                {activeTab === 'reviews' && (
                  <ReviewSection 
                    tourId={tour._id}
                    reviews={tour.reviews || []}
                    averageRating={tour.rating}
                    totalReviews={tour.reviewCount}
                  />
                )}
              </div>
            </div>
          </div>

          {/* Booking Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-lg border p-6 sticky top-6">
              <div className="text-center mb-6">
                <div className="flex items-center justify-center mb-2">
                  <CurrencyRupeeIcon className="h-6 w-6 text-green-600 mr-1" />
                  <span className="text-3xl font-bold text-gray-900">{formatINR(tour.price)}</span>
                </div>
                <p className="text-gray-600">per person</p>
              </div>

              <button
                onClick={handleBookNow}
                className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 transition duration-300 mb-4"
              >
                {user ? 'Book Now' : 'Login to Book'}
              </button>

              <div className="text-center text-sm text-gray-600">
                <p>✓ Free cancellation up to 24 hours</p>
                <p>✓ Instant confirmation</p>
                <p>✓ Mobile ticket accepted</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Booking Form Modal */}
      {showBookingForm && (
        <BookingForm
          tour={tour}
          onClose={() => setShowBookingForm(false)}
          onSuccess={() => {
            setShowBookingForm(false);
            navigate('/booking-confirmation');
          }}
        />
      )}
    </div>
  );
};

export default EnhancedTourDetailsPage;
