import React, { useState, useEffect } from 'react';
import api from '../../api/api';
import Spinner from '../../components/common/Spinner';
import { useAuth } from '../../context/AuthContext';

const MyBookingsPage = () => {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const { user, token } = useAuth();

    useEffect(() => {
        const fetchBookings = async () => {
            try {
                setLoading(true);
                setError('');
                
                // Check if user is authenticated
                if (!token || !user) {
                    setError('Please log in to view your bookings.');
                    setLoading(false);
                    return;
                }

                const { data } = await api.get('/bookings/mybookings');
                setBookings(Array.isArray(data) ? data : []);
            } catch (err) {
                console.error('Error fetching bookings:', err);
                setError(err.response?.data?.message || 'Failed to fetch your bookings. Please try again.');
            } finally {
                setLoading(false);
            }
        };
        fetchBookings();
    }, [token, user]);

    const getStatusColor = (status) => {
        switch (status) {
            case 'confirmed': return 'bg-green-100 text-green-800';
            case 'pending': return 'bg-yellow-100 text-yellow-800';
            case 'cancelled': return 'bg-red-100 text-red-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    }

    if (loading) return <Spinner />;
    if (error) return <p className="text-center text-red-500 mt-10">{error}</p>;

    return (
        <div className="container mx-auto px-6 py-8">
            <h1 className="text-3xl font-bold mb-6">My Bookings</h1>
            {bookings.length === 0 ? (
                <p>You have no bookings yet.</p>
            ) : (
                <div className="space-y-4">
                    {bookings.map(booking => {
                        // Safe access to tourPackage data with fallbacks
                        const tourPackage = booking.tourPackage || {};
                        const tourTitle = tourPackage.title || 'Unknown Tour';
                        const tourLocation = tourPackage.location || 'Unknown Location';
                        const tourImages = tourPackage.images || [];
                        const fallbackImage = `https://picsum.photos/seed/${booking._id}/100/100`;
                        const tourImage = tourImages.length > 0 ? tourImages[0] : fallbackImage;
                        const bookingDate = booking.createdAt || booking.bookingDate || new Date();
                        const status = booking.status || 'pending';
                        
                        return (
                            <div key={booking._id} className="bg-white p-4 rounded-lg shadow-md flex items-center justify-between">
                                <div className="flex items-center space-x-4">
                                   <img 
                                     src={tourImage} 
                                     alt={tourTitle}
                                     className="w-24 h-24 object-cover rounded-md"
                                     onError={(e) => {
                                         e.target.src = fallbackImage;
                                     }}
                                    />
                                   <div>
                                        <h2 className="text-xl font-semibold">{tourTitle}</h2>
                                        <p className="text-gray-600">{tourLocation}</p>
                                        <p className="text-sm text-gray-500">
                                            Booked on: {new Date(bookingDate).toLocaleDateString()}
                                        </p>
                                        {booking.bookingReference && (
                                            <p className="text-xs text-gray-400">
                                                Ref: {booking.bookingReference}
                                            </p>
                                        )}
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="font-bold text-lg">₹{booking.totalAmount || 0}</p>
                                    <span className={`px-2 py-1 text-sm font-semibold rounded-full ${getStatusColor(status)}`}>
                                        {status.charAt(0).toUpperCase() + status.slice(1)}
                                    </span>
                                    {booking.numberOfGuests && (
                                        <p className="text-xs text-gray-500 mt-1">
                                            {booking.numberOfGuests} guest{booking.numberOfGuests > 1 ? 's' : ''}
                                        </p>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default MyBookingsPage;