import Navbar from '@/components/Navbar';
import ProductImageCarousel from '@/components/ProductImageCarousel';
import { notFound } from 'next/navigation';
import { headers } from 'next/headers';

const allowedCategories = [
  'Textbooks',
  'Electronics',
  'Furniture',
  'School Supplies',
  'Clothing',
  'Sports Equipment',
  'Other',
];

export default async function CategoryPage({ params }: { params: { category: string } }) {
  const category = decodeURIComponent(params.category);
  if (!allowedCategories.includes(category)) {
    notFound();
  }
  const host = (headers() as any).get('host');
  const protocol = host?.includes('localhost') ? 'http' : 'https';
  const baseUrl = `${protocol}://${host}`;
  const res = await fetch(`${baseUrl}/api/items?category=${encodeURIComponent(category)}`, { cache: 'no-store' });
  const data = await res.json();
  const items = data.items || [];

  return (
    <>
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 py-12">
        <h1 style={{ color: '#011F5B' }} className="text-3xl font-bold mb-8">{category}</h1>
        {items.length === 0 ? (
          <div className="text-gray-600 text-lg">No items found in this category.</div>
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