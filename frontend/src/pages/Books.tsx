import { useState } from "react";
import { Link } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Filter, Heart } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const mockBooks = [
  {
    id: 1,
    title: "Introduction to Algorithms",
    author: "Thomas H. Cormen",
    price: 2700,
    originalPrice: 3000,
    condition: "Good",
    type: "sell",
    image: "https://images.unsplash.com/photo-1532012197267-da84d127e765?w=400",
    seller: "John Doe",
    department: "Computer Science"
  },
  {
    id: 2,
    title: "Organic Chemistry",
    author: "Paula Yurkanis Bruice",
    price: 1800,
    originalPrice: 2500,
    condition: "Excellent",
    type: "sell",
    image: "https://images.unsplash.com/photo-1589998059171-988d887df646?w=400",
    seller: "Sarah Smith",
    department: "Chemistry"
  },
  {
    id: 3,
    title: "Calculus: Early Transcendentals",
    author: "James Stewart",
    price: 0,
    originalPrice: 2200,
    condition: "Fair",
    type: "donate",
    image: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=400",
    seller: "Mike Johnson",
    department: "Mathematics"
  },
  {
    id: 4,
    title: "Principles of Economics",
    author: "N. Gregory Mankiw",
    price: 1500,
    originalPrice: 2000,
    condition: "Good",
    type: "exchange",
    image: "https://images.unsplash.com/photo-1554224311-beee460c201f?w=400",
    seller: "Emma Wilson",
    department: "Economics"
  },
  {
    id: 5,
    title: "Campbell Biology",
    author: "Jane B. Reece",
    price: 3200,
    originalPrice: 3500,
    condition: "Excellent",
    type: "sell",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400",
    seller: "David Lee",
    department: "Biology"
  },
  {
    id: 6,
    title: "Python Programming",
    author: "Eric Matthes",
    price: 900,
    originalPrice: 1200,
    condition: "Good",
    type: "sell",
    image: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=400",
    seller: "Lisa Chen",
    department: "Computer Science"
  }
];

const Books = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState("all");

  const filteredBooks = mockBooks.filter(book => {
    const matchesSearch = book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         book.author.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = filterType === "all" || book.type === filterType;
    return matchesSearch && matchesType;
  });

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <div className="container py-8 flex-1">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">Browse Books</h1>
          <p className="text-muted-foreground">Find your next textbook or sell yours</p>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by title, author, or ISBN..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={filterType} onValueChange={setFilterType}>
            <SelectTrigger className="w-full md:w-48">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Filter by type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="sell">For Sale</SelectItem>
              <SelectItem value="exchange">Exchange</SelectItem>
              <SelectItem value="donate">Donate</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Books Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredBooks.map((book) => (
            <Card key={book.id} className="group hover:shadow-medium transition-all overflow-hidden">
              <div className="relative aspect-[3/4] overflow-hidden bg-muted ">
                <img
                  src={book.image}
                  alt={book.title}
                  className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
                />
                <Button
                  size="icon"
                  variant="secondary"
                  className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Heart className="h-4 w-4" />
                </Button>
                <Badge className="absolute top-2 left-2" variant={book.type === "donate" ? "secondary" : "default"}>
                  {book.type === "sell" && "For Sale"}
                  {book.type === "exchange" && "Exchange"}
                  {book.type === "donate" && "Free"}
                </Badge>
              </div>
              <CardContent className="pt-4">
                <h3 className="font-semibold text-lg line-clamp-1 mb-1">{book.title}</h3>
                <p className="text-sm text-muted-foreground mb-2">{book.author}</p>
                <div className="flex items-baseline gap-2 mb-2">
                  {book.type === "donate" ? (
                    <span className="text-lg font-bold text-green-600">FREE</span>
                  ) : (
                    <>
                      <span className="text-xl font-bold text-amber-500">₹{book.price}</span>
                      <span className="text-sm text-muted-foreground line-through">₹{book.originalPrice}</span>
                    </>
                  )}
                </div>
                <Badge variant="outline" className="mb-2">{book.condition}</Badge>
                <p className="text-xs text-muted-foreground">by {book.seller}</p>
              </CardContent>
              <CardFooter>
                <Button asChild className="w-full bg-amber-500">
                  <Link to={`/book/${book.id}`}>View Details</Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>

        {filteredBooks.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No books found matching your criteria.</p>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default Books;
