import { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { BookOpen } from "lucide-react";

const Register = () => {
  // ✅ Step 1: Form state
  const [form, setForm] = useState({
    name: "",
    email: "",
    department: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });

  const [message, setMessage] = useState("");

  // ✅ Step 2: Handle input change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.id]: e.target.value });
  };

  // ✅ Step 3: Department change
  const handleDepartmentChange = (value: string) => {
    setForm({ ...form, department: value });
  };

  // ✅ Step 4: Submit form
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (form.password !== form.confirmPassword) {
      setMessage("Passwords do not match");
      return;
    }

    try {
      const response = await axios.post("http://localhost:8080/api/users/register", {
        name: form.name,
        email: form.email,
        department: form.department,
        phone: form.phone,
        password: form.password,
      });

      setMessage(`✅ Registered successfully as ${response.data.name}`);
      setForm({
        name: "",
        email: "",
        department: "",
        phone: "",
        password: "",
        confirmPassword: "",
      });
    } catch (error: any) {
      setMessage(error.response?.data?.message || "❌ Registration failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-muted/20 to-background p-4">
      <Card className="w-full max-w-md shadow-large">
        <CardHeader className="space-y-1 text-center">
          <div className="flex justify-center mb-4">
            <div className="rounded-full bg-primary/10 p-3">
              <BookOpen className="h-8 w-8 text-amber-500" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold">Create Account</CardTitle>
          <CardDescription>Join your campus book trading community</CardDescription>
        </CardHeader>

        {/* ✅ Form */}
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            {/* Full Name */}
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input id="name" placeholder="John Doe" value={form.name} onChange={handleChange} />
            </div>

            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="email">College Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@college.edu"
                value={form.email}
                onChange={handleChange}
              />
            </div>

            {/* Department */}
            <div className="space-y-2">
              <Label htmlFor="department">Department</Label>
              <Select onValueChange={handleDepartmentChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Select department" />
                </SelectTrigger>
                <SelectContent className="bg-yellow-50">
                  <SelectItem value="CSE">Computer Science and Engineering</SelectItem>
                  <SelectItem value="EEE">Electrical and Electronics Engineering</SelectItem>
                  <SelectItem value="MECH">Mechanical Engineering</SelectItem>
                  <SelectItem value="CIVIL">Civil Engineering</SelectItem>
                  <SelectItem value="ECE">Electronics and Communication Engineering</SelectItem>
                  <SelectItem value="EIE">Electrical and Instrumentation Engineering</SelectItem>
                  <SelectItem value="IT">Information Technology</SelectItem>
                  <SelectItem value="IBT">Industrial Bio Technology</SelectItem>
                  <SelectItem value="PE">Production Engineering</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Phone Number */}
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                type="tel"
                placeholder="9876543210"
                value={form.phone}
                onChange={handleChange}
                maxLength={10}
              />
            </div>

            {/* Password */}
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={form.password}
                onChange={handleChange}
              />
            </div>

            {/* Confirm Password */}
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                value={form.confirmPassword}
                onChange={handleChange}
              />
            </div>

            <Button type="submit" className="w-full bg-amber-500">
              Create Account
            </Button>

            {message && (
              <p className="text-center text-sm font-medium text-amber-600 mt-2">
                {message}
              </p>
            )}
          </CardContent>
        </form>

        <CardFooter className="flex flex-col gap-4">
          <div className="text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link to="/login" className="text-amber-500 hover:underline font-medium">
              Login
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Register;
