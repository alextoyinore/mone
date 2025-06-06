"use client";

import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import toast from 'react-hot-toast';
import GoogleIcon from '@/components/icons/GoogleIcon';
import { EyeOpenIcon, EyeClosedIcon } from '@/components/icons/EyeIcons';
import XitoIcon from '@/assets/icondark.svg';
import LoadingSpinner from '@/components/loading/LoadingSpinner';

export default function SignupPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { signUpWithEmail, signInWithGoogle } = useAuth();
  const router = useRouter();

  const handleEmailSignup = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await signUpWithEmail(email, password, { displayName });

      toast.success('Account created successfully');
      router.push('/');
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleGoogleSignup = async () => {
    setIsLoading(true);
    try {
      await signInWithGoogle();
      toast.success('Signed up with Google');
      router.push('/');
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <>
      <div className='flex items-center justify-center cursor-pointer gap-1 mb-6'>
        <Image src={XitoIcon} alt="Logo" width={28} height={28} />
        <span className='text-xl font-bold text-gray-800 dark:text-white'>itoplay</span>
      </div>
      <div>
        <h2 className="mt-2 text-center text-3xl font-extrabold text-gray-900 dark:text-white">
          Create your account
        </h2>
      </div>
        <form className="mt-8 space-y-6" onSubmit={handleEmailSignup}>
          <div className="rounded-md -space-y-px">
            <div>
              <label htmlFor="displayName" className="sr-only">Display Name</label>
              <input
                id="displayName"
                name="displayName"
                type="text"
                required
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                className="appearance-none focus:outline-none rounded-none relative block w-full px-3 py-2 border border-gray-300 dark:border-gray-700 placeholder-gray-500 text-gray-900 dark:text-white rounded-t-md sm:text-sm bg-gray-100 dark:bg-gray-900"
                placeholder="Display Name"
              />
            </div>
            <div>
              <label htmlFor="email" className="sr-only">Email address</label>
              <input
                id="email"
                name="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="appearance-none focus:outline-none rounded-none relative block w-full px-3 py-2 border border-gray-300 dark:border-gray-700 placeholder-gray-500 text-gray-900 dark:text-white sm:text-sm bg-gray-100 dark:bg-gray-900"
                placeholder="Email address"
              />
            </div>
            <div className="relative">
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                autoComplete="new-password"
                required
                className="appearance-none focus:outline-none rounded-b-md relative block w-full px-3 py-2 border border-gray-300 dark:border-gray-700 placeholder-gray-500 text-gray-900 dark:text-white bg-gray-100 dark:bg-gray-900 sm:text-sm pr-10"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5"
              >
                {showPassword ? <EyeOpenIcon /> : <EyeClosedIcon />}
              </button>
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              {isLoading ? <LoadingSpinner className="h-5 w-5" /> : 'Create Account'}
            </button>
          </div>
        </form>

        <div className="mt-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300 dark:border-gray-700"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 text-gray-500 bg-gray-100 dark:bg-gray-900 dark:text-gray-400">
                Or sign up with
              </span>
            </div>
          </div>

          <div className="mt-6">
            <button
              onClick={handleGoogleSignup}
              className="w-full flex items-center justify-center py-2 px-4 rounded-md text-sm font-medium text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-900 bg-gray-200 dark:bg-gray-900"
            >
              <GoogleIcon className="w-5 h-5 mr-2" />
              {isLoading ? <LoadingSpinner className="h-5 w-5" /> : 'Sign up with Google'}
            </button>
          </div>
        </div>
        <div className="mt-4 text-center">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Already have an account?{' '}
            <Link 
              href="/auth/login" 
              className="font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-500"
            >
              Sign in
            </Link>
          </p>
        </div>
    </>
  );
}
