'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useCart } from '../context/CartContext';
import { authApi } from '../lib/api';

export default function SideMenu({ open, onClose }) {
  const { itemCount } = useCart();
  const [user, setUser] = useState(null);

  useEffect(() => {
    if (open) {
      authApi
        .me()
        .then(({ data }) => setUser(data.user))
        .catch(() => setUser(null));
    }
  }, [open]);

  const handleLogout = async () => {
    try {
      await authApi.logout();
    } catch (e) {
      // ignore
    }
    setUser(null);
    onClose();
    window.location.href = '/';
  };

  return (
    <>
      {/* Dark overlay behind the menu */}
      <div
        onClick={onClose}
        className={`fixed inset-0 bg-black/50 z-[60] transition-opacity duration-200 ${
          open ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      />

      {/* Sliding panel */}
      <aside
        className={`fixed top-0 left-0 h-full w-72 bg-white z-[70] shadow-2xl transform transition-transform duration-300 ${
          open ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="bg-indigo-900 text-white p-5">
          <button
            onClick={onClose}
            aria-label="Close menu"
            className="mb-3 text-white/80 hover:text-white focus-ring"
          >
            ✕ Close
          </button>
          {user ? (
            <div>
              <p className="font-bold text-lg">Hi, {user.name}</p>
              <p className="text-sm text-white/70">{user.email}</p>
            </div>
          ) : (
            <div>
              <p className="font-bold text-lg">Welcome</p>
              <Link
                href="/login"
                onClick={onClose}
                className="inline-block mt-2 bg-marigold-400 text-indigo-950 font-bold px-4 py-1.5 rounded focus-ring"
              >
                Login / Sign up
              </Link>
            </div>
          )}
        </div>

        <nav className="p-2">
          <MenuLink href="/" onClose={onClose} label="Home" />
          <MenuLink href="/search" onClose={onClose} label="Browse products" />
          <MenuLink href="/cart" onClose={onClose} label={`Cart${itemCount > 0 ? ` (${itemCount})` : ''}`} />
          <MenuLink href="/orders" onClose={onClose} label="My orders" />
          <MenuLink href="/admin" onClose={onClose} label="Admin dashboard" />

          <div className="border-t border-indigo-900/10 my-2" />
<MenuLink href="/account" onClose={onClose} label="Account settings" />

          {user && (
            <button
              onClick={handleLogout}
              className="w-full text-left px-4 py-3 rounded-md text-red-600 font-semibold hover:bg-red-50 transition-colors focus-ring"
            >
              Log out
            </button>
          )}
        </nav>
      </aside>
    </>
  );
}

function MenuLink({ href, label, onClose }) {
  return (
    <Link
      href={href}
      onClick={onClose}
      className="block px-4 py-3 rounded-md text-indigo-950 font-semibold hover:bg-cream transition-colors focus-ring"
    >
      {label}
    </Link>
  );
}
