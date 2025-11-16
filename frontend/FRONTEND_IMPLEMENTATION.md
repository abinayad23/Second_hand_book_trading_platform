# Frontend Implementation Guide

## Overview
Complete React + TypeScript + TailwindCSS frontend for the CampusLink second-hand textbook marketplace.

## Project Structure

```
frontend/src/
├── api/              # API service modules
│   ├── api.ts        # Axios instance with interceptors
│   ├── auth.ts       # Authentication API calls
│   ├── books.ts      # Book-related API calls
│   ├── users.ts      # User API calls
│   ├── messages.ts   # Chat/messaging API calls
│   ├── reviews.ts    # Review API calls
│   └── admin.ts      # Admin API calls
├── components/       # Reusable components
│   ├── ProtectedRoute.tsx  # Route protection HOC
│   ├── ReviewForm.tsx      # Review submission form
│   ├── ReviewList.tsx      # Review display component
│   ├── Navbar.tsx          # Navigation bar with role-based menu
│   └── ui/           # shadcn/ui components
├── hooks/            # Custom React hooks
│   └── useAuth.ts   # Authentication hook
├── pages/            # Page components
│   ├── Index.tsx            # Landing page
│   ├── Login.tsx            # Login page
│   ├── Register.tsx         # Signup page
│   ├── BrowseBooks.tsx      # Book listing page
│   ├── BookDetails.tsx      # Book detail page
│   ├── SellerProfile.tsx    # Seller profile page
│   ├── AdminDashboard.tsx  # Admin dashboard
│   ├── StudentDashboard.tsx # Student dashboard
│   ├── UploadBook.tsx       # Post book page
│   └── Chat.tsx            # Chat interface
├── store/            # State management (Zustand)
│   └── authStore.ts # Authentication state
└── types/            # TypeScript interfaces
    └── index.ts      # All type definitions
```

## Key Features

### 1. Authentication System
- **Login/Signup**: Full authentication flow with OTP verification
- **Role-based Access**: Admin and Student roles
- **Protected Routes**: Route protection based on authentication and role
- **JWT Token Management**: Automatic token injection in API requests
- **Persistent Auth**: Auth state persisted in localStorage

### 2. Admin Dashboard
- View all users
- View all books
- Approve/reject book listings
- Delete reviews

### 3. Student Dashboard
- View posted books
- Post new books
- Delete own books

### 4. Browse Books
- List all available books
- Search functionality
- Book cards with images, price, condition
- Click to view details

### 5. Book Details
- Full book information
- Seller information
- "View Seller Profile" button
- Review form (for authenticated users)
- Review list with ratings

### 6. Seller Profile
- Seller details (name, department, contact info)
- Average rating and review count
- All books posted by seller
- Reviews for seller's books

### 7. Chat Module
- WhatsApp-like interface
- Conversation list
- Chat window with message history
- Real-time message sending
- Auto-refresh every 3 seconds

### 8. Review Module
- Star rating system (1-5 stars)
- Text comments
- Review display with ratings
- Average rating calculation

## API Integration

### Base URL
The API base URL is configured in `src/api/api.ts`. Default: `http://localhost:9092/api`

### Authentication
- JWT tokens are automatically added to all requests via axios interceptors
- Tokens are stored in Zustand store with persistence
- 401 errors automatically redirect to login

### API Endpoints Used

#### Authentication
- `POST /api/users/login` - Login
- `POST /api/users/initiate` - Start registration
- `POST /api/users/verify?otp=...` - Verify OTP and complete registration
- `GET /api/users/{id}` - Get user by ID
- `PUT /api/users/{id}/edit` - Update user profile

#### Books
- `GET /api/books` - Get all available books
- `GET /api/books/{id}` - Get book by ID
- `GET /api/books/search?q=...` - Search books
- `POST /api/books` - Add new book
- `PUT /api/books/{id}` - Update book
- `DELETE /api/books/{id}` - Delete book

#### Messages
- `POST /api/messages/send?senderId=...&receiverId=...&content=...` - Send message
- `GET /api/messages/conversation?user1Id=...&user2Id=...` - Get conversation

