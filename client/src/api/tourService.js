import api from './api';

// Tour Service - handles all tour-related API calls
const tourService = {
  // Get all tours with optional filters
  getAllTours: async (filters = {}) => {
    try {
      const queryParams = new URLSearchParams();
      
      // Add filters to query params
      Object.keys(filters).forEach(key => {
        if (filters[key] !== undefined && filters[key] !== '') {
          queryParams.append(key, filters[key]);
        }
      });
      
      const queryString = queryParams.toString();
      const url = queryString ? `/tours?${queryString}` : '/tours';
      
      const response = await api.get(url);
      return response.data;
    } catch (error) {
      console.error('Error fetching tours:', error);
      throw error;
    }
  },

  // Get tour by ID
  getTourById: async (tourId) => {
    try {
      const response = await api.get(`/tours/${tourId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching tour details:', error);
      throw error;
    }
  },

  // Get featured tours
  getFeaturedTours: async (limit = 6) => {
    try {
      const response = await api.get(`/tours?featured=true&limit=${limit}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching featured tours:', error);
      throw error;
    }
  },

  // Search tours
  searchTours: async (searchQuery, filters = {}) => {
    try {
      const queryParams = new URLSearchParams();
      queryParams.append('search', searchQuery);
      
      // Add additional filters
      Object.keys(filters).forEach(key => {
        if (filters[key] !== undefined && filters[key] !== '') {
          queryParams.append(key, filters[key]);
        }
      });
      
      const response = await api.get(`/tours?${queryParams.toString()}`);
      return response.data;
    } catch (error) {
      console.error('Error searching tours:', error);
      throw error;
    }
  },

  // Get tours by location
  getToursByLocation: async (location) => {
    try {
      const response = await api.get(`/tours?location=${encodeURIComponent(location)}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching tours by location:', error);
      throw error;
    }
  },

  // Get tours by price range
  getToursByPriceRange: async (minPrice, maxPrice) => {
    try {
      const response = await api.get(`/tours?minPrice=${minPrice}&maxPrice=${maxPrice}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching tours by price range:', error);
      throw error;
    }
  }
};

export default tourService;