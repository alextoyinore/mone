"use client";

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';
import Image from 'next/image';
import LoadingSpinner from '@/components/loading/LoadingSpinner';
import GridSongItem from '@/components/GridSongItem';
import ListSongItem from '@/components/ListSongItem';
import GridIcon from '@/components/icons/GridIcon';
import ListIcon from '@/components/icons/ListIcon';
import SearchIcon from '@/components/icons/SearchIcon';
import { useAudioPlayer } from '@/contexts/AudioPlayerContext';
import PlaylistGridItem from '@/components/PlaylistGridItem';
import PlaylistListItem from '@/components/PlaylistListItem';
import GridArtistItem from '@/components/GridArtistItem';
// import { useFollow } from '@/contexts/FollowContext';


export default function SearchPage() {
  const { user, token } = useAuth();
  // const { followArtist, unfollowArtist, isFollowing } = useFollow();
  const [viewMode, setViewMode] = useState('grid');
  const searchParams = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');
  const [activeTab, setActiveTab] = useState('songs');
  const {setSongsForPlayback, playSong} = useAudioPlayer();
  const [searchResults, setSearchResults] = useState({
    songs: [],
    artists: [],
    playlists: []
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSearch = async (e) => {
    if(e){
      e.preventDefault();
    }
    
    if (!searchQuery.trim()) return;

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/search?q=${searchQuery}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Search failed');
      }

      const data = await response.json();
      console.log(data);
      setSearchResults(data);
    } catch (err) {
      setError('Failed to perform search. Please try again.', err.message);
      setSearchResults({
        songs: [],
        artists: [],
        playlists: []
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handlePlayAll = () => {
    if (searchResults.songs.length > 0) {
      setSongsForPlayback(searchResults.songs);
      playSong(searchResults.songs[0]);
    }
  };

  const handlePlayAllPlaylists = () => {
    if (searchResults.playlists.length > 0) {
      const songs = searchResults.playlists.map((playlist) => playlist.songs);
      setSongsForPlayback(songs.flat());
      playSong(songs.flat()[0]);
    }
  };

  useEffect(() => {
    const q = searchParams.get('q');
    if (q) {
      setSearchQuery(q);
      handleSearch();
    }
  }, [searchParams]);

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-black text-gray-900 dark:text-white">
        <div className="text-center">
          <p className="text-xl mb-4">Please log in to access search</p>
          <Link 
            href="/login" 
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            Log In
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-black text-gray-900 dark:text-white">
      
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Search</h1>

      <div className="">
        {
          viewMode === 'list' ? (
            <button
            onClick={() => setViewMode('grid')}
            className={`py-2 rounded-lg transition capitalize`}
          >
            <GridIcon className="w-5 h-5" />
          </button>
          ) : (
            <button
            onClick={() => setViewMode('list')}
            className={`py-2 rounded-lg transition capitalize`}
          >
            <ListIcon className="w-5 h-5" />
          </button>
          )
        }
        </div> 
      </div> 
       
      
      <form className="mb-6">
        <div className="relative">
          <input 
            type="text" 
            value={searchQuery}
            onChange={(e) => {setSearchQuery(e.target.value) ; handleSearch(e) }}
            placeholder="Search songs, artists, albums..."
            className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-100 dark:bg-gray-900 dark:text-white"
          />
          <button 
            type="submit" 
            disabled={isLoading}
            onClick={(e) => {e.preventDefault(); handleSearch(e)}}
            className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-600 dark:text-gray-300 disabled:opacity-50"
          >
            {isLoading ? <LoadingSpinner className="h-5 w-5" /> : <SearchIcon className="h-5 w-5" />}
          </button>
        </div>
      </form>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded relative mb-4" role="alert">
          <span className="block sm:inline">{error}</span>
        </div>
      )}

      <div className="mb-6 flex space-x-4">
        {(['songs', 'artists', 'playlists']).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-lg transition capitalize ${
              activeTab === tab 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-200 dark:bg-gray-900 text-gray-700 dark:text-gray-300'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-blue-500"></div>
        </div>
      ) : searchQuery && searchResults[activeTab].length === 0 ? (
        <div className="text-center text-gray-500 dark:text-gray-400">
          <p>No {activeTab} found for "{searchQuery}"</p>
        </div>
      ) : !searchQuery ? (
        <div className="text-center text-gray-500 dark:text-gray-400">
          <p>Enter a search query to find songs, artists, albums, and playlists</p>
        </div>
      ) : (
        <>
        <div className='mb-6 text-sm text-gray-600 dark:text-gray-400'>
            {
              activeTab === 'songs' && <div className='flex gap-3'> {searchResults.songs.length} songs found for "{searchQuery}" <span className="text-blue-600 cursor-pointer" 
              onClick={() => handlePlayAll()} >Play All</span>
              <span className="text-gray-600 cursor-pointer"
              onClick={() => {setSearchQuery(''); setSearchResults({songs: [], artists: [], playlists: []}); setActiveTab('songs')}}>Clear</span></div>
            }
              
            {
              activeTab === 'artists' && <div className='flex gap-3'> {searchResults.artists.length} artists found for "{searchQuery}" <span className="text-blue-600 cursor-pointer" 
              onClick={() => setArtistsForPlayback(searchResults.artists)} >Play All</span>
              <span className="text-gray-600 cursor-pointer"
              onClick={() => {setSearchQuery(''); setSearchResults({songs: [], artists: [], playlists: []}); setActiveTab('artists')}}>Clear</span></div>
            }

            {
              activeTab === 'playlists' && <div className='flex gap-3'> {searchResults.playlists.length} playlists found for "{searchQuery}" <span className="text-blue-600 cursor-pointer" 
              onClick={() => handlePlayAllPlaylists()} >Play All</span>
              <span className="text-gray-600 cursor-pointer"
              onClick={() => {setSearchQuery(''); setSearchResults({songs: [], artists: [], playlists: []}); setActiveTab('playlists')}}>Clear</span></div>
            }
            
          </div>
        <div className={`${viewMode === 'grid' ? 'grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5' : 'flex flex-col'}`}>
          
          {activeTab === 'songs' && searchResults.songs.map((song) =>   
              viewMode === 'grid' ? (
                  <GridSongItem
                  key={song._id}
                  song={song}
                  songTitle={song.title}
                  songArtist={song.artist.name}
                  songCoverArt={song.coverArt || 'https://via.placeholder.com/64'}
                  playSong={() => playSong(song)}
                />
                ) : (
                  <ListSongItem
                  key={song._id}
                  song={song}
                  songTitle={song.title}
                  songArtist={song.artist.name}
                  songCoverArt={song.coverArt || 'https://via.placeholder.com/64'}
                  playSong={() => playSong(song)}
                />
                )
          )}

          {activeTab === 'artists' && searchResults.artists.map((artist) => (
            <GridArtistItem
              key={artist._id}
              artist={artist}
              playSong={() => playSong(artist.songs[0])}
              followArtist={(artistId) => handleFollowArtist(artistId)}
              isFollowing={user?.following?.includes(artist._id)}
            />
          ))}

          {activeTab === 'playlists' && searchResults.playlists.map((playlist) => (
            viewMode === 'grid' ? (
              <PlaylistGridItem
              key={playlist._id}
              playlist={playlist}
              handleDeletePlaylist={() => {}}
            />
            ) : (
              <PlaylistListItem
              key={playlist._id}
              playlist={playlist}
              handleDeletePlaylist={() => {}}
            />
            )
          ))}
        </div>
        </>
      )}
    </div>
    
  );
}
