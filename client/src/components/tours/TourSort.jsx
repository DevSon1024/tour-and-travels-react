import React from 'react';

const TourSort = ({ sortOption, setSortOption }) => {
  const sortOptions = [
    { value: 'price-low', label: 'Price: Low to High' },
    { value: 'price-high', label: 'Price: High to Low' },
    { value: 'duration-short', label: 'Duration: Shortest First' },
    { value: 'duration-long', label: 'Duration: Longest First' },
    { value: 'popularity', label: 'Most Popular' },
  ];

  return (
    <div className="flex items-center space-x-2 mb-6">
      <label htmlFor="sort" className="text-gray-700 font-medium">Sort by:</label>
      <select
        id="sort"
        value={sortOption}
        onChange={(e) => setSortOption(e.target.value)}
        className="border border-gray-300 rounded-md shadow-sm py-2 px-3 bg-white focus:outline-none focus:ring-blue-500 focus:border-blue-500"
      >
        {sortOptions.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
};

export default TourSort;