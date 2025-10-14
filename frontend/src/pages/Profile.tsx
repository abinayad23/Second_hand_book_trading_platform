import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { BookOpen, Mail, MapPin, Star } from "lucide-react";

const Profile = () => {
  const userBooks = [
    { id: 1, title: "Data Structures", type: "sell", price: 450, status: "active" },
    { id: 2, title: "Digital Electronics", type: "exchange", status: "active" },
    { id: 3, title: "Linear Algebra", type: "donate", status: "completed" },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 pt-20 pb-12 bg-gradient-subtle">
        <div className="container max-w-6xl mx-auto px-4">
          <Card className="shadow-elegant">
            <CardHeader className="pb-4">
              <div className="flex flex-col md:flex-row gap-6 items-start md:items-center">
                <Avatar className="h-24 w-24">
                  <AvatarImage src="" />
                  <AvatarFallback className="bg-primary/10 text-primary text-2xl">JD</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <CardTitle className="text-3xl">John Doe</CardTitle>
                  <CardDescription className="flex items-center gap-2 mt-2">
                    <Mail className="h-4 w-4" />
                    john.doe@college.edu
                  </CardDescription>
                  <div className="flex items-center gap-4 mt-3">
                    <Badge variant="secondary">Computer Science</Badge>
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                      <span className="text-sm font-medium">4.5</span>
                    </div>
                  </div>
                </div>
                <Button>Edit Profile</Button>
              </div>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="info" className="mt-4">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="info">Profile Info</TabsTrigger>
                  <TabsTrigger value="books">My Books</TabsTrigger>
                  <TabsTrigger value="stats">Statistics</TabsTrigger>
                </TabsList>
                
                <TabsContent value="info" className="space-y-4 mt-6">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Full Name</Label>
                      <Input defaultValue="John Doe" />
                    </div>
                    <div className="space-y-2">
                      <Label>Email</Label>
                      <Input defaultValue="john.doe@college.edu" disabled />
                    </div>
                    <div className="space-y-2">
                      <Label>Department</Label>
                      <Input defaultValue="Computer Science" />
                    </div>
                    <div className="space-y-2">
                      <Label>Phone Number</Label>
                      <Input defaultValue="+1 234 567 8900" />
                    </div>
                    <div className="space-y-2 md:col-span-2">
                      <Label>Campus Location</Label>
                      <div className="flex gap-2">
                        <MapPin className="h-5 w-5 text-muted-foreground mt-2" />
                        <Input defaultValue="Building A, Room 205" />
                      </div>
                    </div>
                  </div>
                  <Button className="mt-4">Save Changes</Button>
                </TabsContent>

                <TabsContent value="books" className="mt-6">
                  <div className="space-y-3">
                    {userBooks.map((book) => (
                      <Card key={book.id}>
                        <CardContent className="flex items-center justify-between p-4">
                          <div className="flex items-center gap-3">
                            <BookOpen className="h-8 w-8 text-primary" />
                            <div>
                              <h4 className="font-semibold">{book.title}</h4>
                              <p className="text-sm text-muted-foreground">
                                Type: {book.type} {book.price && `• ₹${book.price}`}
                              </p>
                            </div>
                          </div>
                          <Badge variant={book.status === "active" ? "default" : "secondary"}>
                            {book.status}
                          </Badge>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </TabsContent>

                <TabsContent value="stats" className="mt-6">
                  <div className="grid md:grid-cols-3 gap-4">
                    <Card>
                      <CardContent className="p-6 text-center">
                        <div className="text-3xl font-bold text-primary">12</div>
                        <p className="text-sm text-muted-foreground mt-1">Books Sold</p>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="p-6 text-center">
                        <div className="text-3xl font-bold text-primary">5</div>
                        <p className="text-sm text-muted-foreground mt-1">Books Exchanged</p>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="p-6 text-center">
                        <div className="text-3xl font-bold text-primary">8</div>
                        <p className="text-sm text-muted-foreground mt-1">Books Donated</p>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Profile;
