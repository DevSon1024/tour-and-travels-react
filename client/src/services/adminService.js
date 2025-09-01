import api from '../api/api';

class AdminService {
  // Dashboard Stats
  async getDashboardStats() {
    try {
      const response = await api.get('/admin/stats');
      return response.data;
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      throw error;
    }
  }

  async getRecentActivity() {
    try {
      const response = await api.get('/admin/activity');
      return response.data;
    } catch (error) {
      console.error('Error fetching recent activity:', error);
      throw error;
    }
  }

  // Tour Management
  async getAllTours() {
    try {
      const response = await api.get('/admin/tours');
      return response.data;
    } catch (error) {
      console.error('Error fetching tours:', error);
      throw error;
    }
  }

  async createTour(tourData) {
    try {
      const response = await api.post('/admin/tours', tourData);
      return response.data;
    } catch (error) {
      console.error('Error creating tour:', error);
      throw error;
    }
  }

  async updateTour(tourId, tourData) {
    try {
      const response = await api.put(`/admin/tours/${tourId}`, tourData);
      return response.data;
    } catch (error) {
      console.error('Error updating tour:', error);
      throw error;
    }
  }

  async deleteTour(tourId) {
    try {
      const response = await api.delete(`/admin/tours/${tourId}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting tour:', error);
      throw error;
    }
  }

  // Booking Management
  async getAllBookings() {
    try {
      const response = await api.get('/admin/bookings');
      return response.data;
    } catch (error) {
      console.error('Error fetching bookings:', error);
      throw error;
    }
  }

  async updateBookingStatus(bookingId, status) {
    try {
      const response = await api.put(`/admin/bookings/${bookingId}/status`, { status });
      return response.data;
    } catch (error) {
      console.error('Error updating booking status:', error);
      throw error;
    }
  }

  async deleteBooking(bookingId) {
    try {
      const response = await api.delete(`/admin/bookings/${bookingId}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting booking:', error);
      throw error;
    }
  }

  // User Management
  async getAllUsers() {
    try {
      const response = await api.get('/admin/users');
      return response.data;
    } catch (error) {
      console.error('Error fetching users:', error);
      throw error;
    }
  }

  async updateUserStatus(userId, status) {
    try {
      const response = await api.put(`/admin/users/${userId}/status`, { status });
      return response.data;
    } catch (error) {
      console.error('Error updating user status:', error);
      throw error;
    }
  }

  async deleteUser(userId) {
    try {
      const response = await api.delete(`/admin/users/${userId}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting user:', error);
      throw error;
    }
  }

  async resetUserPassword(userId) {
    try {
      const response = await api.post(`/admin/users/${userId}/reset-password`);
      return response.data;
    } catch (error) {
      console.error('Error resetting user password:', error);
      throw error;
    }
  }

  // Analytics
  async getAnalytics(period = '30d') {
    try {
      const response = await api.get(`/admin/analytics?period=${period}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching analytics:', error);
      throw error;
    }
  }

  async getBookingTrends() {
    try {
      const response = await api.get('/admin/analytics/booking-trends');
      return response.data;
    } catch (error) {
      console.error('Error fetching booking trends:', error);
      throw error;
    }
  }

  async getRevenueTrends() {
    try {
      const response = await api.get('/admin/analytics/revenue-trends');
      return response.data;
    } catch (error) {
      console.error('Error fetching revenue trends:', error);
      throw error;
    }
  }
}

export const adminService = new AdminService();
export default adminService;
