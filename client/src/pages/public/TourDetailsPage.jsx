import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../api/api';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { formatINR } from '../../utils/currency';
import AutoImageSlider from '../../components/common/AutoImageSlider';
import { useAuth } from '../../context/AuthContext';

const TourDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [tour, setTour] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [bookingError, setBookingError] = useState('');
  const [numberOfGuests, setNumberOfGuests] = useState(1);

  useEffect(() => {
    const fetchTour = async () => {
      try {
        setLoading(true);
        const { data } = await api.get(`/tours/${id}`);
        setTour(data);
      } catch (err) {
        setError('Failed to fetch tour details.');
      } finally {
        setLoading(false);
      }
    };
    fetchTour();
  }, [id]);

  const handleBooking = async (e) => {
    e.preventDefault();
    if (!user) {
      navigate('/login');
      return;
    }

    try {
        await api.post('/bookings', {
            tourPackageId: tour._id,
            numberOfGuests,
        });
        alert('Booking successful! Check "My Bookings" for details.');
        navigate('/my-bookings');
    } catch (err) {
        setBookingError('Failed to create booking. Please try again.');
        console.error(err);
    }
  };

  if (loading) return <Spinner />;
  if (error) return <p className="text-center text-red-500 mt-10">{error}</p>;
  if (!tour) return <p className="text-center mt-10">Tour not found.</p>;

  return (
    <div className="container mx-auto px-6 py-8">
      <div className="grid md:grid-cols-2 gap-10">
        <div>
          <AutoImageSlider
            images={tour.images && tour.images.length > 0 ? tour.images : [
              `https://images.unsplash.com/photo-1488646953014-85cb44e25828?q=80&w=800&h=600&auto=format&fit=crop&seed=${tour._id}`
            ]}
            autoSlideInterval={4000}
            showNavigation={true}
            showDots={tour.images && tour.images.length > 1}
            className="w-full h-96 rounded-lg shadow-lg overflow-hidden"
            imageClassName="w-full h-96 object-cover"
            alt={tour.title}
          />
        </div>
        <div className="flex flex-col justify-between">
          <div>
            <h1 className="text-4xl font-extrabold text-gray-900 mb-2">{tour.title}</h1>
            <p className="text-lg text-gray-600 mb-4">{tour.location}</p>
            <p className="text-gray-700 mb-6">{tour.description}</p>
            <div className="flex items-center space-x-6 mb-6">
                <p><span className="font-semibold">Duration:</span> {tour.duration} days</p>
                <p><span className="font-semibold">Group Size:</span> up to {tour.maxGroupSize} people</p>
            </div>
            <p className="text-4xl font-bold text-blue-600 mb-6">{formatINR(tour.price)} <span className="text-lg font-normal text-gray-500">per person</span></p>
          </div>
          <div className="bg-gray-100 p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold mb-4">Book This Tour</h2>
            <form onSubmit={handleBooking}>
                <div className="mb-4">
                    <label htmlFor="guests" className="block text-sm font-medium text-gray-700">Number of Guests</label>
                    <input 
                        type="number" 
                        id="guests"
                        value={numberOfGuests}
                        onChange={(e) => setNumberOfGuests(e.target.value)}
                        min="1"
                        max={tour.maxGroupSize}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        required
                    />
                </div>
                {bookingError && <p className="text-red-500 text-sm mb-4">{bookingError}</p>}
                <button type="submit" className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition duration-300">
                    {user ? 'Book Now' : 'Login to Book'}
                </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TourDetailsPage;