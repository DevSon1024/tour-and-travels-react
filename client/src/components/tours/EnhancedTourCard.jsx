import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { BusIcon, TrainIcon, ClockIcon, UsersIcon } from '../icons/TransportIcons';
import AutoImageSlider from '../common/AutoImageSlider';
import { formatINR } from '../../utils/currency';

const EnhancedTourCard = ({ tour }) => {
  const [imageError, setImageError] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);

  // Function to render transport type icon
  const renderTransportIcon = (type) => {
    if (type === 'bus') {
      return (
        <div className="flex items-center bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
          <BusIcon className="h-4 w-4 mr-1" />
          Bus
        </div>
      );
    } else if (type === 'train') {
      return (
        <div className="flex items-center bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
          <TrainIcon className="h-4 w-4 mr-1" />
          Train
        </div>
      );
    }
    return null;
  };

  // Get the primary image with fallback options
  const getImageSrc = () => {
    return tour.images && tour.images.length > 0 && tour.images[0] 
      ? tour.images[0] 
      : null;
  };

  const handleImageError = () => {
    setImageError(true);
    setImageLoading(false);
  };

  const handleImageLoad = () => {
    setImageLoading(false);
  };

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden transform hover:-translate-y-2 transition-transform duration-300 ease-in-out">
      <div className="relative">
        {tour.images && tour.images.length > 0 ? (
          <AutoImageSlider
            images={tour.images}
            autoSlideInterval={4000}
            showNavigation={true}
            showDots={tour.images.length > 1}
            className="w-full h-56"
            imageClassName="w-full h-56 object-cover"
            alt={tour.title}
          />
        ) : (
          <div className="w-full h-56 bg-gray-200 flex items-center justify-center">
            <div className="text-center text-gray-500">
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <p className="mt-2 text-sm">No Image Available</p>
            </div>
          </div>
        )}
        {/* Transport type badge */}
        <div className="absolute top-3 right-3 flex space-x-2">
          {tour.transportType && tour.transportType.map(type => (
            <span key={type}>{renderTransportIcon(type)}</span>
          ))}
        </div>
        {/* Featured badge */}
        {tour.featured && (
          <div className="absolute top-3 left-3">
            <span className="bg-gradient-to-r from-orange-500 to-red-500 text-white text-xs font-bold px-3 py-1 rounded-full">
              FEATURED
            </span>
          </div>
        )}
        {/* Rating badge */}
        {tour.rating && tour.rating > 0 && (
          <div className="absolute bottom-3 left-3">
            <span className="bg-black bg-opacity-70 text-white text-xs font-medium px-2 py-1 rounded-full flex items-center">
              ⭐ {tour.rating.toFixed(1)}
            </span>
          </div>
        )}
      </div>
      
      <div className="p-5">
        <h3 className="text-xl font-bold text-gray-900 truncate">{tour.title}</h3>
        <p className="text-gray-600 mt-1">{tour.location}</p>
        
        <div className="mt-3 flex items-center text-sm text-gray-500">
          <ClockIcon className="h-5 w-5 mr-1 text-gray-400" />
          <span>{tour.duration} Days</span>
        </div>
        
        {tour.amenities && tour.amenities.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-1">
            {tour.amenities.slice(0, 3).map((amenity, index) => (
              <span key={index} className="inline-block bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded">
                {amenity}
              </span>
            ))}
            {tour.amenities.length > 3 && (
              <span className="inline-block bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded">+{tour.amenities.length - 3} more</span>
            )}
          </div>
        )}
        
        <div className="flex justify-between items-center mt-4">
          <div>
            <p className="text-2xl font-semibold text-blue-600">{formatINR(tour.price)}</p>
            <p className="text-xs text-gray-500">per person</p>
          </div>
          {tour.availableSeats && (
            <span className="flex items-center text-sm text-gray-500">
              <UsersIcon className="h-4 w-4 mr-1" />
              {tour.availableSeats} seats left
            </span>
          )}
        </div>
        
        <div className="mt-4 flex space-x-2">
          <Link 
            to={`/tours/${tour._id}`} 
            className="flex-1 bg-blue-500 text-white text-center py-2 rounded-lg hover:bg-blue-600 transition-colors flex items-center justify-center"
          >
            <span>View Details</span>
          </Link>
          <Link 
            to={`/tours/${tour._id}?book=true`} 
            className="flex-1 bg-green-500 text-white text-center py-2 rounded-lg hover:bg-green-600 transition-colors flex items-center justify-center"
          >
            <span>Book Now</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default EnhancedTourCard;