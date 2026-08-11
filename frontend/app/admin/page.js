'use client';

import Link from 'next/link';
import AdminGuard from '../../components/AdminGuard';

export default function AdminHome() {
  return (
    <AdminGuard>
      <h1 className="font-display text-2xl font-600 text-indigo-950 mb-6">Admin dashboard</h1>
      <div className="grid sm:grid-cols-2 gap-4">
        <Link
          href="/admin/products"
          className="bg-white border border-indigo-900/10 rounded-lg p-6 hover:shadow-md transition-shadow focus-ring"
        >
          <h2 className="font-semibold text-indigo-950">Manage products</h2>
          <p className="text-sm text-indigo-900/60 mt-1">Add, edit, or remove products from your catalog.</p>
        </Link>
        <Link
          href="/admin/orders"
          className="bg-white border border-indigo-900/10 rounded-lg p-6 hover:shadow-md transition-shadow focus-ring"
        >
          <h2 className="font-semibold text-indigo-950">Manage orders</h2>
          <p className="text-sm text-indigo-900/60 mt-1">View incoming orders and update their status.</p>
        </Link>
      </div>
    </AdminGuard>
  );
}
