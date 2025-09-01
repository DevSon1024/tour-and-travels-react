import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-hot-toast';

const AdminSidebar = () => {
    const activeLink = "bg-blue-600 text-white";
    const normalLink = "hover:bg-gray-700 transition-colors duration-200";
    const { logout, user } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        toast.success('Logged out successfully');
        navigate('/admin-login');
    };

    const menuItems = [
        { path: '/admin', label: 'Dashboard', icon: '📊', end: true },
        { path: '/admin/tours', label: 'Manage Tours', icon: '🏖️' },
        { path: '/admin/bookings', label: 'Manage Bookings', icon: '📋' },
        { path: '/admin/users', label: 'Manage Users', icon: '👥' },
        { path: '/admin/analytics', label: 'Analytics', icon: '📈' },
        { path: '/admin/settings', label: 'Settings', icon: '⚙️' }
    ];

    return (
        <aside className="w-64 bg-gray-800 text-white flex-shrink-0 shadow-lg">
            <div className="p-4 border-b border-gray-700">
                <h2 className="text-2xl font-bold text-center">Admin Panel</h2>
                <p className="text-sm text-gray-300 text-center mt-1">Welcome, {user?.name}</p>
            </div>
            
            <nav className="mt-4">
                <ul className="space-y-1">
                    {menuItems.map((item) => (
                        <li key={item.path}>
                            <NavLink 
                                to={item.path} 
                                end={item.end}
                                className={({isActive}) => `flex items-center px-4 py-3 text-sm font-medium ${isActive ? activeLink : normalLink}`}
                            >
                                <span className="mr-3 text-lg">{item.icon}</span>
                                {item.label}
                            </NavLink>
                        </li>
                    ))}
                </ul>
            </nav>

            <div className="absolute bottom-0 w-64 p-4 border-t border-gray-700">
                <button
                    onClick={handleLogout}
                    className="w-full flex items-center px-4 py-2 text-sm font-medium text-red-300 hover:text-red-100 hover:bg-red-600 rounded-md transition-colors duration-200"
                >
                    <span className="mr-3 text-lg">🚪</span>
                    Logout
                </button>
            </div>
        </aside>
    );
};

export default AdminSidebar;