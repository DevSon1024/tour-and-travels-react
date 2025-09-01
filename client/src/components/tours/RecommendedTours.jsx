import React from 'react';
import EnhancedTourCard from './EnhancedTourCard';

const RecommendedTours = ({ tours }) => {
  // Get top 3 tours based on some criteria (e.g., popularity, rating, etc.)
  // For now, we'll just take the first 3 tours
  const recommendedTours = tours.slice(0, 3);

  return (
    <div className="mb-10">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Recommended Tours</h2>
        <a href="#all-tours" className="text-blue-600 hover:text-blue-800 text-sm font-medium">
          View All Tours
        </a>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {recommendedTours.map(tour => (
          <EnhancedTourCard key={tour._id} tour={tour} />
        ))}
      </div>
    </div>
  );
};

export default RecommendedTours;