'use client';

import { useEffect, useState } from 'react';
import AdminGuard from '../../../components/AdminGuard';
import { orderApi } from '../../../lib/api';

const STATUSES = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    orderApi
      .adminList()
      .then(({ data }) => setOrders(data.orders))
      .catch(() => setError('Could not load orders.'))
      .finally(() => setLoading(false));
  }, []);

  const handleStatusChange = async (id, status) => {
    const prev = orders;
    setOrders((os) => os.map((o) => (o._id === id ? { ...o, status } : o)));
    try {
      await orderApi.updateStatus(id, status);
    } catch (err) {
      setOrders(prev);
      alert(err.response?.data?.message || 'Could not update order status.');
    }
  };

  return (
    <AdminGuard>
      <h1 className="font-display text-2xl font-600 text-indigo-950 mb-6">Orders</h1>

      {loading ? (
        <p className="text-indigo-900/60">Loading…</p>
      ) : error ? (
        <p className="text-red-600">{error}</p>
      ) : orders.length === 0 ? (
        <p className="text-indigo-900/60">No orders yet.</p>
      ) : (
        <div className="bg-white border border-indigo-900/10 rounded-lg divide-y divide-indigo-900/10">
          {orders.map((order) => (
            <div key={order._id} className="p-4">
              <div className="flex justify-between items-start flex-wrap gap-2">
                <div>
                  <p className="font-medium text-indigo-950">{order.user?.name || 'Unknown customer'}</p>
                  <p className="text-sm text-indigo-900/60">{order.user?.email}</p>
                  <p className="text-xs text-indigo-900/50 mt-1">
                    {new Date(order.createdAt).toLocaleString('en-IN')}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-indigo-950">
                    ₹{order.totalPrice.toLocaleString('en-IN')}
                  </p>
                  <p className="text-sm text-indigo-900/60">{order.items.length} item(s)</p>
                </div>
              </div>
              <div className="mt-3 flex items-center gap-2">
                <label className="text-sm text-indigo-900/70">Status:</label>
                <select
                  value={order.status}
                  onChange={(e) => handleStatusChange(order._id, e.target.value)}
                  className="border border-indigo-900/20 rounded-md px-2 py-1 text-sm focus-ring outline-none"
                >
                  {STATUSES.map((s) => (
                    <option key={s} value={s}>
                      {s.charAt(0).toUpperCase() + s.slice(1)}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          ))}
        </div>
      )}
    </AdminGuard>
  );
}
