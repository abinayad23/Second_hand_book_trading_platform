// src/pages/Cart.tsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios, { AxiosHeaders } from "axios";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getUserFromToken } from "@/utils/jwtHelper";

interface Book {
  id: number;
  title: string;
  author: string;
  quality: string;
  generatedPrice: number;
  bookImage?: string;
  available: boolean;
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

// 🔹 Axios instance with JWT interceptor
const axiosInstance = axios.create();
axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    if (!config.headers) {
      config.headers = new AxiosHeaders();
    }
    (config.headers as AxiosHeaders).set("Authorization", `Bearer ${token}`);
  }
  return config;
});

const Cart = () => {
  const [user, setUser] = useState<User | null>(null);
  const [groups, setGroups] = useState<CartGroup[]>([]);
  const navigate = useNavigate();

  // Get logged-in user from JWT
  useEffect(() => {
    const loggedInUser = getUserFromToken();
    if (loggedInUser?.email) {
      setUser({
        id: loggedInUser.id ?? 0,
        name: loggedInUser.username ?? "",
        email: loggedInUser.email ?? "",
      });
    }
  }, []);

  // Fetch grouped cart
  useEffect(() => {
    if (user?.id) fetchGroupedCart();
  }, [user?.id]);

  const fetchGroupedCart = async () => {
    try {
      const res = await axiosInstance.get<CartGroup[]>(
        `http://localhost:8082/api/cart/user/${user?.id}/grouped`
      );
      setGroups(res.data || []);
    } catch (err) {
      console.error(err);
    }
  };

  const removeFromCart = async (cartId: number) => {
    try {
      await axiosInstance.delete(`http://localhost:8082/api/cart/${cartId}`);
      fetchGroupedCart();
    } catch (err) {
      console.error(err);
    }
  };

  const handleCheckout = async () => {
    try {
      const res = await axiosInstance.post(
        "http://localhost:8082/api/transactions/create",
        null,
        { params: { buyerId: user?.id } }
      );

      const transactions = res.data;
      if (transactions.length > 0) {
        navigate(`/transaction/${transactions[0].id}`);
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
      <div className="text-center mt-20 text-gray-600 text-lg">
        Please login to view your cart.
      </div>
    );

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />

      <main className="flex-1 pt-24 pb-16">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold text-center mb-10 text-gray-800">
            My Cart
          </h1>

          {groups.length === 0 ? (
            <div className="text-center mt-20">
              <p className="text-gray-500 text-lg">Your cart is empty.</p>
            </div>
          ) : (
            <>
              {groups.map((group) => (
                <div
                  key={group.seller.id}
                  className="mb-12 bg-white rounded-xl shadow-md border border-gray-200 p-6"
                >
                  {/* Seller Header */}
                  <div className="flex items-center justify-between border-b pb-4 mb-6">
                    <div>
                      <h2 className="text-xl font-semibold text-gray-800">
                        Seller: {group.seller.name}
                      </h2>
                      <p className="text-sm text-gray-500">{group.seller.email}</p>
                    </div>

                    <span className="text-xl font-bold text-amber-600">
                      Total: ₹{group.totalPrice.toFixed(2)}
                    </span>
                  </div>

                  {/* Books */}
                  <div className="grid gap-6 md:grid-cols-3">
                    {group.cartItems.map((item) => (
                      <Card
                        key={item.id}
                        className="rounded-xl border shadow-sm hover:shadow-lg transition"
                      >
                        <CardHeader>
                          <CardTitle className="text-lg font-semibold">
                            {item.book.title}
                          </CardTitle>
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
                              !item.book.available ? "blur-sm opacity-60" : ""
                            }`}
                          />

                          <p className="text-sm text-gray-500 mb-1">{item.book.author}</p>
                          <p className="text-sm mb-1">Quality: {item.book.quality}</p>

                          <p className="font-semibold text-amber-600 mb-3">
                            ₹{item.book.generatedPrice}
                          </p>

                          {!item.book.available ? (
                            <p className="text-red-500 font-semibold text-sm">
                              Not Available
                            </p>
                          ) : (
                            <Button
                              onClick={() => removeFromCart(item.id)}
                              className="w-full bg-teal-600 text-white hover:bg-teal-700 font-semibold shadow-md"
                            >
                              Remove
                            </Button>
                          )}
                        </CardContent>
                      </Card>
                    ))}
                  </div>

                  {/* Checkout */}
                  <div className="text-right mt-10">
                    <Button
                      className="bg-amber-600 hover:bg-amber-700 text-white px-6 py-3 text-lg rounded-lg shadow-md"
                      onClick={handleCheckout}
                      disabled={group.cartItems.some((i) => !i.book.available)}
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
