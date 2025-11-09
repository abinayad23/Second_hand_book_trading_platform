import { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const Wishlist = () => {
  const storedUser = localStorage.getItem("user");
  const user = storedUser ? JSON.parse(storedUser) : null;
  const [wishlist, setWishlist] = useState<any[]>([]);

  useEffect(() => {
    if (user?.id) fetchWishlist();
  }, [user?.id]);

  const fetchWishlist = async () => {
    try {
      const res = await axios.get(`http://localhost:8082/api/wishlist`,{
        params: {userId:user.id},
        headers:{
          "X-User-ID":user.id,
        },
      });
      setWishlist(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const removeFromWishlist = async (bookId: number) => {
    try {
      await axios.delete(`http://localhost:8082/api/wishlist/remove`, {
        params: { userId: user.id, bookId },
         headers: { "X-User-ID": user.id },
      });
      setWishlist(wishlist.filter((item) => item.book.id !== bookId));
    } catch (err) {
      console.error(err);
    }
  };

  if (!user) return <div className="text-center mt-20">Please login to view your wishlist.</div>;

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 pt-20 pb-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold mb-6 text-center">My Wishlist</h1>

          {wishlist.length === 0 ? (
            <p className="text-center text-gray-500 mt-10">No books in your wishlist yet.</p>
          ) : (
            <div className="grid md:grid-cols-3 gap-6">
              {wishlist.map((item) => (
                <Card key={item.id} className="shadow-elegant">
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
                    <p className="text-sm mb-2 text-muted-foreground">by {item.book.author}</p>
                    <p className="text-sm mb-2">Quality: {item.book.quality}</p>
                    <p className="font-semibold mb-2">₹ {item.book.generatedPrice}</p>
                    <Button variant="destructive" onClick={() => removeFromWishlist(item.book.id)}>
                      Remove
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Wishlist;
