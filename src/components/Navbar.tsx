'use client';

import { Fragment } from 'react';
import { Disclosure, Menu, Transition } from '@headlessui/react';
import { MagnifyingGlassIcon } from '@heroicons/react/20/solid';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import { useUser } from '@/context/UserContext';
import { logout } from '@/lib/firebaseAuth';
import { useRouter } from 'next/navigation';

const navigation = [
  { name: 'Home', href: '/', current: true },
  { name: 'Browse', href: '/browse', current: false },
  { name: 'Sell', href: '/sell', current: false },
  { name: 'Messages', href: '/messages', current: false },
];

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
}

interface NavbarProps {
  onLoginClick?: () => void;
}

export default function Navbar({ onLoginClick }: NavbarProps) {
  const { user } = useUser();
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
    router.push('/');
  };

  return (
    <Disclosure as="nav" style={{ backgroundColor: '#FFFFFF', boxShadow: '0 1px 3px rgba(0,0,0,0.05)', borderBottom: '4px solid #990000' }}>
      {({ open }: { open: boolean }) => (
        <>
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex h-16 justify-between">
              <div className="flex">
                <div className="flex flex-shrink-0 items-center">
                  <span style={{ color: '#011F5B', fontWeight: 'bold', fontSize: '2rem' }}>Penn Market</span>
                </div>
                <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                  {navigation.map((item) => (
                    <a
                      key={item.name}
                      href={item.href}
                      className="inline-flex items-center px-1 pt-1 text-sm font-medium"
                      style={item.current
                        ? { color: '#990000' }
                        : { color: '#011F5B' }}
                    >
                      {item.name}
                    </a>
                  ))}
                </div>
              </div>
              <div className="flex flex-1 items-center justify-center px-2 lg:ml-6 lg:justify-end">
                {/* Search bar removed */}
              </div>
              <div className="hidden lg:ml-4 lg:flex lg:items-center">
                {user ? (
                  <Menu as="div" className="relative ml-4 flex-shrink-0">
                    <div>
                      <Menu.Button className="flex rounded-full bg-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
                        <span className="sr-only">Open user menu</span>
                        <div className="h-8 w-8 rounded-full" style={{ backgroundColor: '#011F5B', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 600 }}>
                          {user.name ? user.name[0] : 'U'}
                        </div>
                      </Menu.Button>
                    </div>
                    <Transition
                      as={Fragment}
                      enter="transition ease-out duration-100"
                      enterFrom="transform opacity-0 scale-95"
                      enterTo="transform opacity-100 scale-100"
                      leave="transition ease-in duration-75"
                      leaveFrom="transform opacity-100 scale-100"
                      leaveTo="transform opacity-0 scale-95"
                    >
                      <Menu.Items className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                        <Menu.Item>
                          {({ active }: { active: boolean }) => (
                            <a
                              href="/profile"
                              className={classNames(
                                active ? 'bg-gray-100' : '',
                                'block px-4 py-2 text-sm text-gray-700'
                              )}
                            >
                              Your Profile
                            </a>
                          )}
                        </Menu.Item>
                        <Menu.Item>
                          {({ active }: { active: boolean }) => (
                            <button
                              onClick={handleLogout}
                              className={classNames(
                                active ? 'bg-gray-100' : '',
                                'block w-full text-left px-4 py-2 text-sm text-gray-700'
                              )}
                            >
                              Sign out
                            </button>
                          )}
                        </Menu.Item>
                      </Menu.Items>
                    </Transition>
                  </Menu>
                ) : (
                  <button
                    onClick={onLoginClick}
                    style={{ backgroundColor: '#990000', color: '#fff', padding: '8px 20px', borderRadius: 6, fontWeight: 600, textDecoration: 'none', border: 'none', cursor: 'pointer' }}
                  >
                    Login
                  </button>
                )}
              </div>
              <div className="flex items-center lg:hidden">
                <Disclosure.Button
                  className="inline-flex items-center justify-center rounded-md p-2"
                  style={{ color: '#011F5B', backgroundColor: open ? '#990000' : '#FFFFFF' }}
                >
                  <span className="sr-only">Open main menu</span>
                  {open ? (
                    <XMarkIcon style={{ color: open ? '#FFFFFF' : '#011F5B' }} className="block h-6 w-6" aria-hidden="true" />
                  ) : (
                    <Bars3Icon style={{ color: '#011F5B' }} className="block h-6 w-6" aria-hidden="true" />
                  )}
                </Disclosure.Button>
              </div>
            </div>
          </div>

          <Disclosure.Panel className="lg:hidden">
            <div className="space-y-1 pb-3 pt-2">
              {navigation.map((item) => (
                <Disclosure.Button
                  key={item.name}
                  as="a"
                  href={item.href}
                  className={classNames(
                    item.current
                      ? 'bg-indigo-50 border-indigo-500 text-indigo-700'
                      : 'border-transparent text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800',
                    'block border-l-4 py-2 pl-3 pr-4 text-base font-medium'
                  )}
                >
                  {item.name}
                </Disclosure.Button>
              ))}
            </div>
          </Disclosure.Panel>
        </>
      )}
    </Disclosure>
  );
} 