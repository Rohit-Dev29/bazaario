'use client';

import { useEffect, useRef, useState } from 'react';
import AdminGuard from '../../../../components/AdminGuard';
import { chatApi } from '../../../../lib/api';

export default function AdminConversationPage({ params }) {
  const [conversation, setConversation] = useState(null);
  const [text, setText] = useState('');
  const [error, setError] = useState('');
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef(null);

  const load = () => {
    chatApi
      .sellerGet(params.id)
      .then(({ data }) => setConversation(data.conversation))
      .catch(() => setError('Could not load this conversation.'));
  };

  useEffect(() => {
    load();
    const interval = setInterval(load, 4000);
    return () => clearInterval(interval);
  }, [params.id]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [conversation?.messages?.length]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    setSending(true);
    try {
      const { data } = await chatApi.sellerReply(params.id, text.trim());
      setConversation(data.conversation);
      setText('');
    } catch (err) {
      setError(err.response?.data?.message || 'Could not send reply.');
    } finally {
      setSending(false);
    }
  };

  return (
    <AdminGuard>
      {error && <p className="text-red-600">{error}</p>}
      {conversation && (
        <div className="bg-white border border-indigo-900/10 rounded-lg flex flex-col h-[65vh]">
          <div className="p-4 border-b border-indigo-900/10">
            <p className="font-semibold text-indigo-950">{conversation.buyer?.name}</p>
            <p className="text-sm text-indigo-900/60">{conversation.product?.title}</p>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-cream">
            {conversation.messages.map((m, i) => (
              <div
                key={i}
                className={`max-w-[70%] px-3 py-2 rounded-lg text-sm ${
                  m.sender === 'seller'
                    ? 'bg-marigold-400 text-indigo-950 ml-auto rounded-br-none'
                    : 'bg-white text-indigo-950 border border-indigo-900/10 rounded-bl-none'
                }`}
              >
                <p>{m.text}</p>
                <p className="text-[10px] opacity-60 mt-1">{m.senderName}</p>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          <form onSubmit={handleSend} className="p-3 border-t border-indigo-900/10 flex gap-2">
            <input
              type="text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Type a reply…"
              className="flex-1 border border-indigo-900/20 rounded-full px-4 py-2 text-sm outline-none focus-ring"
            />
            <button
              type="submit"
              disabled={sending}
              className="bg-marigold-500 hover:bg-marigold-600 disabled:opacity-50 text-white font-bold px-4 py-2 rounded-full transition-colors focus-ring"
            >
              Send
            </button>
          </form>
        </div>
      )}
    </AdminGuard>
  );
}
