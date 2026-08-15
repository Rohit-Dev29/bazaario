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
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/70 p-3 sm:p-6">
      <div className="relative w-full max-w-5xl max-h-[95vh] overflow-auto rounded-2xl bg-white shadow-2xl">

        <button
          type="button"
          onClick={() => setShowAd(false)}
          aria-label="Close advertisement"
          className="absolute right-2 top-2 sm:right-4 sm:top-4 z-30 flex h-10 w-10 items-center justify-center rounded-full bg-white text-3xl font-bold text-indigo-950 shadow-lg hover:bg-gray-100"
        >
          ×
        </button>

        <img
          src="/advertisement.png"
          alt="Bazaario Special Offer"
          className="block w-full h-auto"
        />

      </div>
    </div>
  );
}