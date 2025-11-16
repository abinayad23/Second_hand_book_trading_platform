import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { booksApi } from "@/api/books";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { BookOpen, Upload } from "lucide-react";
import { toast } from "sonner";

const UploadBook = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [edition, setEdition] = useState("");
  const [price, setPrice] = useState<number>(0);
  const [description, setDescription] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!user) {
    return (
      <div className="container mx-auto p-6 text-center">
        <p>Please login to list a book.</p>
      </div>
    );
  }

  const handleSubmit = async () => {
    if (!title || !author) {
      toast.error("Please fill all mandatory fields!");
      return;
    }
    if (price <= 0) {
      toast.error("Please enter a valid price");
      return;
    }

    try {
      setLoading(true);
      const bookData = {
        title,
        author,
        edition: edition || undefined,
        price,
        isAvailable: true,
        owner: user,
      };

      // For now, we'll create the book without image upload
      // Image upload can be added later if backend supports it
      await booksApi.addBook(bookData);
      toast.success("Book listed successfully!");
      navigate("/student/dashboard");
    } catch (err: any) {
      console.error(err);
      toast.error(err.response?.data || "Failed to upload book.");
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImageFile(e.target.files[0]);
    }
  };

  return (
    <div className="container mx-auto p-6 max-w-3xl">
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <div className="rounded-full bg-primary/10 p-4">
                <BookOpen className="h-10 w-10 text-primary" />
              </div>
            </div>
            <h1 className="text-4xl font-bold mb-2">List Your Book</h1>
        <p className="text-muted-foreground">
          Share your textbook with fellow students
        </p>
          </div>

      <Card>
            <CardHeader>
              <CardTitle>Book Information</CardTitle>
              <CardDescription>Enter complete details of your book</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
              <Label htmlFor="title">Book Title *</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Book title"
                required
              />
                </div>
                <div className="space-y-2">
              <Label htmlFor="author">Author *</Label>
              <Input
                id="author"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                placeholder="Author name"
                required
              />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
              <Label htmlFor="edition">Edition</Label>
                  <Input
                id="edition"
                value={edition}
                onChange={(e) => setEdition(e.target.value)}
                placeholder="e.g. 2nd Edition"
                  />
                </div>
                <div className="space-y-2">
              <Label htmlFor="price">Price ($) *</Label>
                  <Input
                id="price"
                    type="number"
                min="0"
                step="0.01"
                value={price}
                onChange={(e) => setPrice(Number(e.target.value))}
                placeholder="Enter price"
                required
                  />
                </div>
              </div>

              <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
                <Textarea
              id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Brief description of your book..."
              rows={4}
                />
              </div>

              <div className="space-y-2">
            <Label>Book Image (Optional)</Label>
                <div
                  className="border-2 border-dashed rounded-lg p-8 text-center hover:border-primary/50 transition-colors cursor-pointer"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">
                Click to upload or drag and drop
              </p>
              {imageFile && (
                <p className="text-green-600 mt-2">{imageFile.name} selected</p>
              )}
                  <input
                    type="file"
                    accept="image/*"
                    ref={fileInputRef}
                    className="hidden"
                    onChange={handleFileChange}
                  />
                </div>
            <p className="text-xs text-muted-foreground">
              Note: Image upload will be available once backend supports it
            </p>
              </div>

              <div className="flex gap-3 pt-4">
            <Button
              className="flex-1"
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
  );
};

export default UploadBook;
