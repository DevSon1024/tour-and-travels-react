import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import AdminSidebar from '../../../components/admin/AdminSidebar';
import AdminHeader from '../../../components/admin/AdminHeader';
import { adminService } from '../../../services/adminService';
import { toast } from 'react-hot-toast';
import ConfirmModal from '../../../components/admin/ConfirmModal';
import BookingDetailsModal from '../../../components/admin/BookingDetailsModal';

const ManageBookings = () => {
  const location = useLocation();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingBookings, setUpdatingBookings] = useState(new Set());
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortBy, setSortBy] = useState('date');
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [confirmAction, setConfirmAction] = useState(null);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const data = await adminService.getAllBookings();
      setBookings(data);
    } catch (error) {
      toast.error('Failed to fetch bookings');
      console.error('Error fetching bookings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (bookingId, newStatus) => {
    setUpdatingBookings(prev => new Set(prev).add(bookingId));
    
    try {
      const response = await adminService.updateBookingStatus(bookingId, newStatus);
      
      // Check for successful response
      if (response && response.success && response.booking) {
        // Update the booking in state immediately
        setBookings(prevBookings => 
          prevBookings.map(booking => 
            booking._id === bookingId ? { ...booking, status: newStatus } : booking
          )
        );
        
        // Show success message from backend or use default
        const successMessage = response.message || `Booking ${newStatus} successfully!`;
        toast.success(successMessage);
      } else {
        throw new Error('Invalid response from server');
      }
    } catch (error) {
      console.error('Error updating booking status:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Failed to update booking status';
      toast.error(errorMessage);
    } finally {
      setUpdatingBookings(prev => {
        const newSet = new Set(prev);
        newSet.delete(bookingId);
        return newSet;
      });
    }
  };

  const handleDeleteBooking = async (bookingId) => {
    setUpdatingBookings(prev => new Set(prev).add(bookingId));
    
    try {
      const response = await adminService.deleteBooking(bookingId);
      
      // Check for successful response
      if (response && response.success) {
        // Remove booking from state immediately
        setBookings(prevBookings => prevBookings.filter(booking => booking._id !== bookingId));
        
        // Show success message from backend or use default
        const successMessage = response.message || 'Booking deleted successfully';
        toast.success(successMessage);
      } else {
        throw new Error('Invalid response from server');
      }
    } catch (error) {
      console.error('Error deleting booking:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Failed to delete booking';
      toast.error(errorMessage);
    } finally {
      setUpdatingBookings(prev => {
        const newSet = new Set(prev);
        newSet.delete(bookingId);
        return newSet;
      });
    }
  };

  const openConfirmModal = (action, booking) => {
    setConfirmAction({ action, booking });
    setShowConfirmModal(true);
  };

  const handleConfirmAction = async () => {
    const { action, booking } = confirmAction;
    
    if (action === 'delete') {
      await handleDeleteBooking(booking._id);
    } else {
      await handleStatusUpdate(booking._id, action);
    }
    
    setShowConfirmModal(false);
    setConfirmAction(null);
  };

  const openBookingDetails = (booking) => {
    setSelectedBooking(booking);
    setShowDetailsModal(true);
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      pending: { bg: 'bg-yellow-50', text: 'text-yellow-700', border: 'border-yellow-200' },
      confirmed: { bg: 'bg-green-50', text: 'text-green-700', border: 'border-green-200' },
      cancelled: { bg: 'bg-red-50', text: 'text-red-700', border: 'border-red-200' },
      completed: { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200' }
    };
    
    const config = statusConfig[status] || statusConfig.pending;
    
    return (
      <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium border ${config.bg} ${config.text} ${config.border}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  // Filter and sort bookings
  const filteredBookings = bookings
    .filter(booking => {
      const matchesSearch = 
        booking.user?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        booking.tourPackage?.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        booking.bookingReference?.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = statusFilter === 'all' || booking.status === statusFilter;
      
      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'date':
          return new Date(b.createdAt) - new Date(a.createdAt);
        case 'customer':
          return a.user?.name?.localeCompare(b.user?.name) || 0;
        case 'tour':
          return a.tourPackage?.title?.localeCompare(b.tourPackage?.title) || 0;
        case 'amount':
          return (b.totalAmount || 0) - (a.totalAmount || 0);
        default:
          return 0;
      }
    });

  return (
    <div className="flex min-h-screen bg-gray-50">
      <AdminSidebar />
      <div className="flex-1">
        <AdminHeader />
        <main className="p-6">
          <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="mb-8">
              <h1 className="text-2xl font-bold text-gray-900">Manage Bookings</h1>
              <p className="mt-1 text-sm text-gray-600">View and manage all tour bookings</p>
            </div>
            
            {/* Filters */}
            <div className="mb-6 bg-white rounded-lg border border-gray-200 p-4">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                  <input
                    type="text"
                    placeholder="Search by customer, tour, or booking ID..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="all">All Status</option>
                  <option value="pending">Pending</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="cancelled">Cancelled</option>
                  <option value="completed">Completed</option>
                </select>
                
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="date">Sort by Date</option>
                  <option value="customer">Sort by Customer</option>
                  <option value="tour">Sort by Tour</option>
                  <option value="amount">Sort by Amount</option>
                </select>
              </div>
              
              <div className="mt-3 text-sm text-gray-600">
                Showing {filteredBookings.length} of {bookings.length} bookings
              </div>
            </div>
            
            {/* Table */}
            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
              {loading ? (
                <div className="p-12 text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                  <p className="mt-4 text-gray-600">Loading bookings...</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-200">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Booking ID</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Customer</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tour</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {filteredBookings.length > 0 ? (
                        filteredBookings.map((booking) => (
                          <tr key={booking._id} className="hover:bg-gray-50">
                            <td className="px-4 py-3 text-sm font-medium text-gray-900">
                              #{booking.bookingReference || booking._id.slice(-6)}
                            </td>
                            <td className="px-4 py-3">
                              <div className="text-sm font-medium text-gray-900">{booking.user?.name}</div>
                              <div className="text-xs text-gray-500">{booking.user?.email}</div>
                            </td>
                            <td className="px-4 py-3">
                              <div className="text-sm font-medium text-gray-900">{booking.tourPackage?.title}</div>
                              <div className="text-xs text-gray-500">{booking.tourPackage?.location}</div>
                            </td>
                            <td className="px-4 py-3 text-sm text-gray-900">
                              {new Date(booking.tourDate || booking.createdAt).toLocaleDateString()}
                            </td>
                            <td className="px-4 py-3 text-sm font-medium text-gray-900">
                              ₹{booking.totalAmount?.toLocaleString()}
                            </td>
                            <td className="px-4 py-3">
                              {getStatusBadge(booking.status)}
                            </td>
                            <td className="px-4 py-3">
                              <div className="flex items-center space-x-2">
                                <button
                                  onClick={() => openBookingDetails(booking)}
                                  className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                                >
                                  View
                                </button>
                                
                                {booking.status === 'pending' && (
                                  <>
                                    <button
                                      onClick={() => openConfirmModal('confirmed', booking)}
                                      disabled={updatingBookings.has(booking._id)}
                                      className={`text-green-600 hover:text-green-800 text-sm font-medium ${
                                        updatingBookings.has(booking._id) ? 'opacity-50 cursor-not-allowed' : ''
                                      }`}
                                    >
                                      {updatingBookings.has(booking._id) ? 'Processing...' : 'Approve'}
                                    </button>
                                    <button
                                      onClick={() => openConfirmModal('cancelled', booking)}
                                      disabled={updatingBookings.has(booking._id)}
                                      className={`text-red-600 hover:text-red-800 text-sm font-medium ${
                                        updatingBookings.has(booking._id) ? 'opacity-50 cursor-not-allowed' : ''
                                      }`}
                                    >
                                      {updatingBookings.has(booking._id) ? 'Processing...' : 'Reject'}
                                    </button>
                                  </>
                                )}
                                
                                {booking.status === 'confirmed' && (
                                  <button
                                    onClick={() => openConfirmModal('completed', booking)}
                                    disabled={updatingBookings.has(booking._id)}
                                    className={`text-purple-600 hover:text-purple-800 text-sm font-medium ${
                                      updatingBookings.has(booking._id) ? 'opacity-50 cursor-not-allowed' : ''
                                    }`}
                                  >
                                    {updatingBookings.has(booking._id) ? 'Processing...' : 'Complete'}
                                  </button>
                                )}
                                
                                <button
                                  onClick={() => openConfirmModal('delete', booking)}
                                  disabled={updatingBookings.has(booking._id)}
                                  className={`text-red-600 hover:text-red-800 text-sm font-medium ${
                                    updatingBookings.has(booking._id) ? 'opacity-50 cursor-not-allowed' : ''
                                  }`}
                                >
                                  {updatingBookings.has(booking._id) ? 'Processing...' : 'Delete'}
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="7" className="px-4 py-12 text-center text-gray-500">
                            {searchTerm || statusFilter !== 'all' ? 'No bookings match your filters' : 'No bookings found'}
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* Modals */}
            {showConfirmModal && confirmAction && (
              <ConfirmModal
                title={`${confirmAction.action === 'delete' ? 'Delete' : confirmAction.action.charAt(0).toUpperCase() + confirmAction.action.slice(1)} Booking`}
                message={`Are you sure you want to ${confirmAction.action === 'delete' ? 'delete' : confirmAction.action} this booking?`}
                confirmText={confirmAction.action === 'delete' ? 'Delete' : 'Confirm'}
                confirmColor={confirmAction.action === 'delete' ? 'red' : 'blue'}
                onConfirm={handleConfirmAction}
                onCancel={() => {
                  setShowConfirmModal(false);
                  setConfirmAction(null);
                }}
              />
            )}

            {showDetailsModal && selectedBooking && (
              <BookingDetailsModal
                booking={selectedBooking}
                onClose={() => {
                  setShowDetailsModal(false);
                  setSelectedBooking(null);
                }}
                onStatusUpdate={handleStatusUpdate}
              />
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default ManageBookings;