'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '../context/CartContext';

export default function AddToCartPanel({ product }) {
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const { addItem } = useCart();
  const router = useRouter();

  const handleAdd = () => {
    addItem(product, quantity);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  const handleBuyNow = () => {
    addItem(product, quantity);
    router.push('/cart');
  };

  return (
    <div className="mt-6 flex items-center gap-3 flex-wrap">
      <div className="flex items-center border-2 border-indigo-900/20 rounded-lg">
        <button
          onClick={() => setQuantity((q) => Math.max(1, q - 1))}
          className="px-4 py-3 hover:bg-cream text-lg font-bold focus-ring"
          aria-label="Decrease quantity"
        >
          −
        </button>
        <span className="px-5 text-lg font-bold">{quantity}</span>
        <button
          onClick={() => setQuantity((q) => Math.min(product.stock, q + 1))}
          className="px-4 py-3 hover:bg-cream text-lg font-bold focus-ring"
          aria-label="Increase quantity"
        >
          +
        </button>
      </div>

      <button
        onClick={handleAdd}
        disabled={product.stock === 0}
        className="bg-marigold-400 hover:bg-marigold-500 disabled:opacity-40 disabled:cursor-not-allowed text-white font-extrabold text-lg px-8 py-3.5 rounded-lg shadow-md transition-colors focus-ring"
      >
        {added ? 'Added ✓' : 'ADD TO CART'}
      </button>

      <button
        onClick={handleBuyNow}
        disabled={product.stock === 0}
        className="bg-marigold-500 hover:bg-marigold-600 disabled:opacity-40 disabled:cursor-not-allowed text-white font-extrabold text-lg px-8 py-3.5 rounded-lg shadow-md transition-colors focus-ring"
      >
        BUY NOW
      </button>
    </div>
  );
}
