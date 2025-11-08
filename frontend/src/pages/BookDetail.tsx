import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getBook } from '../api/books';

export default function BookDetail(){
  const { id } = useParams();
  const [book, setBook] = useState<any>(null);

  useEffect(() => {
    if (!id) return;
    getBook(Number(id)).then(setBook).catch(console.error);
  }, [id]);

  if (!book) return <div className="p-6">Loading...</div>;

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl">{book.title}</h1>
      <div className="text-gray-600">{book.author}</div>
      <div className="mt-4">₹{book.price}</div>
      <div className="mt-4">{book.description}</div>
    </div>
  );
}