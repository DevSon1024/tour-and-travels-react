import React, { useState, useEffect } from 'react';
import AdminSidebar from '../../../components/admin/AdminSidebar';
import { adminService } from '../../../services/adminService';
import { toast } from 'react-hot-toast';
import ConfirmModal from '../../../components/admin/ConfirmModal';

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortBy, setSortBy] = useState('name');
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [confirmAction, setConfirmAction] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const data = await adminService.getAllUsers();
      setUsers(data);
    } catch (error) {
      toast.error('Failed to fetch users');
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUserStatusUpdate = async (userId, status) => {
    try {
      await adminService.updateUserStatus(userId, status);
      setUsers(users.map(user => 
        user._id === userId ? { ...user, status } : user
      ));
      toast.success(`User ${status} successfully`);
    } catch (error) {
      toast.error(`Failed to ${status} user`);
      console.error('Error updating user status:', error);
    }
  };

  const handleDeleteUser = async (userId) => {
    try {
      await adminService.deleteUser(userId);
      setUsers(users.filter(user => user._id !== userId));
      toast.success('User deleted successfully');
    } catch (error) {
      toast.error('Failed to delete user');
      console.error('Error deleting user:', error);
    }
  };

  const handleResetPassword = async (userId) => {
    try {
      const result = await adminService.resetUserPassword(userId);
      toast.success(`Password reset successfully. New password: ${result.newPassword}`);
    } catch (error) {
      toast.error('Failed to reset password');
      console.error('Error resetting password:', error);
    }
  };

  const openConfirmModal = (action, user) => {
    setConfirmAction({ action, user });
    setShowConfirmModal(true);
  };

  const handleConfirmAction = async () => {
    const { action, user } = confirmAction;
    
    switch (action) {
      case 'delete':
        await handleDeleteUser(user._id);
        break;
      case 'activate':
        await handleUserStatusUpdate(user._id, 'active');
        break;
      case 'deactivate':
        await handleUserStatusUpdate(user._id, 'inactive');
        break;
      case 'resetPassword':
        await handleResetPassword(user._id);
        break;
      default:
        break;
    }
    
    setShowConfirmModal(false);
    setConfirmAction(null);
  };

  const getUserStatusBadge = (status) => {
    const isActive = status === 'active' || !status;
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
        isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
      }`}>
        {isActive ? '🟢 Active' : '🔴 Inactive'}
      </span>
    );
  };

  const getRoleBadge = (role) => {
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
        role === 'admin' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'
      }`}>
        {role === 'admin' ? '👑 Admin' : '👤 User'}
      </span>
    );
  };

  // Filter and sort users
  const filteredUsers = users
    .filter(user => {
      const matchesSearch = 
        user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email?.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesRole = roleFilter === 'all' || user.role === roleFilter;
      const matchesStatus = statusFilter === 'all' || 
        (statusFilter === 'active' && (user.status === 'active' || !user.status)) ||
        (statusFilter === 'inactive' && user.status === 'inactive');
      
      return matchesSearch && matchesRole && matchesStatus;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name?.localeCompare(b.name) || 0;
        case 'email':
          return a.email?.localeCompare(b.email) || 0;
        case 'role':
          return a.role?.localeCompare(b.role) || 0;
        case 'created':
          return new Date(b.createdAt) - new Date(a.createdAt);
        default:
          return 0;
      }
    });

  return (
    <div className="flex min-h-[calc(100vh-140px)]">
      <AdminSidebar />
      <main className="flex-1 p-8 bg-gray-50">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Manage Users</h1>
          <p className="mt-2 text-gray-600">View and manage registered users.</p>
        </div>
        
        {/* Controls */}
        <div className="mb-6 bg-white p-6 rounded-lg shadow-md">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search users..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <svg className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              
              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Roles</option>
                <option value="user">Users</option>
                <option value="admin">Admins</option>
              </select>
              
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
              
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="name">Sort by Name</option>
                <option value="email">Sort by Email</option>
                <option value="role">Sort by Role</option>
                <option value="created">Sort by Join Date</option>
              </select>
            </div>
            
            <div className="text-sm text-gray-600">
              Total: {filteredUsers.length} users
            </div>
          </div>
        </div>
        
        {/* Users Table */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          {loading ? (
            <div className="p-8 text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading users...</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Join Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredUsers.length > 0 ? (
                    filteredUsers.map((user) => (
                      <tr key={user._id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
                              <span className="text-sm font-medium text-gray-700">
                                {user.name?.charAt(0)?.toUpperCase()}
                              </span>
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">{user.name}</div>
                              <div className="text-sm text-gray-500">{user.email}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {getRoleBadge(user.role)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {getUserStatusBadge(user.status)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {new Date(user.createdAt).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex space-x-2">
                            {(user.status === 'active' || !user.status) ? (
                              <button
                                onClick={() => openConfirmModal('deactivate', user)}
                                className="text-orange-600 hover:text-orange-900 transition-colors duration-200"
                              >
                                🚫 Deactivate
                              </button>
                            ) : (
                              <button
                                onClick={() => openConfirmModal('activate', user)}
                                className="text-green-600 hover:text-green-900 transition-colors duration-200"
                              >
                                ✅ Activate
                              </button>
                            )}
                            
                            <button
                              onClick={() => openConfirmModal('resetPassword', user)}
                              className="text-blue-600 hover:text-blue-900 transition-colors duration-200"
                            >
                              🔑 Reset Password
                            </button>
                            
                            {user.role !== 'admin' && (
                              <button
                                onClick={() => openConfirmModal('delete', user)}
                                className="text-red-600 hover:text-red-900 transition-colors duration-200"
                              >
                                🗑️ Delete
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="5" className="px-6 py-12 text-center text-gray-500">
                        {searchTerm || roleFilter !== 'all' || statusFilter !== 'all' ? 'No users match your filters' : 'No users found'}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Confirm Modal */}
        {showConfirmModal && confirmAction && (
          <ConfirmModal
            title={`${confirmAction.action.charAt(0).toUpperCase() + confirmAction.action.slice(1)} User`}
            message={`Are you sure you want to ${confirmAction.action} ${confirmAction.user.name}?`}
            confirmText={confirmAction.action.charAt(0).toUpperCase() + confirmAction.action.slice(1)}
            confirmColor={confirmAction.action === 'delete' ? 'red' : 'blue'}
            onConfirm={handleConfirmAction}
            onCancel={() => {
              setShowConfirmModal(false);
              setConfirmAction(null);
            }}
          />
        )}
      </main>
    </div>
  );
};

export default ManageUsers;
