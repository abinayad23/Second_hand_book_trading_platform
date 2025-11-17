import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios, { AxiosHeaders } from "axios";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

import { motion } from "framer-motion";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";

import { BookOpen, Upload } from "lucide-react";
import { getUserFromToken } from "@/utils/jwtHelper";

const typeStyles: Record<string, string> = {
  sale: "bg-green-100 text-green-700 border-green-300",
  exchange: "bg-purple-100 text-purple-700 border-purple-300",
  donate: "bg-blue-100 text-blue-700 border-blue-300",
};

const axiosInstance = axios.create();
axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    if (!config.headers) config.headers = new AxiosHeaders();
    (config.headers as AxiosHeaders).set("Authorization", `Bearer ${token}`);
  }
  return config;
});

const UploadBook = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [user, setUser] = useState<any>(null);
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [edition, setEdition] = useState("");
  const [quality, setQuality] = useState("Good");
  const [originalPrice, setOriginalPrice] = useState(0);
  const [generatedPrice, setGeneratedPrice] = useState(0);
  const [description, setDescription] = useState("");
  const [type, setType] = useState("sale");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const currentUser = getUserFromToken();
    if (!currentUser) {
      alert("Please login to list a book.");
      navigate("/login");
    } else {
      setUser(currentUser);
    }
  }, [navigate]);

  if (!user) return null;

  const calculateGeneratedPrice = (price: number, quality: string) => {
    switch (quality) {
      case "Excellent": return price * 0.8;
      case "Good": return price * 0.6;
      case "Average": return price * 0.4;
      default: return price * 0.3;
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
      await axiosInstance.post("http://localhost:8082/api/books/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      alert("Book listed successfully!");
      navigate("/books");
    } catch (err) {
      console.error(err);
      alert("Failed to upload book. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-background via-muted/10 to-background">
      <Navbar />

      <main className="flex-1 pt-24 pb-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="container max-w-3xl mx-auto px-4"
        >
          {/* HEADER */}
          <div className="text-center mb-10">
            <div className="flex justify-center mb-4">
              <div className="rounded-full bg-primary/10 p-4 shadow-sm">
                <BookOpen className="h-10 w-10 text-amber-600" />
              </div>
            </div>

            <h1 className="text-4xl font-bold text-gray-900">List Your Book</h1>
            <p className="text-gray-600 mt-1">Sell, exchange, or donate your book</p>
          </div>

          {/* CARD */}
          <Card className="backdrop-blur-xl bg-white/70 shadow-xl border border-gray-200 rounded-2xl hover:shadow-2xl transition">
            <CardHeader>
              <CardTitle className="text-xl font-semibold">Book Information</CardTitle>
              <CardDescription>Fill in your book’s details below</CardDescription>
            </CardHeader>

            <CardContent className="space-y-6">
              {/* TITLE + AUTHOR */}
              <div className="grid md:grid-cols-2 gap-5">
                <div className="space-y-2">
                  <Label>Book Title *</Label>
                  <Input
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Enter book title"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Author *</Label>
                  <Input
                    value={author}
                    onChange={(e) => setAuthor(e.target.value)}
                    placeholder="Author name"
                  />
                </div>
              </div>

              {/* EDITION + QUALITY (Enhanced Dropdown) */}
              <div className="grid md:grid-cols-2 gap-5">
                <div className="space-y-2">
                  <Label>Edition</Label>
                  <Input
                    value={edition}
                    onChange={(e) => setEdition(e.target.value)}
                    placeholder="e.g., 3rd Edition"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Book Quality</Label>
                  <Select
                    value={quality}
                    onValueChange={(v) => {
                      setQuality(v);
                      handleGeneratedPrice(originalPrice, v);
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select quality" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Excellent">Excellent</SelectItem>
                      <SelectItem value="Good">Good</SelectItem>
                      <SelectItem value="Average">Average</SelectItem>
                      <SelectItem value="Poor">Poor</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* PRICE */}
              <div className="grid md:grid-cols-2 gap-5">
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
                  />
                </div>

                <div className="space-y-2">
                  <Label>Generated Price</Label>
                  <Input value={generatedPrice} readOnly className="bg-gray-100" />
                </div>
              </div>

              {/* DESCRIPTION */}
              <div className="space-y-2">
                <Label>Description</Label>
                <Textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe your book"
                />
              </div>

              {/* TYPE (CUTE TAG STYLE BUTTONS) */}
              <div className="space-y-2">
                <Label>Listing Type *</Label>
                <RadioGroup value={type} onValueChange={setType} className="flex gap-4">
                  {["sale", "exchange", "donate"].map((t) => (
                    <label
                      key={t}
                      className={`cursor-pointer px-4 py-2 border rounded-full text-sm font-medium flex items-center gap-2 ${typeStyles[t]}`}
                    >
                      <RadioGroupItem value={t} />
                      {t.charAt(0).toUpperCase() + t.slice(1)}
                    </label>
                  ))}
                </RadioGroup>
              </div>

              {/* IMAGE UPLOAD */}
              <div className="space-y-2">
                <Label>Upload Image</Label>
                <div
                  className="border-2 border-dashed border-gray-300 rounded-xl text-center p-8 hover:border-amber-400 cursor-pointer transition"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Upload className="h-8 w-8 mx-auto text-amber-600 mb-2" />
                  <p className="text-sm text-gray-500">Click to upload</p>

                  {imageFile && (
                    <p className="text-green-600 mt-2 font-medium">
                      {imageFile.name} selected
                    </p>
                  )}

                  <input
                    type="file"
                    ref={fileInputRef}
                    className="hidden"
                    accept="image/*"
                    onChange={(e) => setImageFile(e.target.files?.[0] || null)}
                  />
                </div>
              </div>

              {/* BUTTONS */}
              <div className="flex gap-3 pt-4">
                <Button
                  className="flex-1 bg-amber-500 hover:bg-amber-600 text-white"
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
        </motion.div>
      </main>

      <Footer />
    </div>
  );
};

export default UploadBook;
