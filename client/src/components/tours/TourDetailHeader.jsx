import React from 'react';
import { BusIcon, TrainIcon, ClockIcon, UsersIcon, LocationIcon, PriceTagIcon } from '../icons/TransportIcons';

const TourDetailHeader = ({ tour }) => {
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

  return (
    <div className="relative bg-gradient-to-r from-blue-600 to-teal-500 overflow-hidden">
      <div 
        className="absolute inset-0 bg-cover bg-center opacity-20" 
        style={{ 
          backgroundImage: `url(${tour.images[0] || `https://picsum.photos/seed/${tour._id}/1200/600`})` 
        }}
      ></div>
      <div className="relative max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
        <div className="text-center md:text-left">
          <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl mb-4">
            {tour.title}
          </h1>
          
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 mb-6">
            <div className="flex items-center text-white">
              <LocationIcon className="h-5 w-5 mr-1" />
              <span>{tour.location}</span>
            </div>
            
            {tour.transportType && tour.transportType.map((type, index) => (
              <span key={index}>{renderTransportIcon(type)}</span>
            ))}
            
            <div className="flex items-center text-white">
              <ClockIcon className="h-5 w-5 mr-1" />
              <span>{tour.duration} Days</span>
            </div>
            
            {tour.availableSeats && (
              <div className="flex items-center text-white">
                <UsersIcon className="h-5 w-5 mr-1" />
                <span>{tour.availableSeats} seats left</span>
              </div>
            )}
          </div>
          
          <div className="flex items-center justify-center md:justify-start text-white text-2xl font-bold">
            <PriceTagIcon className="h-6 w-6 mr-2" />
            <span>${tour.price}</span>
            <span className="text-sm font-normal ml-1">per person</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TourDetailHeader;