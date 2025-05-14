"use client";

import Link from 'next/link';

export default function AuthRequired({ message = "Please log in to view your activity" }) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-gray-900 text-gray-900 dark:text-white">
        <div className="text-center">
          <p className="text-xl mb-4">{message}</p>
          <Link 
            href="/auth/login" 
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            Log In
          </Link>
        </div>
      </div>
    );
}

