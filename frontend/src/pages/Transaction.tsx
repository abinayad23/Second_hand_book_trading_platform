import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BookOpen, CheckCircle, XCircle } from "lucide-react";

interface Book {
  id: number;
  title: string;
  price: number;
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
      <Card className="shadow-lg">
        <CardContent className="p-6 space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-xl font-semibold">Seller: {transaction.seller.name}</h2>
              <p className="text-sm text-muted-foreground">{transaction.seller.email}</p>
              <Badge variant="secondary">{transaction.status}</Badge>
            </div>
            <p className="text-lg font-bold text-primary">₹{transaction.totalPrice}</p>
          </div>
          <ul className="space-y-2">
            {transaction.books.map((book) => (
              <li key={book.id} className="flex items-center gap-3">
                <BookOpen className="h-5 w-5 text-muted-foreground" />
                <span>{book.title} - ₹{book.price}</span>
              </li>
            ))}
          </ul>
          {transaction.status === "PENDING" && (
            <div className="flex gap-4 mt-4">
              <Button onClick={completeTransaction} variant="default">
                <CheckCircle className="h-4 w-4 mr-2" />
                Mark Completed
              </Button>
              <Button onClick={cancelTransaction} variant="destructive">
                <XCircle className="h-4 w-4 mr-2" />
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
