import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Spinner from '../components/common/Spinner';

const AdminRoute = () => {
  const { user, token } = useAuth();

  // If a token exists but the user object is not yet populated from the token,
  // it means the authentication state is still being determined. Show a spinner.
  if (token && !user) {
    return <Spinner />;
  }

  // If there is no token, the user is not logged in. Redirect to the login page.
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // If the user object is available and the role is 'admin', grant access to the admin pages.
  // Otherwise, redirect non-admin users to the home page.
  return user && user.role === 'admin' ? <Outlet /> : <Navigate to="/" replace />;
};

export default AdminRoute;