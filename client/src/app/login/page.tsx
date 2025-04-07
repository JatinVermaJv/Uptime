'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import AuthForm from '@/components/auth/AuthForm';
import { auth, handleApiError } from '@/services/api';

type LoginResponse = {
  data: {
    token: string;
    user: {
      id: string;
      email: string;
      name: string;
    };
    message: string;
  };
};

export default function LoginPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (data: { email: string; password: string }) => {
    setIsLoading(true);
    setError(null);
    console.log('Starting login with data:', { ...data, password: '[REDACTED]' });

    try {
      const response = await auth.login(data) as LoginResponse;
      console.log('Login successful:', response.data);
      
      const { token, user } = response.data;

      // Store token in both localStorage and cookies
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      document.cookie = `token=${token}; path=/; max-age=86400; SameSite=Strict`; // Expires in 1 day
      console.log('Stored auth data in localStorage and cookies');

      // Redirect to dashboard
      console.log('Attempting to redirect to dashboard...');
      router.push('/dashboard');
    } catch (err) {
      console.error('Login error:', err);
      const errorMessage = handleApiError(err);
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900">
      <AuthForm
        mode="login"
        onSubmit={handleSubmit}
        isLoading={isLoading}
      />
      {error && (
        <div className="fixed bottom-4 right-4 bg-red-900 text-white px-4 py-2 rounded-md shadow-lg">
          {error}
        </div>
      )}
    </div>
  );
} 