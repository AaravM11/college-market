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
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [uploadingImages, setUploadingImages] = useState(false);
  const maxImages = 5;

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

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length + imageFiles.length > maxImages) {
      setError(`You can upload up to ${maxImages} images.`);
      return;
    }
    setUploadingImages(true);
    setError(null);
    const newUrls: string[] = [];
    for (const file of files) {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', 'unsigned-market');
      try {
        const res = await fetch('https://api.cloudinary.com/v1_1/da1t8wmax/image/upload', {
          method: 'POST',
          body: formData,
        });
        const data = await res.json();
        if (data.secure_url) newUrls.push(data.secure_url);
      } catch (err) {
        setError('Image upload failed.');
      }
    }
    setImageFiles(prev => [...prev, ...files]);
    setImageUrls(prev => [...prev, ...newUrls]);
    setUploadingImages(false);
  };

  const handleRemoveImage = (idx: number) => {
    setImageFiles(prev => prev.filter((_, i) => i !== idx));
    setImageUrls(prev => prev.filter((_, i) => i !== idx));
  };

  const handleClearImages = () => {
    setImageFiles([]);
    setImageUrls([]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setMessage(null);
    setError(null);
    if (uploadingImages) {
      setError('Please wait for images to finish uploading.');
      setSubmitting(false);
      return;
    }
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
          imageUrls,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setMessage('Item listed successfully!');
        setForm({ title: '', price: '', category: allowedCategories[0], description: '' });
        setImageFiles([]);
        setImageUrls([]);
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
          <div>
            <label className="block font-semibold mb-1" htmlFor="image">Product Images (up to 5)</label>
            <input
              id="image"
              name="image"
              type="file"
              accept="image/*"
              multiple
              onChange={handleImageChange}
              className="w-full border border-gray-300 rounded px-3 py-2"
              disabled={imageFiles.length >= maxImages}
            />
            {uploadingImages && <div className="text-sm text-gray-500 mt-1">Uploading images...</div>}
            {imageUrls.length > 0 && (
              <div className="flex flex-wrap gap-3 mt-2">
                {imageUrls.map((url, idx) => (
                  <div key={url} className="relative group">
                    <img src={url} alt="Preview" className="rounded max-h-32 border" />
                    <button
                      type="button"
                      onClick={() => handleRemoveImage(idx)}
                      className="absolute top-1 right-1 bg-white bg-opacity-80 rounded-full px-2 py-0.5 text-xs font-bold text-red-700 shadow group-hover:opacity-100 opacity-80"
                      aria-label="Remove image"
                    >
                      ×
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={handleClearImages}
                  className="ml-2 px-3 py-1 rounded bg-gray-200 text-gray-700 font-semibold hover:bg-gray-300"
                >
                  Clear All
                </button>
              </div>
            )}
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