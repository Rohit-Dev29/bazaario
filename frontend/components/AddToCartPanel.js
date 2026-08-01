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
      <div className="flex items-center border border-indigo-900/20 rounded-md">
        <button
          onClick={() => setQuantity((q) => Math.max(1, q - 1))}
          className="px-3 py-2 hover:bg-cream focus-ring"
          aria-label="Decrease quantity"
        >
          −
        </button>
        <span className="px-4">{quantity}</span>
        <button
          onClick={() => setQuantity((q) => Math.min(product.stock, q + 1))}
          className="px-3 py-2 hover:bg-cream focus-ring"
          aria-label="Increase quantity"
        >
          +
        </button>
      </div>

      <button
        onClick={handleAdd}
        disabled={product.stock === 0}
        className="bg-marigold-400 hover:bg-marigold-500 disabled:opacity-40 disabled:cursor-not-allowed text-indigo-950 font-semibold px-6 py-2.5 rounded-md transition-colors focus-ring"
      >
        {added ? 'Added ✓' : 'Add to cart'}
      </button>

      <button
        onClick={handleBuyNow}
        disabled={product.stock === 0}
        className="bg-indigo-900 hover:bg-indigo-800 disabled:opacity-40 disabled:cursor-not-allowed text-cream font-semibold px-6 py-2.5 rounded-md transition-colors focus-ring"
      >
        Buy now
      </button>
    </div>
  );
}
