import React, { useEffect, useState } from 'react';
import api from '../api/client';

export default function Wishlist(){
  const [list, setList] = useState<any[]>([]);
  const userId = 1;
  useEffect(()=>{ load(); }, []);
  async function load(){
    const res = await api.get('/wishlist', { params: { userId } });
    setList(res.data);
  }
  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl mb-4">My Wishlist</h1>
      {list.map(w => (
        <div key={w.id} className="border p-3 mb-2">Book ID: {w.bookId}</div>
      ))}
    </div>
  );
}