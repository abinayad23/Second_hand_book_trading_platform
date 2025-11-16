import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { adminApi } from "@/api/admin";
import { booksApi } from "@/api/books";
import { User, Book } from "@/types";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

const AdminDashboard = () => {
  const { user } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [usersData, booksData] = await Promise.all([
        adminApi.getAllUsers(),
        adminApi.getAllBooks(),
      ]);
      setUsers(usersData);
      setBooks(booksData);
    } catch (error) {
      toast.error("Failed to fetch data");
    } finally {
      setLoading(false);
    }
  };

  const handleApproveBook = async (bookId: number) => {
    try {
      await booksApi.updateBook(bookId, { isAvailable: true });
      toast.success("Book approved!");
      fetchData();
    } catch (error) {
      toast.error("Failed to approve book");
    }
  };

  const handleRejectBook = async (bookId: number) => {
    try {
      await booksApi.updateBook(bookId, { isAvailable: false });
      toast.success("Book rejected!");
      fetchData();
    } catch (error) {
      toast.error("Failed to reject book");
    }
  };

  const handleToggleVerification = async (userId: number) => {
    try {
      await adminApi.toggleUserVerification(userId);
      toast.success("User verification status updated!");
      fetchData();
    } catch (error) {
      toast.error("Failed to update verification status");
    }
  };

  const handleChangeRole = async (userId: number, role: string) => {
    try {
      await adminApi.updateUserRole(userId, role);
      toast.success(`User role changed to ${role}!`);
      fetchData();
    } catch (error) {
      toast.error("Failed to change user role");
    }
  };

  const handleDeleteUser = async (userId: number) => {
    if (!confirm("Are you sure you want to delete this user? This action cannot be undone.")) {
      return;
    }
    try {
      await adminApi.deleteUser(userId);
      toast.success("User deleted successfully!");
      fetchData();
    } catch (error) {
      toast.error("Failed to delete user");
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="text-center">Loading...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <p className="text-muted-foreground">Welcome, {user?.name}</p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Total Users</CardTitle>
            <CardDescription>Registered users</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{users.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Total Books</CardTitle>
            <CardDescription>All books posted</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{books.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Available Books</CardTitle>
            <CardDescription>Currently available</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {books.filter((b) => b.isAvailable).length}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Users</CardTitle>
          <CardDescription>Manage registered users</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Department</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Verified</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((u) => (
                <TableRow key={u.id}>
                  <TableCell className="font-medium">{u.name}</TableCell>
                  <TableCell>{u.email}</TableCell>
                  <TableCell>{u.department || "N/A"}</TableCell>
                  <TableCell>
                    <Badge variant={u.role === "ADMIN" ? "default" : "secondary"}>
                      {u.role}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={u.isVerified ? "default" : "destructive"}>
                      {u.isVerified ? "Yes" : "No"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleToggleVerification(u.id)}
                      >
                        {u.isVerified ? "Unverify" : "Verify"}
                      </Button>
                      {u.role !== "ADMIN" && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleChangeRole(u.id, "ADMIN")}
                        >
                          Make Admin
                        </Button>
                      )}
                      {u.role === "ADMIN" && u.id !== user?.id && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleChangeRole(u.id, "STUDENT")}
                        >
                          Make Student
                        </Button>
                      )}
                      {u.id !== user?.id && (
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleDeleteUser(u.id)}
                        >
                          Delete
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>All Books</CardTitle>
          <CardDescription>Approve or reject book listings</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Author</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Owner</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {books.map((book) => (
                <TableRow key={book.id}>
                  <TableCell className="font-medium">{book.title}</TableCell>
                  <TableCell>{book.author || "N/A"}</TableCell>
                  <TableCell>${book.price}</TableCell>
                  <TableCell>{book.owner?.name || "N/A"}</TableCell>
                  <TableCell>
                    <Badge variant={book.isAvailable ? "default" : "secondary"}>
                      {book.isAvailable ? "Available" : "Unavailable"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      {!book.isAvailable && (
                        <Button
                          size="sm"
                          onClick={() => handleApproveBook(book.id)}
                        >
                          Approve
                        </Button>
                      )}
                      {book.isAvailable && (
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleRejectBook(book.id)}
                        >
                          Reject
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminDashboard;

