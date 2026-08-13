'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import AdminGuard from '../../../components/AdminGuard';
import { chatApi } from '../../../lib/api';

export default function AdminMessagesPage() {
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    chatApi
      .sellerList()
      .then(({ data }) => setConversations(data.conversations))
      .catch(() => setError('Could not load messages.'))
      .finally(() => setLoading(false));
  }, []);

  return (
    <AdminGuard>
      <h1 className="font-display text-2xl font-600 text-indigo-950 mb-6">Messages</h1>

      {loading ? (
        <p className="text-indigo-900/60">Loading…</p>
      ) : error ? (
        <p className="text-red-600">{error}</p>
      ) : conversations.length === 0 ? (
        <p className="text-indigo-900/60">No messages yet — buyer questions will show up here.</p>
      ) : (
        <div className="bg-white border border-indigo-900/10 rounded-lg divide-y divide-indigo-900/10">
          {conversations.map((c) => {
            const lastMsg = c.messages[c.messages.length - 1];
            return (
              <Link
                key={c._id}
                href={`/admin/messages/${c._id}`}
                className="flex items-center gap-4 p-4 hover:bg-cream transition-colors focus-ring"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={c.product?.images?.[0]}
                  alt={c.product?.title}
                  className="w-14 h-14 object-cover rounded-md bg-cream shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-indigo-950 truncate">{c.buyer?.name}</p>
                  <p className="text-sm text-indigo-900/60 truncate">{c.product?.title}</p>
                  {lastMsg && (
                    <p className="text-sm text-indigo-900/50 truncate mt-0.5">
                      {lastMsg.sender === 'seller' ? 'You: ' : ''}
                      {lastMsg.text}
                    </p>
                  )}
                </div>
                <span className="text-xs text-indigo-900/40 shrink-0">
                  {new Date(c.lastMessageAt).toLocaleDateString('en-IN')}
                </span>
              </Link>
            );
          })}
        </div>
      )}
    </AdminGuard>
  );
}
