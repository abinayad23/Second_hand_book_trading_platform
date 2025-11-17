// src/pages/Index.tsx
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { BookOpen, Repeat, Heart, Search, TrendingUp, Shield } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { getUserFromToken } from "@/utils/jwtHelper";
import axios, { AxiosHeaders } from "axios";

const axiosInstance = axios.create();
axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    if (!config.headers) config.headers = new AxiosHeaders();
    (config.headers as AxiosHeaders).set("Authorization", `Bearer ${token}`);
  }
  return config;
});

interface UserType {
  id: number;
  name: string;
  username: string;
  email: string;
  role?: string;
}

const Index = () => {
  const [user, setUser] = useState<UserType | null>(null);

  useEffect(() => {
    const currentUser = getUserFromToken();
    if (currentUser?.id) {
      // Fetch full user details from backend
      axiosInstance
        .get<UserType>(`http://localhost:8082/api/users/${currentUser.id}`)
        .then((res) => setUser(res.data))
        .catch((err) => console.error("Failed to fetch user:", err));
    }
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 py-20 md:py-32">
        <div className="container relative z-10 text-center text-white">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 animate-fade-in drop-shadow-lg">
            {user ? `Welcome back, ${user.name || user.username}!` : "Trade Books, Build Community"}
          </h1>
          <p className="text-lg md:text-xl mb-8 text-white/90 animate-fade-in">
            Your campus marketplace for buying, selling, exchanging, and donating textbooks.
          </p>
          <div className="flex flex-wrap gap-4 justify-center animate-fade-in">
            <Button
              size="lg"
              variant="secondary"
              className="bg-green-600 hover:bg-green-700 transition-all duration-300 shadow-lg"
              asChild
            >
              <Link to="/books">Browse Books</Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              asChild
              className="border-white/30 text-white hover:bg-white/10 transition-all duration-300"
            >
              <Link to={user ? "/profile" : "/register"}>List Your Books</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 md:py-24">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-amber-600">How It Works</h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">Simple, secure, and designed for students</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: BookOpen, title: "Sell Your Books", gradient: "from-green-400 to-green-600", text: "List books with photos and details." },
              { icon: Repeat, title: "Exchange Books", gradient: "from-blue-400 to-blue-600", text: "Trade books you don't need for ones you do." },
              { icon: Heart, title: "Donate & Give Back", gradient: "from-pink-400 to-pink-600", text: "Help fellow students by donating books." }
            ].map(({ icon: Icon, title, gradient, text }) => (
              <Card key={title} className="border-0 rounded-3xl bg-white/80 backdrop-blur-md shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 text-center">
                <CardContent className="pt-6 flex flex-col items-center">
                  <div className={`rounded-full bg-gradient-to-br ${gradient} w-16 h-16 flex items-center justify-center mb-4 shadow-xl transform transition-transform duration-500 hover:scale-110 hover:rotate-6`}>
                    <Icon className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="font-semibold text-xl mb-2">{title}</h3>
                  <p className="text-gray-700">{text}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-20 md:py-32 relative">
        <div className="absolute top-0 left-1/4 w-64 h-64 bg-indigo-400 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-1000"></div>
        <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-purple-400 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-3000"></div>

        <div className="container relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-amber-600">
              Why <span className="text-amber-700">BookSwap?</span>
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Experience the smarter way to buy, sell, and exchange textbooks on campus.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-12 max-w-6xl mx-auto">
            {[
              { icon: TrendingUp, title: "Save Money", gradient: "from-indigo-400 to-indigo-600", text: "Save up to 70% on textbooks compared to retail prices." },
              { icon: Shield, title: "Campus Verified", gradient: "from-purple-400 to-purple-600", text: "Trade securely with verified students from your campus." },
              { icon: Search, title: "Easy to Find", gradient: "from-amber-400 to-amber-600", text: "Intuitive search and filters help you locate books fast." }
            ].map(({ icon: Icon, title, gradient, text }) => (
              <div key={title} className="relative group p-6 rounded-3xl bg-white/70 backdrop-blur-lg shadow-lg hover:shadow-2xl hover:-translate-y-4 transition-all duration-500">
                <div className={`absolute -top-6 left-1/2 transform -translate-x-1/2 w-20 h-20 rounded-full bg-gradient-to-br ${gradient} opacity-80 blur-3xl group-hover:blur-2xl transition-all duration-500`}></div>

                <div className="relative flex flex-col items-center text-center">
                  <div className={`rounded-full bg-gradient-to-br ${gradient} w-16 h-16 flex items-center justify-center mb-4 shadow-xl transform transition-transform duration-500 group-hover:scale-110 group-hover:rotate-6`}>
                    <Icon className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="font-bold text-xl mb-2 group-hover:text-amber-600 transition-colors duration-500">{title}</h3>
                  <p className="text-gray-700 text-sm">{text}</p>
                </div>

                <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-amber-200 via-amber-400 to-amber-500 opacity-0 group-hover:opacity-20 transition-opacity duration-500 pointer-events-none"></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24 relative">
        <div className="absolute top-0 -left-20 w-72 h-72 bg-green-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute bottom-0 -right-20 w-72 h-72 bg-amber-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>

        <div className="container relative z-10">
          <Card className="bg-gradient-to-r from-amber-500 to-amber-600 border-0 text-white shadow-xl rounded-3xl">
            <CardContent className="py-12 text-center">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Get Started?</h2>
              <p className="text-lg mb-8 text-white/90 max-w-2xl mx-auto">
                Join thousands of students already saving money and helping each other succeed.
              </p>
              <Button size="lg" variant="secondary" className="bg-green-600 hover:bg-green-700 transition-all duration-300 shadow-lg" asChild>
                <Link to="/register">Create Free Account</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>

      <Footer />

      {/* Tailwind CSS Animations */}
      <style>
        {`
          @keyframes blob {
            0%, 100% { transform: translate(0px, 0px) scale(1); }
            33% { transform: translate(30px, -50px) scale(1.1); }
            66% { transform: translate(-20px, 20px) scale(0.9); }
          }
          .animate-blob { animation: blob 8s infinite; }
          .animation-delay-1000 { animation-delay: 1s; }
          .animation-delay-2000 { animation-delay: 2s; }
          .animation-delay-3000 { animation-delay: 3s; }
          .animate-fade-in { opacity: 0; animation: fadeIn 1s forwards; }
          .animate-fade-in.delay-200 { animation-delay: 0.2s; }
          .animate-fade-in.delay-400 { animation-delay: 0.4s; }
          @keyframes fadeIn { to { opacity: 1; } }
        `}
      </style>
    </div>
  );
};

export default Index;
