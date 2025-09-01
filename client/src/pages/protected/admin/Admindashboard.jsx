import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminSidebar from '../../../components/admin/AdminSidebar';
import AdminHeader from '../../../components/admin/AdminHeader';
import { adminService } from '../../../services/adminService';
import { toast } from 'react-hot-toast';
import { useAuth } from '../../../context/AuthContext';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth(); // Get the logged-in admin's data
  const [stats, setStats] = useState({
    totalTours: 0,
    totalBookings: 0,
    totalUsers: 0,
    pendingBookings: 0,
    totalRevenue: 0,
    activeUsers: 0
  });
  const [recentActivity, setRecentActivity] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);
      const [statsData, activityData] = await Promise.all([
        adminService.getDashboardStats(),
        adminService.getRecentActivity()
      ]);
      setStats(statsData);
      setRecentActivity(activityData);
    } catch (err) {
      console.error('Dashboard error:', err);
      setError('Failed to load dashboard data. Please try again later.');
      toast.error('Could not fetch dashboard data.');
    } finally {
      setLoading(false);
    }
  };

  const StatCard = ({ title, value, icon, color, trend }) => (
    <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-medium text-gray-500">{title}</h3>
          <p className={`text-3xl font-bold ${color} mt-2`}>
            {loading ? (
              <div className="animate-pulse bg-gray-200 h-8 w-16 rounded"></div>
            ) : (
              value
            )}
          </p>
          {trend && (
            <p className="text-sm text-green-600 mt-1">
              ↗ {trend}% from last month
            </p>
          )}
        </div>
        <div className={`text-4xl ${color.replace('text-', 'text-').replace('-600', '-400')}`}>
          {icon}
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex min-h-screen bg-gray-50">
      <AdminSidebar />
      <div className="flex-1">
        <AdminHeader 
          title="Dashboard Overview" 
          subtitle={`Welcome back, ${user?.name || 'Admin'}! Here's what's happening.`} 
        />
        <main className="p-8">
          {error && (
            <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6" role="alert">
              <p className="font-bold">Error</p>
              <p>{error}</p>
            </div>
          )}
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            <StatCard
              title="Total Tours"
              value={stats.totalTours}
              icon="🏖️"
              color="text-blue-600"
              trend={12}
            />
            <StatCard
              title="Total Bookings"
              value={stats.totalBookings}
              icon="📋"
              color="text-green-600"
              trend={8}
            />
            <StatCard
              title="Total Users"
              value={stats.totalUsers}
              icon="👥"
              color="text-purple-600"
              trend={15}
            />
            <StatCard
              title="Pending Bookings"
              value={stats.pendingBookings}
              icon="⏳"
              color="text-orange-600"
            />
            <StatCard
              title="Total Revenue"
              value={`₹${stats.totalRevenue?.toLocaleString() || 0}`}
              icon="💰"
              color="text-emerald-600"
              trend={22}
            />
            <StatCard
              title="Active Users"
              value={stats.activeUsers}
              icon="🟢"
              color="text-indigo-600"
            />
          </div>

          {/* Recent Activity */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
              <div className="space-y-4">
                {loading ? (
                  Array.from({ length: 5 }).map((_, i) => (
                    <div key={i} className="animate-pulse flex items-center space-x-3">
                      <div className="bg-gray-200 h-10 w-10 rounded-full"></div>
                      <div className="flex-1">
                        <div className="bg-gray-200 h-4 w-3/4 rounded mb-2"></div>
                        <div className="bg-gray-200 h-3 w-1/2 rounded"></div>
                      </div>
                    </div>
                  ))
                ) : recentActivity.length > 0 ? (
                  recentActivity.map((activity, index) => (
                    <div key={index} className="flex items-center space-x-3 p-3 hover:bg-gray-50 rounded-md">
                      <div className="bg-blue-100 p-2 rounded-full">
                        <span className="text-blue-600">{activity.icon}</span>
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">{activity.message}</p>
                        <p className="text-xs text-gray-500">{activity.time}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500 text-center py-4">No recent activity</p>
                )}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
              <div className="grid grid-cols-2 gap-4">
                <button 
                  onClick={() => navigate('/admin/tours')}
                  className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors duration-200 text-center"
                >
                  <div className="text-2xl mb-2">➕</div>
                  <div className="text-sm font-medium">Add New Tour</div>
                </button>
                <button 
                  onClick={() => navigate('/admin/analytics')}
                  className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-green-500 hover:bg-green-50 transition-colors duration-200 text-center"
                >
                  <div className="text-2xl mb-2">📊</div>
                  <div className="text-sm font-medium">View Reports</div>
                </button>
                <button 
                  onClick={() => navigate('/admin/users')}
                  className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-purple-500 hover:bg-purple-50 transition-colors duration-200 text-center"
                >
                  <div className="text-2xl mb-2">👤</div>
                  <div className="text-sm font-medium">Manage Users</div>
                </button>
                <button 
                  onClick={() => navigate('/admin/settings')}
                  className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-orange-500 hover:bg-orange-50 transition-colors duration-200 text-center"
                >
                  <div className="text-2xl mb-2">⚙️</div>
                  <div className="text-sm font-medium">Settings</div>
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;