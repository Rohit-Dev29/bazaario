export default function Footer() {
  return (
    <footer className="bg-indigo-950 text-cream/70 text-sm mt-16">
      <div className="max-w-7xl mx-auto px-4 py-10 grid grid-cols-2 sm:grid-cols-5 gap-8">
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
        <div>
          <h4 className="text-cream font-semibold mb-3">Contact us</h4>
          <p>62/52 Kalki Niwas</p>
          <p>Bengoli Tola, New Bairahana</p>
          <p>Prayagraj, Uttar Pradesh</p>
          <p>211003</p>
          <p className="mt-2">
            <a href="tel:+918416834135" className="hover:text-cream transition-colors">
              +91 84168 34135
            </a>
          </p>
          <p>
            <a href="mailto:infobazaario@gmail.com" className="hover:text-cream transition-colors">
              infobazaario@gmail.com
            </a>
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 pb-10">
        <h4 className="text-cream font-semibold mb-3">Find us</h4>
        <div className="rounded-lg overflow-hidden border border-white/10">
          <iframe
            title="Bazaario store location"
            src="https://maps.google.com/maps?q=62%2F52%20Kalki%20Niwas%2C%20Bengoli%20Tola%2C%20New%20Bairahana%2C%20Prayagraj%2C%20Uttar%20Pradesh%20211003&output=embed"
            width="100%"
            height="280"
            style={{ border: 0 }}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      </div>

      <div className="border-t border-white/10 py-4 text-center text-xs">
        © {new Date().getFullYear()} Bazaario. All rights reserved.
      </div>
    </footer>
  );
}
