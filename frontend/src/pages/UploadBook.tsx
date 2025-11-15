import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { BookOpen, Upload } from "lucide-react";

const typeStyles: Record<string, string> = {
  sale: "bg-green-100 text-green-700 border-green-300",
  exchange: "bg-purple-100 text-purple-700 border-purple-300",
  donate: "bg-blue-100 text-blue-700 border-blue-300",
};

const UploadBook = () => {
  const navigate = useNavigate();
  const storedUser = localStorage.getItem("user");
  const user = storedUser ? JSON.parse(storedUser) : null;

  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [edition, setEdition] = useState("");
  const [quality, setQuality] = useState("Good");
  const [originalPrice, setOriginalPrice] = useState<number>(0);
  const [generatedPrice, setGeneratedPrice] = useState<number>(0);
  const [description, setDescription] = useState("");
  const [type, setType] = useState("sale");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!user) return <div className="text-center mt-20">Please login to list a book.</div>;

  const calculateGeneratedPrice = (price: number, quality: string) => {
    switch (quality) {
      case "Excellent":
        return price * 0.8;
      case "Good":
        return price * 0.6;
      case "Average":
        return price * 0.4;
      default:
        return price * 0.3;
    }
  };

  const handleGeneratedPrice = (price: number, q: string) => {
    setGeneratedPrice(Math.round(calculateGeneratedPrice(price, q)));
  };

  const handleSubmit = async () => {
    if (!title || !author || !type) {
      alert("Please fill all mandatory fields!");
      return;
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("author", author);
    formData.append("edition", edition);
    formData.append("quality", quality);
    formData.append("originalPrice", originalPrice.toString());
    formData.append("generatedPrice", generatedPrice.toString());
    formData.append("description", description);
    formData.append("type", type);
    formData.append("userId", user.id.toString());
    if (imageFile) formData.append("image", imageFile);

    try {
      setLoading(true);
      await axios.post("http://localhost:8082/api/books/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      alert("Book listed successfully!");
      navigate("/books");
    } catch (err) {
      console.error(err);
      alert("Failed to upload book.");
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) setImageFile(e.target.files[0]);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 pt-20 pb-12 bg-gray-50">
        <div className="container max-w-3xl mx-auto px-4">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <div className="rounded-full bg-amber-100 p-4">
                <BookOpen className="h-10 w-10 text-amber-600" />
              </div>
            </div>
            <h1 className="text-4xl font-bold mb-2 text-gray-800">List Your Book</h1>
            <p className="text-gray-600">Sell, exchange, or donate your book</p>
          </div>

          {/* Form Card */}
          <Card className="shadow-lg border border-gray-200 rounded-xl transition-shadow hover:shadow-xl">
            <CardHeader>
              <CardTitle>Book Information</CardTitle>
              <CardDescription>Enter complete details of your book</CardDescription>
            </CardHeader>

            <CardContent className="space-y-6">
              {/* Title & Author */}
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Book Title *</Label>
                  <Input
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Book title"
                    className="border-gray-300 focus:border-amber-400 focus:ring-amber-200"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Author *</Label>
                  <Input
                    value={author}
                    onChange={(e) => setAuthor(e.target.value)}
                    placeholder="Author name"
                    className="border-gray-300 focus:border-amber-400 focus:ring-amber-200"
                  />
                </div>
              </div>

              {/* Edition & Quality */}
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Edition</Label>
                  <Input
                    value={edition}
                    onChange={(e) => setEdition(e.target.value)}
                    placeholder="e.g. 2nd Edition"
                    className="border-gray-300 focus:border-amber-400 focus:ring-amber-200"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Quality</Label>
                  <select
                    className="border-gray-300 rounded-lg p-2 w-full focus:ring-amber-200 focus:border-amber-400 bg-white text-gray-800 transition-colors"
                    value={quality}
                    onChange={(e) => {
                      setQuality(e.target.value);
                      handleGeneratedPrice(originalPrice, e.target.value);
                    }}
                  >
                    <option value="Excellent">Excellent</option>
                    <option value="Good">Good</option>
                    <option value="Average">Average</option>
                    <option value="Poor">Poor</option>
                  </select>
                </div>
              </div>

              {/* Prices */}
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Original Price</Label>
                  <Input
                    type="number"
                    value={originalPrice}
                    onChange={(e) => {
                      const val = Number(e.target.value);
                      setOriginalPrice(val);
                      handleGeneratedPrice(val, quality);
                    }}
                    placeholder="₹ Original price"
                    className="border-gray-300 focus:border-amber-400 focus:ring-amber-200"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Generated Price (Auto)</Label>
                  <Input
                    type="number"
                    value={generatedPrice}
                    readOnly
                    placeholder="Auto calculated"
                    className="bg-gray-100 border-gray-200"
                  />
                </div>
              </div>

              {/* Description */}
              <div className="space-y-2">
                <Label>Description</Label>
                <Textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Brief description of your book..."
                  className="border-gray-300 focus:border-amber-400 focus:ring-amber-200"
                />
              </div>

              {/* Type */}
              <div className="space-y-2">
                <Label>Type *</Label>
                <RadioGroup value={type} onValueChange={setType} className="flex gap-6">
                  {["sale", "exchange", "donate"].map((t) => (
                    <div
                      key={t}
                      className={`flex items-center space-x-2 px-3 py-1 border rounded-full text-sm font-medium ${typeStyles[t]}`}
                    >
                      <RadioGroupItem value={t} id={t} />
                      <Label htmlFor={t} className="cursor-pointer">
                        {t.charAt(0).toUpperCase() + t.slice(1)}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>

              {/* Image Upload */}
              <div className="space-y-2">
                <Label>Book Image</Label>
                <div
                  className="border-2 border-gray-300 border-dashed rounded-lg p-8 text-center hover:border-amber-400 transition-colors cursor-pointer"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Upload className="h-8 w-8 mx-auto mb-2 text-amber-600" />
                  <p className="text-sm text-gray-500">Click to upload or drag and drop</p>
                  {imageFile && <p className="text-green-600 mt-2">{imageFile.name} selected</p>}
                  <input type="file" accept="image/*" ref={fileInputRef} className="hidden" onChange={handleFileChange} />
                </div>
              </div>

              {/* Submit */}
              <div className="flex gap-3 pt-4">
                <Button
                  className="flex-1 bg-amber-400 hover:bg-amber-500 text-white transition-colors"
                  onClick={handleSubmit}
                  disabled={loading}
                >
                  {loading ? "Uploading..." : "Upload Book"}
                </Button>
                <Button variant="outline" onClick={() => navigate("/books")}>
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
