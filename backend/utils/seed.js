import dotenv from 'dotenv';
import connectDB from '../config/db.js';
import User from '../models/User.js';
import Category from '../models/Category.js';
import Product from '../models/Product.js';

dotenv.config();

const run = async () => {
  await connectDB();

  console.log('Clearing existing data...');
  await Promise.all([User.deleteMany(), Category.deleteMany(), Product.deleteMany()]);

  console.log('Creating seller and admin accounts...');
  const admin = await User.create({
    name: 'Admin',
    email: 'admin@bazaario.test',
    password: 'AdminPass123',
    role: 'admin',
  });
  const seller = await User.create({
    name: 'Sample Seller',
    email: 'seller@bazaario.test',
    password: 'SellerPass123',
    role: 'seller',
  });

  console.log('Creating categories...');
  const categories = await Category.insertMany([
    { name: 'Electronics', slug: 'electronics', image: 'https://images.pexels.com/photos/2933604/pexels-photo-2933604.jpeg?auto=compress&cs=tinysrgb&w=200&h=200&fit=crop' },
    { name: 'Fashion', slug: 'fashion', image: 'https://images.pexels.com/photos/2249249/pexels-photo-2249249.jpeg?auto=compress&cs=tinysrgb&w=200&h=200&fit=crop' },
    { name: 'Home & Kitchen', slug: 'home-kitchen', image: 'https://images.pexels.com/photos/6245/pexels-photo-6245.jpeg?auto=compress&cs=tinysrgb&w=200&h=200&fit=crop' },
    { name: 'Grocery', slug: 'grocery', image: 'https://images.pexels.com/photos/264537/pexels-photo-264537.jpeg?auto=compress&cs=tinysrgb&w=200&h=200&fit=crop' },
  ]);

  console.log('Creating sample products...');
  const products = [
    {
      title: 'Wireless Bluetooth Earbuds',
      slug: 'wireless-bluetooth-earbuds',
      description: 'Compact true wireless earbuds with 24-hour battery life and active noise cancellation.',
      brand: 'SoundWave',
      category: categories[0]._id,
      seller: seller._id,
      images: ['https://images.pexels.com/photos/33298188/pexels-photo-33298188.jpeg?auto=compress&cs=tinysrgb&w=600&h=600&fit=crop'],
      price: 1999,
      mrp: 3499,
      stock: 50,
    },
    {
      title: 'Men\'s Cotton Casual Shirt',
      slug: 'mens-cotton-casual-shirt',
      description: '100% cotton breathable shirt, perfect for everyday wear.',
      brand: 'Urban Thread',
      category: categories[1]._id,
      seller: seller._id,
      images: ['https://images.pexels.com/photos/15835597/pexels-photo-15835597.jpeg?auto=compress&cs=tinysrgb&w=600&h=600&fit=crop'],
      price: 799,
      mrp: 1299,
      stock: 120,
    },
    {
      title: 'Non-Stick Frying Pan 24cm',
      slug: 'non-stick-frying-pan-24cm',
      description: 'Durable non-stick coating, induction compatible, easy to clean.',
      brand: 'HomeChef',
      category: categories[2]._id,
      seller: seller._id,
      images: ['https://images.pexels.com/photos/105588/pexels-photo-105588.jpeg?auto=compress&cs=tinysrgb&w=600&h=600&fit=crop'],
      price: 649,
      mrp: 999,
      stock: 80,
    },
    {
      title: 'Organic Basmati Rice 5kg',
      slug: 'organic-basmati-rice-5kg',
      description: 'Premium long-grain organic basmati rice, aged for extra aroma.',
      brand: 'FarmFresh',
      category: categories[3]._id,
      seller: seller._id,
      images: ['https://images.pexels.com/photos/4110251/pexels-photo-4110251.jpeg?auto=compress&cs=tinysrgb&w=600&h=600&fit=crop'],
      price: 549,
      mrp: 699,
      stock: 200,
    },
  ];

  await Product.insertMany(products);

  console.log('Seed complete!');
  console.log(`Admin login: admin@bazaario.test / AdminPass123`);
  console.log(`Seller login: seller@bazaario.test / SellerPass123`);
  process.exit(0);
};

run().catch((err) => {
  console.error(err);
  process.exit(1);
});