'use client';

import Image from "next/image";
import Navbar from '@/components/Navbar';
import { useUser } from '@/context/UserContext';
import Login from '@/components/Login';
import React, { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';

const featuredItems = [
  {
    id: 1,
    title: 'Textbooks Bundle',
    price: 89.99,
    image: '/textbooks.jpg',
    category: 'Books',
  },
  {
    id: 2,
    title: 'Dorm Essentials Kit',
    price: 129.99,
    image: '/dorm-kit.jpg',
    category: 'Furniture',
  },
  {
    id: 3,
    title: 'MacBook Pro 2021',
    price: 999.99,
    image: '/laptop.jpg',
    category: 'Electronics',
  },
  {
    id: 4,
    title: 'Scientific Calculator',
    price: 29.99,
    image: '/calculator.jpg',
    category: 'Electronics',
  },
];

const categories = [
  { name: 'Textbooks', icon: '📚' },
  { name: 'Electronics', icon: '💻' },
  { name: 'Furniture', icon: '🪑' },
  { name: 'School Supplies', icon: '✏️' },
  { name: 'Clothing', icon: '👕' },
  { name: 'Sports Equipment', icon: '⚽' },
];

export default function Home() {
  const { user, loading } = useUser();
  const searchParams = useSearchParams();
  const [loginOpen, setLoginOpen] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);
  const [forceSignup, setForceSignup] = useState(false);
  const router = useRouter();
  useEffect(() => {
    if (searchParams.get('login') === '1') {
      setLoginOpen(true);
    }
    if (searchParams.get('error') === 'upenn') {
      setLoginError('You must use a valid UPenn email address to sign up.');
      setLoginOpen(true);
      setForceSignup(true);
      // Remove error from URL after showing
      router.replace('/?login=1');
    }
  }, [searchParams, router]);
  if (loading) return null;

  const handleCategoryClick = (category: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    if (!user) {
      if (window.location.search.includes('login=1')) {
        window.location.reload();
      } else {
        router.push('/?login=1');
      }
    } else {
      router.push(`/category/${encodeURIComponent(category)}`);
    }
  };

  return (
    <main className="min-h-screen bg-gray-50">
      <Navbar onLoginClick={() => setLoginOpen(true)} />
      {loginOpen && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.6)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ position: 'relative', zIndex: 1001, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <button onClick={() => { setLoginOpen(false); setLoginError(null); setForceSignup(false); }}
              style={{ position: 'absolute', top: 12, right: 12, background: 'none', border: 'none', color: '#011F5B', fontSize: 32, fontWeight: 700, cursor: 'pointer', textShadow: '0 2px 8px rgba(0,0,0,0.4)' }}
              aria-label="Close login modal"
            >
              ×
            </button>
            <Login onSuccess={() => { setLoginOpen(false); setLoginError(null); setForceSignup(false); }} initialError={loginError || undefined} initialIsSignup={forceSignup} />
          </div>
        </div>
      )}
      
      {/* Hero Section */}
      <div style={{ backgroundColor: '#011F5B', color: '#FFFFFF' }} className="relative">
        <div className="mx-auto max-w-7xl py-24 px-6 sm:py-32 lg:px-8">
          <div className="text-center">
            <h1 style={{ color: '#FFFFFF' }} className="text-4xl font-bold tracking-tight sm:text-6xl">
              The Penn Community Marketplace
            </h1>
            <div style={{ backgroundColor: '#990000' }} className="mx-auto mt-2 mb-6 w-24 h-1 rounded-full" />
            <p style={{ color: '#FFFFFF' }} className="mt-6 text-lg leading-8">
              Buy and sell with fellow Quakers. Find everything you need for life at Penn.
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <a
                href="/browse"
                style={{ backgroundColor: '#990000', color: '#FFFFFF' }}
                className="rounded-md px-3.5 py-2.5 text-sm font-semibold shadow-sm hover:opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
              >
                Browse Items
              </a>
              <a href="/sell" style={{ color: '#990000' }} className="text-sm font-semibold leading-6 hover:underline">
                Start Selling <span aria-hidden="true">→</span>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Categories Section */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <h2 style={{ color: '#011F5B' }} className="text-2xl font-bold mb-2 inline-block pb-1">Browse by Category</h2>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-6 mt-6">
          {categories.map((category) => (
            <a
              key={category.name}
              href={`/category/${encodeURIComponent(category.name)}`}
              onClick={handleCategoryClick(category.name)}
              style={{ backgroundColor: '#FFFFFF', color: '#011F5B', border: '1px solid #011F5B' }}
              className="flex flex-col items-center justify-center p-4 rounded-lg shadow-sm hover:opacity-90 transition-shadow duration-200"
            >
              <span className="text-4xl mb-2">{category.icon}</span>
              <span className="text-sm font-medium">{category.name}</span>
            </a>
          ))}
        </div>
      </div>
    </main>
  );
}