import React, { useEffect, useState } from 'react';
import { listBooks } from '../api/books';
import BookCard from '../components/BookCard';

export default function Browse() {
  const [books, setBooks] = useState<any[]>([]);
  const [category, setCategory] = useState<string | null>(null);

  useEffect(() => {
    load();
  }, [category]);

  async function load() {
    try {
      const data = await listBooks(category || undefined);
      setBooks(data);
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-2xl mb-4">Browse Books</h1>
      <div className="flex gap-3 mb-4">
        <button onClick={() => setCategory(null)} className="px-3 py-1 bg-gray-200 rounded">All</button>
        <button onClick={() => setCategory('BUY')} className="px-3 py-1 bg-gray-200 rounded">Buy</button>
        <button onClick={() => setCategory('EXCHANGE')} className="px-3 py-1 bg-gray-200 rounded">Exchange</button>
        <button onClick={() => setCategory('DONATE')} className="px-3 py-1 bg-gray-200 rounded">Donate</button>
      </div>
      <div className="grid grid-cols-3 gap-4">
        {books.map(b => (
          <BookCard key={b.id} book={b} />
        ))}
      </div>
    </div>
  );
}