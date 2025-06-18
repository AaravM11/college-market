"use client";
import React, { useState, useMemo, useEffect } from 'react';
import { useUser } from '@/context/UserContext';
import Navbar from '@/components/Navbar';
import ProductImageCarousel from '@/components/ProductImageCarousel';
import Modal from 'react-modal';

const allowedCategories = [
  'Textbooks',
  'Electronics',
  'Furniture',
  'School Supplies',
  'Clothing',
  'Sports Equipment',
  'Other',
];

export default function ProfilePage() {
  const { user, loading } = useUser();
  const [tab, setTab] = useState<'items' | 'settings' | 'contact'>('items');
  const [items, setItems] = useState<any[]>([]);
  const [fetching, setFetching] = useState(false);
  const [editingItem, setEditingItem] = useState<any | null>(null);
  const [editForm, setEditForm] = useState<any>(null);
  const [editSaving, setEditSaving] = useState(false);
  const [editError, setEditError] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      setFetching(true);
      fetch(`/api/items?userId=${user.uid}`)
        .then(res => res.json())
        .then(data => setItems(data.items || []))
        .finally(() => setFetching(false));
    }
  }, [user]);

  const itemsByCategory = useMemo(() => {
    const grouped: Record<string, any[]> = {};
    for (const cat of allowedCategories) grouped[cat] = [];
    for (const item of items) {
      if (grouped[item.category]) grouped[item.category].push(item);
      else grouped['Other'].push(item);
    }
    return grouped;
  }, [items]);

  const handleEditClick = (item: any) => {
    setEditingItem(item);
    setEditForm({
      title: item.title,
      price: item.price,
      category: item.category,
      description: item.description,
      imageUrls: item.imageUrls || [],
    });
    setEditError(null);
  };

  const handleEditFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setEditForm({ ...editForm, [e.target.name]: e.target.value });
  };

  const handleEditSave = async () => {
    setEditSaving(true);
    setEditError(null);
    try {
      const res = await fetch(`/api/items/${editingItem._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editForm),
      });
      const data = await res.json();
      if (data.success) {
        setEditingItem(null);
        // Refresh items
        if (user) {
          fetch(`/api/items?userId=${user.uid}`)
            .then(res => res.json())
            .then(data => setItems(data.items || []));
        }
      } else {
        setEditError(data.error || 'Failed to save changes.');
      }
    } catch (err) {
      setEditError('Failed to save changes.');
    } finally {
      setEditSaving(false);
    }
  };

  if (loading) return null;

  return (
    <>
      <Navbar />
      <div className="max-w-7xl mx-auto flex px-4 py-12 gap-8">
        {/* Left nav column */}
        <div className="w-40 flex-shrink-0">
          <nav className="flex flex-col gap-2">
            <button
              className={`text-left px-3 py-2 rounded font-semibold ${tab === 'items' ? 'bg-[#011F5B] text-white' : 'bg-gray-100 text-[#011F5B]'}`}
              onClick={() => setTab('items')}
            >
              My Items
            </button>
            <button
              className={`text-left px-3 py-2 rounded font-semibold ${tab === 'settings' ? 'bg-[#011F5B] text-white' : 'bg-gray-100 text-[#011F5B]'}`}
              onClick={() => setTab('settings')}
            >
              Settings
            </button>
            <button
              className={`text-left px-3 py-2 rounded font-semibold ${tab === 'contact' ? 'bg-[#011F5B] text-white' : 'bg-gray-100 text-[#011F5B]'}`}
              onClick={() => setTab('contact')}
            >
              Contact Info
            </button>
          </nav>
        </div>
        {/* Right content column */}
        <div className="flex-1">
          {tab === 'items' && (
            <div>
              <h1 className="text-2xl font-bold mb-6" style={{ color: '#011F5B' }}>My Items</h1>
              {fetching ? (
                <div>Loading...</div>
              ) : (
                allowedCategories.map(cat => (
                  itemsByCategory[cat] && itemsByCategory[cat].length > 0 && (
                    <div key={cat} className="mb-8">
                      <h2 className="text-xl font-semibold mb-3" style={{ color: '#990000' }}>{cat}</h2>
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                        {itemsByCategory[cat].map((item: any) => (
                          <div key={item._id} className="bg-white rounded-lg shadow p-5 flex flex-col gap-3">
                            <ProductImageCarousel imageUrls={item.imageUrls} alt={item.title} />
                            <div className="flex-1">
                              <h3 className="text-lg font-bold mb-1" style={{ color: '#011F5B' }}>{item.title}</h3>
                              <div className="text-md font-bold mb-2" style={{ color: '#990000' }}>${item.price}</div>
                              <div className="text-gray-700 mb-2">{item.description.length > 100 ? item.description.slice(0, 100) + '…' : item.description}</div>
                            </div>
                            <button className="mt-2 px-3 py-1 rounded bg-gray-200 text-[#011F5B] font-semibold hover:bg-gray-300" onClick={() => handleEditClick(item)}>Edit</button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )
                ))
              )}
            </div>
          )}
          {tab === 'settings' && (
            <div>
              <h1 className="text-2xl font-bold mb-6" style={{ color: '#011F5B' }}>Settings</h1>
              <div className="text-gray-600">Settings form coming soon.</div>
            </div>
          )}
          {tab === 'contact' && (
            <ContactInfoForm />
          )}
        </div>
      </div>
      {/* Edit Modal */}
      <Modal
        isOpen={!!editingItem}
        onRequestClose={() => setEditingItem(null)}
        ariaHideApp={false}
        className="fixed inset-0 flex items-center justify-center z-50"
        overlayClassName="fixed inset-0 bg-black bg-opacity-40 z-40"
      >
        <div className="bg-white rounded-lg p-8 max-w-md w-full relative">
          <button onClick={() => setEditingItem(null)} className="absolute top-2 right-2 text-2xl font-bold text-[#990000]">×</button>
          <h2 className="text-xl font-bold mb-4" style={{ color: '#011F5B' }}>Edit Item</h2>
          <div className="space-y-3">
            <input
              name="title"
              value={editForm?.title || ''}
              onChange={handleEditFormChange}
              className="w-full border border-gray-300 rounded px-3 py-2"
              placeholder="Title"
            />
            <input
              name="price"
              type="number"
              min="0"
              step="0.01"
              value={editForm?.price || ''}
              onChange={handleEditFormChange}
              className="w-full border border-gray-300 rounded px-3 py-2"
              placeholder="Price"
            />
            <select
              name="category"
              value={editForm?.category || allowedCategories[0]}
              onChange={handleEditFormChange}
              className="w-full border border-gray-300 rounded px-3 py-2"
            >
              {allowedCategories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
            <textarea
              name="description"
              value={editForm?.description || ''}
              onChange={handleEditFormChange}
              className="w-full border border-gray-300 rounded px-3 py-2"
              placeholder="Description"
              rows={3}
            />
          </div>
          {editError && <div className="text-red-700 font-semibold mt-2">{editError}</div>}
          <button
            onClick={handleEditSave}
            disabled={editSaving}
            className="mt-4 w-full py-2 rounded font-semibold bg-[#990000] text-white hover:opacity-90"
          >
            {editSaving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </Modal>
    </>
  );
}

function ContactInfoForm() {
  const { user } = useUser();
  const [phone, setPhone] = useState(user?.contactInfo?.phone || '');
  const [message, setMessage] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setPhone(user?.contactInfo?.phone || '');
  }, [user?.contactInfo?.phone]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);
    try {
      const response = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...user, contactInfo: { phone } }),
      });
      if (response.ok) {
        setMessage('Contact information updated successfully!');
      } else {
        setMessage('Failed to update contact information.');
      }
    } catch (err) {
      setMessage('Failed to update contact information.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-2xl px-4 py-8">
      <h1 style={{ color: '#011F5B' }} className="text-2xl font-bold mb-6">Contact Information</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Email</label>
          <input
            type="email"
            value={user?.email || ''}
            readOnly
            className="mt-1 block w-full rounded-md border-gray-200 bg-gray-100 shadow-sm sm:text-sm cursor-not-allowed"
          />
        </div>
        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-gray-700">Phone Number</label>
          <input
            type="text"
            id="phone"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            required
          />
        </div>
        <button
          type="submit"
          className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          disabled={saving}
        >
          {saving ? 'Saving...' : 'Save'}
        </button>
        {message && <div className="mt-2 text-sm text-gray-700">{message}</div>}
      </form>
    </div>
  );
} 