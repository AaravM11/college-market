'use client';
import React, { useState } from 'react';
import ProductImageCarousel from '@/components/ProductImageCarousel';

export default function BrowseGrid({ items }: { items: any[] }) {
  const [contactInfo, setContactInfo] = useState<{ email: string; phone?: string; name: string } | null>(null);

  if (!items || items.length === 0) {
    return <div className="text-gray-600 text-lg">No items found. Try a different search or category.</div>;
  }

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
        {items.map((item: any) => (
          <div key={item._id} className="bg-white rounded-lg shadow p-5 flex flex-col gap-3">
            <ProductImageCarousel imageUrls={item.imageUrls} alt={item.title} />
            <div className="flex-1">
              <h2 className="text-xl font-semibold mb-1" style={{ color: '#011F5B' }}>{item.title}</h2>
              <div className="text-lg font-bold mb-2" style={{ color: '#990000' }}>${item.price}</div>
              <div className="text-gray-700 mb-2">{item.description.length > 100 ? item.description.slice(0, 100) + '…' : item.description}</div>
            </div>
            {item.user && (
              <div className="flex items-center gap-3 mt-2 border-t pt-3 justify-between">
                <div className="flex items-center gap-3">
                  {item.user.photoURL ? (
                    <img src={item.user.photoURL} alt={item.user.name} width={40} height={40} className="rounded-full object-cover" />
                  ) : (
                    <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center text-xl font-bold text-gray-500">
                      {item.user.name ? item.user.name[0] : '?'}
                    </div>
                  )}
                  <div>
                    <div className="font-semibold" style={{ color: '#011F5B' }}>{item.user.name}</div>
                  </div>
                </div>
                <button
                  className="ml-auto px-4 py-2 rounded bg-[#011F5B] text-white font-semibold hover:bg-[#990000]"
                  onClick={() => setContactInfo({ email: item.user.email, phone: item.user.contactInfo?.phone, name: item.user.name })}
                >
                  Contact
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
      {/* Contact Modal */}
      {contactInfo && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-40">
          <div className="bg-white rounded-lg p-8 max-w-xs w-full relative">
            <button onClick={() => setContactInfo(null)} className="absolute top-2 right-2 text-2xl font-bold text-[#990000]">×</button>
            <h2 className="text-xl font-bold mb-4" style={{ color: '#011F5B' }}>Contact {contactInfo.name}</h2>
            <div className="mb-2"><span className="font-semibold">Email:</span> {contactInfo.email}</div>
            {contactInfo.phone && <div><span className="font-semibold">Phone:</span> {contactInfo.phone}</div>}
          </div>
        </div>
      )}
    </>
  );
} 