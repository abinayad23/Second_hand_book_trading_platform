# 🔧 Step 3 Registration Fix - Quick Guide

## ⚠️ IMPORTANT: The Issue

The problem is likely that **OTP is being deleted too early** or the **endpoint isn't being called correctly**.

## ✅ Fixed Issues

1. ✅ Added comprehensive logging
2. ✅ Better error handling
3. ✅ OTP verification allows two-step process

---

## 🧪 Test Step 3 in Postman

### Complete Registration Request

**Method:** `POST`  
**URL:** `http://localhost:9092/api/users/verify?otp=123456`

**⚠️ CRITICAL:** Replace `123456` with the **actual OTP** from Step 1!

### Headers

```
Content-Type: application/json
```

### Body (JSON)

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

---

## 🔍 What to Check

### 1. Backend Console Logs

After sending the request, check your backend console. You should see:

```
========================================
REGISTRATION REQUEST RECEIVED:
Email: testuser@example.com
Name: Test User
OTP: 123456
========================================
```

**If you DON'T see this:**
- Request not reaching backend
- Check URL is correct
- Check backend is running

### 2. OTP Verification

You should see:
```
OTP Key: testuser@example.com
Is First Year: false
Verifying OTP...
OTP Valid: true
```

**If `OTP Valid: false`:**
- OTP expired (wait > 5 minutes)
- Wrong OTP
- Email mismatch

### 3. Database Save

You should see:
```
✅ OTP verified successfully
Setting password (encrypted)...
Saving user to database...
✅ User saved with ID: 1
```

**If you see database error:**
- Check MySQL is running
- Check database connection

---

## 🐛 Common Problems

### Problem 1: "Invalid or expired OTP"

**Solution:**
1. Send NEW OTP (Step 1 again)
2. Use OTP IMMEDIATELY (within 5 minutes)
3. Make sure email matches exactly

### Problem 2: No logs in console

**Solution:**
- Backend not running → Start it
- Wrong URL → Check it's `http://localhost:9092/api/users/verify?otp=...`
- Request not sent → Check Postman

### Problem 3: Database error

**Solution:**
- Check MySQL is running
- Verify database `campuslink` exists
- Check credentials in `application.properties`

---

## ✅ Quick Test

1. **Restart backend** (to load new logging)
2. **Send OTP** → Get OTP from console
3. **Complete Registration** → Use same OTP
4. **Check console** → Should see "User saved with ID: X"
5. **Verify** → `GET http://localhost:9092/api/users`

---

## 📋 Exact Request Format

```
POST http://localhost:9092/api/users/verify?otp=YOUR_OTP_HERE
Content-Type: application/json

{
  "name": "Your Name",
  "email": "your-email@example.com",
  "password": "your-password",
  "department": "Your Department",
  "phone": "your-phone",
  "registerNumber": "your-register-number",
  "isFirstYear": false,
  "dateOfBirth": null,
  "location": null
}
```

**Replace:**
- `YOUR_OTP_HERE` → Actual OTP from Step 1
- All other fields → Your actual data

---

## 🎯 Expected Response

**Success (200 OK):**
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

**Error (400 Bad Request):**
```json
{
  "error": "Invalid or expired OTP"
}
```

---

Try this and **check your backend console** - the logs will show exactly what's happening!

