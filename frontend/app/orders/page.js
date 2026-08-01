'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { orderApi } from '../../lib/api';

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    orderApi
      .my()
      .then(({ data }) => setOrders(data.orders))
      .catch(() => setError('Sign in to view your orders.'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="max-w-4xl mx-auto px-4 py-10">Loading…</div>;

  if (error) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center">
        <h1 className="font-display text-2xl text-indigo-950">No orders to show</h1>
        <p className="text-indigo-900/60 mt-2">{error}</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <h1 className="font-display text-2xl font-600 text-indigo-950 mb-6">Your orders</h1>
      {orders.length === 0 ? (
        <p className="text-indigo-900/60">You haven't placed any orders yet.</p>
      ) : (
        <div className="space-y-3">
          {orders.map((order) => (
            <Link
              key={order._id}
              href={`/orders/${order._id}`}
              className="block bg-white border border-indigo-900/10 rounded-lg p-4 hover:shadow-md transition-shadow focus-ring"
            >
              <div className="flex justify-between text-sm">
                <span className="text-indigo-900/60">
                  {new Date(order.createdAt).toLocaleDateString('en-IN')}
                </span>
                <span className="capitalize font-medium text-indigo-950">{order.status}</span>
              </div>
              <div className="flex justify-between mt-1">
                <span className="text-indigo-900/80">{order.items.length} item(s)</span>
                <span className="font-semibold text-indigo-950">
                  ₹{order.totalPrice.toLocaleString('en-IN')}
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
