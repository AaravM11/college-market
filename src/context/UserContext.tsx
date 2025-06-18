'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth } from '@/lib/firebaseAuth';

interface ContactInfo {
  email: string;
  phone?: string;
}

interface AppUser {
  uid: string;
  name: string;
  email: string;
  photoURL?: string;
  contactInfo?: ContactInfo;
}

interface UserContextType {
  user: AppUser | null;
  loading: boolean;
  setUser: React.Dispatch<React.SetStateAction<AppUser | null>>;
}

const UserContext = createContext<UserContextType>({ user: null, loading: true, setUser: () => {} });

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AppUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        // Fetch full user profile from backend
        let contactInfo = undefined;
        try {
          const res = await fetch(`/api/users?uid=${firebaseUser.uid}`);
          if (res.ok) {
            const data = await res.json();
            if (data.user && data.user.contactInfo) {
              contactInfo = data.user.contactInfo;
            }
          }
        } catch (e) {
          // ignore fetch errors, fallback to auth info only
        }
        setUser({
          uid: firebaseUser.uid,
          name: firebaseUser.displayName || '',
          email: firebaseUser.email || '',
          photoURL: firebaseUser.photoURL || undefined,
          contactInfo,
        });
      } else {
        setUser(null);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  return (
    <UserContext.Provider value={{ user, loading, setUser }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  return useContext(UserContext);
} 