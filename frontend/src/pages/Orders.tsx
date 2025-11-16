import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Download, BookOpen, Package } from "lucide-react";

const Orders = () => {
  const orders = [
    { 
      id: 1, 
      bookTitle: "Data Structures", 
      type: "bought", 
      price: 450, 
      date: "2024-03-15", 
      status: "completed",
      seller: "John Doe"
    },
    { 
      id: 2, 
      bookTitle: "Digital Electronics", 
      type: "sold", 
      price: 380, 
      date: "2024-03-10", 
      status: "completed",
      buyer: "Alice Smith"
    },
    { 
      id: 3, 
      bookTitle: "Linear Algebra", 
      type: "exchanged", 
      date: "2024-03-08", 
      status: "completed",
      exchangeWith: "Bob Johnson"
    },
    { 
      id: 4, 
      bookTitle: "Physics Vol 1", 
      type: "donated", 
      date: "2024-03-05", 
      status: "completed",
      recipient: "Campus Library"
    },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 pt-20 pb-12 bg-gradient-subtle">
        <div className="container max-w-6xl mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-4xl font-bold mb-2">Order History</h1>
              <p className="text-muted-foreground">Track all your book transactions</p>
            </div>
            <Package className="h-12 w-12 text-primary" />
          </div>

          <Tabs defaultValue="all" className="space-y-6">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="bought">Bought</TabsTrigger>
              <TabsTrigger value="sold">Sold</TabsTrigger>
              <TabsTrigger value="exchanged">Exchanged</TabsTrigger>
              <TabsTrigger value="donated">Donated</TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="space-y-4">
              {orders.map((order) => (
                <Card key={order.id} className="shadow-elegant">
                  <CardContent className="p-6">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="flex gap-4 flex-1">
                        <div className="w-16 h-20 bg-muted rounded flex items-center justify-center flex-shrink-0">
                          <BookOpen className="h-6 w-6 text-muted-foreground" />
                        </div>
                        <div className="space-y-2">
                          <div className="flex items-center gap-2 flex-wrap">
                            <h3 className="font-semibold text-lg">{order.bookTitle}</h3>
                            <Badge variant={
                              order.type === "bought" ? "default" :
                              order.type === "sold" ? "secondary" :
                              order.type === "exchanged" ? "outline" : "default"
                            }>
                              {order.type}
                            </Badge>
                            <Badge variant="secondary">{order.status}</Badge>
                          </div>
                          <div className="text-sm text-muted-foreground space-y-1">
                            <p>Order Date: {new Date(order.date).toLocaleDateString()}</p>
                            {order.seller && <p>Seller: {order.seller}</p>}
                            {order.buyer && <p>Buyer: {order.buyer}</p>}
                            {order.exchangeWith && <p>Exchanged with: {order.exchangeWith}</p>}
                            {order.recipient && <p>Recipient: {order.recipient}</p>}
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-3">
                        {order.price && (
                          <p className="text-2xl font-bold text-primary">₹{order.price}</p>
                        )}
                        {order.type === "bought" && (
                          <Button variant="outline" size="sm">
                            <Download className="h-4 w-4 mr-2" />
                            Download Receipt
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </TabsContent>

            <TabsContent value="bought" className="space-y-4">
              {orders.filter(o => o.type === "bought").map((order) => (
                <Card key={order.id} className="shadow-elegant">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex gap-4">
                        <div className="w-16 h-20 bg-muted rounded flex items-center justify-center">
                          <BookOpen className="h-6 w-6 text-muted-foreground" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-lg mb-2">{order.bookTitle}</h3>
                          <p className="text-sm text-muted-foreground">Seller: {order.seller}</p>
                          <p className="text-sm text-muted-foreground">{new Date(order.date).toLocaleDateString()}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-primary mb-2">₹{order.price}</p>
                        <Button variant="outline" size="sm">
                          <Download className="h-4 w-4 mr-2" />
                          Receipt
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </TabsContent>

            {["sold", "exchanged", "donated"].map((type) => (
              <TabsContent key={type} value={type} className="space-y-4">
                {orders.filter(o => o.type === type).map((order) => (
                  <Card key={order.id} className="shadow-elegant">
                    <CardContent className="p-6">
                      <div className="flex gap-4">
                        <div className="w-16 h-20 bg-muted rounded flex items-center justify-center">
                          <BookOpen className="h-6 w-6 text-muted-foreground" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-lg mb-2">{order.bookTitle}</h3>
                          <p className="text-sm text-muted-foreground">{new Date(order.date).toLocaleDateString()}</p>
                          {order.price && <p className="text-xl font-bold text-primary mt-2">₹{order.price}</p>}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </TabsContent>
            ))}
          </Tabs>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Orders;
