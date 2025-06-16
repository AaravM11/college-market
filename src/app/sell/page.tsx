"use client";

import { useUser } from '@/context/UserContext';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import Navbar from '@/components/Navbar';

const allowedCategories = [
  'Textbooks',
  'Electronics',
  'Furniture',
  'School Supplies',
  'Clothing',
  'Sports Equipment',
  'Other',
];

export default function SellPage() {
  const { user, loading } = useUser();
  const router = useRouter();
  const [form, setForm] = useState({
    title: '',
    price: '',
    category: allowedCategories[0],
    description: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!loading && !user) {
      // Redirect to home and open login modal
      router.replace('/?login=1');
    }
  }, [user, loading, router]);

  if (loading || !user) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setMessage(null);
    setError(null);
    try {
      const res = await fetch('/api/items', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: form.title,
          price: Number(form.price),
          category: form.category,
          description: form.description,
          userId: user?.uid,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setMessage('Item listed successfully!');
        setForm({ title: '', price: '', category: allowedCategories[0], description: '' });
      } else {
        setError(data.error || 'Failed to list item.');
      }
    } catch (err: any) {
      setError('Failed to list item.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="max-w-xl mx-auto py-12 px-4">
        <h1 style={{ color: '#011F5B' }} className="text-3xl font-bold mb-6">Sell an Item</h1>
        <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded-lg shadow">
          <div>
            <label className="block font-semibold mb-1" htmlFor="title">Title</label>
            <input
              id="title"
              name="title"
              type="text"
              value={form.title}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded px-3 py-2"
            />
          </div>
          <div>
            <label className="block font-semibold mb-1" htmlFor="price">Price ($)</label>
            <input
              id="price"
              name="price"
              type="number"
              min="0"
              step="0.01"
              value={form.price}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded px-3 py-2"
            />
          </div>
          <div>
            <label className="block font-semibold mb-1" htmlFor="category">Category</label>
            <select
              id="category"
              name="category"
              value={form.category}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded px-3 py-2"
            >
              {allowedCategories.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block font-semibold mb-1" htmlFor="description">Description</label>
            <textarea
              id="description"
              name="description"
              value={form.description}
              onChange={handleChange}
              required
              rows={4}
              className="w-full border border-gray-300 rounded px-3 py-2"
            />
          </div>
          <button
            type="submit"
            disabled={submitting}
            style={{ backgroundColor: '#990000', color: '#fff' }}
            className="w-full py-2 rounded font-semibold hover:opacity-90"
          >
            {submitting ? 'Listing...' : 'List Item'}
          </button>
          {message && <div className="text-green-700 font-semibold mt-2">{message}</div>}
          {error && <div className="text-red-700 font-semibold mt-2">{error}</div>}
        </form>
      </div>
    </>
  );
} 