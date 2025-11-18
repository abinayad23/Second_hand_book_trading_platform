// src/App.tsx
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";

// Pages
import Index from "./pages/Index";
import Books from "./pages/Books";
import BookDetails from "./pages/BookDetails";
import TransactionDetails from "./pages/Transaction";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/Profile";
import UploadBook from "./pages/UploadBook";
import Wishlist from "./pages/Wishlist";
import Orders from "./pages/Orders";
import Notifications from "./pages/Notifications";
import Cart from "./pages/Cart";
import NotFound from "./pages/NotFound";
import AskReview from "./pages/AskReview";
import ReviewListPage from "./pages/ReviewListPage";


const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      {/* Global Toasters */}
      <Toaster />
      <Sonner />

      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Authenticated Routes */}
          <Route path="/" element={<Index />} />
          <Route path="/books" element={<Books />} />
          <Route path="/books/:id" element={<BookDetails />} />
          <Route path="/transaction/:id" element={<TransactionDetails />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/upload" element={<UploadBook />} />
          <Route path="/wishlist" element={<Wishlist />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/notifications" element={<Notifications />} />
          <Route path="/ask-review" element={<AskReview />} />
          <Route path="/review-list/:sellerId" element={<ReviewListPage />} />


          {/* Catch-all for unknown routes */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
