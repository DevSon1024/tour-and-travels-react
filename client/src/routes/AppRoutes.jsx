import React from 'react';
import { Routes, Route } from 'react-router-dom';

// Public Pages
import HomePage from '../pages/public/HomePage';
import ToursPage from '../pages/public/ToursPage';
import EnhancedTourDetailsPage from '../pages/public/EnhancedTourDetailsPage';
import BookingConfirmationPage from '../pages/public/BookingConfirmationPage';
import LoginPage from '../pages/public/LoginPage';
import RegisterPage from '../pages/public/RegisterPage';

// Protected Pages
import UserProfilePage from '../pages/protected/UserProfilePage';
import MyBookingsPage from '../pages/protected/MyBookingsPage';

// Admin Pages
import AdminDashboard from '../pages/protected/admin/AdminDashboard';
import ManageTours from '../pages/protected/admin/ManageTours';
import ManageBookings from '../pages/protected/admin/ManageBookings';
import ManageUsers from '../pages/protected/admin/ManageUsers';
import Analytics from '../pages/protected/admin/Analytics';
import Settings from '../pages/protected/admin/Settings';

// Route Protection
import ProtectedRoute from './ProtectedRoute';
import AdminRoute from './AdminRoute';

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<HomePage />} />
      <Route path="/tours" element={<ToursPage />} />
      <Route path="/tours/:id" element={<EnhancedTourDetailsPage />} />
      <Route path="/booking-confirmation" element={<BookingConfirmationPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      {/* Protected User Routes */}
      <Route element={<ProtectedRoute />}>
        <Route path="/profile" element={<UserProfilePage />} />
        <Route path="/my-bookings" element={<MyBookingsPage />} />
      </Route>

      {/* Protected Admin Routes */}
      <Route path="/admin" element={<AdminRoute />}>
        <Route index element={<AdminDashboard />} />
        <Route path="tours" element={<ManageTours />} />
        <Route path="bookings" element={<ManageBookings />} />
        <Route path="users" element={<ManageUsers />} />
        <Route path="analytics" element={<Analytics />} />
        <Route path="settings" element={<Settings />} />
      </Route>

      {/* Fallback Route */}
      <Route path="*" element={<h1 className="text-center text-4xl mt-10">404 - Not Found</h1>} />
    </Routes>
  );
};

export default AppRoutes;