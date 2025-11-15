import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Download, BookOpen, Package, Truck } from "lucide-react";
import axios from "axios";

interface Book {
  id: number;
  title: string;
  author?: string;
  generatedPrice?: number;
  type: string; // 👈 show type per book
}

interface Order {
  id: number;
  books: Book[];
  totalPrice?: number;
  orderTime: string;
  status: string;
  buyer?: { id: number; name: string };
  seller?: { id: number; name: string };
}

const Orders = () => {
  const [buyerOrders, setBuyerOrders] = useState<Order[]>([]);
  const [sellerOrders, setSellerOrders] = useState<Order[]>([]);
  const [filter, setFilter] = useState("all");

  const userId = Number(localStorage.getItem("userId"));

  const fetchOrders = async () => {
    try {
      const [buyerRes, sellerRes] = await Promise.all([
        axios.get(`/api/orders/buyer/${userId}`),
        axios.get(`/api/orders/seller/${userId}`),
      ]);
      setBuyerOrders(buyerRes.data);
      setSellerOrders(sellerRes.data);
    } catch (err) {
      console.error("Failed to fetch orders:", err);
    }
  };

  const markDelivered = async (orderId: number) => {
    try {
      await axios.put(`/api/orders/${orderId}/deliver`);
      fetchOrders();
    } catch (err) {
      console.error("Failed to mark delivered:", err);
    }
  };

  useEffect(() => {
    if (userId) fetchOrders();
  }, [userId]);

  // Merge buyer + seller orders for "all"
  const allOrders = [...buyerOrders, ...sellerOrders];

  // Filter logic
  const filteredOrders =
    filter === "all"
      ? allOrders
      : filter === "bought"
      ? buyerOrders
      : filter === "sold"
      ? sellerOrders
      : [];

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

          <Tabs
            defaultValue="all"
            className="space-y-6"
            onValueChange={(val) => setFilter(val)}
          >
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="bought">Bought</TabsTrigger>
              <TabsTrigger value="sold">Sold</TabsTrigger>
              <TabsTrigger value="exchanged">Exchanged</TabsTrigger>
              <TabsTrigger value="donated">Donated</TabsTrigger>
            </TabsList>

            <TabsContent value={filter} className="space-y-4">
              {filteredOrders.length === 0 ? (
                <p className="text-center text-gray-500 mt-10">
                  No {filter === "all" ? "" : filter} orders found.
                </p>
              ) : (
                filteredOrders.map((order) => (
                  <Card key={order.id} className="shadow-elegant">
                    <CardContent className="p-6">
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="flex gap-4 flex-1">
                          <div className="w-16 h-20 bg-muted rounded flex items-center justify-center flex-shrink-0">
                            <BookOpen className="h-6 w-6 text-muted-foreground" />
                          </div>
                          <div className="space-y-2">
                            <div className="flex items-center gap-2 flex-wrap">
                              <Badge variant="secondary">{order.status}</Badge>
                            </div>
                            <div className="text-sm text-muted-foreground space-y-1">
                              <p>
                                Order Date:{" "}
                                {new Date(order.orderTime).toLocaleDateString()}
                              </p>
                              {order.seller && (
                                <p>Seller: {order.seller.name}</p>
                              )}
                              {order.buyer && <p>Buyer: {order.buyer.name}</p>}
                            </div>
                            {/* List books with type */}
                            <ul className="mt-2 space-y-1">
                              {order.books.map((book) => (
                                <li key={book.id} className="text-sm">
                                  <span className="font-medium">
                                    {book.title}
                                  </span>{" "}
                                  <Badge variant="default">{book.type}</Badge>
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                        <div className="flex flex-col items-end gap-3">
                          {order.totalPrice && (
                            <p className="text-2xl font-bold text-primary">
                              ₹{order.totalPrice}
                            </p>
                          )}
                          {filter === "bought" && (
                            <>
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
                            </>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </TabsContent>
          </Tabs>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Orders;
