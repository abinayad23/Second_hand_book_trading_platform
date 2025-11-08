import React, { useState } from 'react';
import { createBook, uploadBookImages } from '../api/books';
import { useNavigate } from 'react-router-dom';

export default function AddBook(){
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [originalPrice, setOriginalPrice] = useState('');
  const [quality, setQuality] = useState('GOOD');
  const [category, setCategory] = useState('BUY');
  const [files, setFiles] = useState<File[]>([]);
  const nav = useNavigate();

  async function submit(e: React.FormEvent){
    e.preventDefault();
    const payload = { sellerId: 1, title, author, originalPrice: parseFloat(originalPrice), quality, category, description: '' };
    const bk: any = await createBook(payload);
    if (files.length) {
      await uploadBookImages(bk.id, files);
    }
    nav('/browse');
  }

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-xl mb-4">Add Book</h1>
      <form onSubmit={submit} className="space-y-3">
        <input className="w-full p-2" placeholder="Title" value={title} onChange={e=>setTitle(e.target.value)} />
        <input className="w-full p-2" placeholder="Author" value={author} onChange={e=>setAuthor(e.target.value)} />
        <input className="w-full p-2" placeholder="Original Price" value={originalPrice} onChange={e=>setOriginalPrice(e.target.value)} />
        <select value={quality} onChange={e=>setQuality(e.target.value)} className="w-full p-2">
          <option value="NEW_LIKE">New-like</option>
          <option value="VERY_GOOD">Very good</option>
          <option value="GOOD">Good</option>
          <option value="FAIR">Fair</option>
          <option value="POOR">Poor</option>
        </select>
        <select value={category} onChange={e=>setCategory(e.target.value)} className="w-full p-2">
          <option value="BUY">Buy</option>
          <option value="EXCHANGE">Exchange</option>
          <option value="DONATE">Donate</option>
        </select>
        <input type="file" multiple onChange={e=> setFiles(Array.from(e.target.files || []))} />
        <button className="bg-green-600 text-white px-4 py-2">Add</button>
      </form>
    </div>
  );
}