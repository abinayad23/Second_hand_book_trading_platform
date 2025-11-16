# 🔐 Postman Login Testing Guide

## Prerequisites

- ✅ User registered successfully
- ✅ Backend running on `http://localhost:9092`
- ✅ Postman installed

---

## 🧪 Test Login

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
  "email": "spyajupratha31@gmail.com",
  "password": "your-password"
}
```

**Important:** Use the password you set during registration!

---

## ✅ Expected Response (Success)

**Status:** `200 OK`

```json
{
  "token": "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJzcHlhanVwcmF0aDMxQGdtYWlsLmNvbSIsInJvbGUiOiJTVFVERU5UIiwiaWF0IjoxNzM0MzIxNjAwLCJleHAiOjE3MzQ0MDgwMDB9.xxxxx",
  "username": "spyajupratha31@gmail.com",
  "role": "STUDENT"
}
```

**Save the `token`** - you'll need it for authenticated requests!

---

## ❌ Expected Response (Invalid Credentials)

**Status:** `401 Unauthorized`

```
Invalid email or password
```

---

## 📋 Step-by-Step in Postman

### Step 1: Create New Request

1. Click **New** → **HTTP Request**
2. Name it: "Login"

### Step 2: Configure Request

1. **Method:** Select `POST`
2. **URL:** Enter `http://localhost:9092/api/users/login`
3. **Headers Tab:**
   - Key: `Content-Type`
   - Value: `application/json`
4. **Body Tab:**
   - Select `raw`
   - Select `JSON` (from dropdown)
   - Paste:
   ```json
   {
     "email": "spyajupratha31@gmail.com",
     "password": "your-password"
   }
   ```

### Step 3: Send Request

1. Click **Send**
2. Check **Response** panel

---

## 🔑 Using the Token

After successful login, you'll get a JWT token. Use it for authenticated requests:

### Add Token to Requests

**Headers Tab:**
```
Authorization: Bearer eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJzcHlhanVwcmF0aDMxQGdtYWlsLmNvbSIsInJvbGUiOiJTVFVERU5UIiwiaWF0IjoxNzM0MzIxNjAwLCJleHAiOjE3MzQ0MDgwMDB9.xxxxx
```

**Replace the token** with the actual token from login response!

---

## 🧪 Test Authenticated Endpoint

### Example: Get Current User

**Method:** `GET`  
**URL:** `http://localhost:9092/api/users/{id}`

**Headers:**
```
Authorization: Bearer YOUR_TOKEN_HERE
```

**Note:** Replace `{id}` with actual user ID

---

## 📝 Quick Copy-Paste

### Login Request
```http
POST http://localhost:9092/api/users/login
Content-Type: application/json

{
  "email": "spyajupratha31@gmail.com",
  "password": "your-password"
}
```

### Authenticated Request (Example)
```http
GET http://localhost:9092/api/users/1
Authorization: Bearer YOUR_TOKEN_HERE
```

---

## 🐛 Troubleshooting

### Issue: 401 Unauthorized

**Possible causes:**
- Wrong email or password
- User not registered
- Password doesn't match

**Solution:**
- Verify email is correct
- Check password (case-sensitive)
- Ensure user was registered successfully

### Issue: 500 Internal Server Error

**Possible causes:**
- Backend error
- Database connection issue

**Solution:**
- Check backend console for errors
- Verify database is running
- Check backend logs

### Issue: CORS Error

**Solution:**
- CORS is already configured ✅
- Ensure backend is running on port 9092
- Check SecurityConfig has CORS enabled

---

## ✅ Test Checklist

- [ ] User registered successfully
- [ ] Backend running on port 9092
- [ ] Postman request configured
- [ ] Email and password correct
- [ ] Login successful (200 OK)
- [ ] Token received in response
- [ ] Token works for authenticated requests

---

## 🎯 Complete Login Flow

1. **Register User** → Get user created
2. **Login** → Get JWT token
3. **Use Token** → Make authenticated requests

---

## 📸 Expected Response Screenshot Guide

**Success Response:**
```
Status: 200 OK
Body:
{
  "token": "eyJhbGc...",
  "username": "spyajupratha31@gmail.com",
  "role": "STUDENT"
}
```

**Error Response:**
```
Status: 401 Unauthorized
Body: "Invalid email or password"
```

---

## 🎉 You're Ready!

Follow these steps to test login. Make sure you use the correct password that was set during registration!

