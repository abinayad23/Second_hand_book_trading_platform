import { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Mail, MapPin, Star, BookOpen } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useNavigate } from "react-router-dom";
import { Plus } from "lucide-react";

const Profile = () => {
  const [user, setUser] = useState<any>(null);
  const [userBooks, setUserBooks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const userObj = JSON.parse(storedUser);
      setUser(userObj);

      // Fetch user's books dynamically
      axios
        .get(`/api/books/user/${userObj.id}`)
        .then((res) => {
          if (Array.isArray(res.data)) {
            setUserBooks(res.data);
          } else if (Array.isArray(res.data.books)) {
            setUserBooks(res.data.books);
          } else {
            setUserBooks([]);
          }
          setLoading(false);
        })
        .catch((err) => {
          console.error("Error fetching user books:", err);
          setUserBooks([]);
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, []);

  if (loading) return <div className="text-center mt-20">Loading...</div>;
  if (!user) return <div className="text-center mt-20">User not logged in.</div>;

  // Update user state while editing
  const handleChange = (field: string, value: string) => {
    setUser({ ...user, [field]: value });
  };

  // Save updated profile to backend
  const handleSave = () => {
    setSaving(true);
    axios
      .put(`/api/users/${user.id}`, user)
      .then((res) => {
        setUser(res.data);
        localStorage.setItem("user", JSON.stringify(res.data));
        setSaving(false);
        alert("Profile updated successfully!");
      })
      .catch((err) => {
        console.error("Error updating profile:", err);
        setSaving(false);
        alert("Failed to update profile.");
      });
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 pt-20 pb-12 bg-gradient-subtle">
        <div className="container max-w-6xl mx-auto px-4">
          <Card className="shadow-elegant">
            <CardHeader className="pb-4 flex flex-col md:flex-row gap-6 items-start md:items-center">
              <Avatar className="h-24 w-24">
                <AvatarImage src={user.profileImagePath || ""} />
                <AvatarFallback>
                  {user.name?.split(" ").map((n: string) => n[0]).join("")}
                </AvatarFallback>
              </Avatar>

              <div className="flex-1">
                <CardTitle className="text-3xl">{user.name}</CardTitle>
                <CardDescription className="flex items-center gap-2 mt-2">
                  <Mail className="h-4 w-4" />
                  {user.email}
                </CardDescription>

                <div className="flex items-center gap-4 mt-3">
                  <Badge variant="secondary">{user.department || "No department"}</Badge>
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                    <span className="text-sm font-medium">{user.acceptRate || 0}</span>
                  </div>
                </div>
              </div>

              <Button onClick={handleSave} disabled={saving}>
                {saving ? "Saving..." : "Save Changes"}
              </Button>
            </CardHeader>

            <CardContent>
              <Tabs defaultValue="info" className="mt-4">
                <TabsList className="grid w-full grid-cols-1 md:grid-cols-3">
                  <TabsTrigger value="info">Profile Info</TabsTrigger>
                  <TabsTrigger value="books">My Books</TabsTrigger>
                  <TabsTrigger value="stats">Statistics</TabsTrigger>
                </TabsList>

                <Button
  className="mb-4 bg-amber-400 text-white hover:bg-amber-500 flex items-center gap-2"
  onClick={() => navigate("/upload")}
>
  <Plus className="h-4 w-4" /> List a Book
</Button>

                {/* ---------- Profile Info Tab ---------- */}
                <TabsContent value="info" className="space-y-4 mt-6">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Full Name</Label>
                      <Input
                        value={user.name}
                        onChange={(e) => handleChange("name", e.target.value)}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Email</Label>
                      <Input value={user.email} disabled />
                    </div>

                    <div className="space-y-2">
                      <Label>Department</Label>
                      <Input
                        value={user.department || ""}
                        onChange={(e) => handleChange("department", e.target.value)}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Phone Number</Label>
                      <Input
                        value={user.phone || ""}
                        onChange={(e) => handleChange("phone", e.target.value)}
                      />
                    </div>

                    <div className="space-y-2 md:col-span-2">
                      <Label>Campus Location</Label>
                      <div className="flex gap-2">
                        <MapPin className="h-5 w-5 text-muted-foreground mt-2" />
                        <Input
                          value={user.location || ""}
                          onChange={(e) => handleChange("location", e.target.value)}
                        />
                      </div>
                    </div>
                  </div>
                </TabsContent>

                {/* ---------- Books Tab ---------- */}
                <TabsContent value="books" className="mt-6">
                  <div className="space-y-3">
                    {Array.isArray(userBooks) && userBooks.length > 0 ? (
                      userBooks.map((book) => (
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
                      ))
                    ) : (
                      <p>No books available.</p>
                    )}
                  </div>
                </TabsContent>

                {/* ---------- Statistics Tab ---------- */}
                <TabsContent value="stats" className="mt-6">
                  <div className="grid md:grid-cols-3 gap-4">
                    <Card>
                      <CardContent className="p-6 text-center">
                        <div className="text-3xl font-bold text-primary">
                          {Array.isArray(userBooks)
                            ? userBooks.filter((b) => b.type === "sell").length
                            : 0}
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">Books Sold</p>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardContent className="p-6 text-center">
                        <div className="text-3xl font-bold text-primary">
                          {Array.isArray(userBooks)
                            ? userBooks.filter((b) => b.type === "exchange").length
                            : 0}
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">Books Exchanged</p>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardContent className="p-6 text-center">
                        <div className="text-3xl font-bold text-primary">
                          {Array.isArray(userBooks)
                            ? userBooks.filter((b) => b.type === "donate").length
                            : 0}
                        </div>
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
