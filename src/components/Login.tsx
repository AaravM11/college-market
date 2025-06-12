'use client';
import React, { useState } from 'react';
import { signInWithEmail, signUpWithEmail, signInWithGoogle } from '@/lib/firebaseAuth';

export default function Login({ onSuccess }: { onSuccess?: () => void }) {
  const [isSignup, setIsSignup] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      if (isSignup) {
        await signUpWithEmail(email, password);
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
      await signInWithGoogle();
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
          style={{ width: '100%', padding: 10, borderRadius: 6, border: '1px solid #011F5B' }}
        />
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