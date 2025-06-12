import Image from "next/image";
import Navbar from '@/components/Navbar';

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
  return (
    <main className="min-h-screen bg-gray-50">
      <Navbar />
      
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
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <h2 style={{ color: '#011F5B' }} className="text-2xl font-bold mb-2 inline-block pb-1">Browse by Category</h2>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-6 mt-6">
          {categories.map((category) => (
            <a
              key={category.name}
              href={`/category/${category.name.toLowerCase()}`}
              style={{ backgroundColor: '#FFFFFF', color: '#011F5B', border: '1px solid #011F5B' }}
              className="flex flex-col items-center justify-center p-4 rounded-lg shadow-sm hover:opacity-90 transition-shadow duration-200"
            >
              <span className="text-4xl mb-2">{category.icon}</span>
              <span className="text-sm font-medium">{category.name}</span>
            </a>
          ))}
        </div>
      </div>

      {/* Featured Items Section */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <h2 style={{ color: '#011F5B' }} className="text-2xl font-bold mb-2 inline-block pb-1">Featured Items</h2>
        <div className="grid grid-cols-1 gap-y-10 gap-x-6 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8 mt-6">
          {featuredItems.map((item) => (
            <div key={item.id} style={{ backgroundColor: '#FFFFFF', border: '1px solid #011F5B' }} className="group relative rounded-lg p-4">
              <div className="h-64 w-full bg-gray-200 flex items-center justify-center text-gray-400 rounded">
                [Image Placeholder]
              </div>
              <div className="mt-4 flex justify-between">
                <div>
                  <h3 style={{ color: '#011F5B' }} className="text-sm">
                    <a href={`/items/${item.id}`}>
                      <span aria-hidden="true" className="absolute inset-0" />
                      {item.title}
                    </a>
                  </h3>
                  <p style={{ color: '#990000' }} className="mt-1 text-sm">{item.category}</p>
                </div>
                <p style={{ color: '#990000' }} className="text-sm font-medium">${item.price}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
