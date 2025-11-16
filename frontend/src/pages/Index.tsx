import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, Search, MessageSquare, Star } from "lucide-react";
import { useAuthStore } from "@/store/authStore";

const Index = () => {
  const { isAuthenticated } = useAuthStore();
  const authenticated = isAuthenticated();

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <div className="max-w-3xl mx-auto space-y-6">
          <div className="flex justify-center mb-4">
            <BookOpen className="h-20 w-20 text-primary" />
          </div>
          <h1 className="text-5xl font-bold tracking-tight">
            CampusLink
            </h1>
          <p className="text-xl text-muted-foreground">
            Buy and sell textbooks with fellow students. Save money, help others.
            </p>
          <div className="flex gap-4 justify-center">
            <Button asChild size="lg">
                <Link to="/books">Browse Books</Link>
              </Button>
            {!authenticated && (
              <Button asChild size="lg" variant="outline">
                <Link to="/register">Get Started</Link>
              </Button>
            )}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-center mb-12">Why CampusLink?</h2>
        <div className="grid md:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <Search className="h-10 w-10 text-primary mb-2" />
              <CardTitle>Easy Search</CardTitle>
              <CardDescription>
                Find the textbooks you need quickly with our powerful search
              </CardDescription>
            </CardHeader>
            </Card>
          <Card>
            <CardHeader>
              <MessageSquare className="h-10 w-10 text-primary mb-2" />
              <CardTitle>Direct Messaging</CardTitle>
              <CardDescription>
                Chat directly with sellers to negotiate and ask questions
              </CardDescription>
            </CardHeader>
            </Card>
          <Card>
            <CardHeader>
              <Star className="h-10 w-10 text-primary mb-2" />
              <CardTitle>Trusted Reviews</CardTitle>
              <CardDescription>
                Read reviews from other students before making a purchase
              </CardDescription>
            </CardHeader>
            </Card>
        </div>
      </section>

      {/* CTA Section */}
      {!authenticated && (
        <section className="container mx-auto px-4 py-16 text-center">
          <Card className="max-w-2xl mx-auto">
            <CardHeader>
              <CardTitle className="text-2xl">Ready to get started?</CardTitle>
              <CardDescription>
                Join hundreds of students buying and selling textbooks
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex gap-4 justify-center">
                <Button asChild size="lg">
                  <Link to="/register">Sign Up Free</Link>
                </Button>
                <Button asChild size="lg" variant="outline">
                  <Link to="/login">Login</Link>
              </Button>
              </div>
            </CardContent>
          </Card>
      </section>
      )}
    </div>
  );
};

export default Index;
