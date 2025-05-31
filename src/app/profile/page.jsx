"use client";

import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import Image from 'next/image';
import toast from 'react-hot-toast';
import AuthRequired from '../../components/AuthRequired';
import Cookies from 'js-cookie';
import defaultImage from '@/assets/default-image-black.svg';

export default function ProfilePage() {
  const { user, updateProfile, logout, getToken } = useAuth();
  const [displayName, setDisplayName] = useState(user?.displayName);
  const [email, setEmail] = useState(user?.email);
  const [profileImage, setProfileImage] = useState(() => {
    const originalImage = user?.photoURL || defaultImage;
    
    // Enhance Google profile image resolution
    if (originalImage.includes('googleusercontent.com')) {
      // Replace with higher resolution image
      return originalImage.replace('s96-c', 's400-c');
    }
    
    return originalImage;
  });
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState('');
  const [isArtist, setIsArtist] = useState(false);
  const [token, setToken] = useState(null);

  useEffect(() => {
    const fetchToken = async () => {
      if (user) {
        try {
          const newToken = await getToken();
          setToken(newToken);
        } catch (error) {
          console.error('Failed to get token', error);
          setToken(null);
        }
      } else {
        setToken(null);
      }
    };

    fetchToken();
  }, [user]);


  useEffect(() => {
    const checkArtistStatus = async () => {
      if (!user || !token) return;

      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/users/artist-status`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        const data = await response.json();
        console.log(data);
        
        setIsArtist(data.isArtist);
      } catch (error) {
        console.error('Failed to check artist status', error);
        setIsArtist(false);
      }
    };

    checkArtistStatus();
  }, [user, token]);


  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setError('');

    try {
      await updateProfile({
        displayName,
        photoURL: profileImage
      });
      
      // Set cookies for user details
      Cookies.set('displayName', displayName, { expires: 7 });
      Cookies.set('email', email, { expires: 7 });
      Cookies.set('photoURL', profileImage, { expires: 7 });
      
      setIsEditing(false);
    } catch (err) {
      setError(err.message || 'Failed to update profile');
    }
  };


  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };


  const handleBecomeArtist = async () => {
    try {
      // Refresh token before making the request
      const token = await getToken();
      setToken(token);

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/users/become-artist`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      // Log the full response for debugging
      console.log('Become Artist Response Status:', response.status);

      if (!response.ok) {
        // Handle non-200 responses
        const errorText = await response.text();
        console.error('Become Artist Error:', errorText);
        toast.error(`Failed to become an artist. Status: ${response.status}`);
        return;
      }

      const data = await response.json();
      if (data.success) {
        toast.success(data.message);
        setIsArtist(true);
        Cookies.set('isArtist', 'true', { expires: 7 });
      } else {
        toast.error(data.message || 'Failed to become an artist');
      }
    } catch (err) {
      console.error('Become Artist Catch Error:', err);
      toast.error(err.message || 'An unexpected error occurred');
    }
  };


  if (!user) {
    return <AuthRequired message="You must be logged in to view your profile." />;
  }


  return (
    <div className="min-h-screen dark:from-gray-900 dark:to-gray-800">
      <div className="">
        <div className="dark:bg-gray-900">
          
          <div className="flex flex-col gap-4">
            <div className="flex items-center">
              <div className="relative w-40 h-40 mr-8">
                <div className="relative w-full h-full rounded-full overflow-hidden">
                  <Image 
                    src={profileImage} 
                    alt="Profile" 
                    fill 
                    className="object-cover"
                    unoptimized
                  />
                  {isEditing && (
                    <label 
                      htmlFor="profileImageUpload" 
                      className="absolute bottom-2 right-2 bg-blue-600 text-white p-2 rounded-full cursor-pointer hover:bg-blue-700 transition-colors"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <input 
                        type="file" 
                        id="profileImageUpload"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                      />
                    </label>
                  )}
                </div>
              </div>
              
              <div>
                <h2 className="text-3xl font-bold">
                  {isEditing ? (
                    <input 
                      type="text" 
                      value={displayName}
                      onChange={(e) => setDisplayName(e.target.value)}
                      className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Display Name"
                    />
                  ) : (
                    <span className="font-bold text-gray-900 dark:text-white">{displayName}</span>
                  )}
                </h2>
                <p className="text-gray-600 dark:text-gray-400">
                  {isEditing ? (
                    <input 
                      type="email" 
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Email Address"
                    />
                  ) : (
                    <span className="text-gray-600 dark:text-gray-400">{email}</span>
                  )}
                </p>

                <div className="flex gap-2 mt-3">
                  <button onClick={logout} className="text-red-600 dark:text-red-400 cursor-pointer px-5 py-1 rounded-full hover:bg-red-100 transition-colors bg-red-50 dark:bg-red-800 text-sm">Logout</button>

                  <button onClick={handleUpdateProfile} className="text-gray-600 dark:text-gray-400 cursor-pointer px-5 py-1 rounded-full hover:bg-gray-100 transition-colors bg-gray-50 dark:bg-gray-900 text-sm">Update Profile</button>

                  {
                    !isArtist && (
                      <button onClick={handleBecomeArtist} className="text-blue-600 dark:text-blue-400 cursor-pointer px-5 py-1 rounded-full hover:bg-blue-100 transition-colors bg-blue-50 dark:bg-blue-800 text-sm">Become Artist</button>
                    )
                  }
                
                </div>  
              </div>
            </div>

            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
                {error}
              </div>
            )}

            {/* Artist Stats */}

            <div className="mt-6 space-y-4">
              <div className="flex gap-14">
                <div>
                  <h3 className="text-lg font-semibold">Account Stats</h3>
                  <ul className="space-y-1 text-gray-600 dark:text-gray-400">
                    <li>Joined: May 2025</li>
                    <li>Favorite Tracks: 24</li>
                    <li>Playlists: 5</li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold">Preferences</h3>
                  <div className="space-y-2">
                    <label className="flex items-center">
                      <input 
                        type="checkbox" 
                        className="mr-2" 
                        defaultChecked 
                      />
                      Email Notifications
                    </label>
                    <label className="flex items-center">
                      <input 
                        type="checkbox" 
                        className="mr-2" 
                      />
                      Dark Mode
                    </label>
                  </div>
                </div>
              </div> 
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

