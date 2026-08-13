'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { authApi } from '../lib/api';

export default function AdminGuard({ children }) {
  const [status, setStatus] = useState('checking'); // checking | allowed | denied
  const pathname = usePathname();

  useEffect(() => {
    authApi
      .me()
      .then(({ data }) => {
        if (data.user.role === 'admin' || data.user.role === 'seller') {
          setStatus('allowed');
        } else {
          setStatus('denied');
        }
      })
      .catch(() => setStatus('denied'));
  }, []);

  if (status === 'checking') {
    return <div className="max-w-4xl mx-auto px-4 py-16 text-center text-indigo-900/60">Checking access…</div>;
  }

  if (status === 'denied') {
    return (
      <div className="max-w-md mx-auto px-4 py-16 text-center">
        <h1 className="font-display text-2xl text-indigo-950">Admin access only</h1>
        <p className="text-indigo-900/60 mt-2">
          Sign in with an admin or seller account to reach this page.
        </p>
        <Link
          href="/login"
          className="inline-block mt-6 bg-marigold-400 hover:bg-marigold-500 text-indigo-950 font-semibold px-6 py-3 rounded-md transition-colors focus-ring"
        >
          Sign in
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex gap-6 mb-8 border-b border-indigo-900/10 pb-3 text-sm font-medium">
        <Link
          href="/admin"
          className={pathname === '/admin' ? 'text-marigold-600' : 'text-indigo-900/70 hover:text-indigo-950'}
        >
          Dashboard
        </Link>
        <Link
          href="/admin/products"
          className={pathname.startsWith('/admin/products') ? 'text-marigold-600' : 'text-indigo-900/70 hover:text-indigo-950'}
        >
          Products
        </Link>
        <Link
          href="/admin/orders"
          className={pathname.startsWith('/admin/orders') ? 'text-marigold-600' : 'text-indigo-900/70 hover:text-indigo-950'}
        >
          Orders
        </Link>
        <Link
          href="/admin/messages"
          className={pathname.startsWith('/admin/messages') ? 'text-marigold-600' : 'text-indigo-900/70 hover:text-indigo-950'}
        >
          Messages
        </Link>
      </div>
      {children}
    </div>
  );
}
