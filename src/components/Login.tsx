'use client';
import React, { useState } from 'react';
import { signInWithEmail, signUpWithEmail, signInWithGoogle } from '@/lib/firebaseAuth';
import { getAuth, signOut } from 'firebase/auth';
import { useUser } from '@/context/UserContext';

export default function Login({ onSuccess, initialError, initialIsSignup }: { onSuccess?: () => void, initialError?: string, initialIsSignup?: boolean }) {
  const { setUser } = useUser();
  const [isSignup, setIsSignup] = useState(initialIsSignup || false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [error, setError] = useState(initialError || '');
  const [loading, setLoading] = useState(false);

  React.useEffect(() => {
    if (initialError) setError(initialError);
  }, [initialError]);

  React.useEffect(() => {
    if (typeof initialIsSignup === 'boolean') setIsSignup(initialIsSignup);
  }, [initialIsSignup]);

  const isUpennEmail = (email: string) => /\.upenn\.edu$/i.test(email);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      let userCredential;
      if (isSignup) {
        if (!isUpennEmail(email)) {
          setError('You must use a valid UPenn email address to sign up.');
          setLoading(false);
          return;
        }
        if (password !== confirmPassword) {
          setError('Passwords do not match.');
          setLoading(false);
          return;
        }
        userCredential = await signUpWithEmail(email, password);
        // Create user in DB
        const user = getAuth().currentUser;
        if (user) {
          await fetch('/api/users/create', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              uid: user.uid,
              name: user.displayName || '',
              email: user.email,
              photoURL: user.photoURL || '',
              contactInfo: { phone },
            }),
          });
        }
      } else {
        await signInWithEmail(email, password);
      }
      if (onSuccess) onSuccess();
    } catch (err: any) {
      setError(err.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = async () => {
    setError('');
    setLoading(true);
    try {
      const result = await signInWithGoogle();
      // Create user in DB
      const user = getAuth().currentUser;
      if (user) {
        if (!user.email || !isUpennEmail(user.email)) {
          await signOut(getAuth());
          setUser(null);
          if (typeof window !== 'undefined') {
            window.location.href = '/?login=1&error=upenn';
          }
          return;
        }
        await fetch('/api/users/create', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            uid: user.uid,
            name: user.displayName || '',
            email: user.email,
            photoURL: user.photoURL || '',
          }),
        });
      }
      if (onSuccess) onSuccess();
    } catch (err: any) {
      setError(err.message || 'Google sign-in failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      style={{
        background: '#fff',
        borderRadius: 16,
        padding: 36,
        minWidth: 380,
        maxWidth: 420,
        width: '100%',
        boxShadow: '0 2px 24px rgba(0,0,0,0.18)',
        margin: '0 auto',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}
    >
      <h2 style={{ color: '#011F5B', fontWeight: 700, fontSize: 28, marginBottom: 16, textAlign: 'center' }}>{isSignup ? 'Sign Up' : 'Login'}</h2>
      <div style={{ marginBottom: 16, width: '100%' }}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
          style={{ width: '100%', padding: 10, borderRadius: 6, border: '1px solid #011F5B', marginBottom: 8 }}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
          style={{ width: '100%', padding: 10, borderRadius: 6, border: '1px solid #011F5B', marginBottom: 8 }}
        />
        {isSignup && (
          <>
            <input
              type="password"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={e => setConfirmPassword(e.target.value)}
              required
              style={{ width: '100%', padding: 10, borderRadius: 6, border: '1px solid #011F5B', marginBottom: 8 }}
            />
            <input
              type="tel"
              placeholder="Phone Number (optional)"
              value={phone}
              onChange={e => setPhone(e.target.value)}
              style={{ width: '100%', padding: 10, borderRadius: 6, border: '1px solid #011F5B' }}
            />
          </>
        )}
      </div>
      {error && <div style={{ color: '#990000', marginBottom: 12, textAlign: 'center' }}>{error}</div>}
      <button type="submit" disabled={loading} style={{ width: '100%', background: '#990000', color: '#fff', padding: 10, borderRadius: 6, fontWeight: 600, border: 'none', marginBottom: 12 }}>
        {loading ? (isSignup ? 'Signing up...' : 'Logging in...') : (isSignup ? 'Sign Up' : 'Login')}
      </button>
      <button type="button" onClick={handleGoogle} disabled={loading} style={{ width: '100%', background: '#fff', color: '#011F5B', border: '1px solid #011F5B', padding: 10, borderRadius: 6, fontWeight: 600, marginBottom: 12 }}>
        Continue with Google
      </button>
      <div style={{ textAlign: 'center' }}>
        <span style={{ color: '#011F5B' }}>{isSignup ? 'Already have an account?' : "Don't have an account?"} </span>
        <button type="button" onClick={() => setIsSignup(!isSignup)} style={{ color: '#990000', background: 'none', border: 'none', fontWeight: 600, cursor: 'pointer' }}>
          {isSignup ? 'Login' : 'Sign Up'}
        </button>
      </div>
    </form>
  );
} 