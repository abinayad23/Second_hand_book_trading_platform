import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Heart, Trash2, BookOpen, MessageCircle } from "lucide-react";
import { Link } from "react-router-dom";

const Wishlist = () => {
  const wishlistItems = [
    { id: 1, title: "Operating Systems", author: "William Stallings", price: 540, subject: "Computer Science", type: "sell" },
    { id: 2, title: "Digital Signal Processing", author: "Alan V. Oppenheim", price: 720, subject: "Electronics", type: "sell" },
    { id: 3, title: "Thermodynamics", author: "Yunus A. Cengel", subject: "Mechanical", type: "exchange" },
    { id: 4, title: "Quantum Mechanics", author: "David J. Griffiths", subject: "Physics", type: "donate" },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 pt-20 pb-12 bg-gradient-subtle">
        <div className="container max-w-6xl mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-4xl font-bold mb-2">My Wishlist</h1>
              <p className="text-muted-foreground">Books you're interested in ({wishlistItems.length})</p>
            </div>
            <Heart className="h-12 w-12 text-primary fill-primary" />
          </div>

          {wishlistItems.length === 0 ? (
            <Card className="shadow-elegant">
              <CardContent className="flex flex-col items-center justify-center py-16">
                <Heart className="h-16 w-16 text-muted-foreground mb-4" />
                <h3 className="text-xl font-semibold mb-2">Your wishlist is empty</h3>
                <p className="text-muted-foreground mb-6">Start adding books you're interested in</p>
                <Link to="/books">
                  <Button>Browse Books</Button>
                </Link>
              </CardContent>
            </Card>
          ) : (
            <div className="grid md:grid-cols-2 gap-6">
              {wishlistItems.map((book) => (
                <Card key={book.id} className="shadow-elegant hover:shadow-glow transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex gap-4">
                      <div className="w-24 h-32 bg-muted rounded flex items-center justify-center flex-shrink-0">
                        <BookOpen className="h-8 w-8 text-muted-foreground" />
                      </div>
                      <div className="flex-1 space-y-3">
                        <div>
                          <h3 className="font-semibold text-lg mb-1">{book.title}</h3>
                          <p className="text-sm text-muted-foreground">{book.author}</p>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          <Badge variant="secondary">{book.subject}</Badge>
                          <Badge variant="outline">{book.type}</Badge>
                        </div>
                        {book.price && (
                          <p className="text-xl font-bold text-primary">₹{book.price}</p>
                        )}
                        <div className="flex gap-2">
                          <Button size="sm" className="flex-1">
                            <MessageCircle className="h-4 w-4 mr-2" />
                            Contact
                          </Button>
                          <Button size="sm" variant="ghost">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
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
