'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useCart } from '../context/CartContext';
import { categoryApi } from '../lib/api';

export default function Navbar() {
  const { itemCount } = useCart();
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    categoryApi
      .list()
      .then(({ data }) => setCategories(data.categories.slice(0, 8)))
      .catch(() => setCategories([]));
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim()) router.push(`/search?q=${encodeURIComponent(query.trim())}`);
  };

  return (
    <header className="sticky top-0 z-50 shadow-lg">
      <div className="bg-indigo-900 text-white">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center gap-5">
<Link href="/" className="shrink-0 focus-ring leading-tight max-w-[160px] sm:max-w-none">
            <span className="font-display text-3xl font-700 tracking-tight block">
              Bazaar<span className="text-marigold-400">io</span>
            </span>
            <span className="marquee-wrap block">
              <span className="marquee-text font-display font-extrabold text-[12px] text-marigold-400 tracking-wide">
                ✦ Presented by Rohit Verma ✦
              </span>
            </span>
          </Link>

          <form onSubmit={handleSearch} className="flex-1 max-w-2xl hidden sm:flex shadow-md rounded">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search for products, brands and more"
              className="w-full rounded-l px-5 py-3 text-indigo-950 font-medium focus-ring outline-none"
            />
            <button
              type="submit"
              className="bg-marigold-400 hover:bg-marigold-500 transition-colors px-6 rounded-r text-white font-bold text-lg focus-ring"
              aria-label="Search"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="7" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
            </button>
          </form>

          <nav className="ml-auto flex items-center gap-6 text-base font-bold">
            <Link href="/login" className="hover:text-marigold-400 transition-colors focus-ring">
              Account
            </Link>
            <Link href="/orders" className="hover:text-marigold-400 transition-colors hidden sm:inline focus-ring">
              Orders
            </Link>
            <Link href="/admin" className="hover:text-marigold-400 transition-colors hidden sm:inline focus-ring">
              Admin
            </Link>
            <Link
              href="/cart"
              className="relative bg-marigold-500 hover:bg-marigold-600 transition-colors px-4 py-2 rounded shadow focus-ring"
            >
              Cart
              {itemCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-white text-indigo-900 text-xs font-extrabold rounded-full w-6 h-6 flex items-center justify-center border-2 border-marigold-500">
                  {itemCount}
                </span>
              )}
            </Link>
          </nav>
        </div>

        <form onSubmit={handleSearch} className="sm:hidden px-4 pb-3 flex shadow-md">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search Bazaario"
            className="w-full rounded-l px-4 py-2.5 text-indigo-950 font-medium outline-none"
          />
          <button type="submit" className="bg-marigold-400 px-5 rounded-r text-white font-bold">
            Go
          </button>
        </form>
      </div>

      {categories.length > 0 && (
        <div className="bg-marigold-500 text-white overflow-x-auto">
          <div className="max-w-7xl mx-auto px-4 py-2.5 flex gap-6 text-sm font-bold whitespace-nowrap">
            {categories.map((c) => (
              <Link
                key={c._id}
                href={`/search?category=${c._id}`}
                className="hover:text-indigo-950 transition-colors focus-ring"
              >
                {c.name}
              </Link>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}
