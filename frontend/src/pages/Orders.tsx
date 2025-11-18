// src/pages/Orders.tsx
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { BookOpen, Package, Truck, Star } from "lucide-react";
import axios, { AxiosHeaders } from "axios";
import { useNavigate } from "react-router-dom";
import { getUserFromToken } from "@/utils/jwtHelper";

// Axios with token
const axiosInstance = axios.create();
axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    if (!config.headers) config.headers = new AxiosHeaders();
    (config.headers as AxiosHeaders).set("Authorization", `Bearer ${token}`);
  }
  return config;
});

interface BookDTO {
  id: number;
  title: string;
  type: string;
  generatedPrice: number;
  bookImage?: string;
}

interface OrderDTO {
  id: number;
  totalPrice: number;
  orderTime: string;
  status: string;
  buyerId?: number;
  sellerId?: number;
  buyerName?: string;
  sellerName?: string;
  books: BookDTO[];
}

const statusColors: Record<string, string> = {
  PENDING_DELIVERY: "bg-amber-400 text-black",
  DELIVERED: "bg-green-600 text-white",
  CANCELLED: "bg-gray-500 text-white",
};

const typeColors: Record<string, string> = {
  Sale: "bg-blue-200 text-blue-800",
  Donate: "bg-green-200 text-green-800",
  Exchange: "bg-purple-200 text-purple-800",
  Rent: "bg-yellow-200 text-yellow-800",
  Other: "bg-gray-200 text-gray-800",
};

const capitalizeFirstLetter = (str: string) =>
  str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();

