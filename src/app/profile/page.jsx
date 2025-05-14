"use client";

import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import Image from 'next/image';
import Link from 'next/link';
import toast from 'react-hot-toast';
import AuthRequired from '../../components/AuthRequired';
import Cookies from 'js-cookie';

export default function ProfilePage() {
  const { user, updateProfile, logout, getToken } = useAuth();
  const [displayName, setDisplayName] = useState(user?.displayName);
  const [email, setEmail] = useState(user?.email);
  const [profileImage, setProfileImage] = useState(() => {
    const originalImage = user?.photoURL || 'https://placehold.co/150x150';
    
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
        toast.success('Successfully became an artist!');
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
    <div className="min-h-screen p-8 bg-white dark:bg-gray-900 text-gray-900 dark:text-white">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">My Profile</h1>
        
        <div className="grid md:grid-cols-3 gap-8">
          {/* Profile Section */}
          <div className="md:col-span-2 bg-white dark:bg-gray-900 rounded-lg p-8">
            <div className="flex items-center mb-6">
              <div className="relative mr-6">
                <Image 
                  src={profileImage} 
                  alt="Profile" 
                  width={400} 
                  height={400} 
                  className="rounded-full w-32 h-32 object-cover"
                  unoptimized
                />
                {isEditing && (
                  <label 
                    htmlFor="profileImageUpload" 
                    className="absolute bottom-0 right-0 bg-blue-600 text-white p-2 rounded-full cursor-pointer"
                  >
                    📷
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
              
              <div>
                <h2 className="text-2xl font-semibold">
                  {isEditing ? (
                    <input 
                      type="text" 
                      value={displayName}
                      onChange={(e) => setDisplayName(e.target.value)}
                      className="w-full px-2 py-1 border rounded bg-white dark:bg-gray-700"
                    />
                  ) : (
                    displayName
                  )}
                </h2>
                <p className="text-gray-600 dark:text-gray-400">
                  {isEditing ? (
                    <input 
                      type="email" 
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-2 py-1 border rounded bg-white dark:bg-gray-700"
                      disabled
                    />
                  ) : (
                    email
                  )}
                </p>
              </div>
            </div>

            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
                {error}
              </div>
            )}

            <div className="mt-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="text-lg font-semibold mb-2">Account Stats</h3>
                  <ul className="space-y-1 text-gray-600 dark:text-gray-400">
                    <li>Joined: May 2025</li>
                    <li>Favorite Tracks: 24</li>
                    <li>Playlists: 5</li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold mb-2">Preferences</h3>
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

              <div className="flex justify-between items-center mt-6">
                {isEditing ? (
                  <button
                    type="submit"
                    onClick={handleUpdateProfile}
                    className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                  >
                    Save Changes
                  </button>
                ) : (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                  >
                    Edit Profile
                  </button>
                )}
                
                <button
                  onClick={logout}
                  className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>

          {/* Artist Section */}
          <div className="bg-white dark:bg-gray-900 rounded-lg p-8">
            <h3 className="text-2xl font-semibold mb-4">Artist Profile</h3>
            {isArtist ? (
              <div className="text-green-600 dark:text-green-400">
                <p>🎵 You are an artist</p>
                <Link href="/upload" className="mt-4 inline-block bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700">
                  Upload Song
                </Link>
              </div>
            ) : (
              <div>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  Want to share your music with the world?
                </p>
                <button 
                  onClick={handleBecomeArtist}
                  className="w-full bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
                >
                  Become an Artist
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
