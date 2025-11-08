import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { BookOpen, Upload } from "lucide-react";

const UploadBook = () => {
  const navigate = useNavigate();
  const storedUser = localStorage.getItem("user");
  const user = storedUser ? JSON.parse(storedUser) : null;

  const [listingType, setListingType] = useState("sell"); // optional: maps to isAvailable
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [edition, setEdition] = useState("");
  const [price, setPrice] = useState(0);
  const [loading, setLoading] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!user) return <div className="text-center mt-20">Please login to list a book.</div>;

  const calculatedPrice = Math.round((500 * 70) / 100); // example calculation

  const handleSubmit = async () => {
    if (!title || !author) return alert("Title and Author are required");

    const formData = new FormData();
    formData.append("title", title);
    formData.append("author", author);
    formData.append("edition", edition);
    formData.append("price", listingType === "sell" ? calculatedPrice.toString() : "0");
    formData.append("userId", user.id.toString());
    if (imageFile) {
      formData.append("image", imageFile);
    }

    try {
      setLoading(true);
      await axios.post("http://localhost:8082/api/books/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      alert("Book listed successfully!");
      navigate("/profile");
    } catch (err) {
      console.error(err);
      alert("Failed to list book.");
    } finally {
      setLoading(false);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      setImageFile(e.dataTransfer.files[0]);
      e.dataTransfer.clearData();
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 pt-20 pb-12 bg-gradient-subtle">
        <div className="container max-w-3xl mx-auto px-4">
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <div className="rounded-full bg-primary/10 p-4">
                <BookOpen className="h-10 w-10 text-primary" />
              </div>
            </div>
            <h1 className="text-4xl font-bold mb-2">List Your Book</h1>
            <p className="text-muted-foreground">Share your books with fellow students</p>
          </div>

          <Card className="shadow-elegant">
            <CardHeader>
              <CardTitle>Book Details</CardTitle>
              <CardDescription>Fill in the information about your book</CardDescription>
            </CardHeader>

            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label>Book Availability</Label>
                <RadioGroup value={listingType} onValueChange={setListingType} className="flex gap-4">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="sell" id="available" />
                    <Label htmlFor="available" className="cursor-pointer">Available</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="donate" id="unavailable" />
                    <Label htmlFor="unavailable" className="cursor-pointer">Not Available</Label>
                  </div>
                </RadioGroup>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Book Title *</Label>
                  <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Book Title" />
                </div>
                <div className="space-y-2">
                  <Label>Author *</Label>
                  <Input value={author} onChange={(e) => setAuthor(e.target.value)} placeholder="Author Name" />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Edition</Label>
                  <Input value={edition} onChange={(e) => setEdition(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>Price</Label>
                  <Input
                    type="number"
                    value={listingType === "sell" ? calculatedPrice : 0}
                    onChange={(e) => setPrice(Number(e.target.value))}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Upload Image</Label>
                <div
                  className="border-2 border-dashed rounded-lg p-8 text-center hover:border-primary/50 transition-colors cursor-pointer"
                  onClick={() => fileInputRef.current?.click()}
                  onDragOver={handleDragOver}
                  onDrop={handleDrop}
                >
                  <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">Click to upload or drag and drop</p>
                  <p className="text-xs text-muted-foreground mt-1">PNG, JPG up to 5MB</p>
                  {imageFile && <p className="text-green-600 mt-2">{imageFile.name} selected</p>}
                  <input
                    type="file"
                    accept="image/*"
                    ref={fileInputRef}
                    className="hidden"
                    onChange={(e) => setImageFile(e.target.files ? e.target.files[0] : null)}
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <Button className="flex-1" onClick={handleSubmit} disabled={loading}>
                  {loading ? "Listing..." : "List Book"}
                </Button>
                <Button variant="outline" size="lg" onClick={() => navigate("/profile")}>
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default UploadBook;