const Orders = () => {
  const [buyerOrders, setBuyerOrders] = useState<OrderDTO[]>([]);
  const [sellerOrders, setSellerOrders] = useState<OrderDTO[]>([]);
  const [activeTab, setActiveTab] = useState<"BUYER" | "SELLER">("BUYER");
  const [userId, setUserId] = useState<number | null>(null);

  const navigate = useNavigate();

  useEffect(() => {
    const user = getUserFromToken();
    if (user?.id) setUserId(user.id);
  }, []);

  const fetchOrders = async () => {
    if (!userId) return;

    try {
      const [buyerRes, sellerRes] = await Promise.all([
        axiosInstance.get(`http://localhost:8082/api/orders/buyer/${userId}`),
        axiosInstance.get(`http://localhost:8082/api/orders/seller/${userId}`),
      ]);

      console.log("=== RAW BUYER ORDERS ===", buyerRes.data);
      console.log("=== RAW SELLER ORDERS ===", sellerRes.data);

      // Log sellerId for each order
      buyerRes.data.forEach((o: OrderDTO) =>
        console.log(
          `OrderID ${o.id} → sellerId received:`,
          o.sellerId,
          "sellerName:",
          o.sellerName
        )
      );

      setBuyerOrders(buyerRes.data);
      setSellerOrders(sellerRes.data);
    } catch (err) {
      console.error("Failed to fetch orders:", err);
    }
  };

  const markDelivered = async (orderId: number) => {
    try {
      await axiosInstance.put(
        `http://localhost:8082/api/orders/${orderId}/deliver`
      );
      fetchOrders();
    } catch (err) {
      console.error("Failed to mark delivered:", err);
    }
  };

  useEffect(() => {
    if (userId) fetchOrders();
  }, [userId]);

  const renderBooks = (books: BookDTO[]) => (
    <ul className="mt-2 space-y-2">
      {books.map((book) => {
        const type = capitalizeFirstLetter(book.type);
        const badgeColor = typeColors[type] || typeColors["Other"];
        return (
          <li key={book.id} className="flex items-center gap-3 text-sm">
            {book.bookImage ? (
              <img
                src={`http://localhost:8082${book.bookImage}`}
                alt={book.title}
                className="w-12 h-16 object-cover rounded border"
              />
            ) : (
              <div className="w-12 h-16 bg-gray-100 rounded flex items-center justify-center">
                <BookOpen className="h-5 w-5 text-gray-600" />
              </div>
            )}
            <div>
              <span className="font-medium">{book.title}</span>{" "}
              <Badge className={`ml-1 px-2 py-1 rounded ${badgeColor}`}>
                {type}
              </Badge>
              <p className="text-xs text-muted-foreground">
                ₹{book.generatedPrice}
              </p>
            </div>
          </li>
        );
      })}
    </ul>
  );

  const renderOrderCard = (order: OrderDTO, isBuyer: boolean) => (
    <Card key={order.id} className="shadow-lg mb-6 rounded-xl border">
      <CardContent className="p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex-1 space-y-2">
            <Badge
              className={`px-2 py-1 rounded ${
                statusColors[order.status] || "bg-gray-300"
              }`}
            >
              {order.status.replace("_", " ")}
            </Badge>

            <p className="text-sm text-muted-foreground">
              Order Date: {new Date(order.orderTime).toLocaleDateString()}
            </p>

            {isBuyer && order.sellerName && (
              <p className="text-sm text-muted-foreground">
                Seller: {order.sellerName}
              </p>
            )}

            {renderBooks(order.books)}
          </div>

          <div className="flex flex-col items-end gap-3">
            <p className="text-2xl font-bold text-amber-600">
              ₹{order.totalPrice}
            </p>
            

            {isBuyer && (
              <>
                {/* <Button
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-2 border-amber-400 text-amber-600 hover:bg-amber-50"
                >
                  <Download className="h-4 w-4" />
                  Download Receipt
                </Button> */}
                {order.status === "PENDING_DELIVERY" && (
                  <Button
                    variant="default"
                    size="sm"
                    className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white"
                    onClick={() => markDelivered(order.id)}
                  >
                    <Truck className="h-4 w-4" />
                    Mark as Delivered
                  </Button>
                )}
              </>
            )}
            {/* ⭐ LOG BEFORE NAVIGATION */}
            {isBuyer && order.status === "DELIVERED" && (
              <Button
                size="sm"
                className="bg-orange-500 hover:bg-orange-600 text-white flex items-center gap-2"
                onClick={() => {
                  console.log(
                    "➡️ REVIEW button clicked for Order:",
                    order.id,
                    "Passing sellerId:",
                    order.sellerId,
                    "sellerName:",
                    order.sellerName
                  );

                  navigate("/ask-review", {
                    state: {
                      orderId: order.id,
                      sellerId: order.sellerId,
                      sellerName: order.sellerName,
                    },
                  });
                }}
              >
                <Star className="h-4 w-4" />
                Ask Review
              </Button>
            )}

            {order.status === "CANCELLED" && (
              <p className="text-xs text-gray-500 italic">No actions available</p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 pt-20 pb-12 bg-gray-50">
        <div className="container max-w-6xl mx-auto px-4 flex flex-col md:flex-row gap-6">
          <aside className="w-full md:w-1/4 bg-white rounded-lg shadow p-4 sticky top-24 self-start">
            <h2 className="text-lg font-semibold mb-4">Orders Menu</h2>
            <div className="flex flex-col gap-2">
              <button
                onClick={() => setActiveTab("BUYER")}
                className={`text-left px-4 py-2 rounded ${
                  activeTab === "BUYER"
                    ? "bg-orange-500 text-white font-semibold"
                    : "hover:bg-gray-100"
                }`}
              >
                Bought Orders
              </button>

              <button
                onClick={() => setActiveTab("SELLER")}
                className={`text-left px-4 py-2 rounded ${
                  activeTab === "SELLER"
                    ? "bg-orange-500 text-white font-semibold"
                    : "hover:bg-gray-100"
                }`}
              >
                Sold Orders
              </button>
            </div>
          </aside>

          <section className="flex-1">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-4xl font-bold mb-2">Order History</h1>
                <p className="text-muted-foreground">
                  Track all your book transactions
                </p>
              </div>
              <Package className="h-12 w-12 text-orange-500" />
            </div>

            {activeTab === "BUYER"
              ? buyerOrders.map((o) => renderOrderCard(o, true))
              : sellerOrders.map((o) => renderOrderCard(o, false))}
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Orders;
