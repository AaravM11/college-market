"use client";
import { useUser } from '@/context/UserContext';
import { useRouter, useSearchParams } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import Navbar from '@/components/Navbar';
import ProductImageCarousel from '@/components/ProductImageCarousel';

const allowedCategories = [
  'Textbooks',
  'Electronics',
  'Furniture',
  'School Supplies',
  'Clothing',
  'Sports Equipment',
  'Other',
];

export default function BrowsePage() {
  const { user, loading } = useUser();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [items, setItems] = useState<any[]>([]);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    if (!loading && !user) {
      router.replace('/?login=1');
    }
  }, [user, loading, router]);

  useEffect(() => {
    if (user) {
      setFetching(true);
      fetch(`/api/items?search=${searchParams.get('search') || ''}&category=${searchParams.get('category') || ''}`)
        .then(res => res.json())
        .then(data => setItems(data.items || []))
        .finally(() => setFetching(false));
    }
  }, [user, searchParams]);

  if (loading || !user || fetching) return null;

  return (
    <>
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 py-12">
        <h1 style={{ color: '#011F5B' }} className="text-3xl font-bold mb-8">Browse Items</h1>
        <form className="flex flex-col md:flex-row gap-4 mb-8" method="get">
          <input
            type="text"
            name="search"
            defaultValue={searchParams.get('search') || ''}
            placeholder="Search items..."
            className="w-full md:w-1/2 rounded-md border border-gray-300 py-2 px-4 focus:outline-none focus:ring-2 focus:ring-[#990000]"
            style={{ color: '#011F5B' }}
          />
          <select
            name="category"
            defaultValue={searchParams.get('category') || ''}
            className="w-full md:w-1/4 rounded-md border border-gray-300 py-2 px-4 focus:outline-none focus:ring-2 focus:ring-[#990000]"
            style={{ color: '#011F5B' }}
          >
            <option value="">All Categories</option>
            {allowedCategories.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
          <button
            type="submit"
            className="rounded-md px-4 py-2 font-semibold shadow-sm"
            style={{ backgroundColor: '#990000', color: '#FFFFFF' }}
          >
            Search
          </button>
        </form>
        {items.length === 0 ? (
          <div className="text-gray-600 text-lg">No items found. Try a different search or category.</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
            {items.map((item) => (
              <div key={item._id} className="bg-white rounded-lg shadow p-5 flex flex-col gap-3">
                <ProductImageCarousel imageUrls={item.imageUrls} alt={item.title} />
                <div className="flex-1">
                  <h2 className="text-xl font-semibold mb-1" style={{ color: '#011F5B' }}>{item.title}</h2>
                  <div className="text-lg font-bold mb-2" style={{ color: '#990000' }}>${item.price}</div>
                  <div className="text-gray-700 mb-2">{item.description.length > 100 ? item.description.slice(0, 100) + '…' : item.description}</div>
                </div>
                {item.user && (
                  <div>
                    <div className="font-semibold" style={{ color: '#011F5B' }}>{item.user.name}</div>
                    <div className="text-sm text-gray-600">{item.user.email}</div>
                    {item.user.contactInfo?.phone && (
                      <div className="text-sm text-gray-600">{item.user.contactInfo.phone}</div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
} 