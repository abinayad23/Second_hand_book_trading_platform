# Postman Testing Guide for JWT Token Validation

## Server Information
- **Base URL**: `http://localhost:9092`
- **Port**: 9092

---

## Step 1: Login and Get Token

### Option A: Using `/api/users/login` (Recommended - Returns JSON)

**Request:**
- **Method**: `POST`
- **URL**: `http://localhost:9092/api/users/login`
- **Headers**:
  - `Content-Type: application/json`
- **Body** (raw JSON):
```json
{
  "email": "your-email@example.com",
  "password": "your-password"
}
```

**Expected Response:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiJ9...",
  "username": "your-username",
  "role": "STUDENT"
}
```

**Copy the `token` value from the response!**

---

### Option B: Using `/api/auth/login`

**Request:**
- **Method**: `POST`
- **URL**: `http://localhost:9092/api/auth/login`
- **Headers**:
  - `Content-Type: application/json`
- **Body** (raw JSON):
```json
{
  "email": "your-email@example.com",
  "password": "your-password"
}
```

**Expected Response:**
```
✅ Login successful! Token: eyJhbGciOiJIUzI1NiJ9...
```

**Extract the token from the response string!**

---

## Step 2: Validate Token (Method 1 - Using Validation Endpoint)

**Request:**
- **Method**: `GET`
- **URL**: `http://localhost:9092/api/auth/validate?token=YOUR_TOKEN_HERE`
- Replace `YOUR_TOKEN_HERE` with the token you got from Step 1

**Expected Response:**
- If valid: `✅ Token is valid!`
- If invalid/expired: `❌ Invalid or expired token!`

---

## Step 3: Test Protected Endpoint (Method 2 - Using Authorization Header)

### Test Authentication with `/api/users/test`

**Request:**
- **Method**: `GET`
- **URL**: `http://localhost:9092/api/users/test`
- **Headers**:
  - `Authorization: Bearer YOUR_TOKEN_HERE`
  - Replace `YOUR_TOKEN_HERE` with the token from Step 1

**Expected Response:**
```
Authenticated as: your-email@example.com
```

---

## Step 4: Test Other Protected Endpoints

### Get User by ID
**Request:**
- **Method**: `GET`
- **URL**: `http://localhost:9092/api/users/{id}`
- **Headers**:
  - `Authorization: Bearer YOUR_TOKEN_HERE`
- Replace `{id}` with actual user ID

### Get All Users
**Request:**
- **Method**: `GET`
- **URL**: `http://localhost:9092/api/users`
- **Headers**:
  - `Authorization: Bearer YOUR_TOKEN_HERE`

---

## Postman Setup Tips

### 1. Create Environment Variables
1. Click on "Environments" in Postman
2. Create a new environment (e.g., "Local Development")
3. Add variables:
   - `base_url`: `http://localhost:9092`
   - `token`: (leave empty, will be set after login)

### 2. Automatically Save Token After Login
1. In your login request, go to **Tests** tab
2. Add this script:
```javascript
if (pm.response.code === 200) {
    var jsonData = pm.response.json();
    // For /api/users/login
    if (jsonData.token) {
        pm.environment.set("token", jsonData.token);
        console.log("Token saved:", jsonData.token);
    }
    // For /api/auth/login (if using string response)
    else {
        var responseText = pm.response.text();
        var tokenMatch = responseText.match(/Token: (.+)/);
        if (tokenMatch) {
            pm.environment.set("token", tokenMatch[1]);
            console.log("Token saved:", tokenMatch[1]);
        }
    }
}
```

### 3. Use Token in Authorization Header
1. In your protected endpoint requests, go to **Authorization** tab
2. Select **Type**: `Bearer Token`
3. In **Token** field, enter: `{{token}}` (this uses the environment variable)

---

## Common Issues & Solutions

### Issue 1: "401 Unauthorized"
- **Cause**: Token missing, expired, or invalid
- **Solution**: 
  - Make sure you're including `Bearer ` prefix in Authorization header
  - Check if token is expired (tokens expire in 5 minutes for `/api/auth/login` or 24 hours for `/api/users/login`)
  - Login again to get a new token

### Issue 2: "Invalid or expired token!"
- **Cause**: Token was generated before the fix or uses wrong secret key
- **Solution**: Generate a new token by logging in again

### Issue 3: Token validation works but protected endpoints fail
- **Cause**: Token might not be properly set in SecurityContext
- **Solution**: Check server logs for authentication errors

---

## Quick Test Checklist

- [ ] Server is running on port 9092
- [ ] Login request returns 200 with token
- [ ] Token is copied correctly (no extra spaces)
- [ ] Authorization header format: `Bearer <token>` (note the space after Bearer)
- [ ] Token is not expired
- [ ] Protected endpoint returns 200 with data

---

## Example Postman Collection Structure

```
📁 CampusLink API
  📁 Authentication
    📄 Login (Users) - POST /api/users/login
    📄 Login (Auth) - POST /api/auth/login
    📄 Validate Token - GET /api/auth/validate
  📁 Users
    📄 Get All Users - GET /api/users
    📄 Get User by ID - GET /api/users/{id}
    📄 Test Auth - GET /api/users/test
```

---

## Testing Flow

1. **Login** → Get token
2. **Validate Token** → Verify token is valid
3. **Test Protected Endpoint** → Use token in Authorization header
4. **Verify Response** → Should return authenticated user data

---

**Note**: Make sure your Spring Boot application is running before testing!

