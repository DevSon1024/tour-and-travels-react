import React, { useState, useEffect } from 'react';
import AdminSidebar from '../../../components/admin/AdminSidebar';
import { adminService } from '../../../services/adminService';
import { toast } from 'react-hot-toast';
import { formatINR } from '../../../utils/currency';
import TourModal from '../../../components/admin/TourModal';
import ConfirmModal from '../../../components/admin/ConfirmModal';

const ManageTours = () => {
  const [tours, setTours] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingTour, setEditingTour] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [tourToDelete, setTourToDelete] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('title');
  const [filterBy, setFilterBy] = useState('all');

  useEffect(() => {
    fetchTours();
  }, []);

  const fetchTours = async () => {
    try {
      setLoading(true);
      const data = await adminService.getAllTours();
      setTours(data);
    } catch (error) {
      toast.error('Failed to fetch tours');
      console.error('Error fetching tours:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddTour = () => {
    setEditingTour(null);
    setShowModal(true);
  };

  const handleEditTour = (tour) => {
    setEditingTour(tour);
    setShowModal(true);
  };

  const handleDeleteTour = (tour) => {
    setTourToDelete(tour);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    try {
      await adminService.deleteTour(tourToDelete._id);
      setTours(tours.filter(tour => tour._id !== tourToDelete._id));
      toast.success('Tour deleted successfully');
      setShowDeleteModal(false);
      setTourToDelete(null);
    } catch (error) {
      toast.error('Failed to delete tour');
      console.error('Error deleting tour:', error);
    }
  };

  const handleSaveTour = async (tourData) => {
    try {
      if (editingTour) {
        const response = await adminService.updateTour(editingTour._id, tourData);
        const updatedTour = response.data || response;
        setTours(tours.map(tour => 
          tour._id === editingTour._id ? updatedTour : tour
        ));
        toast.success('Tour updated successfully');
      } else {
        const response = await adminService.createTour(tourData);
        const newTour = response.data || response;
        setTours([newTour, ...tours]); // Add new tour at the beginning
        toast.success('Tour created successfully');
      }
      setShowModal(false);
      setEditingTour(null);
    } catch (error) {
      console.error('Error saving tour:', error);
      
      // Extract error message from response
      let errorMessage = 'Failed to save tour';
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      toast.error(errorMessage);
    }
  };

  // Filter and sort tours
  const filteredTours = tours
    .filter(tour => {
      const matchesSearch = tour.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           tour.location?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesFilter = filterBy === 'all' || 
                           (filterBy === 'featured' && tour.featured) ||
                           (filterBy === 'active' && tour.status === 'active') ||
                           (filterBy === 'inactive' && tour.status === 'inactive');
      return matchesSearch && matchesFilter;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'title':
          return a.title?.localeCompare(b.title) || 0;
        case 'price':
          return (a.price || 0) - (b.price || 0);
        case 'duration':
          return (a.duration || 0) - (b.duration || 0);
        case 'created':
          return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
        default:
          return 0;
      }
    });

  return (
    <div className="flex min-h-[calc(100vh-140px)]">
      <AdminSidebar />
      <main className="flex-1 p-8 bg-gray-50">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Manage Tours</h1>
          <p className="mt-2 text-gray-600">Add, edit, or delete tour packages.</p>
        </div>
        
        {/* Controls */}
        <div className="mb-6 bg-white p-6 rounded-lg shadow-md">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search tours..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <svg className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="title">Sort by Title</option>
                <option value="price">Sort by Price</option>
                <option value="duration">Sort by Duration</option>
                <option value="created">Sort by Created Date</option>
              </select>
              
              <select
                value={filterBy}
                onChange={(e) => setFilterBy(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Tours</option>
                <option value="featured">Featured Tours</option>
                <option value="active">Active Tours</option>
                <option value="inactive">Inactive Tours</option>
              </select>
            </div>
            
            <button
              onClick={handleAddTour}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center gap-2"
            >
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
              </svg>
              Add New Tour
            </button>
          </div>
        </div>
        
        {/* Tours Table */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          {loading ? (
            <div className="p-8 text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading tours...</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tour</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Duration</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredTours.length > 0 ? (
                    filteredTours.map((tour) => (
                      <tr key={tour._id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="relative h-12 w-12 rounded-lg overflow-hidden bg-gray-200">
                              {tour.images && tour.images.length > 0 ? (
                                <img
                                  className="h-full w-full object-cover"
                                  src={tour.images[0]}
                                  alt={tour.title}
                                  onError={(e) => {
                                    e.target.style.display = 'none';
                                    e.target.nextSibling.style.display = 'flex';
                                  }}
                                />
                              ) : null}
                              <div 
                                className={`h-full w-full flex items-center justify-center text-xs text-gray-500 ${tour.images && tour.images.length > 0 ? 'hidden' : 'flex'}`}
                                style={{ display: tour.images && tour.images.length > 0 ? 'none' : 'flex' }}
                              >
                                No Image
                              </div>
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">{tour.title}</div>
                              {tour.featured && (
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                                  ⭐ Featured
                                </span>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{tour.location}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{formatINR(tour.price)}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{tour.duration} Days</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            tour.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                          }`}>
                            {tour.status === 'active' ? '🟢 Active' : '🔴 Inactive'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex space-x-2">
                            <button
                              onClick={() => handleEditTour(tour)}
                              className="text-blue-600 hover:text-blue-900 transition-colors duration-200"
                            >
                              ✏️ Edit
                            </button>
                            <button
                              onClick={() => handleDeleteTour(tour)}
                              className="text-red-600 hover:text-red-900 transition-colors duration-200"
                            >
                              🗑️ Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="6" className="px-6 py-12 text-center text-gray-500">
                        {searchTerm || filterBy !== 'all' ? 'No tours match your filters' : 'No tours found'}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Tour Modal */}
        {showModal && (
          <TourModal
            tour={editingTour}
            onSave={handleSaveTour}
            onClose={() => {
              setShowModal(false);
              setEditingTour(null);
            }}
          />
        )}

        {/* Delete Confirmation Modal */}
        {showDeleteModal && (
          <ConfirmModal
            title="Delete Tour"
            message={`Are you sure you want to delete "${tourToDelete?.title}"? This action cannot be undone.`}
            confirmText="Delete"
            confirmColor="red"
            onConfirm={confirmDelete}
            onCancel={() => {
              setShowDeleteModal(false);
              setTourToDelete(null);
            }}
          />
        )}
      </main>
    </div>
  );
};

export default ManageTours;