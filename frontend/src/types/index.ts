export interface User {
  id: number;
  name: string;
  email: string;
  username: string;
  password?: string;
  department?: string;
  phone?: string;
  location?: string;
  profileImagePath?: string;
  registerNumber?: string;
  isFirstYear?: boolean;
  dateOfBirth?: string | null;
  isVerified?: boolean;
  rating?: number;
  role: "ADMIN" | "STUDENT";
  createdAt?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  username: string;
  role: string;
}

export interface SignupRequest {
  name: string;
  email: string;
  password: string;
  username?: string;
  department?: string;
  phone?: string;
  location?: string;
  registerNumber?: string;
  isFirstYear?: boolean;
  dateOfBirth?: string | null;
}

export interface Book {
  id: number;
  title: string;
  author?: string;
  quality?: string;
  type?: string;
  originalPrice?: number;
  generatedPrice?: number;
  price?: number;
  description?: string;
  available?: boolean;
  isAvailable?: boolean;
  bookImage?: string;
  imagePath?: string;
  edition?: string;
  owner?: User;
  postedByUser?: string;
  condition?: string;
}

export interface Review {
  id: number;
  rating: number;
  comment: string;
  reviewer?: User;
  seller?: User;
  book?: Book;
  timestamp?: string;
  createdAt?: string;
}

export interface Notification {
  id: number;
  message: string;
  isRead: boolean;
  timestamp?: string;
  user?: User;
}

export interface Message {
  id: number;
  sender?: User;
  receiver?: User;
  content: string;
  timestamp?: string;
  isRead?: boolean;
  seen?: boolean;
}

export interface Conversation {
  otherUser: User;
  lastMessage?: Message;
}

