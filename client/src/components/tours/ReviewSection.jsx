import React, { useState } from 'react';
import { StarIcon, UserIcon } from '@heroicons/react/24/solid';
import { StarIcon as StarOutlineIcon } from '@heroicons/react/24/outline';

const ReviewSection = ({ tourId, reviews = [], averageRating = 0, totalReviews = 0 }) => {
  const [showAllReviews, setShowAllReviews] = useState(false);
  const [newReview, setNewReview] = useState({
    rating: 5,
    title: '',
    comment: '',
    name: ''
  });
  const [showReviewForm, setShowReviewForm] = useState(false);

  // Sample reviews if none provided
  const sampleReviews = [
    {
      id: 1,
      name: "Sarah Johnson",
      rating: 5,
      title: "Amazing Experience!",
      comment: "This tour exceeded all my expectations. The guide was knowledgeable, the locations were breathtaking, and everything was well-organized. Highly recommend!",
      date: "2024-01-15",
      verified: true
    },
    {
      id: 2,
      name: "Mike Chen",
      rating: 4,
      title: "Great Value for Money",
      comment: "Really enjoyed this tour. Good balance of activities and free time. The accommodation was comfortable and the food was delicious.",
      date: "2024-01-10",
      verified: true
    },
    {
      id: 3,
      name: "Emma Wilson",
      rating: 5,
      title: "Unforgettable Journey",
      comment: "Every moment was magical. The sunset views were incredible and our guide made sure we had the best experience possible. Will definitely book again!",
      date: "2024-01-05",
      verified: false
    },
    {
      id: 4,
      name: "David Rodriguez",
      rating: 4,
      title: "Well Organized Tour",
      comment: "Professional service and great attention to detail. The itinerary was perfect and we saw all the highlights. Minor issue with pickup timing but overall excellent.",
      date: "2023-12-28",
      verified: true
    }
  ];

  const displayReviews = reviews.length > 0 ? reviews : sampleReviews;
  const displayedReviews = showAllReviews ? displayReviews : displayReviews.slice(0, 3);

  const renderStars = (rating) => {
    return [...Array(5)].map((_, index) => (
      <StarIcon
        key={index}
        className={`h-5 w-5 ${
          index < rating ? 'text-yellow-400' : 'text-gray-300'
        }`}
      />
    ));
  };

  const renderRatingDistribution = () => {
    const distribution = [0, 0, 0, 0, 0];
    displayReviews.forEach(review => {
      if (review.rating >= 1 && review.rating <= 5) {
        distribution[review.rating - 1]++;
      }
    });

    return (
      <div className="space-y-2">
        {[5, 4, 3, 2, 1].map(rating => (
          <div key={rating} className="flex items-center">
            <span className="text-sm font-medium w-3">{rating}</span>
            <StarIcon className="h-4 w-4 text-yellow-400 mx-1" />
            <div className="flex-1 bg-gray-200 rounded-full h-2 mx-2">
              <div
                className="bg-yellow-400 h-2 rounded-full"
                style={{
                  width: `${displayReviews.length > 0 ? (distribution[rating - 1] / displayReviews.length) * 100 : 0}%`
                }}
              ></div>
            </div>
            <span className="text-sm text-gray-600 w-8">
              {distribution[rating - 1]}
            </span>
          </div>
        ))}
      </div>
    );
  };

  const handleSubmitReview = (e) => {
    e.preventDefault();
    // Here you would typically send the review to your backend
    console.log('Submitting review:', newReview);
    setShowReviewForm(false);
    setNewReview({ rating: 5, title: '', comment: '', name: '' });
  };

  const calculateAverageRating = () => {
    if (displayReviews.length === 0) return 0;
    const sum = displayReviews.reduce((acc, review) => acc + review.rating, 0);
    return (sum / displayReviews.length).toFixed(1);
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Customer Reviews</h2>
        
        {/* Rating Summary */}
        <div className="grid md:grid-cols-2 gap-8 mb-8">
          <div className="text-center">
            <div className="text-4xl font-bold text-gray-900 mb-2">
              {calculateAverageRating()}
            </div>
            <div className="flex justify-center mb-2">
              {renderStars(Math.round(calculateAverageRating()))}
            </div>
            <p className="text-gray-600">
              Based on {displayReviews.length} review{displayReviews.length !== 1 ? 's' : ''}
            </p>
          </div>
          
          <div>
            <h3 className="font-semibold mb-3">Rating Distribution</h3>
            {renderRatingDistribution()}
          </div>
        </div>

        {/* Write Review Button */}
        <div className="text-center mb-8">
          <button
            onClick={() => setShowReviewForm(!showReviewForm)}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition duration-300"
          >
            Write a Review
          </button>
        </div>

        {/* Review Form */}
        {showReviewForm && (
          <div className="bg-gray-50 p-6 rounded-lg mb-8">
            <h3 className="text-lg font-semibold mb-4">Share Your Experience</h3>
            <form onSubmit={handleSubmitReview}>
              <div className="grid md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Your Name
                  </label>
                  <input
                    type="text"
                    value={newReview.name}
                    onChange={(e) => setNewReview({...newReview, name: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Rating
                  </label>
                  <select
                    value={newReview.rating}
                    onChange={(e) => setNewReview({...newReview, rating: parseInt(e.target.value)})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {[5, 4, 3, 2, 1].map(rating => (
                      <option key={rating} value={rating}>
                        {rating} Star{rating !== 1 ? 's' : ''}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Review Title
                </label>
                <input
                  type="text"
                  value={newReview.title}
                  onChange={(e) => setNewReview({...newReview, title: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Summarize your experience"
                  required
                />
              </div>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Your Review
                </label>
                <textarea
                  value={newReview.comment}
                  onChange={(e) => setNewReview({...newReview, comment: e.target.value})}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Tell others about your experience..."
                  required
                />
              </div>
              
              <div className="flex gap-3">
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition duration-300"
                >
                  Submit Review
                </button>
                <button
                  type="button"
                  onClick={() => setShowReviewForm(false)}
                  className="bg-gray-300 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-400 transition duration-300"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Reviews List */}
        <div className="space-y-6">
          {displayedReviews.map((review) => (
            <div key={review.id} className="border-b border-gray-200 pb-6 last:border-b-0">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center">
                  <div className="bg-gray-300 rounded-full p-2 mr-3">
                    <UserIcon className="h-6 w-6 text-gray-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 flex items-center">
                      {review.name}
                      {review.verified && (
                        <span className="ml-2 bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                          Verified
                        </span>
                      )}
                    </h4>
                    <p className="text-sm text-gray-600">
                      {new Date(review.date).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </p>
                  </div>
                </div>
                <div className="flex items-center">
                  {renderStars(review.rating)}
                </div>
              </div>
              
              <h5 className="font-medium text-gray-900 mb-2">{review.title}</h5>
              <p className="text-gray-700 leading-relaxed">{review.comment}</p>
            </div>
          ))}
        </div>

        {/* Show More/Less Button */}
        {displayReviews.length > 3 && (
          <div className="text-center mt-6">
            <button
              onClick={() => setShowAllReviews(!showAllReviews)}
              className="text-blue-600 hover:text-blue-800 font-medium"
            >
              {showAllReviews 
                ? `Show Less Reviews` 
                : `Show All ${displayReviews.length} Reviews`
              }
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReviewSection;