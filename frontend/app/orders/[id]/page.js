async function getOrder(id) {
  const base = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
  try {
    const res = await fetch(`${base}/orders/${id}`, { cache: 'no-store', credentials: 'include' });
    if (!res.ok) return null;
    return (await res.json()).order;
  } catch (e) {
    return null;
  }
}

export default async function OrderDetailPage({ params }) {
  const order = await getOrder(params.id);

  if (!order) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center">
        <h1 className="font-display text-2xl text-indigo-950">Order not found</h1>
        <p className="text-indigo-900/60 mt-2">Sign in to view your order details.</p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <h1 className="font-display text-2xl font-600 text-indigo-950">Order confirmed 🎉</h1>
      <p className="text-indigo-900/60 mt-1">Order ID: {order._id}</p>
      <p className="text-indigo-900/60">Status: <span className="capitalize font-medium">{order.status}</span></p>

      <div className="mt-6 bg-white border border-indigo-900/10 rounded-lg divide-y divide-indigo-900/10">
        {order.items.map((item, i) => (
          <div key={i} className="flex gap-4 p-4">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={item.image} alt={item.title} className="w-16 h-16 object-cover rounded-md bg-cream" />
            <div className="flex-1">
              <p className="font-medium text-indigo-950">{item.title}</p>
              <p className="text-sm text-indigo-900/60">Qty: {item.quantity}</p>
            </div>
            <p className="font-medium text-indigo-950">₹{(item.price * item.quantity).toLocaleString('en-IN')}</p>
          </div>
        ))}
      </div>

      <div className="mt-6 bg-white border border-indigo-900/10 rounded-lg p-5">
        <h2 className="font-semibold text-indigo-950 mb-2">Shipping to</h2>
        <p className="text-sm text-indigo-900/80">
          {order.shippingAddress.line1}, {order.shippingAddress.city}, {order.shippingAddress.state}{' '}
          {order.shippingAddress.postalCode}
        </p>
      </div>

      <div className="mt-6 flex justify-between font-semibold text-indigo-950 text-lg">
        <span>Total paid</span>
        <span>₹{order.totalPrice.toLocaleString('en-IN')}</span>
      </div>
    </div>
  );
}
