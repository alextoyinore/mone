import { useState } from "react";

export default function MessageModal({ open, onClose, recipient, onSend }) {
  const [message, setMessage] = useState("");
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-black bg-opacity-30">
      <div className="bg-white rounded shadow-lg p-6 w-80 relative">
        <button onClick={onClose} className="absolute top-2 right-2 text-gray-400 hover:text-gray-600">✕</button>
        <div className="mb-3 font-semibold text-lg">Message to {recipient.name || recipient.email}</div>
        <textarea
          className="w-full border rounded p-2 mb-4"
          rows={4}
          placeholder="Type your message..."
          value={message}
          onChange={e => setMessage(e.target.value)}
        />
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded w-full font-semibold hover:bg-blue-700"
          onClick={() => { onSend(message); setMessage(""); }}
          disabled={!message.trim()}
        >Send</button>
      </div>
    </div>
  );
}
