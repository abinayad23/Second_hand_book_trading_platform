// src/components/Login.tsx
import { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
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
import { BookOpen } from "lucide-react";

const Login = () => {
  const [email, setEmail] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [otpVerified, setOtpVerified] = useState(false);
  const [password, setPassword] = useState("");

  const [message, setMessage] = useState("");
  const [msgType, setMsgType] = useState<"success" | "error" | "info">("info");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const notify = (type: "success" | "error" | "info", msg: string) => {
    setMsgType(type);
    setMessage(msg);
    setTimeout(() => setMessage(""), 3000);
  };

  // ======================
  // SEND OTP
  // ======================
  const sendOTP = async () => {
    if (!email) return notify("error", "Please enter email.");

    setLoading(true);
    try {
      const res = await axios.post("http://localhost:8082/api/auth/send-otp", {
        email,
        useEmail: true,
      });

      if (res.data.success) {
        setOtpSent(true);
        notify("success", "OTP sent to your email.");
      } else {
        notify("error", "Failed to send OTP.");
      }
    } catch {
      notify("error", "Failed to send OTP.");
    } finally {
      setLoading(false);
    }
  };

  // ======================
  // VERIFY OTP
  // ======================
  const verifyOTP = async () => {
    if (!otp) return notify("error", "Enter OTP.");

    setLoading(true);
    try {
      const res = await axios.post("http://localhost:8082/api/auth/verify-otp", {
        email,
        otp,
      });

      if (res.data.success) {
        setOtpVerified(true);
        notify("success", "OTP verified. You can now log in.");
      } else {
        notify("error", "Invalid or expired OTP.");
      }
    } catch {
      notify("error", "Invalid or expired OTP.");
    } finally {
      setLoading(false);
    }
  };

  // ======================
  // LOGIN
  // ======================
  const login = async () => {
    if (!otpVerified) return notify("error", "Verify OTP first.");
    if (!password) return notify("error", "Enter password.");

    setLoading(true);
    try {
      const res = await axios.post("http://localhost:8082/api/users/login", {
        email,
        password,
      });

      const token = res.data.token;
      if (!token) return notify("error", "Server did not return token.");

      localStorage.setItem("token", token);

      notify("success", "Login successful!");

      setTimeout(() => navigate("/"), 800);
    } catch (err: any) {
      if (err.response?.data?.error) {
        notify("error", err.response.data.error);
      } else {
        notify("error", "Invalid email or password.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-gradient-to-br from-amber-50 via-white to-amber-100">
      <Card className="w-full max-w-2xl shadow-2xl rounded-2xl border border-amber-200">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="rounded-full bg-amber-200 p-4 shadow-lg">
              <BookOpen className="h-10 w-10 text-amber-700" />
            </div>
          </div>
          <CardTitle className="text-3xl font-extrabold text-amber-700">
            Login to Your Account
          </CardTitle>
          <CardDescription className="text-gray-600">
            Secure login using OTP verification
          </CardDescription>
        </CardHeader>

       

        <CardContent className="space-y-5 p-6">
          {/* EMAIL */}
          <div className="space-y-1">
            <Label>Email</Label>
            <Input
              disabled={otpSent || loading}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="example@college.edu"
              className="bg-white border border-gray-300 shadow-sm"
            />
          </div>

          {/* SEND OTP BUTTON */}
          {!otpSent && (
            <Button
              className="w-full bg-amber-600 hover:bg-amber-700 text-white shadow-md"
              onClick={sendOTP}
              disabled={loading}
            >
              {loading ? "Sending..." : "Send OTP"}
            </Button>
          )}

          {/* OTP INPUT */}
          {otpSent && !otpVerified && (
            <div className="space-y-2">
              <Label>Enter OTP</Label>
              <Input
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                placeholder="Enter OTP"
                className="bg-white border border-gray-300 shadow-sm"
              />
              <Button
                className="w-full bg-green-600 hover:bg-green-700 text-white shadow-md"
                onClick={verifyOTP}
                disabled={loading}
              >
                {loading ? "Verifying..." : "Verify OTP"}
              </Button>
            </div>
          )}

          {/* PASSWORD INPUT */}
          {otpVerified && (
            <div className="space-y-2">
              <Label>Password</Label>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-white border border-gray-300 shadow-sm"
              />
              <Button
                className="w-full bg-amber-600 hover:bg-amber-700 text-white shadow-md rounded-lg"
                onClick={login}
                disabled={loading}
              >
                {loading ? "Logging in..." : "Login"}
              </Button>
            </div>
          )}
        </CardContent>

         {/* MESSAGE BOX */}
        {message && (
          <div
            className={`mx-8 p-3 rounded-lg mb-2 text-center font-medium animate-fade-in 
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

        <CardFooter className="text-center pb-6">
          <p className="text-gray-700">
            Don’t have an account?{" "}
            <Link to="/register" className="text-amber-600 underline font-semibold">
              Sign Up
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Login;
