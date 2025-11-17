import { useState } from "react";
import axios from "axios";
import { Link,useNavigate } from "react-router-dom";
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
const navigate = useNavigate(); 
 const [form, setForm] = useState({
    name: "",
    username: "",
    email: "",
    department: "",
    phone: "",
    location: "",
    registerNumber: "",
    password: "",
    confirmPassword: "",
    isFirstYear: false,
    dateOfBirth: "",
    profileImage: null,
  });

  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [message, setMessage] = useState("");
  const [msgType, setMsgType] = useState<"success" | "error" | "info">("info");

  const handleChange = (e: any) => {
    setForm({ ...form, [e.target.id]: e.target.value });
  };

  const handleDepartmentChange = (value: string) => {
    setForm({ ...form, department: value });
  };

  const handleFirstYearChange = (value: string) => {
    setForm({ ...form, isFirstYear: value === "yes" });
  };

  const notify = (type: "success" | "error" | "info", msg: string) => {
    setMsgType(type);
    setMessage(msg);
    setTimeout(() => setMessage(""), 3500);
  };

  const sendOTP = async () => {
    if (!form.email) return notify("error", "Please enter your email address.");

    try {
      await axios.post("http://localhost:8082/api/auth/send-otp", {
        email: form.email,
        phone: form.phone,
        useEmail: true,
      });

      setOtpSent(true);
      notify("success", "OTP has been sent to your email.");
    } catch {
      notify("error", "Failed to send OTP. Please try again.");
    }
  };

  const verifyOTP = async () => {
    try {
      await axios.post("http://localhost:8082/api/auth/verify-otp", {
        email: form.email,
        otp:otp,
      });

      setOtpVerified(true);
      notify("success", "OTP verified successfully.");
    } catch(error:any) {
      notify("error", "Invalid OTP. Please try again.");
    }
  };

  const registerUser = async (e: any) => {
    e.preventDefault();

    if (!otpVerified) return notify("error", "Please verify OTP before submitting.");
    if (form.password !== form.confirmPassword)
      return notify("error", "Passwords do not match.");

    try {
      const payload = { name: form.name, username: form.username, email: form.email, department: form.department, phone: form.phone, location: form.location, registerNumber: form.registerNumber, password: form.password, isFirstYear: form.isFirstYear, dateOfBirth: form.dateOfBirth,};

      const response = await axios.post(
        `http://localhost:8082/api/users/verify?otp=${otp}`,
        payload
      );

      notify("success", `Registration successful. Welcome, ${response.data.name}!`);

      setForm({
        name: "",
        username: "",
        email: "",
        department: "",
        phone: "",
        location: "",
        registerNumber: "",
        password: "",
        confirmPassword: "",
        isFirstYear: false,
        dateOfBirth: "",
        profileImage: null,
      });

      setOtp("");
      setOtpSent(false);
      setOtpVerified(false);
      setTimeout(() => navigate("/login"), 2000);
    } catch (error: any) {
      notify("error", "Registration failed. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-gradient-to-br from-amber-50 via-white to-amber-100">
      <Card className="w-full max-w-3xl shadow-2xl rounded-2xl border border-amber-200">
        <CardHeader className="text-center pb-2">
          <div className="flex justify-center mb-4">
            <div className="rounded-full bg-amber-200 p-4 shadow-lg">
              <BookOpen className="h-10 w-10 text-amber-700" />
            </div>
          </div>
          <CardTitle className="text-4xl font-extrabold text-amber-700 drop-shadow-sm">
            Create Your Account
          </CardTitle>
          <CardDescription className="text-gray-600 text-lg">
            Join the campus book trading community
          </CardDescription>
        </CardHeader>

        

        <form onSubmit={registerUser}>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
            {/* Input Fields */}
            {[
              ["name", "Full Name", "John Doe"],
              ["username", "Username", "john123"],
              ["email", "College Email", "example@college.edu"],
              ["registerNumber", "Register Number", "20XX12345"],
              ["phone", "Phone", "+91 9876543210"],
              ["location", "Location", "City, State"],
            ].map(([id, label, placeholder]) => (
              <div key={id} className="space-y-1">
                <Label htmlFor={id}>{label}</Label>
                <Input
                  id={id}
                  value={(form as any)[id]}
                  onChange={handleChange}
                  placeholder={placeholder}
                  className="bg-white border border-gray-300 shadow-sm"
                />
              </div>
            ))}

            {/* Department */}
            <div className="space-y-1">
              <Label>Department</Label>
              <Select onValueChange={handleDepartmentChange}>
                <SelectTrigger className="bg-white border-gray-300 shadow-sm">
                  <SelectValue placeholder="Select department" />
                </SelectTrigger>
                <SelectContent className="bg-white border border-gray-300 shadow-md">
                  <SelectItem value="CSE">CSE</SelectItem>
                  <SelectItem value="ECE">ECE</SelectItem>
                  <SelectItem value="EEE">EEE</SelectItem>
                  <SelectItem value="MECH">MECH</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* First Year */}
            <div className="space-y-1">
              <Label>Are you a First-Year Student?</Label>
              <Select onValueChange={handleFirstYearChange}>
                <SelectTrigger className="bg-white border-gray-300 shadow-sm">
                  <SelectValue placeholder="Select option" />
                </SelectTrigger>
                <SelectContent className="bg-white border-gray-300 shadow-md">
                  <SelectItem value="yes">Yes</SelectItem>
                  <SelectItem value="no">No</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Date Of Birth */}
            <div className="space-y-1">
              <Label>Date of Birth</Label>
              <Input
                id="dateOfBirth"
                type="date"
                value={form.dateOfBirth}
                onChange={handleChange}
                className="bg-white border-gray-300 shadow-sm"
              />
            </div>

            {/* Password */}
            <div className="space-y-1">
              <Label>Password</Label>
              <Input
                id="password"
                type="password"
                value={form.password}
                onChange={handleChange}
                className="bg-white border-gray-300 shadow-sm"
              />
            </div>

            {/* Confirm Password */}
            <div className="space-y-1">
              <Label>Confirm Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                value={form.confirmPassword}
                onChange={handleChange}
                className="bg-white border-gray-300 shadow-sm"
              />
            </div>

            {/* OTP Buttons */}
            {!otpSent && (
              <Button
                type="button"
                onClick={sendOTP}
                className="mt-3 bg-blue-600 hover:bg-blue-700 text-white shadow-md"
              >
                Send OTP
              </Button>
            )}

            {otpSent && !otpVerified && (
              <div className="space-y-2 col-span-full">
                <Label>Enter OTP</Label>
                <Input
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  placeholder="Enter OTP"
                  className="bg-white border-gray-300 shadow-sm"
                />
                <Button
                  type="button"
                  onClick={verifyOTP}
                  className="w-full bg-green-600 hover:bg-green-700 text-white shadow-md"
                >
                  Verify OTP
                </Button>
              </div>
            )}
          </CardContent>

          <CardFooter className="flex flex-col gap-3 p-6">
            <Button
              type="submit"
              disabled={!otpVerified}
              className="w-full bg-amber-600 hover:bg-amber-700 text-white font-semibold rounded-lg shadow-lg disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              Create Account
            </Button>
            {/* Message Box */}
        {message && (
          <div
            className={`mx-8 p-3 rounded-lg mb-2 animate-fade-in text-center font-medium 
            ${
              msgType === "success"
                ? "bg-green-100 text-green-700 border border-green-300"
                : msgType === "error"
                ? "bg-red-100 text-red-700 border border-red-300"
                : "bg-blue-100 text-blue-700 border border-blue-300"
            }`}
          >
            {message}
          </div>
        )}

            <p className="text-center text-gray-700">
              Already have an account?{" "}
              <Link to="/login" className="text-amber-600 underline font-medium">
                Login
              </Link>
            </p>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default Register;
