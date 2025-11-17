import React from "react";

type Seller = {
  id: number;
  name: string;
  email: string;
};

type Book = {
  id: number;
  title: string;
  generatedPrice: number;
};

type CartItem = {
  id: number;
  book: Book;
  addedTime: string;
};

type CartGroupProps = {
  seller: Seller;
  cartItems: CartItem[];
  totalPrice: number;
  onCheckout: (sellerId: number) => void;
};

export const CartGroup: React.FC<CartGroupProps> = ({
  seller,
  cartItems,
  totalPrice,
  onCheckout,
}) => (
  <div className="bg-white shadow rounded p-4 mb-6">
    <h2 className="font-bold text-lg">{seller.name}</h2>
    <ul>
      {cartItems.map((item) => (
        <li key={item.id} className="py-2 flex justify-between">
          <span>{item.book.title}</span>
          <span>₹ {item.book.generatedPrice}</span>
        </li>
      ))}
    </ul>
    <div className="flex justify-between mt-4 items-center">
      <span className="text-xl font-semibold">Total: ₹ {totalPrice}</span>
      <button
        onClick={() => onCheckout(seller.id)}
        className="bg-blue-600 text-white px-4 py-2 rounded"
      >
        Proceed to Transaction
      </button>
    </div>
  </div>
);