#### Reviews
- `POST /api/reviews/add?reviewerId=...&bookId=...&rating=...&comment=...` - Add review
- `GET /api/reviews/book/{bookId}` - Get reviews for a book
- `GET /api/reviews/user/{userId}` - Get reviews by a user

#### Admin
- `GET /api/admin/users` - Get all users (admin only)
- `GET /api/admin/books` - Get all books (admin only)
- `DELETE /api/admin/reviews/{reviewId}` - Delete review (admin only)

## State Management

### Zustand Store
- **authStore**: Manages authentication state
  - `user`: Current user object
  - `token`: JWT token
  - `isAuthenticated`: Boolean flag
  - `login(user, token)`: Login function
  - `logout()`: Logout function
  - `updateUser(updates)`: Update user data

## Routing

### Public Routes
- `/` - Landing page
- `/books` - Browse books
- `/books/:id` - Book details
- `/seller/:id` - Seller profile
- `/login` - Login page
- `/register` - Signup page

### Protected Routes (Authenticated)
- `/chat` - Chat interface
- `/profile` - User profile

### Protected Routes (Student Only)
- `/student/dashboard` - Student dashboard
- `/upload` - Post book

### Protected Routes (Admin Only)
- `/admin/dashboard` - Admin dashboard

## Dependencies

### Core
- `react` ^19.2.0
- `react-dom` ^19.2.0
- `react-router-dom` ^7.9.4
- `typescript` ~5.9.3

### State Management
- `zustand` - Lightweight state management

### API
- `axios` ^1.12.2 - HTTP client

### UI
- `tailwindcss` ^4.1.14 - Styling
- `@radix-ui/*` - UI component primitives
- `lucide-react` - Icons
- `sonner` - Toast notifications

### Utilities
- `date-fns` - Date formatting

## Setup Instructions

1. **Install Dependencies**
   ```bash
   cd frontend
   npm install
   ```

2. **Configure API Base URL**
   - Edit `src/api/api.ts` if your backend runs on a different port
   - Default: `http://localhost:9092/api`

3. **Run Development Server**
   ```bash
   npm run dev
   ```

4. **Build for Production**
   ```bash
   npm run build
   ```

## Environment Variables (Optional)

Create a `.env` file in the frontend directory:
```
VITE_API_BASE_URL=http://localhost:9092/api
```

Then update `src/api/api.ts` to use:
```typescript
baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:9092/api"
```

## Production Readiness Checklist

✅ TypeScript types for all data structures
✅ Error handling with toast notifications
✅ Loading states for async operations
✅ Protected routes with role-based access
✅ JWT token management
✅ Responsive design with TailwindCSS
✅ Clean component structure
✅ Reusable hooks
✅ API service layer separation
✅ State management with Zustand
✅ Form validation
✅ Image upload support (ready for backend integration)

## Notes

1. **Image Upload**: The UploadBook component is ready for image upload, but currently sends book data without images. Once the backend supports multipart/form-data for book creation, update the `booksApi.addBook` function.

2. **Real-time Chat**: Currently uses polling (3-second intervals). For production, consider implementing WebSocket support.

3. **Error Boundaries**: Consider adding React Error Boundaries for better error handling.

4. **API Error Handling**: All API errors are caught and displayed via toast notifications. Customize error messages as needed.

5. **Authentication Flow**: The login flow fetches user data by email after receiving the token. This ensures we have complete user information.

## Integration with Backend

The frontend is designed to work seamlessly with the Spring Boot backend:

1. **CORS**: Ensure backend allows requests from frontend origin
2. **JWT**: Backend should validate JWT tokens in the `Authorization: Bearer <token>` header
3. **Error Responses**: Backend should return appropriate HTTP status codes (401 for unauthorized, etc.)

## Testing

To test the application:

1. Start the backend server on port 9092
2. Start the frontend dev server
3. Register a new user (or use existing credentials)
4. Login and explore different features based on your role

## Support

For issues or questions, refer to the backend API documentation or check the API endpoints in the respective service files.

