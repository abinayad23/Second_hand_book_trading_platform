import React, { useEffect, useState } from 'react';
import { getCart, removeCartItem } from '../api/cart';
import { createOrder } from '../api/orders';

export default function Cart() {
  const [cart, setCart] = useState<any>(null);
  const userId = 1; // placeholder

  useEffect(() => { load(); }, []);
  async function load() {
    const data = await getCart(userId);
    setCart(data);
  }

  async function checkout() {
    if (!cart) return;
    const items = (cart.items || []).map((it: any) => ({ bookId: it.bookId, price: 100 /* placeholder */, qty: it.qty }));
    const total = items.reduce((s: number, it: any) => s + it.price * it.qty, 0);
    const res = await createOrder({ buyerId: userId, total, items });
    alert('Order created. ClientSecret: ' + res.clientSecret);
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl mb-4">My Cart</h1>
      {!cart && <div>Loading...</div>}
      {cart && (
        <div>
          {(cart.items || []).map((it: any) => (
            <div key={it.id} className="border p-3 mb-2 flex justify-between">
              <div>Book ID: {it.bookId} x{it.qty}</div>
              <div>
                <button className="text-red-600" onClick={async () => { await removeCartItem(it.id); load(); }}>Remove</button>
              </div>
            </div>
          ))}
          <button className="bg-blue-600 text-white px-4 py-2 mt-4" onClick={checkout}>Checkout (Stripe)</button>
        </div>
      )}
    </div>
  );
}