import React, { useState, useEffect } from 'react';
import api from '../../api/api';
import { useAuth } from '../../context/AuthContext';
import Spinner from '../../components/common/Spinner';

// Note: You need a /users/profile GET route on your backend for this
// and a PUT route to update it. I've included a sample userController.js in the server code.
// Make sure to create a userRoutes.js and use it in server.js

const UserProfilePage = () => {
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const { user } = useAuth(); // Get user info from context

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                // This assumes your backend has a route at /api/users/profile
                // that returns the logged-in user's details.
                const { data } = await api.get('/users/profile'); 
                setProfile(data);
            } catch (error) {
                console.error("Failed to fetch profile", error);
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, []);

    if (loading) return <Spinner />;
    if (!profile) return <p className="text-center text-red-500 mt-10">Could not load profile.</p>;

    return (
        <div className="container mx-auto px-6 py-8">
            <h1 className="text-3xl font-bold mb-6">My Profile</h1>
            <div className="bg-white p-6 rounded-lg shadow-md max-w-lg mx-auto">
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-500">Name</label>
                        <p className="text-lg">{profile.name}</p>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-500">Email</label>
                        <p className="text-lg">{profile.email}</p>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-500">Role</label>
                        <p className="text-lg capitalize">{profile.role}</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserProfilePage;