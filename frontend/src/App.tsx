import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import Browse from './pages/Browse';
import BookDetail from './pages/BookDetail';
import AddBook from './pages/AddBook';
import Cart from './pages/Cart';
import Wishlist from './pages/Wishlist';

export default function App() {
  const loggedIn = !!localStorage.getItem('jwt');
  return (
    <Routes>
      <Route path="/" element={loggedIn ? <Navigate to="/browse" /> : <Login />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/browse" element={loggedIn ? <Browse /> : <Navigate to="/login" />} />
      <Route path="/book/:id" element={loggedIn ? <BookDetail /> : <Navigate to="/login" />} />
      <Route path="/add-book" element={loggedIn ? <AddBook /> : <Navigate to="/login" />} />
      <Route path="/profile" element={loggedIn ? <Profile /> : <Navigate to="/login" />} />
      <Route path="/cart" element={loggedIn ? <Cart /> : <Navigate to="/login" />} />
      <Route path="/wishlist" element={loggedIn ? <Wishlist /> : <Navigate to="/login" />} />
    </Routes>
  );
}