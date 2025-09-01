import React, { useState, useEffect } from 'react';
import AdminSidebar from '../../../components/admin/AdminSidebar';
import { adminService } from '../../../services/adminService';
import { toast } from 'react-hot-toast';

const Analytics = () => {
  const [analytics, setAnalytics] = useState({
    bookingTrends: [],
    revenueTrends: [],
    topTours: [],
    customerStats: {},
    monthlyStats: {}
  });
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState('30d');

  useEffect(() => {
    fetchAnalytics();
  }, [period]);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const [analyticsData, bookingTrends, revenueTrends] = await Promise.all([
        adminService.getAnalytics(period),
        adminService.getBookingTrends(),
        adminService.getRevenueTrends()
      ]);
      
      setAnalytics({
        ...analyticsData,
        bookingTrends,
        revenueTrends
      });
    } catch (error) {
      toast.error('Failed to load analytics data');
      console.error('Error fetching analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  const StatCard = ({ title, value, change, icon, color }) => (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-medium text-gray-500">{title}</h3>
          <p className={`text-3xl font-bold ${color} mt-2`}>
            {loading ? (
              <div className="animate-pulse bg-gray-200 h-8 w-20 rounded"></div>
            ) : (
              value
            )}
          </p>
          {change && (
            <p className={`text-sm mt-1 ${change > 0 ? 'text-green-600' : 'text-red-600'}`}>
              {change > 0 ? '↗' : '↘'} {Math.abs(change)}% from last period
            </p>
          )}
        </div>
        <div className={`text-4xl ${color.replace('text-', 'text-').replace('-600', '-400')}`}>
          {icon}
        </div>
      </div>
    </div>
  );

  const ChartPlaceholder = ({ title, height = "300px" }) => (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>
      <div 
        className="flex items-center justify-center bg-gray-100 rounded-lg border-2 border-dashed border-gray-300"
        style={{ height }}
      >
        <div className="text-center">
          <div className="text-4xl text-gray-400 mb-2">📊</div>
          <p className="text-gray-500">Chart visualization would go here</p>
          <p className="text-sm text-gray-400 mt-1">Integration with Chart.js or similar library</p>
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex min-h-[calc(100vh-140px)]">
      <AdminSidebar />
      <main className="flex-1 p-8 bg-gray-50">
        <div className="mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Analytics Dashboard</h1>
              <p className="mt-2 text-gray-600">Track your business performance and insights.</p>
            </div>
            <select
              value={period}
              onChange={(e) => setPeriod(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="7d">Last 7 days</option>
              <option value="30d">Last 30 days</option>
              <option value="90d">Last 90 days</option>
              <option value="1y">Last year</option>
            </select>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Total Revenue"
            value={`₹${analytics.monthlyStats?.totalRevenue?.toLocaleString() || '0'}`}
            change={15}
            icon="💰"
            color="text-green-600"
          />
          <StatCard
            title="Total Bookings"
            value={analytics.monthlyStats?.totalBookings || '0'}
            change={8}
            icon="📋"
            color="text-blue-600"
          />
          <StatCard
            title="New Customers"
            value={analytics.customerStats?.newCustomers || '0'}
            change={12}
            icon="👥"
            color="text-purple-600"
          />
          <StatCard
            title="Conversion Rate"
            value={`${analytics.customerStats?.conversionRate || '0'}%`}
            change={-2}
            icon="📈"
            color="text-orange-600"
          />
        </div>

        {/* Charts Row 1 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <ChartPlaceholder title="Booking Trends" />
          <ChartPlaceholder title="Revenue Trends" />
        </div>

        {/* Charts Row 2 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <ChartPlaceholder title="Popular Tours" />
          <ChartPlaceholder title="Customer Demographics" />
        </div>

        {/* Top Tours Table */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Top Performing Tours</h3>
          </div>
          {loading ? (
            <div className="p-8 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading top tours...</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tour</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Bookings</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Revenue</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Avg Rating</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Growth</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {analytics.topTours?.length > 0 ? (
                    analytics.topTours.map((tour, index) => (
                      <tr key={tour._id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="text-sm font-medium text-gray-900">
                              #{index + 1} {tour.name}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {tour.bookingCount || 0}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-green-600">
                          ₹{tour.revenue?.toLocaleString() || '0'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          ⭐ {tour.averageRating || 'N/A'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <span className={`${tour.growth > 0 ? 'text-green-600' : 'text-red-600'}`}>
                            {tour.growth > 0 ? '↗' : '↘'} {Math.abs(tour.growth || 0)}%
                          </span>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="5" className="px-6 py-12 text-center text-gray-500">
                        No tour data available
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-lg shadow-md">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Recent Activity</h3>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {[
                { icon: '📋', message: 'New booking received for Rajasthan Royal Heritage Tour', time: '2 minutes ago' },
                { icon: '👤', message: 'New user registration: john.doe@email.com', time: '15 minutes ago' },
                { icon: '💰', message: 'Payment received for booking #BK001234', time: '1 hour ago' },
                { icon: '⭐', message: 'New 5-star review for Kerala Backwaters tour', time: '2 hours ago' },
                { icon: '🎯', message: 'Tour completed: Golden Triangle Classic', time: '3 hours ago' }
              ].map((activity, index) => (
                <div key={index} className="flex items-center space-x-3 p-3 hover:bg-gray-50 rounded-md">
                  <div className="bg-blue-100 p-2 rounded-full">
                    <span className="text-blue-600">{activity.icon}</span>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">{activity.message}</p>
                    <p className="text-xs text-gray-500">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Analytics;
