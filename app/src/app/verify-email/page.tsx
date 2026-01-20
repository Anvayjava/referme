'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function VerifyEmailPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="text-4xl font-bold text-blue-600">
            ReferMe
          </Link>
          <h2 className="mt-6 text-3xl font-bold text-gray-900">
            Check your email
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            We've sent you a verification email
          </p>
        </div>

        {/* Info Card */}
        <div className="bg-white rounded-lg shadow-sm p-8">
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Verify your email address</h3>
            <p className="text-sm text-gray-600">
              Click the verification link in the email we sent you to activate your account.
            </p>
          </div>

          <div className="bg-blue-50 rounded-lg p-4">
            <h4 className="font-semibold text-blue-900 mb-2 text-sm">What to do next:</h4>
            <ul className="text-xs text-blue-800 space-y-2">
              <li>• Check your inbox for the verification email</li>
              <li>• Click the verification link to activate your account</li>
              <li>• If you don't see it, check your spam folder</li>
              <li>• The link expires in 24 hours</li>
            </ul>
          </div>

          <div className="mt-6 text-center">
            <Link
              href="/login"
              className="inline-block w-full bg-blue-600 text-white py-2 px-4 rounded-lg font-semibold hover:bg-blue-700"
            >
              Go to Login
            </Link>
          </div>
        </div>

        <div className="mt-4 text-center">
          <Link href="/signup" className="text-sm text-gray-600 hover:underline">
            ← Back to sign up
          </Link>
        </div>
      </div>
    </div>
  );
}
