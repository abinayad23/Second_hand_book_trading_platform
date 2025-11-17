// src/pages/Profile.tsx
import { useEffect, useState } from "react";
import axios, { AxiosHeaders } from "axios";
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
import { getUserFromToken } from "@/utils/jwtHelper";

// ----------------------
// Types
// ----------------------
interface UserType {
  id: number;
  name: string;
  username: string;
  email: string;
  role?: string;
  department?: string;
  phone?: string;
  location?: string;
  profile_image_path?: string;
  acceptRate?: number;
}

interface BookType {
  id: number;
  title: string;
  type: string;
  price?: number;
  status: string;
  bookImage?: string; // Book image
}

// ----------------------
// Badge colors for book types
// ----------------------
const typeColors: Record<string, string> = {
  Sell: "bg-green-200 text-green-800",
  Donate: "bg-blue-200 text-blue-800",
  Exchange: "bg-purple-200 text-purple-800",
  Rent: "bg-yellow-200 text-yellow-800",
  Other: "bg-gray-200 text-gray-800",
};

const capitalizeFirstLetter = (str: string) =>
  str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();

const generateColorFromName = (name: string) => {
  const colors = ["bg-red-400", "bg-blue-400", "bg-green-400", "bg-yellow-400", "bg-purple-400"];
  const index = name.charCodeAt(0) % colors.length;
  return colors[index];
};

// ----------------------
// Axios instance with JWT
// ----------------------
const axiosInstance = axios.create();
axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    if (!config.headers) config.headers = new AxiosHeaders();
    (config.headers as AxiosHeaders).set("Authorization", `Bearer ${token}`);
  }
  return config;
});

// ----------------------
// Profile Component
// ----------------------
const Profile = () => {
  const [user, setUser] = useState<UserType | null>(null);
  const [userBooks, setUserBooks] = useState<BookType[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const currentUser = getUserFromToken();
    const userId = currentUser?.id;
    if (!userId) {
      setLoading(false);
      return;
    }

    // Fetch user details
    axiosInstance.get<UserType>(`http://localhost:8082/api/users/${userId}`)
      .then((res) => setUser(res.data))
      .catch((err) => console.error(err));

    // Fetch user's books
    axiosInstance.get<BookType[]>(`http://localhost:8082/api/books/user/${userId}`)
      .then((res) => setUserBooks(res.data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="text-center mt-20">Loading...</div>;
  if (!user) return <div className="text-center mt-20">User not logged in.</div>;

  const handleChange = (field: keyof UserType, value: string) => {
    setUser({ ...user, [field]: value });
  };

  const handleSave = async () => {
    if (!user?.id) return;
    setSaving(true);
    try {
      const updatedUser = {
        name: user.name,
        username: user.username,
        department: user.department,
        phone: user.phone,
        location: user.location,
        profileImagePath: user.profile_image_path
      };
      const res = await axiosInstance.put<UserType>(
        `http://localhost:8082/api/users/${user.id}/edit`,
        updatedUser
      );
      setUser(res.data);
      alert("Profile updated successfully!");
    } catch (err) {
      console.error("Error updating profile:", err);
      alert("Failed to update profile.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 pt-20 pb-12 bg-gray-50">
        <div className="container max-w-6xl mx-auto px-4">
          <Card className="shadow-lg rounded-xl">
            {/* Header */}
            <CardHeader className="flex flex-col md:flex-row items-center justify-between gap-6 p-6">
              <div className="flex items-center gap-6">
                <Avatar className="h-24 w-24">
                  {user.profile_image_path ? (
                    <AvatarImage src={`http://localhost:8082${user.profile_image_path}`} />
                  ) : (
                    <AvatarFallback className={`text-white ${generateColorFromName(user.name)}`}>
                      {user.name?.split(" ").map((n) => n[0]).join("")}
                    </AvatarFallback>
                  )}
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

              <Button
                onClick={handleSave}
                disabled={saving}
                className="min-w-[150px] bg-amber-400 hover:bg-amber-500 text-white"
              >
                {saving ? "Saving..." : "Save Changes"}
              </Button>
            </CardHeader>

            {/* Tabs */}
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
                        const badgeColor = typeColors[type] || typeColors.Other;

                        return (
                          <Card key={book.id} className="p-4 shadow-sm hover:shadow-md transition-all rounded-lg flex gap-4">
                            {/* Book Image */}
                            {book.bookImage ? (
                              <img
                                src={`http://localhost:8082${book.bookImage}`}
                                alt={book.title}
                                className="h-24 w-24 object-cover rounded"
                              />
                            ) : (
                              <div className="h-24 w-24 bg-gray-100 rounded flex items-center justify-center">
                                <BookOpen className="h-5 w-5 text-gray-600" />
                              </div>
                            )}

                            {/* Book Details */}
                            <div className="flex-1">
                              <h4 className="font-semibold text-lg">{book.title}</h4>
                              <p className="text-sm text-gray-600">
                                Type: <span className={`px-2 py-1 rounded ${badgeColor}`}>{type}</span>
                              </p>
                              {book.price && <p className="text-sm text-gray-600">Price: ₹{book.price}</p>}
                              <Badge className="capitalize mt-1" variant={book.status === "active" ? "default" : "secondary"}>
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
                        {userBooks.filter((b) => b.type.toLowerCase() === "sale").length}
                      </div>
                      <p className="text-sm text-gray-600 mt-1">Books Sold</p>
                    </Card>

                    <Card className="text-center p-6 shadow-sm rounded-lg">
                      <div className="text-3xl font-bold text-purple-600">
                        {userBooks.filter((b) => b.type.toLowerCase() === "exchange").length}
                      </div>
                      <p className="text-sm text-gray-600 mt-1">Books Exchanged</p>
                    </Card>

                    <Card className="text-center p-6 shadow-sm rounded-lg">
                      <div className="text-3xl font-bold text-blue-600">
                        {userBooks.filter((b) => b.type.toLowerCase() === "donate").length}
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
