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
}

interface Transaction {
  id: number;
  books: Book[];
  seller: User;
  totalPrice: number;
  status: "PENDING" | "COMPLETED" | "CANCELLED";
}

const statusColors: any = {
  PENDING: "bg-yellow-500 text-black",
  COMPLETED: "bg-green-600 text-white",
  CANCELLED: "bg-red-600 text-white",
};

const TransactionDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [transaction, setTransaction] = useState<Transaction | null>(null);

  const fetchTransaction = async () => {
    const res = await axios.get(`http://localhost:8082/api/transactions/${id}`);
    setTransaction(res.data);
  };

  const completeTransaction = async () => {
    await axios.put(`http://localhost:8082/api/transactions/${id}/complete`);
    navigate("/orders");
  };

  const cancelTransaction = async () => {
    await axios.put(`http://localhost:8082/api/transactions/${id}/cancel`);
    navigate("/cart");
  };

  useEffect(() => {
    if (id) fetchTransaction();
  }, [id]);

  if (!transaction) return <div className="p-6">Loading transaction...</div>;

  return (
    <div className="min-h-screen p-6">
      <h1 className="text-3xl font-bold mb-6">Transaction Details</h1>

      <Card className="shadow-lg border rounded-xl">
        <CardHeader>
          <CardTitle className="text-xl font-semibold">Seller Information</CardTitle>
        </CardHeader>

        <CardContent className="p-6 space-y-6">

          {/* Seller Section */}
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-lg font-semibold">{transaction.seller.name}</h2>
              <p className="text-sm text-muted-foreground">{transaction.seller.email}</p>

              <Badge className={`mt-2 ${statusColors[transaction.status]}`}>
                {transaction.status}
              </Badge>
            </div>

            {/* Price */}
            <p className="text-3xl font-bold text-orange-600">
              ₹{transaction.totalPrice}
            </p>
          </div>

          {/* Books List (UPDATED) */}
          <div>
            <h3 className="font-medium mb-2">Books</h3>
            <ul className="space-y-3">
              {transaction.books.map((book) => (
                <li
                  key={book.id}
                  className="flex justify-between items-center bg-muted/30 p-4 rounded-lg border"
                >
                  <div className="flex items-center gap-3">
                    {/* Book icon in color */}
                    <BookOpen className="h-6 w-6 text-orange-600" />

                    {/* Title */}
                    <span className="text-sm font-medium">{book.title}</span>
                  </div>

                  {/* Price for each book (CLEAR & BOLD) */}
                  <span className="text-sm font-bold text-gray-900">
                    ₹{book.generatedPrice}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Buttons */}
         {/* Buttons */}
{transaction.status === "PENDING" && (
  <div className="flex gap-4 pt-4 border-t">

    <Button
      onClick={completeTransaction}
      className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-5 py-2 text-sm font-semibold"
    >
      <CheckCircle className="h-4 w-4" />
      Mark Completed
    </Button>

    <Button
      onClick={cancelTransaction}
      className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-5 py-2 text-sm font-semibold"
    >
      <XCircle className="h-4 w-4" />
      Cancel
    </Button>

  </div>
)}

        </CardContent>
      </Card>
    </div>
  );
};

export default TransactionDetails;
