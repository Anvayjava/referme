'use client';

import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import NewPostModal from './NewPostModal';

export default function Navigation() {
  const { user, logout, isAuthenticated } = useAuth();
  const [showDropdown, setShowDropdown] = useState(false);
  const [showNewPostModal, setShowNewPostModal] = useState(false);
  const router = useRouter();
  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between h-16">
          <div className="flex items-center space-x-8">
            <Link href="/" className="text-2xl font-bold text-blue-600">
              ReferMe
            </Link>
            {isAuthenticated && (
              <div className="hidden md:flex space-x-4">
                <Link href="/" className="text-gray-900 font-semibold px-3 py-2 border-b-2 border-blue-600">
                  Home
                </Link>
                <Link href="/referrals" className="text-gray-600 hover:text-gray-900 px-3 py-2">
                  Referrals
                </Link>
                <Link href="/messages" className="text-gray-600 hover:text-gray-900 px-3 py-2 relative">
                  Messages
                  <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                </Link>
              </div>
            )}
          </div>
          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <>
                <button
                  onClick={() => setShowNewPostModal(true)}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 font-semibold"
                >
                  + New Post
                </button>
                <div className="relative">
                  <button
                    onClick={() => setShowDropdown(!showDropdown)}
                    className="flex items-center space-x-2 hover:bg-gray-100 px-3 py-2 rounded-lg"
                  >
                    <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                      {user?.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <span className="hidden md:block text-sm font-medium">{user?.name}</span>
                    <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>

                  {showDropdown && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                      <Link
                        href="/profile"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setShowDropdown(false)}
                      >
                        View Profile
                      </Link>
                      <hr className="my-2" />
                      <button
                        onClick={async () => {
                          await logout();
                          setShowDropdown(false);
                          router.push('/login');
                        }}
                        className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                      >
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
                <Link href="/login" className="text-gray-600 hover:text-gray-900 px-4 py-2 font-medium">
                  Log In
                </Link>
                <Link href="/signup" className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 font-semibold">
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      </div>

      <NewPostModal
        isOpen={showNewPostModal}
        onClose={() => setShowNewPostModal(false)}
        onPostCreated={(post) => {
          setShowNewPostModal(false);
          // Refresh the page to show the new post
          router.refresh();
        }}
      />
    </nav>
  );
}
