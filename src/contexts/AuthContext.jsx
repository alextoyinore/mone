"use client";

import { createContext, useState, useContext, useEffect, useCallback } from 'react';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signInWithPopup, 
  GoogleAuthProvider, 
  signOut, 
  onAuthStateChanged, 
  updateProfile 
} from 'firebase/auth';
import { auth } from '../lib/firebase';

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isArtist, setIsArtist] = useState(false);

  // Helper to save user
  const saveUserData = useCallback((userData) => {
    setUser(userData);

    if (typeof window !== 'undefined') {
      // Create a more secure cookie
      const cookieOptions = [
        'path=/',
        'SameSite=Strict',
        'Secure',
        `Max-Age=${60 * 60 * 24 * 7}` // 7 days
      ];

      // Encode user data and set cookie
      const encodedUserData = encodeURIComponent(JSON.stringify({
        uid: userData?.uid,
        email: userData?.email,
        displayName: userData?.displayName,
        photoURL: userData?.photoURL,
      }));

      document.cookie = `xito_auth=${encodedUserData}; ${cookieOptions.join('; ')}`;
    }
  }, []);

  
  // Ensure initial user state is consistent
  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Read from cookie
      const cookies = document.cookie.split('; ');
      const userCookie = cookies.find(row => row.startsWith('xito_auth='));
      if (userCookie) {
        try {
          const savedUser = userCookie.split('=')[1];
          const parsedUser = JSON.parse(decodeURIComponent(savedUser));
          
          // Validate parsed user
          if (parsedUser && parsedUser.uid) {
            setUser(parsedUser);
          } else {
            throw new Error('Invalid user data');
          }
        } catch (error) {
          console.error('Failed to parse saved user', error);
          document.cookie = 'xito_auth=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/';
          setUser(null);
        }
      }
    }
  }, []);

  // Auth state listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        // Transform Firebase user to our custom user object
        const userData = {
          uid: currentUser.uid,
          email: currentUser.email,
          displayName: currentUser.displayName,
          photoURL: currentUser.photoURL,
        };
                
        saveUserData(userData);
      } else {
        // Clear user data when logged out
        saveUserData(null);
      }
      
      setLoading(false);
    }, (error) => {
      console.error('Auth state change error:', error);
      setLoading(false);
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, [saveUserData]);

  // Authentication methods
  const signUpWithEmail = async (email, password, additionalDetails = {}) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      // Update profile with additional details
      await updateProfile(user, {
        displayName: additionalDetails.displayName || '',
        photoURL: additionalDetails.photoURL || ''
      });

      // Sync user to backend
      await syncUserToBackend(user);

      setUser(user);
      return user;
    } catch (error) {
      console.error('Sign up error:', error);
      throw error;
    }
  };

  const signInWithEmail = async (email, password) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      return userCredential.user;
    } catch (error) {
      console.error('Sign in error:', error);
      throw error;
    }
  };

  const signInWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      return result.user;
    } catch (error) {
      console.error('Google sign in error:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      setUser(null);
      if (typeof window !== 'undefined') {
        // Clear authentication cookie
        document.cookie = 'xito_auth=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/; SameSite=Strict; Secure';
      }
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    }
  };

  const syncUserToBackend = async (firebaseUser) => {
    try {
      // Prepare user data for backend sync
      const userData = {
        uid: firebaseUser.uid,
        email: firebaseUser.email,
        fullname: firebaseUser.displayName,
        avatar: firebaseUser.photoURL,
        googleid: firebaseUser.uid
      };

      // Send user data to backend
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/users/sync`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${await firebaseUser.getIdToken()}`
        },
        body: JSON.stringify(userData)
      });

      if (!response.ok) {
        throw new Error('Failed to sync user to backend');
      }

      return await response.json();
    } catch (error) {
      console.error('User sync error:', error);
      // Optionally, you can add more error handling or logging
      throw error;
    }
  };

  const getToken = async () => {
    if (!user) return null;
    try {
      // Fetch the current Firebase user to get the latest token
      const currentUser = auth.currentUser;
      if (!currentUser) return null;
      const token = await currentUser.getIdToken();
      return token;
    } catch (error) {
      console.error('Failed to get token:', error);
      return null;
    }
  };

  const value = {
    user,
    loading,
    signInWithEmail,
    signUpWithEmail,
    signInWithGoogle,
    logout,
    getToken,
    isArtist
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}
