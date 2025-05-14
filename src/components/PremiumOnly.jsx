import { useAuth } from "../AuthContext";
import { Navigate } from "react-router-dom";

export default function PremiumOnly({ children }) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  if (!user.isPremium) return (
    <div className="max-w-lg mx-auto p-8 text-center">
      <div className="text-2xl mb-4">🔒 Premium Feature</div>
      <div className="mb-4">This feature is available to premium users only.</div>
      <a href="/premium" className="inline-block bg-yellow-400 text-white font-bold px-4 py-2 rounded">Upgrade to Premium</a>
    </div>
  );
  return children;
}
