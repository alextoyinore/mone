"use client";

import React, { createContext, useState, useContext, useEffect } from 'react';
import { useAuth } from './AuthContext';
import axios from 'axios';

const FriendActivityContext = createContext({
  friendsListening: [],
  isLoading: true,
  error: null,
  refetch: () => {},
});

export function FriendActivityProvider({ children }) {
  const [friendsListening, setFriendsListening] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth();

  const fetchFriendActivity = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await axios.get('/api/friends/activity', {
        headers: {
          'Authorization': `Bearer ${user?.token}`,
        },
      });
      
      setFriendsListening(response.data);
    } catch (err) {
      setError(err.message);
      console.error('Failed to fetch friend activity:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (user?.token) {
      fetchFriendActivity();
    }
  }, [user?.token]);

  return (
    <FriendActivityContext.Provider value={{
      friendsListening,
      isLoading,
      error,
      refetch: fetchFriendActivity,
    }}>
      {children}
    </FriendActivityContext.Provider>
  );
}

export function useFriendActivity() {
  return useContext(FriendActivityContext);
}

export default FriendActivityContext;
