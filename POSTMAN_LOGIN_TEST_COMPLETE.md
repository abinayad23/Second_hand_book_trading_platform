# 🔐 Login Testing Guide - Postman

## ✅ Registration Successful!

Your user was created successfully:
- **ID:** 20
- **Email:** sonanagarajan076@gmail.com
- **Username:** sonanagarajan076@gmail.com
- **Role:** STUDENT
- **Status:** Verified ✅

---

## 🔑 Important: Password for Login

**⚠️ CRITICAL:** You must use the **ORIGINAL PLAIN PASSWORD** you sent during registration, NOT the encrypted one!

- ❌ **DON'T USE:** `$2a$10$W6C/O7pUwsMTz7OR/9JXm.CrRRNQcJdACP0UImEuJl0he2uPgRJhS` (this is encrypted)
- ✅ **USE:** The password you sent in Step 3 registration (e.g., `"password123"`)

---

## 🧪 Test Login in Postman

### Option 1: `/api/users/login` (Recommended)

**Method:** `POST`  
**URL:** `http://localhost:9092/api/users/login`

**Headers:**
```
Content-Type: application/json
```

**Body (JSON):**
```json
{
  "email": "sonanagarajan076@gmail.com",
  "password": "YOUR_ORIGINAL_PASSWORD_HERE"
}
```

**Replace `YOUR_ORIGINAL_PASSWORD_HERE`** with the password you used during registration!

---

### Expected Response (Success - 200 OK)

```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "username": "sonanagarajan076@gmail.com",
  "role": "STUDENT"
}
```

**Save the `token`** - you'll need it for authenticated requests!

---

### Expected Response (Error - 401 Unauthorized)

```json
"Invalid email or password"
```

**If you get this error:**
1. ✅ Check email is correct: `sonanagarajan076@gmail.com`
2. ✅ Check password is the **ORIGINAL** one from registration (not encrypted)
3. ✅ Make sure you're using the exact password you sent in Step 3

---

### Option 2: `/api/auth/login` (Alternative)

**Method:** `POST`  
**URL:** `http://localhost:9092/api/auth/login`

**Headers:**
```
Content-Type: application/json
```

**Body (JSON):**
```json
{
  "email": "sonanagarajan076@gmail.com",
  "password": "YOUR_ORIGINAL_PASSWORD_HERE"
}
```

**Expected Response:**
```
✅ Login successful! Token: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

---

## 🐛 Common Login Issues

### Issue 1: "Invalid email or password"

**Causes:**
- Wrong password (using encrypted password instead of plain)
- Wrong email
- Password doesn't match what was used during registration

**Fix:**
- Use the **exact same password** you sent in Step 3 registration
- Check email spelling: `sonanagarajan076@gmail.com`

### Issue 2: 401 Unauthorized

**Causes:**
- Authentication failed
- Password encryption mismatch

**Fix:**
- Verify you're using the original plain password
- Check backend console for error details

### Issue 3: 500 Internal Server Error

**Causes:**
- Backend error
- Database connection issue

**Fix:**
- Check backend console for error logs
- Verify backend is running
- Check database connection

---

## 📋 Complete Test Flow

### Step 1: Registration (Already Done ✅)
```
POST http://localhost:9092/api/auth/send-otp
POST http://localhost:9092/api/users/verify?otp=XXXXXX
```

### Step 2: Login (Test Now)
```
POST http://localhost:9092/api/users/login
{
  "email": "sonanagarajan076@gmail.com",
  "password": "YOUR_ORIGINAL_PASSWORD"
}
```

### Step 3: Use Token for Authenticated Requests
```
GET http://localhost:9092/api/users
Authorization: Bearer YOUR_TOKEN_HERE
```

---

## 🔍 Debug: Check What Password Was Used

If you forgot the password you used during registration, check:

1. **Postman History** - Look at your Step 3 request body
2. **Backend Console** - May show the password in logs (if logging is enabled)
3. **Frontend** - If you registered via frontend, check browser console

**Note:** The stored password is encrypted, so you can't retrieve the original. You must use the same password you sent during registration.

---

## ✅ Quick Test

1. **Open Postman**
2. **Create new POST request**
3. **URL:** `http://localhost:9092/api/users/login`
4. **Body (JSON):**
   ```json
   {
     "email": "sonanagarajan076@gmail.com",
     "password": "password123"
   }
   ```
5. **Send** - Should return token if password is correct!

---

## 🎯 What Password Did You Use?

During Step 3 registration, you sent a `password` field. **That exact value** is what you need for login.

For example, if you sent:
```json
{
  "password": "password123",
  ...
}
```

Then use `"password123"` for login!

---

Try it now and let me know what response you get! 🚀

