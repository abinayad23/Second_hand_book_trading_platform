import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Book {
  id: number;
  title: string;
  author: string;
  quality: string;
  generatedPrice: number;
  bookImage?: string;
  available: boolean; // 👈 added availability
}

interface User {
  id: number;
  name: string;
  email: string;
}

interface CartItem {
  id: number;
  book: Book;
  addedTime: string;
}

interface CartGroup {
  seller: User;
  cartItems: CartItem[];
  totalPrice: number;
}

const Cart = () => {
  const storedUser = localStorage.getItem("user");
  const user = storedUser ? JSON.parse(storedUser) : null;
  const [groups, setGroups] = useState<CartGroup[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (user?.id) fetchGroupedCart();
  }, [user?.id]);

  const fetchGroupedCart = async () => {
    try {
      const res = await axios.get(
        `http://localhost:8082/api/cart/user/${user.id}/grouped`
      );
      setGroups(res.data || []);
    } catch (err) {
      console.error(err);
    }
  };

  const removeFromCart = async (cartId: number) => {
    try {
      await axios.delete(`http://localhost:8082/api/cart/${cartId}`);
      fetchGroupedCart();
    } catch (err) {
      console.error(err);
    }
  };

  const handleCheckout = async () => {
    try {
      const res = await axios.post(
        "http://localhost:8082/api/transactions/create",
        null,
        { params: { buyerId: user.id } }
      );

      const transactions = res.data;
      if (transactions.length > 0) {
        const firstTransactionId = transactions[0].id;
        navigate(`/transaction/${firstTransactionId}`);
      } else {
        alert("No transactions created.");
      }
    } catch (err) {
      alert("Checkout failed!");
      console.error(err);
    }
  };

  if (!user)
    return (
      <div className="text-center mt-20">Please login to view your cart.</div>
    );

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 pt-20 pb-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold mb-6 text-center">My Cart</h1>
          {groups.length === 0 ? (
            <p className="text-center text-gray-500 mt-10">
              No books in your cart yet.
            </p>
          ) : (
            <>
              {groups.map((group) => (
                <div
                  key={group.seller.id}
                  className="mb-10 bg-white shadow-lg rounded-lg p-6"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h2 className="text-lg font-bold">{group.seller.name}</h2>
                      <p className="text-sm text-gray-500">
                        {group.seller.email}
                      </p>
                    </div>
                    <div>
                      <span className="text-lg font-semibold text-amber-600">
                        Total: ₹{group.totalPrice.toFixed(2)}
                      </span>
                    </div>
                  </div>
                  <div className="grid md:grid-cols-3 gap-6">
                    {group.cartItems.map((item) => (
                      <Card key={item.id} className="shadow-lg">
                        <CardHeader>
                          <CardTitle>{item.book.title}</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <img
                            src={
                              item.book.bookImage
                                ? `http://localhost:8082${item.book.bookImage}`
                                : "https://via.placeholder.com/300x400?text=No+Image"
                            }
                            alt={item.book.title}
                            className={`rounded-lg mb-3 w-full h-64 object-cover ${
                              item.book.available === false
                                ? "filter blur-sm opacity-60"
                                : ""
                            }`}
                          />
                          <p className="text-sm text-muted-foreground mb-2">
                            {item.book.author}
                          </p>
                          <p className="text-sm mb-2">
                            Quality: {item.book.quality}
                          </p>
                          <p className="font-semibold text-amber-600 mb-3">
                            ₹{item.book.generatedPrice}
                          </p>
                          {item.book.available === false ? (
                            <p className="text-red-500 font-semibold">
                              Not Available
                            </p>
                          ) : (
                            <Button
                              variant="destructive"
                              onClick={() => removeFromCart(item.id)}
                            >
                              Remove
                            </Button>
                          )}
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                  <div className="text-right mt-8">
                    <Button
                      className="bg-amber-500 text-white hover:bg-amber-600"
                      onClick={handleCheckout}
                      disabled={group.cartItems.some(
                        (item) => item.book.available === false
                      )} // disable checkout if any unavailable
                    >
                      Proceed to Order
                    </Button>
                  </div>
                </div>
              ))}
            </>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Cart;
