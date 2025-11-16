# Postman Testing Guide for Chat/Users Endpoint

## ⚠️ IMPORTANT: If you get 403 errors, check these first:

1. **User must be verified** - After registration, user should have `isVerified = true`
2. **Token must be valid** - Tokens expire after 24 hours
3. **Token must be in Authorization header** - Format: `Bearer YOUR_TOKEN`

---

## Quick Debug Steps:

### Step 0: Check if user is verified
- **Method:** `GET`
- **URL:** `http://localhost:9092/api/users/email/YOUR_EMAIL`
- **Headers:** `Authorization: Bearer YOUR_TOKEN`
- **Check response:** Look for `"isVerified": true`

### Step 0.5: Test Authentication Status
- **Method:** `GET`
- **URL:** `http://localhost:9092/api/users/debug/auth`
- **Headers:** `Authorization: Bearer YOUR_TOKEN`
- **This will show if you're authenticated**

---

## Step 1: Login and Get Token

### Request: Login
- **Method:** `POST`
- **URL:** `http://localhost:9092/api/users/login`
- **Headers:**
  ```
  Content-Type: application/json
  ```
- **Body (raw JSON):**
  ```json
  {
    "email": "your-email@example.com",
    "password": "your-password"
  }
  ```
- **Response:** You'll get a token like:
  ```json
  {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "username": "your-email@example.com",
    "role": "STUDENT"
  }
  ```
- **Copy the token** from the response!
- **Note:** If user is not verified, the system will auto-verify during login

---

## Step 2: Test Get All Users (Chat Endpoint)

### Request: Get All Users
- **Method:** `GET`
- **URL:** `http://localhost:9092/api/users`
- **Headers:**
  ```
  Authorization: Bearer YOUR_TOKEN_HERE
  Content-Type: application/json
  ```
- **Replace `YOUR_TOKEN_HERE`** with the token from Step 1

### Expected Response:
- **Status:** `200 OK`
- **Body:** Array of users
  ```json
  [
    {
      "id": 1,
      "name": "John Doe",
      "email": "john@example.com",
      "role": "STUDENT",
      ...
    }
  ]
  ```

### If you get 403 Forbidden:
1. Check if the token is correct
2. Check if the token is expired (tokens last 24 hours)
3. Check backend console logs for authentication errors

---

## Step 3: Test Get User by Email

### Request: Get User by Email
- **Method:** `GET`
- **URL:** `http://localhost:9092/api/users/email/your-email@example.com`
- **Headers:**
  ```
  Authorization: Bearer YOUR_TOKEN_HERE
  Content-Type: application/json
  ```

---

## Step 4: Test Chat/Messages Endpoints

### Send a Message
- **Method:** `POST`
- **URL:** `http://localhost:9092/api/messages/send?senderId=1&receiverId=2&content=Hello!`
- **Headers:**
  ```
  Authorization: Bearer YOUR_TOKEN_HERE
  Content-Type: application/json
  ```

### Get Conversation Between Two Users
- **Method:** `GET`
- **URL:** `http://localhost:9092/api/messages/conversation?user1Id=1&user2Id=2`
- **Headers:**
  ```
  Authorization: Bearer YOUR_TOKEN_HERE
  ```

### Mark Message as Read
- **Method:** `PUT`
- **URL:** `http://localhost:9092/api/messages/read/{messageId}`
- **Headers:**
  ```
  Authorization: Bearer YOUR_TOKEN_HERE
  ```

### Mark Conversation as Read
- **Method:** `PUT`
- **URL:** `http://localhost:9092/api/messages/read-conversation?user1Id=1&user2Id=2`
- **Headers:**
  ```
  Authorization: Bearer YOUR_TOKEN_HERE
  ```

---

## Step 4: Test Other Protected Endpoints

### Get User by ID
- **Method:** `GET`
- **URL:** `http://localhost:9092/api/users/{id}`
- **Headers:**
  ```
  Authorization: Bearer YOUR_TOKEN_HERE
  ```

### Get Notifications
- **Method:** `GET`
- **URL:** `http://localhost:9092/api/notifications/user/{userId}`
- **Headers:**
  ```
  Authorization: Bearer YOUR_TOKEN_HERE
  ```

---

## Troubleshooting

### Error: 403 Forbidden
**Possible causes:**
1. Token is missing or invalid
2. Token is expired
3. User is not verified (`isVerified = false`)
4. JWT filter is not setting authentication correctly

**Check backend logs for:**
- `🔍 Extracted email from token: ...`
- `✅ Authentication set for: ...`
- `❌ Token validation failed: ...`

### Error: 401 Unauthorized
- Token is completely invalid or expired
- User credentials are wrong

### How to Debug:
1. Check if token is being sent: Look for `Authorization: Bearer ...` in request headers
2. Check backend console: Look for authentication logs
3. Verify token format: Should start with `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9`
4. Test token validation: Use `/api/auth/validate?token=YOUR_TOKEN`

---

## Quick Test Script for Postman

### Collection Setup:
1. Create a new collection "CampusLink API"
2. Add environment variables:
   - `base_url`: `http://localhost:9092/api`
   - `token`: (will be set after login)

### Pre-request Script (for Login):
```javascript
// Nothing needed for login
```

### Test Script (for Login):
```javascript
if (pm.response.code === 200) {
    var jsonData = pm.response.json();
    pm.environment.set("token", jsonData.token);
    console.log("Token saved:", jsonData.token);
}
```

### Pre-request Script (for Protected Endpoints):
```javascript
pm.request.headers.add({
    key: 'Authorization',
    value: 'Bearer ' + pm.environment.get("token")
});
```

---

## Testing the Complete Flow

1. **Register User:**
   - POST `/api/users/initiate` (send OTP)
   - POST `/api/users/verify?otp=123456` (complete registration)

2. **Login:**
   - POST `/api/users/login` (get token)

3. **Test Protected Endpoints:**
   - GET `/api/users` (should work with token)
   - GET `/api/users/email/{email}` (should work with token)
   - GET `/api/notifications/user/{userId}` (should work with token)

---

## Common Issues and Solutions

### Issue: Token works in Postman but not in browser
**Solution:** Check if token is stored in `sessionStorage`:
- Open browser DevTools → Application → Session Storage
- Look for `auth-storage` key
- Verify it contains the token

### Issue: 403 even with valid token
**Solution:** 
1. Check if user is verified: `isVerified = true`
2. Check backend logs for authentication errors
3. Try logging out and logging in again

### Issue: Token expires quickly
**Solution:** Tokens last 24 hours. If expired, login again to get a new token.

