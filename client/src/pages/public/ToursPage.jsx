import React, { useState, useEffect, useMemo, useCallback } from 'react';
import api from '../../api/api';
import EnhancedTourCard from '../../components/tours/EnhancedTourCard';
import TourListItem from '../../components/tours/TourListItem';
import TourSort from '../../components/tours/TourSort';
import ViewToggle from '../../components/tours/ViewToggle';
import RecommendedTours from '../../components/tours/RecommendedTours';
import TourHero from '../../components/tours/TourHero';
import TourEmptyState from '../../components/tours/TourEmptyState';
import Spinner from '../../components/common/Spinner';

const ToursPage = () => {
  const [tours, setTours] = useState([]);
  const [filteredTours, setFilteredTours] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [viewMode, setViewMode] = useState('grid');
  const [sortOption, setSortOption] = useState('price-low');

  useEffect(() => {
    const fetchTours = async () => {
      try {
        setLoading(true);
        const { data } = await api.get('/tours');
        
        // Add consistent transport type data based on tour ID
        const toursWithTransport = data.map(tour => {
          const seed = tour._id ? tour._id.charCodeAt(0) : 0;
          return {
            ...tour,
            transportType: seed % 2 === 0 ? ['bus'] : ['train'],
            availableSeats: (seed % 20) + 1,
            departureTime: seed % 2 === 0 ? '10:00 AM' : '2:00 PM',
            amenities: ['WiFi', 'Meals', 'Guide', 'Hotel Pickup']
          };
        });
        
        setTours(toursWithTransport);
        setFilteredTours(toursWithTransport);
      } catch (err) {
        setError('Failed to fetch tours. Please try again later.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchTours();
  }, []);

  // Apply sorting only
  useEffect(() => {
    let result = [...tours];
    
    // Apply sorting
    switch (sortOption) {
      case 'price-low':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        result.sort((a, b) => b.price - a.price);
        break;
      case 'duration-short':
        result.sort((a, b) => a.duration - b.duration);
        break;
      case 'duration-long':
        result.sort((a, b) => b.duration - a.duration);
        break;
      case 'popularity':
        result.sort(() => Math.random() - 0.5);
        break;
      default:
        break;
    }
    
    setFilteredTours(result);
  }, [tours, sortOption]);
  
  if (loading) return <Spinner />;
  if (error) return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <div className="text-center">
        <p className="text-red-600 text-lg mb-4">{error}</p>
        <button 
          onClick={() => window.location.reload()} 
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
        >
          Try Again
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-white">
      <TourHero />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Recommended Tours Section */}
        {tours.length > 0 && (
          <div id="recommended-tours" className="mb-16">
            <RecommendedTours tours={tours} />
          </div>
        )}
        
        <div id="all-tours">
          {/* Header with Controls */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 gap-4">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">All Tours</h2>
              <p className="text-gray-600 mt-1">
                {filteredTours.length} tour{filteredTours.length !== 1 ? 's' : ''} available
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <TourSort sortOption={sortOption} setSortOption={setSortOption} />
              <ViewToggle viewMode={viewMode} setViewMode={setViewMode} />
            </div>
          </div>
          
          {/* Tours Grid/List */}
          {filteredTours.length === 0 ? (
            <TourEmptyState />
          ) : viewMode === 'grid' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredTours.map((tour) => (
                <div key={tour._id} className="h-full">
                  <EnhancedTourCard tour={tour} />
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-6">
              {filteredTours.map((tour) => (
                <div key={tour._id}>
                  <TourListItem tour={tour} />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ToursPage;