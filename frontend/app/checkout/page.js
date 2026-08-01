'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '../../context/CartContext';
import { orderApi } from '../../lib/api';

export default function CheckoutPage() {
  const { items, subtotal, clearCart } = useCart();
  const router = useRouter();
  const [address, setAddress] = useState({
    line1: '',
    line2: '',
    city: '',
    state: '',
    postalCode: '',
    country: 'India',
    phone: '',
  });
  const [paymentMethod, setPaymentMethod] = useState('cod');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const shipping = subtotal > 500 ? 0 : 49;
  const tax = Number((subtotal * 0.18).toFixed(2));
  const total = subtotal + shipping + tax;

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const { data } = await orderApi.create({
        items: items.map((i) => ({
          productId: i.productId,
          quantity: i.quantity,
          variant: i.variant,
        })),
        shippingAddress: address,
        paymentMethod,
      });
      clearCart();
      router.push(`/orders/${data.order._id}`);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          'Could not place order. Please sign in and check your cart.'
      );
    } finally {
      setLoading(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center">
        <h1 className="font-display text-2xl text-indigo-950">Nothing to check out</h1>
        <p className="text-indigo-900/60 mt-2">Add items to your cart first.</p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 grid md:grid-cols-3 gap-8">
      <form onSubmit={handlePlaceOrder} className="md:col-span-2 space-y-6">
        <div>
          <h1 className="font-display text-2xl font-600 text-indigo-950 mb-4">Shipping address</h1>
          <div className="grid grid-cols-2 gap-3">
            <input
              placeholder="Address line 1"
              required
              value={address.line1}
              onChange={(e) => setAddress({ ...address, line1: e.target.value })}
              className="col-span-2 border border-indigo-900/20 rounded-md px-3 py-2 focus-ring outline-none"
            />
            <input
              placeholder="Address line 2 (optional)"
              value={address.line2}
              onChange={(e) => setAddress({ ...address, line2: e.target.value })}
              className="col-span-2 border border-indigo-900/20 rounded-md px-3 py-2 focus-ring outline-none"
            />
            <input
              placeholder="City"
              required
              value={address.city}
              onChange={(e) => setAddress({ ...address, city: e.target.value })}
              className="border border-indigo-900/20 rounded-md px-3 py-2 focus-ring outline-none"
            />
            <input
              placeholder="State"
              required
              value={address.state}
              onChange={(e) => setAddress({ ...address, state: e.target.value })}
              className="border border-indigo-900/20 rounded-md px-3 py-2 focus-ring outline-none"
            />
            <input
              placeholder="Postal code"
              required
              value={address.postalCode}
              onChange={(e) => setAddress({ ...address, postalCode: e.target.value })}
              className="border border-indigo-900/20 rounded-md px-3 py-2 focus-ring outline-none"
            />
            <input
              placeholder="Phone"
              required
              value={address.phone}
              onChange={(e) => setAddress({ ...address, phone: e.target.value })}
              className="border border-indigo-900/20 rounded-md px-3 py-2 focus-ring outline-none"
            />
          </div>
        </div>

        <div>
          <h2 className="font-semibold text-indigo-950 mb-2">Payment method</h2>
          <div className="space-y-2">
            {[
              { id: 'cod', label: 'Cash on delivery' },
              { id: 'razorpay', label: 'Razorpay (Cards / UPI / Netbanking)' },
              { id: 'stripe', label: 'Stripe (International cards)' },
            ].map((opt) => (
              <label key={opt.id} className="flex items-center gap-2 text-sm text-indigo-900">
                <input
                  type="radio"
                  name="paymentMethod"
                  checked={paymentMethod === opt.id}
                  onChange={() => setPaymentMethod(opt.id)}
                />
                {opt.label}
              </label>
            ))}
          </div>
        </div>

        {error && <p className="text-sm text-red-600">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-marigold-400 hover:bg-marigold-500 disabled:opacity-50 text-indigo-950 font-semibold px-6 py-3 rounded-md transition-colors focus-ring"
        >
          {loading ? 'Placing order…' : `Place order — ₹${total.toLocaleString('en-IN')}`}
        </button>
      </form>

      <div className="bg-white border border-indigo-900/10 rounded-lg p-5 h-fit">
        <h2 className="font-semibold text-indigo-950 mb-3">Order summary</h2>
        <div className="space-y-2 text-sm">
          {items.map((i) => (
            <div key={i.key} className="flex justify-between text-indigo-900/80">
              <span>
                {i.title} × {i.quantity}
              </span>
              <span>₹{(i.price * i.quantity).toLocaleString('en-IN')}</span>
            </div>
          ))}
          <div className="border-t border-indigo-900/10 pt-2 flex justify-between font-semibold text-indigo-950">
            <span>Total</span>
            <span>₹{total.toLocaleString('en-IN')}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
