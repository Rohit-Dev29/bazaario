'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useCart } from '../context/CartContext';

export default function Navbar() {
  const { itemCount } = useCart();
  const router = useRouter();
  const [query, setQuery] = useState('');

  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim()) router.push(`/search?q=${encodeURIComponent(query.trim())}`);
  };

  return (
    <header className="bg-indigo-900 text-cream sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center gap-4">
        <Link href="/" className="font-display text-2xl font-600 tracking-tight shrink-0 focus-ring">
          Bazaar<span className="text-marigold-400">io</span>
        </Link>

        <form onSubmit={handleSearch} className="flex-1 max-w-2xl hidden sm:flex">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search for products, brands and more"
            className="w-full rounded-l-md px-4 py-2 text-indigo-900 focus-ring outline-none"
          />
          <button
            type="submit"
            className="bg-marigold-400 hover:bg-marigold-500 transition-colors px-4 rounded-r-md text-indigo-950 font-medium focus-ring"
            aria-label="Search"
          >
            Search
          </button>
        </form>

        <nav className="ml-auto flex items-center gap-5 text-sm font-medium">
          <Link href="/login" className="hover:text-marigold-400 transition-colors focus-ring">
            Account
          </Link>
          <Link href="/orders" className="hover:text-marigold-400 transition-colors hidden sm:inline focus-ring">
            Orders
          </Link>
          <Link href="/cart" className="relative hover:text-marigold-400 transition-colors focus-ring">
            Cart
            {itemCount > 0 && (
              <span className="absolute -top-2 -right-3 bg-marigold-400 text-indigo-950 text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                {itemCount}
              </span>
            )}
          </Link>
        </nav>
      </div>

      <form onSubmit={handleSearch} className="sm:hidden px-4 pb-3 flex">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search Bazaario"
          className="w-full rounded-l-md px-4 py-2 text-indigo-900 outline-none"
        />
        <button type="submit" className="bg-marigold-400 px-4 rounded-r-md text-indigo-950 font-medium">
          Go
        </button>
      </form>
    </header>
  );
}
