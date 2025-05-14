"use client";

import React, { createContext, useState, useContext } from 'react';

const SongOptionsContext = createContext({
  openDropdownId: null,
  setOpenDropdownId: () => {}
});

export function SongOptionsProvider({ children }) {
  const [openDropdownId, setOpenDropdownId] = useState(null);

  return (
    <SongOptionsContext.Provider value={{ openDropdownId, setOpenDropdownId }}>
      {children}
    </SongOptionsContext.Provider>
  );
}

export function useSongOptions() {
  return useContext(SongOptionsContext);
}
