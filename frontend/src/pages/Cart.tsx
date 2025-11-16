import { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const Cart = () => {
  const storedUser = localStorage.getItem("user");
  const user = storedUser ? JSON.parse(storedUser) : null;
  const [cartItems, setCartItems] = useState<any[]>([]);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    if (user?.id) fetchCart();
  }, [user?.id]);

  // 🔹 Recalculate total whenever cartItems change
  useEffect(() => {
    const totalAmount = cartItems.reduce(
      (sum, item) => sum + (item.book.generatedPrice || 0),
      0
    );
    setTotal(totalAmount);
  }, [cartItems]);

  const fetchCart = async () => {
    try {
      const res = await axios.get("http://localhost:8082/api/cart", {
        params: { userId: user.id },
      });
      setCartItems(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const removeFromCart = async (bookId: number) => {
    try {
      await axios.delete("http://localhost:8082/api/cart/remove", {
        params: { userId: user.id, bookId },
      });
      // 🔹 Update cart and total immediately
      setCartItems((prev) => prev.filter((item) => item.book.id !== bookId));
    } catch (err) {
      console.error(err);
    }
  };

  if (!user)
    return (
      <div className="text-center mt-20">
        Please login to view your cart.
      </div>
    );

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 pt-20 pb-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold mb-6 text-center">My Cart</h1>

          {cartItems.length === 0 ? (
            <p className="text-center text-gray-500 mt-10">
              No books in your cart yet.
            </p>
          ) : (
            <>
              <div className="grid md:grid-cols-3 gap-6">
                {cartItems.map((item) => (
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
                        className="rounded-lg mb-3 w-full h-64 object-cover"
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
                      <Button
                        variant="destructive"
                        onClick={() => removeFromCart(item.book.id)}
                      >
                        Remove
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <div className="text-right mt-10">
                <h2 className="text-2xl font-bold mb-4">
                  Total: ₹{total.toFixed(2)}
                </h2>
                <Button className="bg-amber-500 text-white hover:bg-amber-600">
                  Proceed to Order
                </Button>
              </div>
            </>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Cart;
