import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Download, BookOpen, Package, Truck } from "lucide-react";
import axios from "axios";

interface BookDTO {
  id: number;
  title: string;
  type: string;
  generatedPrice: number;
  bookImage?: string; // ✅ image path from backend
}

interface OrderDTO {
  id: number;
  totalPrice: number;
  orderTime: string;
  status: string;
  buyerName?: string;
  sellerName?: string;
  books: BookDTO[];
}

const Orders = () => {
  const [buyerOrders, setBuyerOrders] = useState<OrderDTO[]>([]);
  const [sellerOrders, setSellerOrders] = useState<OrderDTO[]>([]);

  // ✅ Parse full user object from localStorage
  const userJson = localStorage.getItem("user");
  const user = userJson ? JSON.parse(userJson) : null;
  const userId = user?.id;

  const fetchOrders = async () => {
    try {
      const [buyerRes, sellerRes] = await Promise.all([
        axios.get(`http://localhost:8082/api/orders/buyer/${userId}`),
        axios.get(`http://localhost:8082/api/orders/seller/${userId}`),
      ]);
      setBuyerOrders(buyerRes.data);
      setSellerOrders(sellerRes.data);
    } catch (err) {
      console.error("Failed to fetch orders:", err);
    }
  };

  const markDelivered = async (orderId: number) => {
    try {
      await axios.put(`http://localhost:8082/api/orders/${orderId}/deliver`);
      fetchOrders();
    } catch (err) {
      console.error("Failed to mark delivered:", err);
    }
  };

  useEffect(() => {
    if (!userId) {
      console.error("No valid userId found in localStorage");
      return;
    }
    fetchOrders();
  }, [userId]);

  const renderBooks = (books: BookDTO[]) => (
    <ul className="mt-2 space-y-2">
      {books.map((book) => (
        <li key={book.id} className="flex items-center gap-3 text-sm">
          {book.bookImage ? (
            <img
              src={`http://localhost:8082${book.bookImage}`} // ✅ prepend backend host
              alt={book.title}
              className="w-12 h-16 object-cover rounded border"
            />
          ) : (
            <div className="w-12 h-16 bg-muted rounded flex items-center justify-center">
              <BookOpen className="h-5 w-5 text-muted-foreground" />
            </div>
          )}
          <div>
            <span className="font-medium">{book.title}</span>{" "}
            <Badge variant="default">{book.type}</Badge>
            {book.generatedPrice !== undefined && (
              <p className="text-xs text-muted-foreground">
                ₹{book.generatedPrice}
              </p>
            )}
          </div>
        </li>
      ))}
    </ul>
  );

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 pt-20 pb-12 bg-gradient-subtle">
        <div className="container max-w-6xl mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-4xl font-bold mb-2">Order History</h1>
              <p className="text-muted-foreground">
                Track all your book transactions
              </p>
            </div>
            <Package className="h-12 w-12 text-primary" />
          </div>

          {/* Bought Orders */}
          <h2 className="text-2xl font-semibold mb-4">Bought Orders</h2>
          {buyerOrders.length === 0 ? (
            <p className="text-gray-500 mb-8">No bought orders found.</p>
          ) : (
            buyerOrders.map((order) => (
              <Card key={order.id} className="shadow-elegant mb-6">
                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex-1 space-y-2">
                      <Badge variant="secondary">{order.status}</Badge>
                      <p className="text-sm text-muted-foreground">
                        Order Date:{" "}
                        {new Date(order.orderTime).toLocaleDateString()}
                      </p>
                      {order.sellerName && (
                        <p className="text-sm text-muted-foreground">
                          Seller: {order.sellerName}
                        </p>
                      )}
                      {renderBooks(order.books)}
                    </div>
                    <div className="flex flex-col items-end gap-3">
                      <p className="text-2xl font-bold text-primary">
                        ₹{order.totalPrice}
                      </p>
                      <Button variant="outline" size="sm">
                        <Download className="h-4 w-4 mr-2" />
                        Download Receipt
                      </Button>
                      {order.status === "PENDING_DELIVERY" && (
                        <Button
                          variant="default"
                          size="sm"
                          onClick={() => markDelivered(order.id)}
                        >
                          <Truck className="h-4 w-4 mr-2" />
                          Mark as Delivered
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}

          {/* Sold Orders */}
          <h2 className="text-2xl font-semibold mb-4 mt-10">Sold Orders</h2>
          {sellerOrders.length === 0 ? (
            <p className="text-gray-500">No sold orders found.</p>
          ) : (
            sellerOrders.map((order) => (
              <Card key={order.id} className="shadow-elegant mb-6">
                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex-1 space-y-2">
                      <Badge variant="secondary">{order.status}</Badge>
                      <p className="text-sm text-muted-foreground">
                        Order Date:{" "}
                        {new Date(order.orderTime).toLocaleDateString()}
                      </p>
                      {order.buyerName && (
                        <p className="text-sm text-muted-foreground">
                          Buyer: {order.buyerName}
                        </p>
                      )}
                      {renderBooks(order.books)}
                    </div>
                    <div className="flex flex-col items-end gap-3">
                      <p className="text-2xl font-bold text-primary">
                        ₹{order.totalPrice}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Orders;
