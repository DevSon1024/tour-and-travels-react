import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { jwtDecode } from 'jwt-decode';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';

// Error boundary component for Navbar
class NavbarErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Navbar Error:', error, errorInfo);
    // Clear potentially corrupted token
    localStorage.removeItem('token');
  }

  render() {
    if (this.state.hasError) {
      return (
        <nav className="bg-white border-b border-gray-100 sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex-shrink-0">
                <img src="D:\Download\Logo_of_Shiv_Sena.svg.png" alt="Image" />
                <Link to="/" className="text-xl font-semibold text-gray-900 hover:text-blue-600 transition-colors">
                  TripSaga
                </Link>
              </div>
              <div className="flex items-center space-x-4">
                <Link to="/login" className="text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors">
                  Login
                </Link>
                <Link to="/register" className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700 transition-colors">
                  Register
                </Link>
              </div>
            </div>
          </div>
        </nav>
      );
    }

    return this.props.children;
  }
}

const Navbar = () => {
  const { token, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  // Safely decode token to check if user is admin with enhanced error handling
  let isAdmin = false;
  let userInfo = null;
  
  if (token) {
    try {
      const decoded = jwtDecode(token);
      
      // Check if token is expired
      if (decoded.exp && decoded.exp * 1000 < Date.now()) {
        console.warn('Token expired, clearing...');
        logout();
        return null; // Return null to trigger re-render after logout
      }
      
      isAdmin = decoded.role === 'admin';
      userInfo = decoded;
    } catch (error) {
      console.error('Error decoding token, clearing localStorage:', error);
      // Clear corrupted token and reload
      localStorage.removeItem('token');
      window.location.reload();
      return null;
    }
  }

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsMobileMenuOpen(false);
  };

  const isActiveLink = (path) => location.pathname === path;

  const navLinks = [
    { path: '/', label: 'Home' },
    { path: '/tours', label: 'Tours' }
  ];

  return (
    <NavbarErrorBoundary>
      <nav className="bg-white border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex-shrink-0">
              <Link to="/" className="text-xl font-semibold text-gray-900 hover:text-blue-600 transition-colors">
                TripSaga
              </Link>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`px-3 py-2 text-sm font-medium transition-colors ${
                    isActiveLink(link.path)
                      ? 'text-blue-600 border-b-2 border-blue-600'
                      : 'text-gray-700 hover:text-blue-600'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              
              {/* Auth Links */}
              <div className="flex items-center space-x-4 ml-6 pl-6 border-l border-gray-200">
                {token ? (
                  <>
                    {isAdmin && (
                      <Link 
                        to="/admin" 
                        className="text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors"
                      >
                        Admin
                      </Link>
                    )}
                    <Link 
                      to="/my-bookings" 
                      className="text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors"
                    >
                      My Bookings
                    </Link>
                    <Link 
                      to="/profile" 
                      className="text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors"
                    >
                      Profile
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="bg-gray-100 text-gray-700 px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-200 transition-colors"
                    >
                      Logout
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      to="/login"
                      className="text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors"
                    >
                      Login
                    </Link>
                    <Link
                      to="/register"
                      className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700 transition-colors"
                    >
                      Register
                    </Link>
                  </>
                )}
              </div>
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="text-gray-700 hover:text-blue-600 p-2 transition-colors"
              >
                {isMobileMenuOpen ? (
                  <XMarkIcon className="h-6 w-6" />
                ) : (
                  <Bars3Icon className="h-6 w-6" />
                )}
              </button>
            </div>
          </div>

          {/* Mobile Navigation */}
          {isMobileMenuOpen && (
            <div className="md:hidden border-t border-gray-100">
              <div className="py-4 space-y-2">
                {navLinks.map((link) => (
                  <Link
                    key={link.path}
                    to={link.path}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`block px-3 py-2 text-sm font-medium transition-colors ${
                      isActiveLink(link.path)
                        ? 'text-blue-600 bg-blue-50'
                        : 'text-gray-700 hover:text-blue-600 hover:bg-gray-50'
                    }`}
                  >
                    {link.label}
                  </Link>
                ))}
                
                <div className="pt-4 border-t border-gray-100 mt-4">
                  {token ? (
                    <>
                      {isAdmin && (
                        <Link
                          to="/admin"
                          onClick={() => setIsMobileMenuOpen(false)}
                          className="block px-3 py-2 text-sm font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50 transition-colors"
                        >
                          Admin
                        </Link>
                      )}
                      <Link
                        to="/my-bookings"
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="block px-3 py-2 text-sm font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50 transition-colors"
                      >
                        My Bookings
                      </Link>
                      <Link
                        to="/profile"
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="block px-3 py-2 text-sm font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50 transition-colors"
                      >
                        Profile
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="block w-full text-left px-3 py-2 text-sm font-medium text-gray-700 hover:text-red-600 hover:bg-gray-50 transition-colors"
                      >
                        Logout
                      </button>
                    </>
                  ) : (
                    <div className="space-y-2">
                      <Link
                        to="/login"
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="block px-3 py-2 text-sm font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50 transition-colors"
                      >
                        Login
                      </Link>
                      <Link
                        to="/register"
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="block mx-3 my-2 bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium text-center hover:bg-blue-700 transition-colors"
                      >
                        Register
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </nav>
    </NavbarErrorBoundary>
  );
};

export default Navbar;