import Navbar from '@/components/Navbar';
import ProductImageCarousel from '@/components/ProductImageCarousel';
import { headers } from 'next/headers';
import { Suspense } from 'react';

const allowedCategories = [
  'Textbooks',
  'Electronics',
  'Furniture',
  'School Supplies',
  'Clothing',
  'Sports Equipment',
  'Other',
];

async function getItems({ search, category }: { search?: string; category?: string }) {
  const host = (headers() as any).get('host');
  const protocol = host?.includes('localhost') ? 'http' : 'https';
  const baseUrl = `${protocol}://${host}`;
  let url = `${baseUrl}/api/items`;
  const params = [];
  if (category && allowedCategories.includes(category)) params.push(`category=${encodeURIComponent(category)}`);
  if (search) params.push(`search=${encodeURIComponent(search)}`);
  if (params.length) url += `?${params.join('&')}`;
  const res = await fetch(url, { cache: 'no-store' });
  const data = await res.json();
  return data.items || [];
}

export default async function BrowsePage({ searchParams }: { searchParams: { search?: string; category?: string } }) {
  const search = searchParams.search || '';
  const category = searchParams.category || '';
  const items = await getItems({ search, category });
  return (
    <>
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 py-12">
        <h1 style={{ color: '#011F5B' }} className="text-3xl font-bold mb-8">Browse Items</h1>
        <form className="flex flex-col md:flex-row gap-4 mb-8" method="get">
          <input
            type="text"
            name="search"
            defaultValue={search}
            placeholder="Search items..."
            className="w-full md:w-1/2 rounded-md border border-gray-300 py-2 px-4 focus:outline-none focus:ring-2 focus:ring-[#990000]"
            style={{ color: '#011F5B' }}
          />
          <select
            name="category"
            defaultValue={category}
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
            {items.map((item: any) => (
              <div key={item._id} className="bg-white rounded-lg shadow p-5 flex flex-col gap-3">
                <ProductImageCarousel imageUrls={item.imageUrls} alt={item.title} />
                <div className="flex-1">
                  <h2 className="text-xl font-semibold mb-1" style={{ color: '#011F5B' }}>{item.title}</h2>
                  <div className="text-lg font-bold mb-2" style={{ color: '#990000' }}>${item.price}</div>
                  <div className="text-gray-700 mb-2">{item.description.length > 100 ? item.description.slice(0, 100) + '…' : item.description}</div>
                </div>
                {item.user && (
                  <div className="flex items-center gap-3 mt-2 border-t pt-3">
                    {item.user.photoURL ? (
                      <img src={item.user.photoURL} alt={item.user.name} width={40} height={40} className="rounded-full object-cover" />
                    ) : (
                      <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center text-xl font-bold text-gray-500">
                        {item.user.name ? item.user.name[0] : '?'}
                      </div>
                    )}
                    <div>
                      <div className="font-semibold" style={{ color: '#011F5B' }}>{item.user.name}</div>
                      <div className="text-sm text-gray-600">{item.user.email}</div>
                    </div>
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