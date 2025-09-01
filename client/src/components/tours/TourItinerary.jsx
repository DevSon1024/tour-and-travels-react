import React from 'react';
import { ClockIcon, MapPinIcon } from '@heroicons/react/24/outline';

const TourItinerary = ({ itinerary }) => {
  if (!itinerary || itinerary.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-600">Detailed itinerary will be provided upon booking.</p>
        <p className="text-sm text-gray-500 mt-2">Contact us for more information about daily activities.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold mb-4">Day-by-Day Itinerary</h3>
      
      <div className="space-y-4">
        {itinerary.map((day, index) => (
          <div key={index} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow duration-200">
            <div className="flex items-start space-x-4">
              {/* Day Number */}
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">
                  {day.day}
                </div>
              </div>
              
              {/* Day Content */}
              <div className="flex-grow">
                <h4 className="text-lg font-semibold text-gray-900 mb-2">
                  Day {day.day}: {day.title}
                </h4>
                
                <p className="text-gray-700 mb-3 leading-relaxed">
                  {day.description}
                </p>
                
                {/* Activities */}
                {day.activities && day.activities.length > 0 && (
                  <div className="mt-4">
                    <h5 className="text-sm font-medium text-gray-900 mb-2 flex items-center">
                      <ClockIcon className="h-4 w-4 mr-1" />
                      Activities
                    </h5>
                    <ul className="space-y-1">
                      {day.activities.map((activity, actIndex) => (
                        <li key={actIndex} className="flex items-start">
                          <div className="w-2 h-2 bg-blue-400 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                          <span className="text-gray-600 text-sm">{activity}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {/* Summary */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-6">
        <div className="flex items-center">
          <MapPinIcon className="h-5 w-5 text-blue-600 mr-2" />
          <span className="text-blue-800 font-medium">
            Total Duration: {itinerary.length} {itinerary.length === 1 ? 'Day' : 'Days'}
          </span>
        </div>
        <p className="text-blue-700 text-sm mt-1">
          All activities are subject to weather conditions and local availability.
        </p>
      </div>
    </div>
  );
};

export default TourItinerary;
