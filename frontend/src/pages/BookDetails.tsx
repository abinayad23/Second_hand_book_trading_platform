import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Heart, MapPin, MessageCircle, Star, BookOpen, Calendar, User } from "lucide-react";

const BookDetails = () => {
  const reviews = [
    { id: 1, user: "Alice Smith", rating: 5, comment: "Great condition! Quick response from seller.", date: "2 days ago" },
    { id: 2, user: "Bob Johnson", rating: 4, comment: "Good book, minor wear on cover.", date: "1 week ago" },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 pt-20 pb-12 bg-gradient-subtle">
        <div className="container max-w-6xl mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <Card className="shadow-elegant overflow-hidden">
                <div className="aspect-[3/4] bg-muted flex items-center justify-center">
                  <BookOpen className="h-24 w-24 text-muted-foreground" />
                </div>
              </Card>
            </div>

            <div className="space-y-6">
              <div>
                <div className="flex items-start justify-between mb-2">
                  <h1 className="text-4xl font-bold">Data Structures and Algorithms</h1>
                  <Button size="icon" variant="ghost">
                    <Heart className="h-5 w-5" />
                  </Button>
                </div>
                <p className="text-xl text-muted-foreground">by Thomas H. Cormen</p>
                <div className="flex items-center gap-2 mt-3">
                  <Badge>Computer Science</Badge>
                  <Badge variant="secondary">Semester 3</Badge>
                  <Badge variant="outline" className="bg-amber-400">For Sale</Badge>
                </div>
              </div>

              <Separator />

              <div>
                <div className="text-3xl font-bold text-primary mb-2">₹450</div>
                <p className="text-sm text-muted-foreground">Original Price: ₹500 • 90% of original</p>
              </div>

              <Card className="bg-muted/50">
                <CardContent className="p-4 space-y-3">
                  <div className="flex items-center gap-2">
                    <BookOpen className="h-5 w-5 text-muted-foreground" />
                    <span className="text-sm"><strong>Edition:</strong> 3rd Edition</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-muted-foreground" />
                    <span className="text-sm"><strong>ISBN:</strong> 978-0-262-03384-8</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-5 w-5 text-muted-foreground" />
                    <span className="text-sm"><strong>Meetup:</strong> Library, Main Campus</span>
                  </div>
                </CardContent>
              </Card>

              <div>
                <h3 className="font-semibold mb-2">Description</h3>
                <p className="text-muted-foreground">
                  This book is in excellent condition with minimal wear. All pages are intact with no markings or highlights. 
                  Perfect for students starting their data structures course.
                </p>
              </div>

              <div className="flex gap-3">
                <Button className="flex-1" size="lg">
                  <MessageCircle className="mr-2 h-5 w-5" />
                  Contact Seller
                </Button>
                <Button variant="outline" size="lg">Report</Button>
              </div>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarImage src="" />
                      <AvatarFallback className="bg-primary/10 text-primary">JD</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h4 className="font-semibold">John Doe</h4>
                        <div className="flex items-center gap-1">
                          <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                          <span className="text-sm">4.5</span>
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground">Computer Science • 25 books listed</p>
                    </div>
                    <Button variant="outline" size="sm">View Profile</Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          <div className="mt-12">
            <h2 className="text-2xl font-bold mb-6">Reviews & Ratings</h2>
            <div className="grid md:grid-cols-2 gap-4">
              {reviews.map((review) => (
                <Card key={review.id}>
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback className="bg-primary/10 text-primary text-xs">
                            {review.user.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-semibold text-sm">{review.user}</p>
                          <p className="text-xs text-muted-foreground">{review.date}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        {[...Array(review.rating)].map((_, i) => (
                          <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />
                        ))}
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground">{review.comment}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default BookDetails;
