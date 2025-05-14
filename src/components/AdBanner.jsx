import { useAuth } from "../AuthContext";

export default function AdBanner() {
  const { user } = useAuth();
  if (user && user.isPremium) return null;
  // Example ad, replace with real ad code or provider
  return (
    <div className="w-full bg-yellow-100 border border-yellow-300 text-yellow-800 text-center py-2 px-4 rounded mb-6">
      <b>Ad:</b> Discover new music and deals! Upgrade to <a href="/premium" className="underline font-bold">Premium</a> for an ad-free experience.
    </div>
  );
}
