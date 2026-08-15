'use client';

import { useEffect, useState } from 'react';

export default function CheckoutAdPopup() {
  const [showAd, setShowAd] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowAd(true);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  if (!showAd) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 p-4">
      <div className="relative w-full max-w-4xl overflow-hidden rounded-2xl bg-white shadow-2xl">

        {/* Close button */}
        <button
          type="button"
          onClick={() => setShowAd(false)}
          aria-label="Close advertisement"
          className="absolute right-3 top-3 z-20 flex h-10 w-10 items-center justify-center rounded-full bg-white text-2xl font-bold text-indigo-950 shadow-lg hover:bg-gray-100"
        >
          ×
        </button>

        {/* Advertisement */}
        <img
          src="/advertisement.png"
          alt="Bazaario special offer"
          className="block w-full h-auto"
        />

      </div>
    </div>
  );
}