import { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Mail, MapPin, Star, BookOpen, Plus } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useNavigate } from "react-router-dom";

const typeColors: Record<string, string> = {
  Sell: "bg-green-200 text-green-800",
  Donate: "bg-blue-200 text-blue-800",
  Exchange: "bg-purple-200 text-purple-800",
  Rent: "bg-yellow-200 text-yellow-800",
  Other: "bg-gray-200 text-gray-800",
};

const capitalizeFirstLetter = (str: string) => str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();

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

      axios
        .get(`/api/books/user/${userObj.id}`)
        .then((res) => {
          if (Array.isArray(res.data)) setUserBooks(res.data);
          else if (Array.isArray(res.data?.books)) setUserBooks(res.data.books);
          else setUserBooks([]);
          setLoading(false);
        })
        .catch((err) => {
          console.error("Error fetching user books:", err);
          setUserBooks([]);
          setLoading(false);
        });
    } else setLoading(false);
  }, []);

  if (loading) return <div className="text-center mt-20">Loading...</div>;
  if (!user) return <div className="text-center mt-20">User not logged in.</div>;

  const handleChange = (field: string, value: string) => {
    setUser({ ...user, [field]: value });
  };

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

      <main className="flex-1 pt-20 pb-12 bg-gray-50">
        <div className="container max-w-6xl mx-auto px-4">
          <Card className="shadow-lg rounded-xl">
            {/* Header: avatar + info left, save button right */}
            <CardHeader className="flex flex-col md:flex-row items-center justify-between gap-6 p-6">
              <div className="flex items-center gap-6">
                <Avatar className="h-24 w-24">
                  <AvatarImage src={user.profileImagePath || ""} />
                  <AvatarFallback>
                    {user.name?.split(" ").map((n: string) => n[0]).join("")}
                  </AvatarFallback>
                </Avatar>

                <div className="space-y-2">
                  <CardTitle className="text-3xl font-semibold">{user.name}</CardTitle>
                  <CardDescription className="flex items-center gap-2 text-gray-600">
                    <Mail className="h-4 w-4 text-blue-600" />
                    {user.email}
                  </CardDescription>

                  <div className="flex items-center gap-4 mt-2">
                    <Badge variant="secondary">{user.department || "No department"}</Badge>
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                      <span className="text-sm font-medium">{user.acceptRate || 0}</span>
                    </div>
                  </div>
                </div>
              </div>

              <Button onClick={handleSave} disabled={saving} className="min-w-[150px] bg-amber-400 hover:bg-amber-500 text-white">
                {saving ? "Saving..." : "Save Changes"}
              </Button>
            </CardHeader>

            {/* Content: tabs */}
            <CardContent>
              <Tabs defaultValue="info" className="mt-2">
                <TabsList className="grid w-full grid-cols-1 md:grid-cols-3">
                  <TabsTrigger value="info">Profile Info</TabsTrigger>
                  <TabsTrigger value="books">My Books</TabsTrigger>
                  <TabsTrigger value="stats">Statistics</TabsTrigger>
                </TabsList>

                {/* Profile Info */}
                <TabsContent value="info" className="space-y-6 mt-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label>Full Name</Label>
                      <Input value={user.name || ""} onChange={(e) => handleChange("name", e.target.value)} />
                    </div>
                    <div className="space-y-2">
                      <Label>Email</Label>
                      <Input value={user.email || ""} disabled />
                    </div>
                    <div className="space-y-2">
                      <Label>Department</Label>
                      <Input value={user.department || ""} onChange={(e) => handleChange("department", e.target.value)} />
                    </div>
                    <div className="space-y-2">
                      <Label>Phone Number</Label>
                      <Input value={user.phone || ""} onChange={(e) => handleChange("phone", e.target.value)} />
                    </div>
                    <div className="space-y-2 md:col-span-2">
                      <Label>Campus Location</Label>
                      <div className="flex gap-2 items-center">
                        <MapPin className="h-5 w-5 text-green-600" />
                        <Input value={user.location || ""} onChange={(e) => handleChange("location", e.target.value)} />
                      </div>
                    </div>
                  </div>
                </TabsContent>

                {/* My Books */}
                <TabsContent value="books" className="mt-6 space-y-4">
                  <div className="flex justify-end mb-2">
                    <Button
                      className="bg-amber-400 text-white hover:bg-amber-500 flex items-center gap-2"
                      onClick={() => navigate("/upload")}
                    >
                      <Plus className="h-4 w-4 text-white" /> List a Book
                    </Button>
                  </div>

                  {userBooks.length > 0 ? (
                    <div className="grid sm:grid-cols-1 md:grid-cols-2 gap-4">
                      {userBooks.map((book) => {
                        const type = capitalizeFirstLetter(book.type);
                        const badgeColor = typeColors[type] || typeColors["Other"];
                        return (
                          <Card key={book.id} className="p-4 shadow-sm hover:shadow-md transition-all rounded-lg">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                <BookOpen className={`h-8 w-8 ${typeColors[type]?.split(" ")[1] || "text-gray-700"}`} />
                                <div className="space-y-1">
                                  <h4 className="font-semibold leading-tight">{book.title}</h4>
                                  <p className="text-sm text-gray-600">
                                    Type: <span className={`px-2 py-1 rounded ${badgeColor}`}>{type}</span>
                                    {book.price && ` • ₹${book.price}`}
                                  </p>
                                </div>
                              </div>
                              <Badge variant={book.status === "active" ? "default" : "secondary"} className="capitalize">
                                {book.status}
                              </Badge>
                            </div>
                          </Card>
                        );
                      })}
                    </div>
                  ) : (
                    <p className="text-gray-500">No books available.</p>
                  )}
                </TabsContent>

                {/* Statistics */}
                <TabsContent value="stats" className="mt-6">
                  <div className="grid md:grid-cols-3 gap-6">
                    <Card className="text-center p-6 shadow-sm rounded-lg">
                      <div className="text-3xl font-bold text-green-600">
                        {userBooks.filter((b) => b.type === "sell").length}
                      </div>
                      <p className="text-sm text-gray-600 mt-1">Books Sold</p>
                    </Card>

                    <Card className="text-center p-6 shadow-sm rounded-lg">
                      <div className="text-3xl font-bold text-purple-600">
                        {userBooks.filter((b) => b.type === "exchange").length}
                      </div>
                      <p className="text-sm text-gray-600 mt-1">Books Exchanged</p>
                    </Card>

                    <Card className="text-center p-6 shadow-sm rounded-lg">
                      <div className="text-3xl font-bold text-blue-600">
                        {userBooks.filter((b) => b.type === "donate").length}
                      </div>
                      <p className="text-sm text-gray-600 mt-1">Books Donated</p>
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
