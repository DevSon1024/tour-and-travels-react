import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

const TourCard = ({ tour }) => {
  return (
    <div className="bg-white rounded shadow border overflow-hidden">
      <img 
        src={tour.images?.[0] || `https://picsum.photos/seed/${tour._id}/400/300`} 
        alt={tour.title || 'Tour image'} 
        className="w-full h-56 object-cover"
        onError={(e) => {
          e.target.src = `https://picsum.photos/seed/${tour._id}/400/300`;
        }}
      />
      <div className="p-5">
        <h3 className="text-xl font-bold text-gray-900 truncate">{tour.title}</h3>
        <p className="text-gray-600 mt-1">{tour.location}</p>
        <div className="flex justify-between items-center mt-4">
          <p className="text-2xl font-semibold text-blue-600">₹{tour.price}</p>
          <span className="text-sm text-gray-500 bg-gray-200 px-2 py-1 rounded">{tour.duration} Days</span>
        </div>
        <Link to={`/tours/${tour._id}`} className="block w-full text-center mt-4 bg-blue-500 text-white py-2 rounded hover:bg-blue-600">
          View Details
        </Link>
      </div>
    </div>
  );
};

TourCard.propTypes = {
  tour: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    location: PropTypes.string.isRequired,
    price: PropTypes.number.isRequired,
    duration: PropTypes.number.isRequired,
    images: PropTypes.array
  }).isRequired
};

export default React.memo(TourCard);