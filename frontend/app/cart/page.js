'use client';

import Link from 'next/link';
import { useCart } from '../../context/CartContext';

export default function CartPage() {
  const { items, removeItem, updateQuantity, subtotal } = useCart();

  if (items.length === 0) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center">
        <h1 className="font-display text-2xl text-indigo-950">Your cart is empty</h1>
        <p className="text-indigo-900/60 mt-2">Looks like you haven't added anything yet.</p>
        <Link
          href="/"
          className="inline-block mt-6 bg-marigold-400 hover:bg-marigold-500 text-indigo-950 font-semibold px-6 py-3 rounded-md transition-colors focus-ring"
        >
          Continue shopping
        </Link>
      </div>
    );
  }

  const shipping = subtotal > 500 ? 0 : 49;
  const tax = Number((subtotal * 0.18).toFixed(2));
  const total = subtotal + shipping + tax;

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 grid md:grid-cols-3 gap-8">
      <div className="md:col-span-2 space-y-4">
        <h1 className="font-display text-2xl font-600 text-indigo-950">Your cart ({items.length})</h1>
        {items.map((item) => (
          <div
            key={item.key}
            className="flex gap-4 bg-white border border-indigo-900/10 rounded-lg p-4"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={item.image}
              alt={item.title}
              className="w-20 h-20 object-cover rounded-md bg-cream"
            />
            <div className="flex-1">
              <p className="font-medium text-indigo-950">{item.title}</p>
              <p className="text-indigo-900/70 mt-1">₹{item.price.toLocaleString('en-IN')}</p>
              <div className="mt-2 flex items-center gap-3">
                <div className="flex items-center border border-indigo-900/20 rounded-md">
                  <button
                    onClick={() => updateQuantity(item.key, item.quantity - 1)}
                    className="px-2 py-1 hover:bg-cream focus-ring"
                  >
                    −
                  </button>
                  <span className="px-3">{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(item.key, item.quantity + 1)}
                    className="px-2 py-1 hover:bg-cream focus-ring"
                  >
                    +
                  </button>
                </div>
                <button
                  onClick={() => removeItem(item.key)}
                  className="text-sm text-red-600 hover:underline focus-ring"
                >
                  Remove
                </button>
              </div>
            </div>
            <p className="font-semibold text-indigo-950">
              ₹{(item.price * item.quantity).toLocaleString('en-IN')}
            </p>
          </div>
        ))}
      </div>

      <div className="bg-white border border-indigo-900/10 rounded-lg p-5 h-fit sticky top-20">
        <h2 className="font-semibold text-indigo-950 mb-3">Order summary</h2>
        <div className="space-y-2 text-sm text-indigo-900/80">
          <div className="flex justify-between">
            <span>Subtotal</span>
            <span>₹{subtotal.toLocaleString('en-IN')}</span>
          </div>
          <div className="flex justify-between">
            <span>Shipping</span>
            <span>{shipping === 0 ? 'Free' : `₹${shipping}`}</span>
          </div>
          <div className="flex justify-between">
            <span>Tax (GST 18%)</span>
            <span>₹{tax.toLocaleString('en-IN')}</span>
          </div>
          <div className="border-t border-indigo-900/10 pt-2 flex justify-between font-semibold text-indigo-950">
            <span>Total</span>
            <span>₹{total.toLocaleString('en-IN')}</span>
          </div>
        </div>
        <Link
          href="/checkout"
          className="mt-4 block text-center bg-marigold-400 hover:bg-marigold-500 text-indigo-950 font-semibold px-6 py-3 rounded-md transition-colors focus-ring"
        >
          Proceed to checkout
        </Link>
      </div>
    </div>
  );
}
