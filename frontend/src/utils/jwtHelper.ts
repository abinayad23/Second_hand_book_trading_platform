// src/utils/jwtHelper.ts
import {jwtDecode} from "jwt-decode";

export interface DecodedUser {
  sub?: string;     // usually user ID or email
  iat?: number;
  exp?: number;
  username?: string;
  role?: string;
  [key: string]: any; // any other fields
}

// Decode JWT
export const decodeToken = (token: string): DecodedUser => {
  try {
    return jwtDecode<DecodedUser>(token);
  } catch (err) {
    console.error("Invalid JWT token", err);
    return {};
  }
};

// Get stored token
export const getToken = () => localStorage.getItem("token");

// Get logged-in user info
export const getUserFromToken = () => {
  const token = getToken();
  if (!token) return null;

  const decoded = decodeToken(token);
  return {
      id: decoded.id,             // use 'id' directly
    username: decoded.username, // optional, might be undefined
    role: decoded.role,
    email: decoded.email,   
  };
};
