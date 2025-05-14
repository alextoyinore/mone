import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const routeTitles = {
  "/": "Home - Xitoplay",
  'login': 'Login - Xitoplay',
  'register': 'Register - Xitoplay',
  "/upload": "Upload Song - Xitoplay",
  "/uploadsong": "Upload Song - Xitoplay",
  "/profile": "Profile - Xitoplay",
  'artists': 'Artists - Xitoplay',
  "/artist": "Artist Profile - Xitoplay",
  "/inbox": "Inbox - Xitoplay",
  // Add more routes as needed

};

export default function PageTitleManager() {
  const location = useLocation();

  useEffect(() => {
    // Try to match the current path exactly, or by prefix for dynamic routes
    let title = routeTitles[location.pathname];
    if (!title) {
      // Handle dynamic routes like /artist/:id or /song/:id
      if (location.pathname.startsWith("/artist/")) title = "Artist Profile - Xitoplay";
      else if (location.pathname.startsWith("/song/")) title = "Song - Xitoplay";
      else if (location.pathname.startsWith("/album/")) title = "Album - Xitoplay";
      else if (location.pathname.startsWith("/playlist/")) title = "Playlist - Xitoplay";
      else if (location.pathname.startsWith("/inbox/")) title = "Inbox - Xitoplay";
      else if (location.pathname.startsWith("/notifications/")) title = "Notifications - Xitoplay";
      else if (location.pathname.startsWith("/search/")) title = "Search - Xitoplay";
      else title = "Xitoplay";
    }
    document.title = title;
  }, [location.pathname]);

  return null;
}
