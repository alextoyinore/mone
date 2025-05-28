"use client";

import { useState, useRef, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import AuthRequired from '../../components/AuthRequired';
import Select from 'react-select';
import { useDropzone } from 'react-dropzone';
import AnimatedSpinner from '@/components/loading/AnimatedSpinner';

// Helper function to create initial form data
const createInitialFormData = () => Object.freeze({
  title: '',
  genre: '',
  album: '',
  description: '',
  links: Object.freeze({
    spotify: '',
    appleMusic: '',
    audiomack: '',
    boomplay: '',
    youtube: '',
    soundcloud: '',
    deezer: '',
    tidal: '',
    amazonMusic: '',
    other: ''
  })
});

// Validation helper with improved type checking and error handling
const validateForm = (formData, songFile) => {
  const errors = {};

  // Title validation
  if (typeof formData.title !== 'string' || !formData.title.trim()) {
    errors.title = 'Song title is required';
  }

  // Song file validation
  if (!songFile) {
    errors.songFile = 'Audio file is required';
  } else {
    const MAX_AUDIO_SIZE = 15 * 1024 * 1024; // 15MB
    const ALLOWED_AUDIO_TYPES = [
      'audio/mpeg', 
      'audio/mp3', 
      'audio/wav', 
      'audio/x-wav', 
      'audio/m4a', 
      'audio/x-m4a'
    ];

    if (!ALLOWED_AUDIO_TYPES.includes(songFile.type)) {
      errors.songFile = 'Invalid audio file type';
    }

    if (songFile.size > MAX_AUDIO_SIZE) {
      errors.songFile = 'Audio file must be less than 15MB';
    }
  }
  
  return errors;
};

// Upload page component
export default function UploadPage() {
  const { user, getToken } = useAuth();

  // State hooks
  const [formData, setFormData] = useState(createInitialFormData());
  const [songFile, setSongFile] = useState(null);
  const [coverFile, setCoverFile] = useState(null);
  const [errors, setErrors] = useState({});
  const [isUploading, setIsUploading] = useState(false);
  const [token, setToken] = useState(null);

  // Fetch token when user changes
  useEffect(() => {
    const fetchToken = async () => {
      if (user) {
        const userToken = await getToken();
        setToken(userToken);
      }
    };
    fetchToken();
  }, [user, getToken]);

  // Ref hooks
  const songInputRef = useRef(null);
  const coverInputRef = useRef(null);

  // Dropzone hooks
  const {
    getRootProps: getSongRootProps,
    getInputProps: getSongInputProps,
    isDragActive: isSongDragActive
  } = useDropzone({
    onDrop: (files) => handleDrop(files, 'song'),
    accept: {
      'audio/mpeg': ['.mp3'],
      'audio/wav': ['.wav'],
      'audio/m4a': ['.m4a']
    },
    maxSize: 15 * 1024 * 1024 // 15MB
  });

  const {
    getRootProps: getCoverRootProps,
    getInputProps: getCoverInputProps,
    isDragActive: isCoverDragActive
  } = useDropzone({
    onDrop: (files) => handleDrop(files, 'cover'),
    accept: {
      'image/jpeg': ['.jpg', '.jpeg'],
      'image/png': ['.png'],
      'image/webp': ['.webp']
    },
    maxSize: 3 * 1024 * 1024 // 3MB
  });

  useEffect(() => {
    getToken().then(token => setToken(token));
  }, []);

  // Authentication check
  if (!user) {
    return <AuthRequired message="You must be logged in to upload songs." />;
  }

  // Drag and drop handler for files
  const handleDrop = (acceptedFiles, type) => {
    const file = acceptedFiles[0];
    if (type === 'song') {
      const allowedTypes = ['audio/mpeg', 'audio/mp3', 'audio/wav', 'audio/x-wav', 'audio/m4a', 'audio/x-m4a'];
      if (!allowedTypes.includes(file.type)) {
        setErrors(prev => ({
          ...prev,
          songFile: 'Audio file must be MP3, WAV, or M4A'
        }));
        return;
      }
      if (file.size > 15 * 1024 * 1024) {
        setErrors(prev => ({
          ...prev,
          songFile: 'Audio file must be less than 15MB'
        }));
        return;
      }
      setSongFile(file);
    } else if (type === 'cover') {
      const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
      if (!allowedTypes.includes(file.type)) {
        setErrors(prev => ({
          ...prev,
          coverFile: 'Cover art must be JPG, PNG, or WEBP'
        }));
        return;
      }
      if (file.size > 3 * 1024 * 1024) {
        setErrors(prev => ({
          ...prev,
          coverFile: 'Cover art must be less than 3MB'
        }));
        return;
      }
      setCoverFile(file);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleFileChange = (type, file) => {
    if (type === 'song') {
      setSongFile(file);
      // Additional song file validation can be added here
    }
    if (type === 'cover') {
      setCoverFile(file);
      // Additional cover file validation can be added here
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsUploading(true);
    try {
      console.log('Token: ', token);
    
      // Validate form
      const validationErrors = validateForm(formData, songFile);
      if (Object.keys(validationErrors).length > 0) {
        setErrors(validationErrors);
        return;
      }

      // Prepare form data
      const uploadData = new FormData();
      uploadData.append('title', formData.title);
      uploadData.append('genre', formData.genre || '');
      uploadData.append('album', formData.album || '');
      uploadData.append('description', formData.description || '');
      
      // Append streaming links
      uploadData.append('links', JSON.stringify(formData.links || {}));
      
      // Append files
      if (songFile) uploadData.append('audio', songFile);
      if (coverFile) uploadData.append('coverArt', coverFile);

      console.log('Upload Data: ', uploadData);

      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/songs/`, {
          method: 'POST',
          body: uploadData,
          headers: {
            'Authorization': `Bearer ${token}`,
          }
        });

        console.log('Response: ', response);

        if (response.ok) {
          const result = await response.json();
          alert('Song uploaded successfully!');
          // Reset form
          setFormData(createInitialFormData());
          setSongFile(null);
          setCoverFile(null);
          if (songInputRef.current) songInputRef.current.value = '';
          if (coverInputRef.current) coverInputRef.current.value = '';
        } else {
          const errorData = await response.text();
          alert(`Upload failed: ${errorData}`);
        }
      } catch (error) {
        console.error('Upload error:', error);
        alert('An error occurred during upload.');
      } finally {
        setIsUploading(false);
      }
    } catch (error) {
      console.error('Upload error:', error);
      alert('An error occurred during upload.');
    } finally {
      setIsUploading(false);
    }
  };

  if (!user) {
    return <AuthRequired message="You must be logged in to upload songs." />;
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-8 bg-gray-50 dark:bg-gray-900">
      <div className="w-full max-md:w-[90%] p-4">
        <div className='flex justify-between items-start'>
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Upload Song</h1>
          <p className="text-gray-600 dark:text-gray-300 mt-2">Share your music with the world</p>
        </div>

        <button 
            type="submit" 
            disabled={isUploading}
            onClick={handleSubmit}
            className="bg-blue-600 cursor-pointer text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isUploading ? (
              <div className="flex items-center justify-center gap-4">
                <AnimatedSpinner className="h-5 w-5" />
                Uploading...
              </div>
            ) : 'Upload Song'}
          </button> 
        </div>
        
        
        <form className="flex gap-6">
          <div>
            <div className='space-y-6'>
              <label className="block mb-2 text-sm font-medium">Song Title *</label>
              <input 
                type="text" 
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                placeholder="Enter song title"
                className={`w-full px-4 py-3 border rounded-lg bg-gray-50 dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300 ${errors.title ? 'border-red-500' : 'border-gray-300'}`}
                required 
              />
              {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
            </div>

            <div className="my-6">
              <div>
                <label className="block mb-2 text-sm font-medium">Song File *</label>
                <div 
                  {...getSongRootProps()} 
                  className={`w-full p-6 border-2 border-dashed rounded-lg text-center cursor-pointer transition duration-300 ${isSongDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-blue-500'}`}
                >
                  <input {...getSongInputProps()} />
                  <div className="flex flex-col items-center justify-center space-y-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    {songFile ? (
                      <p className="text-sm text-gray-600">{songFile.name}</p>
                    ) : (
                      <>
                        <p className="text-sm text-gray-600">Drag 'n' drop song file, or click to select</p>
                        <em className="text-xs text-gray-400">(MP3, WAV, M4A - max 15MB)</em>
                      </>
                    )}
                  </div>
                </div>
                {errors.songFile && <p className="text-red-500 text-sm mt-1">{errors.songFile}</p>}
              </div>

              <div className='my-6'>
                <label className="block mb-2 text-sm font-medium">Cover Image</label>
                <div 
                  {...getCoverRootProps()} 
                  className={`w-full p-6 border-2 border-dashed rounded-lg text-center cursor-pointer transition duration-300 ${isCoverDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-blue-500'}`}
                >
                  <input {...getCoverInputProps()} />
                  <div className="flex flex-col items-center justify-center space-y-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    {coverFile ? (
                      <p className="text-sm text-gray-600">{coverFile.name}</p>
                    ) : (
                      <>
                        <p className="text-sm text-gray-600">Drag 'n' drop cover image, or click to select</p>
                        <em className="text-xs text-gray-400">(JPG, PNG, WEBP - max 3MB)</em>
                      </>
                    )}
                  </div>
                </div>
                {errors.coverFile && <p className="text-red-500 text-sm mt-1">{errors.coverFile}</p>}
              </div>
            </div>

            <div className='my-6'>
            <label className="block mb-2 text-sm font-medium">Genre</label>
            <Select
              name="genre"
              options={[
                { value: 'gospel', label: 'Gospel' },
                { value: 'rock', label: 'Rock' },
                { value: 'pop', label: 'Pop' },
                { value: 'hip-hop', label: 'Hip Hop' },
                { value: 'electronic', label: 'Electronic' },
                { value: 'classical', label: 'Classical' },
                { value: 'jazz', label: 'Jazz' },
                { value: 'blues', label: 'Blues' },
                { value: 'country', label: 'Country' },
                { value: 'reggae', label: 'Reggae' },
                { value: 'soul', label: 'Soul' },
                { value: 'funk', label: 'Funk' },
                { value: 'r&b', label: 'R&B' },
                { value: 'metal', label: 'Metal' },
                { value: 'punk', label: 'Punk' },
                { value: 'folk', label: 'Folk' },
                { value: 'world', label: 'World Music' },
                { value: 'ambient', label: 'Ambient' },
                { value: 'indie', label: 'Indie' },
                { value: 'alternative', label: 'Alternative' },
                { value: 'latin', label: 'Latin' },
                { value: 'rap', label: 'Rap' },
                { value: 'amapiano', label: 'Amapiano' },
                { value: 'afrobeat', label: 'Afrobeat' },
                { value: 'afropop', label: 'Afropop' },
                { value: 'afroswing', label: 'Afroswing' },
                { value: 'afrojazz', label: 'Afrojazz' },
                { value: 'afrohouse', label: 'Afrohouse' },
                { value: 'afrodisco', label: 'Afrodisco' },
                { value: 'other', label: 'Other' }
              ]}
              value={formData.genre ? { value: formData.genre, label: formData.genre.charAt(0).toUpperCase() + formData.genre.slice(1) } : null}
              onChange={(selectedOption) => {
                setFormData(prev => ({
                  ...prev,
                  genre: selectedOption ? selectedOption.value : ''
                }));
              }}
              placeholder="Select or search genre..."
              isSearchable={true}
              styles={{
                control: (base) => ({
                  ...base,
                  backgroundColor: 'rgb(249, 250, 251)', // bg-gray-50
                  borderColor: '#D1D5DB',
                  borderRadius: '0.5rem',
                  padding: '6px',
                  boxShadow: 'none',
                  '&:hover': {
                    borderColor: '#3B82F6', // blue-500
                  }
                }),
                menu: (base) => ({
                  ...base,
                  backgroundColor: 'white',
                  zIndex: 9999,
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
                }),
                option: (base, state) => ({
                  ...base,
                  backgroundColor: state.isSelected ? '#3B82F6' : 'white',
                  color: state.isSelected ? 'white' : 'black',
                  '&:hover': {
                    backgroundColor: state.isSelected ? '#3B82F6' : '#F3F4F6'
                  }
                })
              }}
            />
          </div>

            <div className='my-6'>
              <label className="block mb-2 text-sm font-medium">Lyrics</label>
              <textarea 
                name="lyrics"
                value={formData.lyrics}
                onChange={handleInputChange}
                placeholder="Enter song lyrics (optional)"
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white dark:bg-gray-700 dark:text-white"
              />
            </div>
          </div>
          
          <div>

          <div className='mb-6'>
            <label className="block mb-2 text-sm font-medium">Description</label>
            <textarea 
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Optional description about the song"
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white dark:bg-gray-700 dark:text-white"
            />
          </div>

          <div className='my-6'>
            <h3 className="text-lg font-semibold mb-3">Streaming Platform Links</h3>
            <div className="grid grid-cols-2 gap-4">
              {Object.keys(formData.links).map((platform) => (
                <div key={platform}>
                  <label className="block mb-1 text-sm capitalize">{platform.replace(/([A-Z])/g, ' $1')}</label>
                  <input 
                    type="url"
                    name={`links.${platform}`}
                    value={formData.links[platform]}
                    onChange={(e) => {
                      const newLinks = {...formData.links};
                      newLinks[platform] = e.target.value;
                      setFormData(prev => ({
                        ...prev,
                        links: newLinks
                      }));
                    }}
                    placeholder={`${platform} song link`}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white dark:bg-gray-700 dark:text-white"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* <div className='my-6'>
            <label className="block mb-2 text-sm font-medium">Album</label>
            <input 
              type="text" 
              name="album"
              value={formData.album}
              onChange={handleInputChange}
              placeholder="Enter album name (optional)"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white dark:bg-gray-700 dark:text-white"
            />
          </div> */}

          <div className="flex items-center">
            <input 
              type="checkbox" 
              name="isExplicit"
              checked={formData.isExplicit}
              onChange={handleInputChange}
              className="mr-2"
            />
            <label className="text-sm">Explicit Content</label>
          </div>

          </div>

        </form>
      </div>
    </div>
  );
}

