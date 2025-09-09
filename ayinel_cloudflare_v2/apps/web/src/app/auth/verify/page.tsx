'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { api } from '@/lib/api';

export default function VerifyPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isVerifying, setIsVerifying] = useState(true);
  const [error, setError] = useState('');
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const token = searchParams.get('token');

    if (!token) {
      setError('No verification token found');
      setIsVerifying(false);
      return;
    }

    const verifyToken = async () => {
      try {
        const response = await api.post('/auth/verify', { token });
        const { accessToken, refreshToken, user: userData } = response.data;

        // Store tokens
        localStorage.setItem('accessToken', accessToken);
        localStorage.setItem('refreshToken', refreshToken);
        localStorage.setItem('user', JSON.stringify(userData));

        // Set user data
        setUser(userData);

        // Redirect to dashboard or home
        setTimeout(() => {
          router.push('/dashboard');
        }, 2000);
      } catch (error: any) {
        setError(error.response?.data?.message || 'Failed to verify token');
      } finally {
        setIsVerifying(false);
      }
    };

    verifyToken();
  }, [searchParams, router]);

  if (isVerifying) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-white mx-auto mb-4"></div>
          <h2 className="text-2xl font-bold text-white mb-2">Verifying...</h2>
          <p className="text-purple-200">
            Please wait while we verify your account
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center px-4">
        <div className="max-w-md w-full text-center">
          <div className="text-red-400 text-6xl mb-4">✗</div>
          <h2 className="text-2xl font-bold text-white mb-4">
            Verification Failed
          </h2>
          <p className="text-purple-200 mb-6">{error}</p>
          <Link
            href="/auth/login"
            className="inline-block bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300"
          >
            Try Again
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        <div className="text-green-400 text-6xl mb-4">✓</div>
        <h2 className="text-2xl font-bold text-white mb-4">
          Welcome to Ayinel!
        </h2>
        {user && (
          <p className="text-purple-200 mb-6">
            Welcome back, <strong>{user.displayName}</strong>!
          </p>
        )}
        <p className="text-purple-200 mb-6">
          Your account has been verified successfully. Redirecting to
          dashboard...
        </p>
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto"></div>
      </div>
    </div>
  );
}
