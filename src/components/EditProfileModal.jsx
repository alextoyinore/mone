import { useState } from "react";

export default function EditProfileModal({ open, user, onClose, onSave }) {
  const [fullname, setFullname] = useState(user.fullname || "");
  const [avatar, setAvatar] = useState(user.avatar || "");
  const [bio, setBio] = useState(user.bio || "");
  const [social, setSocial] = useState(user.social || {});
  const [saving, setSaving] = useState(false);
  if (!open) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
      <div className="bg-white rounded shadow p-6 w-full max-w-md relative">
        <button className="absolute top-2 right-2 text-gray-500" onClick={onClose}>✕</button>
        <h2 className="text-xl font-bold mb-4">Edit Profile</h2>
        <div className="mb-3">
          <label className="block font-semibold mb-1">Full Name</label>
          <input className="border rounded px-2 py-1 w-full" value={fullname} onChange={e => setFullname(e.target.value)} />
        </div>
        <div className="mb-3">
          <label className="block font-semibold mb-1">Avatar URL</label>
          <input className="border rounded px-2 py-1 w-full" value={avatar} onChange={e => setAvatar(e.target.value)} />
        </div>
        <div className="mb-3">
          <label className="block font-semibold mb-1">Bio</label>
          <textarea className="border rounded px-2 py-1 w-full" rows={3} value={bio} onChange={e => setBio(e.target.value)} />
        </div>
        <div className="mb-3">
          <label className="block font-semibold mb-1">Social Links (JSON)</label>
          <input className="border rounded px-2 py-1 w-full" value={JSON.stringify(social)} onChange={e => {
            try { setSocial(JSON.parse(e.target.value)); } catch { setSocial({}); } }} />
        </div>
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded mt-2 w-full"
          disabled={saving}
          onClick={async () => {
            setSaving(true);
            await onSave({ fullname, avatar, bio, social });
            setSaving(false);
          }}
        >{saving ? "Saving..." : "Save"}</button>
      </div>
    </div>
  );
}
