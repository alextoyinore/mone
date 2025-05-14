import { useAuth } from "../AuthContext";

export default function DownloadButton({ songId, songTitle }) {
  const { user } = useAuth();

  const handleDownload = () => {
    window.open(`/api/songs/${songId}/download`, '_blank');
  };

  if (!user) return null;
  if (!user.isPremium) {
    return (
      <a href="/premium" className="inline-block bg-yellow-400 text-white text-xs font-bold px-2 py-1 rounded mt-2">Upgrade to Download</a>
    );
  }
  return (
    <button
      onClick={handleDownload}
      className="bg-blue-500 hover:bg-blue-600 text-white text-xs font-bold px-2 py-1 rounded mt-2"
      title={`Download ${songTitle}`}
    >
      Download
    </button>
  );
}
