import React from 'react';
import { CheckIcon, XMarkIcon } from '@heroicons/react/24/outline';

const TourInclusions = ({ inclusions, exclusions }) => {
  return (
    <div className="space-y-6">
      {/* What's Included */}
      <div>
        <h3 className="text-xl font-semibold mb-4 text-green-700">What's Included</h3>
        {inclusions && inclusions.length > 0 ? (
          <div className="space-y-2">
            {inclusions.map((item, index) => (
              <div key={index} className="flex items-start">
                <CheckIcon className="h-5 w-5 text-green-600 mr-3 mt-0.5 flex-shrink-0" />
                <span className="text-gray-700">{item}</span>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="space-y-2">
              <div className="flex items-start">
                <CheckIcon className="h-5 w-5 text-green-600 mr-3 mt-0.5 flex-shrink-0" />
                <span className="text-gray-700">Professional tour guide</span>
              </div>
              <div className="flex items-start">
                <CheckIcon className="h-5 w-5 text-green-600 mr-3 mt-0.5 flex-shrink-0" />
                <span className="text-gray-700">Transportation as per itinerary</span>
              </div>
              <div className="flex items-start">
                <CheckIcon className="h-5 w-5 text-green-600 mr-3 mt-0.5 flex-shrink-0" />
                <span className="text-gray-700">Entry fees to attractions mentioned</span>
              </div>
              <div className="flex items-start">
                <CheckIcon className="h-5 w-5 text-green-600 mr-3 mt-0.5 flex-shrink-0" />
                <span className="text-gray-700">24/7 customer support</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* What's Not Included */}
      <div>
        <h3 className="text-xl font-semibold mb-4 text-red-700">What's Not Included</h3>
        {exclusions && exclusions.length > 0 ? (
          <div className="space-y-2">
            {exclusions.map((item, index) => (
              <div key={index} className="flex items-start">
                <XMarkIcon className="h-5 w-5 text-red-600 mr-3 mt-0.5 flex-shrink-0" />
                <span className="text-gray-700">{item}</span>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="space-y-2">
              <div className="flex items-start">
                <XMarkIcon className="h-5 w-5 text-red-600 mr-3 mt-0.5 flex-shrink-0" />
                <span className="text-gray-700">Personal expenses and shopping</span>
              </div>
              <div className="flex items-start">
                <XMarkIcon className="h-5 w-5 text-red-600 mr-3 mt-0.5 flex-shrink-0" />
                <span className="text-gray-700">Meals not mentioned in itinerary</span>
              </div>
              <div className="flex items-start">
                <XMarkIcon className="h-5 w-5 text-red-600 mr-3 mt-0.5 flex-shrink-0" />
                <span className="text-gray-700">Travel insurance</span>
              </div>
              <div className="flex items-start">
                <XMarkIcon className="h-5 w-5 text-red-600 mr-3 mt-0.5 flex-shrink-0" />
                <span className="text-gray-700">Tips and gratuities</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Important Notes */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <h4 className="font-semibold text-yellow-800 mb-2">Important Notes</h4>
        <ul className="text-sm text-yellow-700 space-y-1">
          <li>• All inclusions are subject to availability and may vary based on season</li>
          <li>• Additional charges may apply for optional activities</li>
          <li>• Please confirm specific inclusions with our team before booking</li>
          <li>• Cancellation and refund policies apply as per terms and conditions</li>
        </ul>
      </div>
    </div>
  );
};

export default TourInclusions;
