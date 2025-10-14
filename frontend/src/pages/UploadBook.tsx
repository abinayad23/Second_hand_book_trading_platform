import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Slider } from "@/components/ui/slider";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Upload, BookOpen } from "lucide-react";
import { useState } from "react";

const UploadBook = () => {
  const [listingType, setListingType] = useState("sell");
  const [quality, setQuality] = useState([70]);

  const originalPrice = 500;
  const calculatedPrice = Math.round((originalPrice * quality[0]) / 100);

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
                <Label>Listing Type</Label>
                <RadioGroup value={listingType} onValueChange={setListingType} className="flex gap-4">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="sell" id="sell" />
                    <Label htmlFor="sell" className="cursor-pointer">Sell</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="exchange" id="exchange" />
                    <Label htmlFor="exchange" className="cursor-pointer">Exchange</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="donate" id="donate" />
                    <Label htmlFor="donate" className="cursor-pointer">Donate</Label>
                  </div>
                </RadioGroup>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Book Title *</Label>
                  <Input id="title" placeholder="e.g., Data Structures and Algorithms" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="author">Author *</Label>
                  <Input id="author" placeholder="e.g., Thomas H. Cormen" />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="isbn">ISBN</Label>
                  <Input id="isbn" placeholder="978-0-262-03384-8" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edition">Edition</Label>
                  <Input id="edition" placeholder="e.g., 3rd Edition" />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="subject">Subject *</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select subject" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="cs">Computer Science</SelectItem>
                      <SelectItem value="ee">Electrical Engineering</SelectItem>
                      <SelectItem value="me">Mechanical Engineering</SelectItem>
                      <SelectItem value="math">Mathematics</SelectItem>
                      <SelectItem value="physics">Physics</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="semester">Semester</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select semester" />
                    </SelectTrigger>
                    <SelectContent>
                      {[1, 2, 3, 4, 5, 6, 7, 8].map((sem) => (
                        <SelectItem key={sem} value={sem.toString()}>Semester {sem}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {listingType === "sell" && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="original-price">Original Price (₹) *</Label>
                    <Input id="original-price" type="number" placeholder="500" defaultValue={originalPrice} />
                  </div>
                  
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <Label>Book Quality ({quality[0]}%)</Label>
                      <span className="text-sm text-muted-foreground">Up to 90% of original price</span>
                    </div>
                    <Slider
                      value={quality}
                      onValueChange={setQuality}
                      max={90}
                      min={10}
                      step={5}
                      className="w-full"
                    />
                    <div className="bg-muted p-4 rounded-lg">
                      <p className="text-sm text-muted-foreground mb-1">Calculated Price</p>
                      <p className="text-3xl font-bold text-primary">₹{calculatedPrice}</p>
                    </div>
                  </div>
                </>
              )}

              {listingType === "exchange" && (
                <div className="space-y-2">
                  <Label htmlFor="wanted-book">Book You Want in Exchange *</Label>
                  <Input id="wanted-book" placeholder="e.g., Operating Systems" />
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Add details about the condition, markings, etc."
                  rows={4}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="location">Preferred Meetup Location</Label>
                <Input id="location" placeholder="e.g., Library, Building A" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="images">Upload Images</Label>
                <div className="border-2 border-dashed rounded-lg p-8 text-center hover:border-primary/50 transition-colors cursor-pointer">
                  <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">Click to upload or drag and drop</p>
                  <p className="text-xs text-muted-foreground mt-1">PNG, JPG up to 5MB</p>
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <Button className="flex-1" size="lg">List Book</Button>
                <Button variant="outline" size="lg">Cancel</Button>
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
