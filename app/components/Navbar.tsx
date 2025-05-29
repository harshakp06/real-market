'use client';

import Link from 'next/link';
import { useSession, signIn, signOut } from 'next-auth/react';

export default function Navbar() {
  const { data: session } = useSession();

  return (
    <nav className="bg-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <Link href="/" className="flex-shrink-0 flex items-center">
              <span className="text-xl font-bold text-gray-800">Real Market</span>
            </Link>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              <Link href="/properties" className="text-gray-900 inline-flex items-center px-1 pt-1 text-sm font-medium">
                Properties
              </Link>
              <Link href="/blog" className="text-gray-900 inline-flex items-center px-1 pt-1 text-sm font-medium">
                Blog
              </Link>
            </div>
          </div>
          <div className="flex items-center">
            {session ? (
              <>
                {session.user?.email?.includes('admin') && (
                  <Link href="/admin" className="text-gray-900 hover:text-gray-700 px-3 py-2 rounded-md text-sm font-medium">
                    Admin
                  </Link>
                )}
                <button
                  onClick={() => signOut()}
                  className="ml-4 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm font-medium"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <button
                onClick={() => signIn('credentials')}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium"
              >
                Sign In
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
} 