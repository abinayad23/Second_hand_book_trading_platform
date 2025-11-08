import React from 'react';
import { Link } from 'react-router-dom';

export default function BookCard({book}: any) {
  const img = book.images && book.images[0] ? book.images[0] : '';
  return (
    <div className="border p-4 rounded">
      {img && <img src={img} alt={book.title} className="w-full h-40 object-cover mb-2" />}
      <h3 className="font-semibold">{book.title}</h3>
      <div className="text-sm text-gray-600">{book.author}</div>
      <div className="mt-2">₹{book.price}</div>
      <div className="mt-3">
        <Link to={`/book/${book.id}`} className="text-blue-600">View</Link>
      </div>
    </div>
  );
}