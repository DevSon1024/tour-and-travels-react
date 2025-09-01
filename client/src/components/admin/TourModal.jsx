import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';

const TourModal = ({ tour, onSave, onClose }) => {
  const [formData, setFormData] = useState({
    name: '',
    location: '',
    price: '',
    duration: '',
    description: '',
    images: [],
    itinerary: [],
    inclusions: [],
    exclusions: [],
    featured: false,
    status: 'active',
    maxGroupSize: '',
    difficulty: 'Easy'
  });
  const [loading, setLoading] = useState(false);
  const [imageUrls, setImageUrls] = useState(['']);
  const [itineraryItems, setItineraryItems] = useState([{ day: 1, title: '', description: '' }]);
  const [inclusionItems, setInclusionItems] = useState(['']);
  const [exclusionItems, setExclusionItems] = useState(['']);

  useEffect(() => {
    if (tour) {
      setFormData({
        name: tour.name || '',
        location: tour.location || '',
        price: tour.price || '',
        duration: tour.duration || '',
        description: tour.description || '',
        images: tour.images || [],
        itinerary: tour.itinerary || [],
        inclusions: tour.inclusions || [],
        exclusions: tour.exclusions || [],
        featured: tour.featured || false,
        status: tour.status || 'active',
        maxGroupSize: tour.maxGroupSize || '',
        difficulty: tour.difficulty || 'Easy'
      });
      setImageUrls(tour.images?.length > 0 ? tour.images : ['']);
      setItineraryItems(tour.itinerary?.length > 0 ? tour.itinerary : [{ day: 1, title: '', description: '' }]);
      setInclusionItems(tour.inclusions?.length > 0 ? tour.inclusions : ['']);
      setExclusionItems(tour.exclusions?.length > 0 ? tour.exclusions : ['']);
    }
  }, [tour]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleImageUrlChange = (index, value) => {
    const newUrls = [...imageUrls];
    newUrls[index] = value;
    setImageUrls(newUrls);
    setFormData(prev => ({ ...prev, images: newUrls.filter(url => url.trim()) }));
  };

  const addImageUrl = () => {
    setImageUrls([...imageUrls, '']);
  };

  const removeImageUrl = (index) => {
    const newUrls = imageUrls.filter((_, i) => i !== index);
    setImageUrls(newUrls);
    setFormData(prev => ({ ...prev, images: newUrls.filter(url => url.trim()) }));
  };

  const handleItineraryChange = (index, field, value) => {
    const newItems = [...itineraryItems];
    newItems[index] = { ...newItems[index], [field]: value };
    setItineraryItems(newItems);
    setFormData(prev => ({ ...prev, itinerary: newItems.filter(item => item.title.trim()) }));
  };

  const addItineraryItem = () => {
    setItineraryItems([...itineraryItems, { day: itineraryItems.length + 1, title: '', description: '' }]);
  };

  const removeItineraryItem = (index) => {
    const newItems = itineraryItems.filter((_, i) => i !== index);
    setItineraryItems(newItems);
    setFormData(prev => ({ ...prev, itinerary: newItems.filter(item => item.title.trim()) }));
  };

  const handleInclusionChange = (index, value) => {
    const newItems = [...inclusionItems];
    newItems[index] = value;
    setInclusionItems(newItems);
    setFormData(prev => ({ ...prev, inclusions: newItems.filter(item => item.trim()) }));
  };

  const addInclusion = () => {
    setInclusionItems([...inclusionItems, '']);
  };

  const removeInclusion = (index) => {
    const newItems = inclusionItems.filter((_, i) => i !== index);
    setInclusionItems(newItems);
    setFormData(prev => ({ ...prev, inclusions: newItems.filter(item => item.trim()) }));
  };

  const handleExclusionChange = (index, value) => {
    const newItems = [...exclusionItems];
    newItems[index] = value;
    setExclusionItems(newItems);
    setFormData(prev => ({ ...prev, exclusions: newItems.filter(item => item.trim()) }));
  };

  const addExclusion = () => {
    setExclusionItems([...exclusionItems, '']);
  };

  const removeExclusion = (index) => {
    const newItems = exclusionItems.filter((_, i) => i !== index);
    setExclusionItems(newItems);
    setFormData(prev => ({ ...prev, exclusions: newItems.filter(item => item.trim()) }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name || !formData.location || !formData.price || !formData.duration || !formData.maxGroupSize) {
      toast.error('Please fill in all required fields: Name, Location, Price, Duration, and Max Group Size');
      return;
    }

    if (isNaN(formData.price) || formData.price <= 0) {
      toast.error('Price must be a valid positive number');
      return;
    }

    if (isNaN(formData.duration) || formData.duration <= 0) {
      toast.error('Duration must be a valid positive number');
      return;
    }

    if (isNaN(formData.maxGroupSize) || formData.maxGroupSize <= 0) {
      toast.error('Max Group Size must be a valid positive number');
      return;
    }

    setLoading(true);
    try {
      await onSave(formData);
    } catch (error) {
      console.error('Error saving tour:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900">
            {tour ? 'Edit Tour' : 'Add New Tour'}
          </h2>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tour Name *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Location *
              </label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Price (₹) *
              </label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Duration (Days) *
              </label>
              <input
                type="number"
                name="duration"
                value={formData.duration}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Max Group Size *
              </label>
              <input
                type="number"
                name="maxGroupSize"
                value={formData.maxGroupSize}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Difficulty Level
              </label>
              <select
                name="difficulty"
                value={formData.difficulty}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="Easy">Easy</option>
                <option value="Moderate">Moderate</option>
                <option value="Challenging">Challenging</option>
                <option value="Extreme">Extreme</option>
              </select>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              rows="4"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Images */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Image URLs
            </label>
            {imageUrls.map((url, index) => (
              <div key={index} className="flex gap-2 mb-2">
                <input
                  type="url"
                  value={url}
                  onChange={(e) => handleImageUrlChange(index, e.target.value)}
                  placeholder="Enter image URL"
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                {imageUrls.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeImageUrl(index)}
                    className="px-3 py-2 text-red-600 hover:text-red-800"
                  >
                    Remove
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              onClick={addImageUrl}
              className="text-blue-600 hover:text-blue-800 text-sm"
            >
              + Add Image URL
            </button>
          </div>

          {/* Status and Featured */}
          <div className="flex gap-6">
            <div className="flex items-center">
              <input
                type="checkbox"
                name="featured"
                checked={formData.featured}
                onChange={handleInputChange}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label className="ml-2 text-sm font-medium text-gray-700">
                Featured Tour
              </label>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Status
              </label>
              <select
                name="status"
                value={formData.status}
                onChange={handleInputChange}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-4 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors duration-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
            >
              {loading ? 'Saving...' : (tour ? 'Update Tour' : 'Create Tour')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TourModal;
