import React from "react";

export default function MentionDropdown({ users, onSelect, position }) {
  if (!users.length) return null;
  return (
    <ul
      className="absolute z-50 bg-white border rounded shadow w-56 max-h-48 overflow-y-auto"
      style={position}
    >
      {users.map(user => (
        <li
          key={user.email}
          className="px-3 py-2 cursor-pointer hover:bg-lime-100"
          onClick={() => onSelect(user)}
        >
          <span className="font-semibold">{user.fullname || user.name}</span>
          <span className="ml-2 text-xs text-gray-500">@{user.name}</span>
        </li>
      ))}
    </ul>
  );
}
