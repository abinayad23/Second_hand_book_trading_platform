import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BookOpen, CheckCircle, XCircle } from "lucide-react";

interface Book {
  id: number;
  title: string;
  generatedPrice: number;
}

interface User {
  id: number;
  name: string;
  email: string;
  role?: string;
}

interface Transaction {
  id: number;
  books: Book[];
  seller: User;
  totalPrice: number;
  status: "PENDING" | "COMPLETE" | "CANCEL";
}

const statusColors: Record<Transaction["status"], string> = {
  PENDING:"bg-yellow-500 text-black",
  COMPLETE:"bg-green-600 text-white",
  CANCEL:"bg-red-600 text-white",
};

const TransactionDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [transaction, setTransaction] = useState<Transaction | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  const token = localStorage.getItem("token");

  const fetchTransaction = async () => {
    if (!token) {
      alert("Please login to view transactions");
      navigate("/login");
      return;
    }

    try {
      const res = await axios.get(`http://localhost:8082/api/transactions/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // Map backend user object to our User type
      const fetchedTransaction: Transaction = {
        ...res.data,
        seller: {
          id: res.data.seller.id,
          name: res.data.seller.username || res.data.seller.name || "Unknown", // map username -> name
          email: res.data.seller.email,
          role: res.data.seller.role,
        },
      };

      setTransaction(fetchedTransaction);
    } catch (error) {
      console.error("Failed to fetch transaction:", error);
      alert("Failed to fetch transaction");
    } finally {
      setLoading(false);
    }
  };

  const updateTransactionStatus = async (status: "COMPLETE" | "CANCEL") => {
    if (!transaction || !token) return;
    setUpdating(true);

    try {
      await axios.put(
        `http://localhost:8082/api/transactions/${transaction.id}/${status.toLowerCase()}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setTransaction({ ...transaction, status });
      if (status === "COMPLETE") navigate("/orders");
      if (status === "CANCEL") navigate("/cart");
    } catch (error) {
      console.error(`Failed to ${status.toLowerCase()} transaction:`, error);
      alert(`Failed to ${status.toLowerCase()} transaction.`);
    } finally {
      setUpdating(false);
    }
  };

  useEffect(() => {
    if (id) fetchTransaction();
  }, [id]);

  if (loading) return <div className="p-6 text-center">Loading transaction...</div>;
  if (!transaction)
    return <div className="p-6 text-center text-red-600">Transaction not found.</div>;

  return (
    <div className="min-h-screen p-6">
      <h1 className="text-3xl font-bold mb-6">Transaction Details</h1>

      <Card className="shadow-lg border rounded-xl">
        <CardHeader>
          <CardTitle className="text-xl font-semibold">Seller Information</CardTitle>
        </CardHeader>

        <CardContent className="p-6 space-y-6">
          {/* Seller Info */}
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-lg font-semibold">{transaction.seller.name}</h2>
              <p className="text-sm text-muted-foreground">{transaction.seller.email}</p>
              <Badge className={`mt-2 ${statusColors[transaction.status]}`}>
                {transaction.status}
              </Badge>
            </div>

            {/* Total Price */}
            <p className="text-3xl font-bold text-orange-600">
              ₹{transaction.totalPrice}
            </p>
          </div>

          {/* Books List */}
          <div>
            <h3 className="font-medium mb-2">Books</h3>
            <ul className="space-y-3">
              {transaction.books.map((book) => (
                <li
                  key={book.id}
                  className="flex justify-between items-center bg-muted/30 p-4 rounded-lg border"
                >
                  <div className="flex items-center gap-3">
                    <BookOpen className="h-6 w-6 text-orange-600" />
                    <span className="text-sm font-medium">{book.title}</span>
                  </div>
                  <span className="text-sm font-bold text-gray-900">
                    ₹{book.generatedPrice}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Action Buttons */}
          {transaction.status === "PENDING" && (
            <div className="flex gap-4 pt-4 border-t">
              <Button
                onClick={() => updateTransactionStatus("COMPLETE")}
                disabled={updating}
                className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-5 py-2 text-sm font-semibold"
              >
                <CheckCircle className="h-4 w-4" />
                {updating ? "Updating..." : "Mark Completed"}
              </Button>

              <Button
                onClick={() => updateTransactionStatus("CANCEL")}
                disabled={updating}
                className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-5 py-2 text-sm font-semibold"
              >
                <XCircle className="h-4 w-4" />
                {updating ? "Updating..." : "Cancel"}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default TransactionDetails;
