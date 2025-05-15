import React from "react";
import { ToastProvider } from "./components/ToastProvider";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import PageTitleManager from "./components/PageTitleManager";
import { AuthProvider } from "./AuthContext";
import { PlayerProvider } from "./contexts/PlayerContext";
import ProtectedRoute from "./contexts/ProtectedRoute";
import AppLayout from "./components/AppLayout";
import Home from "./pages/Home";
import Albums from "./pages/Albums";
import Artists from "./pages/Artists";
import ArtistProfile from "./pages/ArtistProfile";
import Profile from "./pages/Profile";
import Login from "./pages/Login";
import UploadSong from "./pages/UploadSong";
import SongDetails from "./pages/SongDetails";
import Songs from "./pages/Songs";
import SearchResults from "./pages/SearchResults";
import Favorites from "./pages/Favorites";
import RecentlyPlayed from "./pages/RecentlyPlayed";
import FollowedArtists from "./pages/FollowedArtists";
import Playlists from "./pages/Playlists";
import Feed from "./pages/Feed";
import Inbox from "./pages/Inbox";
import EditProfile from "./pages/EditProfile";
import PublicPlaylist from "./pages/PublicPlaylist";
import PublicSong from "./pages/PublicSong";
import EmbedSong from "./pages/EmbedSong";
import EmbedPlaylistPage from "./pages/EmbedPlaylist";
import PublicAlbum from "./pages/PublicAlbum";
import EmbedAlbumPage from "./pages/EmbedAlbum";
import UserProfile from "./pages/UserProfile";
import Explore from "./pages/Explore";
import ArtistDashboard from "./pages/ArtistDashboard";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";
import AdminDashboard from "./pages/AdminDashboard";
import Premium from "./pages/Premium";
import Register from "./pages/Register";
import './index.css';

import { ThemeProvider } from "./ThemeContext";
import PlaylistsPage from "./app/playlists/page";

export default function App() {
  return (
    <ThemeProvider>
      <ToastProvider>
        <AuthProvider>
          <PlayerProvider>
            <Router>
              <PageTitleManager>
                <Routes>
                  <Route path="login" element={<Login />} />
                  <Route path="register" element={<Register />} />
                  <Route element={<AppLayout />}>
                    <Route index element={<Home />} />
                    <Route path="songs" element={<Songs />} />
                    <Route path="playlists" element={<ProtectedRoute><Playlists /></ProtectedRoute>} />
                    <Route path="albums" element={<ProtectedRoute><Albums /></ProtectedRoute>} /> 
                    <Route path="artist/:id" element={<ArtistProfile />} />
                    <Route path="profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
                    <Route path="edit-profile" element={<ProtectedRoute><EditProfile /></ProtectedRoute>} />
                    <Route path="upload" element={<ProtectedRoute><UploadSong /></ProtectedRoute>} />
                    <Route path="song/:id" element={<SongDetails />} />
                    <Route path="embed/song/:id" element={<EmbedSong />} />
                    <Route path="embed/playlist/:id" element={<EmbedPlaylistPage />} />
                    <Route path='artists' element={<Artists />} />
                    <Route path="album/:id" element={<PublicAlbum />} />
                    <Route path="embed/album/:id" element={<EmbedAlbumPage />} />
                    <Route path="user/:id" element={<UserProfile />} />
                    <Route path="explore" element={<Explore />} />
                    <Route path="search" element={<SearchResults />} />
                    <Route path="favorites" element={<Favorites />} />
                    <Route path="inbox" element={<ProtectedRoute><Inbox /></ProtectedRoute>} />
                    <Route path="recent" element={<RecentlyPlayed />} />
                    <Route path="followed" element={<FollowedArtists />} />
                    <Route path="feed" element={<Feed />} />
                    <Route path="playlist/public/:slug" element={<PublicPlaylist />} />
                    <Route path="playlist/:id" element={<PlaylistsPage />} />
                    <Route path="song/public/:id" element={<PublicSong />} />
                    <Route path="artist-dashboard" element={<ArtistDashboard />} />
                    <Route path="admin-dashboard" element={<AdminDashboard />} />
                    <Route path="premium" element={<ProtectedRoute><Premium /></ProtectedRoute>} />
                    <Route path="settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
                    <Route path="*" element={<NotFound />} />
                  </Route>
                </Routes>
              </PageTitleManager>
            </Router>
          </PlayerProvider>
        </AuthProvider>
      </ToastProvider>
    </ThemeProvider>
  );
}

