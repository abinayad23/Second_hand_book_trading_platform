import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Bell, BookOpen, MessageCircle, Heart, CheckCheck } from "lucide-react";

const Notifications = () => {
  const notifications = [
    { 
      id: 1, 
      type: "match", 
      message: "Your wanted book 'Operating Systems' is now available!", 
      time: "2 hours ago",
      unread: true 
    },
    { 
      id: 2, 
      type: "message", 
      message: "New message from John Doe about 'Data Structures'", 
      time: "5 hours ago",
      unread: true 
    },
    { 
      id: 3, 
      type: "wishlist", 
      message: "'Digital Electronics' from your wishlist is now on sale", 
      time: "1 day ago",
      unread: false 
    },
    { 
      id: 4, 
      type: "exchange", 
      message: "Alice Smith wants to exchange 'Linear Algebra' with you", 
      time: "2 days ago",
      unread: false 
    },
    { 
      id: 5, 
      type: "review", 
      message: "Bob Johnson left a 5-star review on your book", 
      time: "3 days ago",
      unread: false 
    },
  ];

  const getIcon = (type: string) => {
    switch (type) {
      case "match":
        return <BookOpen className="h-5 w-5" />;
      case "message":
        return <MessageCircle className="h-5 w-5" />;
      case "wishlist":
        return <Heart className="h-5 w-5" />;
      default:
        return <Bell className="h-5 w-5" />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 pt-20 pb-12 bg-gradient-subtle">
        <div className="container max-w-4xl mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-4xl font-bold mb-2">Notifications</h1>
              <p className="text-muted-foreground">Stay updated with your book activities</p>
            </div>
            <Button variant="outline">
              <CheckCheck className="h-4 w-4 mr-2" />
              Mark all as read
            </Button>
          </div>

          <div className="space-y-3">
            {notifications.map((notification) => (
              <Card 
                key={notification.id} 
                className={`shadow-elegant transition-all ${
                  notification.unread ? "border-l-4 border-l-primary" : ""
                }`}
              >
                <CardContent className="p-6">
                  <div className="flex gap-4">
                    <div className={`rounded-full p-3 flex-shrink-0 ${
                      notification.unread ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"
                    }`}>
                      {getIcon(notification.type)}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between gap-4 mb-2">
                        <p className={`font-medium ${notification.unread ? "text-foreground" : "text-muted-foreground"}`}>
                          {notification.message}
                        </p>
                        {notification.unread && <Badge>New</Badge>}
                      </div>
                      <p className="text-sm text-muted-foreground">{notification.time}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {notifications.length === 0 && (
            <Card className="shadow-elegant">
              <CardContent className="flex flex-col items-center justify-center py-16">
                <Bell className="h-16 w-16 text-muted-foreground mb-4" />
                <h3 className="text-xl font-semibold mb-2">No notifications yet</h3>
                <p className="text-muted-foreground">We'll notify you when something interesting happens</p>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Notifications;
