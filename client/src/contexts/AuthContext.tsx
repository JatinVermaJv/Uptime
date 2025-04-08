'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '@/types';
import { getCurrentUser } from '@/utils/auth';

interface AuthContextType {
  user: User | null;
  updateUser: (data: Partial<User> & { currentPassword?: string; newPassword?: string }) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const user = getCurrentUser();
    setUser(user);
  }, []);

  const updateUser = async (data: Partial<User> & { currentPassword?: string; newPassword?: string }) => {
    // Here you would typically make an API call to update the user
    // For now, we'll just update the local state
    if (user) {
      setUser({ ...user, ...data });
    }
  };

  return (
    <AuthContext.Provider value={{ user, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
} 