import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { BookOpen, Repeat, Heart, Search, TrendingUp, Shield } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-amber-500 py-20 md:py-32">
        <div className="container relative z-10">
          <div className="max-w-3xl mx-auto text-center text-white">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 animate-fade-in">
              Trade Books, Build Community
            </h1>
            <p className="text-lg md:text-xl mb-8 text-white/90 animate-fade-in">
              Your campus marketplace for buying, selling, exchanging, and donating textbooks. Save money, help peers, and reduce waste.
            </p>
            <div className="flex flex-wrap gap-4 justify-center animate-fade-in">
              <Button size="lg" variant="secondary" className="bg-green-600"asChild>
                <Link to="/books">Browse Books</Link>
              </Button>
              <Button size="lg" variant="outline" asChild className="border-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground/10">
                <Link to="/sell">List Your Books</Link>
              </Button>
            </div>
          </div>
        </div>
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS1vcGFjaXR5PSIwLjA1IiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-30" />
      </section>

      {/* Features Section */}
      <section className="py-16 md:py-24">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">How It Works</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Simple, secure, and designed for students
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="border-2 hover:shadow-medium transition-shadow">
              <CardContent className="pt-6">
                <div className="rounded-full bg-primary/10 w-12 h-12 flex items-center justify-center mb-4">
                  <BookOpen className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold text-xl mb-2">Sell Your Books</h3>
                <p className="text-muted-foreground">
                  List books with photos and details. Our smart pricing suggests fair prices based on condition (up to 90% of original value).
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 hover:shadow-medium transition-shadow">
              <CardContent className="pt-6">
                <div className="rounded-full bg-secondary/10 w-12 h-12 flex items-center justify-center mb-4">
                  <Repeat className="h-6 w-6 text-secondary" />
                </div>
                <h3 className="font-semibold text-xl mb-2">Exchange Books</h3>
                <p className="text-muted-foreground">
                  Trade books you don't need for ones you do. Get notified instantly when matching exchange requests arrive.
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 hover:shadow-medium transition-shadow">
              <CardContent className="pt-6">
                <div className="rounded-full bg-accent/10 w-12 h-12 flex items-center justify-center mb-4">
                  <Heart className="h-6 w-6 text-accent" />
                </div>
                <h3 className="font-semibold text-xl mb-2">Donate & Give Back</h3>
                <p className="text-muted-foreground">
                  Help fellow students by donating books. Build a supportive campus community while clearing your shelf.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-16 md:py-24 bg-muted/30">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Why BookSwap?</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="rounded-full bg-primary/10 w-16 h-16 flex items-center justify-center mb-4 mx-auto">
                <TrendingUp className="h-8 w-8 text-primary" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Save Money</h3>
              <p className="text-muted-foreground text-sm">
                Save up to 70% on textbooks compared to retail prices
              </p>
            </div>

            <div className="text-center">
              <div className="rounded-full bg-secondary/10 w-16 h-16 flex items-center justify-center mb-4 mx-auto">
                <Shield className="h-8 w-8 text-secondary" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Campus Verified</h3>
              <p className="text-muted-foreground text-sm">
                Trade safely with verified students from your college
              </p>
            </div>

            <div className="text-center">
              <div className="rounded-full bg-accent/10 w-16 h-16 flex items-center justify-center mb-4 mx-auto">
                <Search className="h-8 w-8 text-accent" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Easy to Find</h3>
              <p className="text-muted-foreground text-sm">
                Smart search and filters help you find exactly what you need
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24">
        <div className="container">
          <Card className="bg-amber-500 border-0 text-white">
            <CardContent className="py-12 text-center">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Get Started?</h2>
              <p className="text-lg mb-8 text-white/90 max-w-2xl mx-auto">
                Join thousands of students already saving money and helping each other succeed.
              </p>
              <Button size="lg" variant="secondary" className="bg-green-600" asChild>
                <Link to="/register">Create Free Account</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Index;
