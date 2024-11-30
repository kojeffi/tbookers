// AuthContext.js
import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from './api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [authToken, setAuthToken] = useState(null);
    const [profileData, setProfileData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [notificationCount, setNotificationCount] = useState(0);

    // Function to load token and fetch profile data
    const loadToken = async () => {
        try {
            const token = await AsyncStorage.getItem('authToken');
            if (token) {
                setAuthToken(token);
                await fetchProfileData(); // Fetch profile data when token is loaded
            } else {
                setLoading(false);
            }
        } catch (e) {
            console.error('Failed to load token', e);
            setError('Failed to load token');
            setLoading(false);
        }
    };

    // Function to fetch profile data
    const fetchProfileData = async () => {
        try {
            const response = await api.get('/profile'); // Ensure this endpoint returns all user fields
            setProfileData(response.data); // Assuming response.data contains all the fields
            setNotificationCount(response.data.notificationCount || 0);
        } catch (e) {
            console.error('Failed to fetch profile data', e);
            setError('Failed to fetch profile data');
            // Optionally handle token invalidation
            logout();
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadToken();
    }, []);

    // Function to save token
    const saveToken = async (token) => {
        try {
            await AsyncStorage.setItem('authToken', token);
            setAuthToken(token);
            await fetchProfileData(); // Fetch profile data after saving token
        } catch (e) {
            console.error('Failed to save token', e);
            setError('Failed to save token');
        }
    };

    // Function to logout
    const logout = async () => {
        try {
            await AsyncStorage.removeItem('authToken');
            setAuthToken(null);
            setProfileData(null);
            setNotificationCount(0);
        } catch (e) {
            console.error('Failed to logout', e);
            setError('Failed to logout');
        }
    };

    // Function to update notification count
    const updateNotificationCount = (count) => {
        setNotificationCount(count);
    };

    return (
        <AuthContext.Provider
            value={{
                authToken,
                profileData, // Provide entire profile data
                loading,
                error,
                saveToken,
                logout,
                notificationCount,
                updateNotificationCount,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};
