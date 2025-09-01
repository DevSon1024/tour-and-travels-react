import React, { useState, useEffect } from 'react';
import api from '../../api/api';

const TourForm = ({ tour, onFormSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    location: '',
    price: '',
    duration: '',
    maxGroupSize: '',
    images: '', // Handling as a comma-separated string for simplicity
    transportType: [],
    departureTime: '',
    availableSeats: '',
    amenities: '', // Handling as a comma-separated string for simplicity
    featured: false,
  });

  useEffect(() => {
    if (tour) {
      setFormData({
        title: tour.title,
        description: tour.description,
        location: tour.location,
        price: tour.price,
        duration: tour.duration,
        maxGroupSize: tour.maxGroupSize,
        images: tour.images.join(', '),
        transportType: tour.transportType || [],
        departureTime: tour.departureTime || '',
        availableSeats: tour.availableSeats || '',
        amenities: tour.amenities ? tour.amenities.join(', ') : '',
        featured: tour.featured || false,
      });
    }
  }, [tour]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (type === 'checkbox') {
      setFormData((prev) => ({ ...prev, [name]: checked }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };
  
  const handleTransportTypeChange = (type) => {
    setFormData(prev => {
      const updatedTypes = [...prev.transportType];
      const index = updatedTypes.indexOf(type);
      
      if (index === -1) {
        updatedTypes.push(type);
      } else {
        updatedTypes.splice(index, 1);
      }
      
      return { ...prev, transportType: updatedTypes };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const tourData = {
      ...formData,
      images: formData.images.split(',').map(img => img.trim()),
      amenities: formData.amenities.split(',').map(amenity => amenity.trim()),
    };

    try {
      let response;
      if (tour) {
        // Update existing tour
        response = await api.put(`/tours/${tour._id}`, tourData);
      } else {
        // Create new tour
        response = await api.post('/tours', tourData);
      }
      onFormSubmit(response.data);
    } catch (error) {
      console.error('Failed to save tour', error);
      alert('Error: Could not save tour.');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-2xl">
        <h2 className="text-2xl font-bold mb-6">{tour ? 'Edit Tour' : 'Add New Tour'}</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input name="title" value={formData.title} onChange={handleChange} placeholder="Title" className="w-full p-2 border rounded" required />
          <textarea name="description" value={formData.description} onChange={handleChange} placeholder="Description" className="w-full p-2 border rounded" required />
          <input name="location" value={formData.location} onChange={handleChange} placeholder="Location" className="w-full p-2 border rounded" required />
          <div className="grid grid-cols-3 gap-4">
            <input type="number" name="price" value={formData.price} onChange={handleChange} placeholder="Price ($)" className="w-full p-2 border rounded" required />
            <input type="number" name="duration" value={formData.duration} onChange={handleChange} placeholder="Duration (days)" className="w-full p-2 border rounded" required />
            <input type="number" name="maxGroupSize" value={formData.maxGroupSize} onChange={handleChange} placeholder="Group Size" className="w-full p-2 border rounded" required />
          </div>
          <input name="images" value={formData.images} onChange={handleChange} placeholder="Image URLs (comma-separated)" className="w-full p-2 border rounded" />
          
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Transport Type</label>
            <div className="flex space-x-4">
              <label className="inline-flex items-center">
                <input 
                  type="checkbox" 
                  checked={formData.transportType.includes('bus')}
                  onChange={() => handleTransportTypeChange('bus')}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <span className="ml-2 text-gray-700">Bus</span>
              </label>
              <label className="inline-flex items-center">
                <input 
                  type="checkbox" 
                  checked={formData.transportType.includes('train')}
                  onChange={() => handleTransportTypeChange('train')}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <span className="ml-2 text-gray-700">Train</span>
              </label>
            </div>
          </div>
          
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700">Departure Time</label>
            <input name="departureTime" value={formData.departureTime} onChange={handleChange} placeholder="e.g. 10:00 AM" className="w-full p-2 border rounded" />
          </div>
          
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700">Available Seats</label>
            <input type="number" name="availableSeats" value={formData.availableSeats} onChange={handleChange} placeholder="Number of available seats" className="w-full p-2 border rounded" />
          </div>
          
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700">Amenities</label>
            <input name="amenities" value={formData.amenities} onChange={handleChange} placeholder="Amenities (comma-separated)" className="w-full p-2 border rounded" />
          </div>
          
          <div className="mt-4">
            <label className="inline-flex items-center">
              <input 
                type="checkbox" 
                name="featured"
                checked={formData.featured}
                onChange={handleChange}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <span className="ml-2 text-gray-700">Featured Tour (will appear in recommended section)</span>
            </label>
          </div>
          
          <div className="flex justify-end space-x-4 mt-6">
            <button type="button" onClick={onCancel} className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400">Cancel</button>
            <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">Save Tour</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TourForm;