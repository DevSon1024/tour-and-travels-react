import React from 'react';
import { Link } from 'react-router-dom';
import AutoImageSlider from '../common/AutoImageSlider';
import { formatINR } from '../../utils/currency';
import { 
  MapPinIcon as LocationIcon, 
  ClockIcon, 
  UserGroupIcon as UsersIcon,
  TagIcon as PriceTagIcon
} from '@heroicons/react/24/outline';

const TourListItem = ({ tour }) => {
  // Function to render transport type icon
  const renderTransportIcon = (type) => {
    if (type === 'bus') {
      return (
        <div className="flex items-center bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h8m-8 5h8m-4 5v-5m-8-9h16a2 2 0 012 2v12a2 2 0 01-2 2h-16a2 2 0 01-2-2V5a2 2 0 012-2z" />
          </svg>
          Bus
        </div>
      );
    } else if (type === 'train') {
      return (
        <div className="flex items-center bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Train
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden mb-4 hover:shadow-lg transition-shadow duration-300">
      <div className="md:flex">
        <div className="md:w-1/3 relative">
          {tour.images && tour.images.length > 0 ? (
            <AutoImageSlider
              images={tour.images}
              autoSlideInterval={5000}
              showNavigation={true}
              showDots={tour.images.length > 1}
              className="w-full h-48 md:h-full"
              imageClassName="w-full h-48 md:h-full object-cover"
              alt={tour.title}
            />
          ) : (
            <div className="w-full h-48 md:h-full bg-gray-200 flex items-center justify-center">
              <div className="text-center text-gray-500">
                <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <p className="mt-2 text-sm">No Image Available</p>
              </div>
            </div>
          )}
          {/* Transport type badge */}
          <div className="absolute top-3 right-3 flex space-x-2 z-10">
            {tour.transportType && tour.transportType.map(type => (
              <span key={type}>{renderTransportIcon(type)}</span>
            ))}
          </div>
        </div>
        
        <div className="md:w-2/3 p-6">
          <div className="flex justify-between items-start">
              <div>
                <h3 className="text-xl font-bold text-gray-900">{tour.title}</h3>
                <div className="flex items-center text-sm text-gray-500 mb-1">
                  <LocationIcon className="h-4 w-4 mr-1 text-gray-400" />
                  <span>{tour.location}</span>
                </div>
              </div>
              <div className="flex items-center text-sm text-gray-500 mb-1">
                <PriceTagIcon className="h-4 w-4 mr-1 text-gray-400" />
                <span className="font-semibold text-blue-600">{formatINR(tour.price)}</span>
              </div>
            </div>
          
          <p className="text-gray-700 mt-3 line-clamp-2">
            {tour.description || 'Experience this amazing tour package with us!'}
          </p>
          
          <div className="mt-4 flex flex-wrap gap-4">
            <div className="flex items-center text-sm text-gray-500">
              <ClockIcon className="h-5 w-5 mr-1 text-gray-400" />
              <span>{tour.duration} Days</span>
            </div>
            
            {tour.departureTime && (
              <div className="flex items-center text-sm text-gray-500">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>Departs: {tour.departureTime}</span>
              </div>
            )}
            
            {tour.availableSeats && (
              <div className="flex items-center text-sm text-gray-500">
                <UsersIcon className="h-5 w-5 mr-1 text-gray-400" />
                <span>{tour.availableSeats} seats left</span>
              </div>
            )}
          </div>
          
          {tour.amenities && tour.amenities.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-1">
              {tour.amenities.map((amenity, index) => (
                <span key={index} className="inline-block bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded">
                  {amenity}
                </span>
              ))}
            </div>
          )}
          
          <div className="mt-5 flex space-x-3">
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
    </div>
  );
};

export default TourListItem;