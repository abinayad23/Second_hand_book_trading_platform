# 📮 Postman Testing - Complete Registration Flow

## 🧪 Test 1: Send OTP

### Request Setup

**Method:** `POST`  
**URL:** `http://localhost:9092/api/auth/send-otp`

### Headers

```
Content-Type: application/json
```

### Request Body (JSON)

```json
{
  "email": "testuser@example.com",
  "useEmail": true
}
```

### Expected Response

**Status:** `200 OK`

```json
{
  "message": "OTP sent successfully to testuser@example.com",
  "success": true
}
```

**Action:** Check backend console or email for OTP (e.g., `123456`)

---

## 🧪 Test 2: Verify OTP

### Request Setup

**Method:** `POST`  
**URL:** `http://localhost:9092/api/auth/verify-otp`

### Headers

```
Content-Type: application/json
```

### Request Body (JSON)

```json
{
  "email": "testuser@example.com",
  "otp": "123456"
}
```

**Replace `123456` with actual OTP from Step 1!**

### Expected Response

**Status:** `200 OK`

```json
{
  "message": "OTP verified successfully",
  "success": true
}
```

---

## 🧪 Test 3: Complete Registration (Save to Database)

### Request Setup

**Method:** `POST`  
**URL:** `http://localhost:9092/api/users/verify?otp=123456`

**Replace `123456` with the SAME OTP from Step 1!**

### Headers

```
Content-Type: application/json
```

### Request Body (JSON)

```json
{
  "name": "Test User",
  "email": "testuser@example.com",
  "password": "password123",
  "department": "Computer Science",
  "phone": "+1234567890",
  "registerNumber": "testuser",
  "isFirstYear": false,
  "dateOfBirth": null,
  "location": null
}
```

### Expected Response

**Status:** `200 OK`

```json
{
  "id": 1,
  "name": "Test User",
  "email": "testuser@example.com",
  "username": "testuser@example.com",
  "department": "Computer Science",
  "phone": "+1234567890",
  "isVerified": true,
  "role": "STUDENT",
  "rating": 0.0,
  "createdAt": "2025-01-15T10:30:00"
}
```

**✅ User is now saved to database!**

---

## 🧪 Test 4: Verify User in Database

### Option A: Get All Users

**Method:** `GET`  
**URL:** `http://localhost:9092/api/users`

### Headers

```
Content-Type: application/json
```

### Expected Response

**Status:** `200 OK`

```json
[
  {
    "id": 1,
    "name": "Test User",
    "email": "testuser@example.com",
    "username": "testuser@example.com",
    "department": "Computer Science",
    "phone": "+1234567890",
    "isVerified": true,
    "role": "STUDENT",
    "rating": 0.0,
    "createdAt": "2025-01-15T10:30:00"
  }
]
```

### Option B: Get User by ID

**Method:** `GET`  
**URL:** `http://localhost:9092/api/users/1`

**Replace `1` with actual user ID from registration response**

### Expected Response

**Status:** `200 OK`

```json
{
  "id": 1,
  "name": "Test User",
  "email": "testuser@example.com",
  "username": "testuser@example.com",
  "department": "Computer Science",
  "phone": "+1234567890",
  "isVerified": true,
  "role": "STUDENT"
}
```

---

## 🧪 Test 5: Login with Registered User

### Request Setup

**Method:** `POST`  
**URL:** `http://localhost:9092/api/users/login`

### Headers

```
Content-Type: application/json
```

### Request Body (JSON)

```json
{
  "email": "testuser@example.com",
  "password": "password123"
}
```

**Use the password you set during registration!**

### Expected Response

**Status:** `200 OK`

```json
{
  "token": "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ0ZXN0dXNlckBleGFtcGxlLmNvbSIsInJvbGUiOiJTVFVERU5UIiwiaWF0IjoxNzM0MzIxNjAwLCJleHAiOjE3MzQ0MDgwMDB9.xxxxx",
  "username": "testuser@example.com",
  "role": "STUDENT"
}
```

**✅ Login successful! User exists in database!**

---

## 📋 Complete Registration Flow (Step-by-Step)

### Step 1: Send OTP
```
POST http://localhost:9092/api/auth/send-otp
Body: {"email": "newuser@example.com", "useEmail": true}
```
→ **Copy OTP from console/email**

### Step 2: Verify OTP
```
POST http://localhost:9092/api/auth/verify-otp
Body: {"email": "newuser@example.com", "otp": "123456"}
```
→ **Should return success**

### Step 3: Complete Registration
```
POST http://localhost:9092/api/users/verify?otp=123456
Body: {
  "name": "New User",
  "email": "newuser@example.com",
  "password": "password123",
  "department": "CS",
  "phone": "+1234567890",
  "isFirstYear": false
}
```
→ **User saved to database!**

### Step 4: Verify User Exists
```
GET http://localhost:9092/api/users
```
→ **Should see the new user in the list**

### Step 5: Test Login
```
POST http://localhost:9092/api/users/login
Body: {"email": "newuser@example.com", "password": "password123"}
```
→ **Should return JWT token**

---

## 🎯 Quick Copy-Paste Requests

### Complete Registration Flow

**1. Send OTP:**
```http
POST http://localhost:9092/api/auth/send-otp
Content-Type: application/json

{"email":"newuser@example.com","useEmail":true}
```

**2. Verify OTP (use OTP from Step 1):**
```http
POST http://localhost:9092/api/auth/verify-otp
Content-Type: application/json

{"email":"newuser@example.com","otp":"123456"}
```

**3. Complete Registration (use SAME OTP):**
```http
POST http://localhost:9092/api/users/verify?otp=123456
Content-Type: application/json

{
  "name": "New User",
  "email": "newuser@example.com",
  "password": "password123",
  "department": "Computer Science",
  "phone": "+1234567890",
  "registerNumber": "newuser",
  "isFirstYear": false,
  "dateOfBirth": null,
  "location": null
}
```

**4. Check All Users:**
```http
GET http://localhost:9092/api/users
```

**5. Login:**
```http
POST http://localhost:9092/api/users/login
Content-Type: application/json

{"email":"newuser@example.com","password":"password123"}
```

---

## ✅ Verification Checklist

- [ ] Step 1: OTP sent successfully
- [ ] Step 2: OTP verified successfully
- [ ] Step 3: Registration completed (user object returned)
- [ ] Step 4: User appears in `/api/users` list
- [ ] Step 5: Login successful with JWT token

---

## 🐛 Troubleshooting

### User Not in Database After Registration

**Check:**
1. Did Step 3 (complete registration) return a user object?
2. Check backend console for errors
3. Verify database connection in `application.properties`
4. Check if OTP was valid when calling `/api/users/verify`

### OTP Invalid Error in Step 3

**Cause:** OTP expired or already used  
**Solution:** 
- Use OTP within 5 minutes
- Make sure you're using the SAME OTP from Step 1
- Don't verify OTP twice in Step 2 (it's okay, but use same OTP in Step 3)

### Login Fails After Registration

**Check:**
1. Password matches what you set in registration
2. User exists in database (check Step 4)
3. User has `isVerified = true`

---

## 📝 Notes

1. **OTP Expiry:** OTPs expire after 5 minutes
2. **Same OTP:** Use the SAME OTP in both Step 2 and Step 3
3. **Password:** Remember the password you set - you'll need it for login
4. **Database:** Users are saved to `users` table in MySQL database

---

## 🎉 Success Indicators

✅ **Registration successful** → User object returned with `id`  
✅ **User in database** → Appears in `/api/users` list  
✅ **Login works** → Returns JWT token  

Follow these steps to test the complete registration flow in Postman!

