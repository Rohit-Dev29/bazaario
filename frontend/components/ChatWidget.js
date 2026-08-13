'use client';

import { useEffect, useRef, useState } from 'react';
import { chatApi } from '../lib/api';

export default function ChatWidget({ productId, productTitle }) {
  const [open, setOpen] = useState(false);
  const [conversation, setConversation] = useState(null);
  const [text, setText] = useState('');
  const [error, setError] = useState('');
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef(null);
  const pollRef = useRef(null);

  const loadConversation = () => {
    chatApi
      .getMyConversation(productId)
      .then(({ data }) => setConversation(data.conversation))
      .catch(() => setError('Sign in to chat with the seller.'));
  };

  useEffect(() => {
    if (!open) return;
    loadConversation();
    pollRef.current = setInterval(loadConversation, 4000);
    return () => clearInterval(pollRef.current);
  }, [open, productId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [conversation?.messages?.length]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    setSending(true);
    setError('');
    try {
      const { data } = await chatApi.sendMessage(productId, text.trim());
      setConversation(data.conversation);
      setText('');
    } catch (err) {
      setError(err.response?.data?.message || 'Could not send message. Please sign in first.');
    } finally {
      setSending(false);
    }
  };

  return (
    <>
      {/* Floating button */}
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-5 right-5 z-40 bg-marigold-500 hover:bg-marigold-600 text-white font-bold px-5 py-3 rounded-full shadow-xl flex items-center gap-2 transition-colors focus-ring"
      >
        💬 Chat with seller
      </button>

      {/* Panel */}
      {open && (
        <div className="fixed bottom-0 right-0 sm:bottom-5 sm:right-5 z-50 w-full sm:w-96 h-[70vh] sm:h-[520px] bg-white sm:rounded-lg shadow-2xl flex flex-col border border-indigo-900/10">
          <div className="bg-indigo-900 text-white p-4 flex justify-between items-center sm:rounded-t-lg">
            <div>
              <p className="font-bold">Chat about this product</p>
              <p className="text-xs text-white/70 truncate max-w-[220px]">{productTitle}</p>
            </div>
            <button onClick={() => setOpen(false)} className="text-white/80 hover:text-white text-xl focus-ring">
              ✕
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-cream">
            {!conversation || conversation.messages.length === 0 ? (
              <p className="text-sm text-indigo-900/50 text-center mt-8">
                Ask the seller anything about this product — sizing, delivery time, materials, etc.
              </p>
            ) : (
              conversation.messages.map((m, i) => (
                <div
                  key={i}
                  className={`max-w-[80%] px-3 py-2 rounded-lg text-sm ${
                    m.sender === 'buyer'
                      ? 'bg-marigold-400 text-indigo-950 ml-auto rounded-br-none'
                      : 'bg-white text-indigo-950 border border-indigo-900/10 rounded-bl-none'
                  }`}
                >
                  <p>{m.text}</p>
                  <p className="text-[10px] opacity-60 mt-1">{m.senderName}</p>
                </div>
              ))
            )}
            <div ref={messagesEndRef} />
          </div>

          {error && <p className="text-xs text-red-600 px-4">{error}</p>}

          <form onSubmit={handleSend} className="p-3 border-t border-indigo-900/10 flex gap-2">
            <input
              type="text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Type a message…"
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
    </>
  );
}
