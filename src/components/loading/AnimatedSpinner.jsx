"use client";

import React from 'react';

export default function AnimatedSpinner({ className = "h-5 w-5" }) {
  return (
    <div className={`relative ${className}`}>
      <div className="absolute inset-0 rounded-full opacity-25"></div>
      <div className="absolute inset-0 rounded-full opacity-50 transform rotate-45"></div>
      <div className="absolute inset-0 rounded-full opacity-75 transform rotate-90"></div>
      <div className="absolute inset-0 rounded-full opacity-100 transform rotate-135"></div>
    </div>
  );
}
