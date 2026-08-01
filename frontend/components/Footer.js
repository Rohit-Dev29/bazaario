export default function Footer() {
  return (
    <footer className="bg-indigo-950 text-cream/70 text-sm mt-16">
      <div className="max-w-7xl mx-auto px-4 py-10 grid grid-cols-2 sm:grid-cols-4 gap-8">
        <div>
          <h4 className="text-cream font-semibold mb-3">Bazaario</h4>
          <p>About us</p>
          <p>Careers</p>
        </div>
        <div>
          <h4 className="text-cream font-semibold mb-3">Help</h4>
          <p>Track your order</p>
          <p>Returns &amp; refunds</p>
          <p>Contact support</p>
        </div>
        <div>
          <h4 className="text-cream font-semibold mb-3">Sell on Bazaario</h4>
          <p>Become a seller</p>
          <p>Seller policies</p>
        </div>
        <div>
          <h4 className="text-cream font-semibold mb-3">Policies</h4>
          <p>Terms of use</p>
          <p>Privacy policy</p>
        </div>
      </div>
      <div className="border-t border-white/10 py-4 text-center text-xs">
        © {new Date().getFullYear()} Bazaario. All rights reserved.
      </div>
    </footer>
  );
}
