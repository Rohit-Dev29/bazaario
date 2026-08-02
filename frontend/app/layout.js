import './globals.css';
import { CartProvider } from '../context/CartContext';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export const metadata = {     title: 'Bazaario — Everything, from everyone',
     description: 'A marketplace for sellers and shoppers alike.',
     verification: {
       google: 'z0l3GhIsgOe6yCMIai_ryz0RiPCpG9aeMDxbAb3nPK8',
     },
  };

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="font-sans min-h-screen flex flex-col">
        <CartProvider>
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
        </CartProvider>
      </body>
    </html>
  );
}
