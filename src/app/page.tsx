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
      <div className="relative bg-indigo-600">
        <div className="mx-auto max-w-7xl py-24 px-6 sm:py-32 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold tracking-tight text-white sm:text-6xl">
              Your Campus Marketplace
            </h1>
            <p className="mt-6 text-lg leading-8 text-indigo-100">
              Buy and sell items with your fellow students. Find everything you need for your college life.
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <a
                href="/browse"
                className="rounded-md bg-white px-3.5 py-2.5 text-sm font-semibold text-indigo-600 shadow-sm hover:bg-indigo-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
              >
                Browse Items
              </a>
              <a href="/sell" className="text-sm font-semibold leading-6 text-white">
                Start Selling <span aria-hidden="true">→</span>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Categories Section */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-8">Browse by Category</h2>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-6">
          {categories.map((category) => (
            <a
              key={category.name}
              href={`/category/${category.name.toLowerCase()}`}
              className="flex flex-col items-center justify-center p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200"
            >
              <span className="text-4xl mb-2">{category.icon}</span>
              <span className="text-sm font-medium text-gray-900">{category.name}</span>
            </a>
          ))}
        </div>
      </div>

      {/* Featured Items Section */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-8">Featured Items</h2>
        <div className="grid grid-cols-1 gap-y-10 gap-x-6 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
          {featuredItems.map((item) => (
            <div key={item.id} className="group relative">
              <div className="aspect-h-1 aspect-w-1 w-full overflow-hidden rounded-lg bg-gray-200">
                <div className="h-64 w-full bg-gray-200 flex items-center justify-center text-gray-400">
                  [Image Placeholder]
                </div>
              </div>
              <div className="mt-4 flex justify-between">
                <div>
                  <h3 className="text-sm text-gray-700">
                    <a href={`/items/${item.id}`}>
                      <span aria-hidden="true" className="absolute inset-0" />
                      {item.title}
                    </a>
                  </h3>
                  <p className="mt-1 text-sm text-gray-500">{item.category}</p>
                </div>
                <p className="text-sm font-medium text-gray-900">${item.price}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
