"use client";

import { useAuth } from '../contexts/AuthContext';
import { redirect } from 'next/navigation';

export default function AuthRequired({ message = "Please log in to view your activity" }) {

    const { user } = useAuth();

    if (!user) {
      return redirect('/auth/login');
    }
    
    return null;
}

