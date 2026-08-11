'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import AdminGuard from '../../../components/AdminGuard';
import { productApi } from '../../../lib/api';

export default function AdminProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = () => {
    setLoading(true);
    productApi
      .adminList()
      .then(({ data }) => setProducts(data.products))
      .catch(() => setError('Could not load products.'))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, []);

  const handleDelete = async (id, title) => {
    if (!window.confirm(`Remove "${title}"? This will unlist it from the store.`)) return;
    try {
      await productApi.remove(id);
      setProducts((prev) => prev.filter((p) => p._id !== id));
    } catch (err) {
      alert(err.response?.data?.message || 'Could not delete product.');
    }
  };

  return (
    <AdminGuard>
      <div className="flex justify-between items-center mb-6">
        <h1 className="font-display text-2xl font-600 text-indigo-950">Products</h1>
        <Link
          href="/admin/products/new"
          className="bg-marigold-400 hover:bg-marigold-500 text-indigo-950 font-semibold px-4 py-2 rounded-md transition-colors focus-ring"
        >
          + Add product
        </Link>
      </div>

      {loading ? (
        <p className="text-indigo-900/60">Loading…</p>
      ) : error ? (
        <p className="text-red-600">{error}</p>
      ) : products.length === 0 ? (
        <p className="text-indigo-900/60">No products yet — add your first one.</p>
      ) : (
        <div className="bg-white border border-indigo-900/10 rounded-lg divide-y divide-indigo-900/10">
          {products.map((p) => (
            <div key={p._id} className="flex items-center gap-4 p-4">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={p.images?.[0]} alt={p.title} className="w-14 h-14 object-cover rounded-md bg-cream" />
              <div className="flex-1 min-w-0">
                <p className="font-medium text-indigo-950 truncate">{p.title}</p>
                <p className="text-sm text-indigo-900/60">
                  ₹{p.price.toLocaleString('en-IN')} · Stock: {p.stock}{' '}
                  {!p.isActive && <span className="text-red-600">· Unlisted</span>}
                </p>
              </div>
              <Link
                href={`/admin/products/${p._id}`}
                className="text-sm font-medium text-marigold-600 hover:underline focus-ring"
              >
                Edit
              </Link>
              <button
                onClick={() => handleDelete(p._id, p.title)}
                className="text-sm font-medium text-red-600 hover:underline focus-ring"
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      )}
    </AdminGuard>
  );
}
