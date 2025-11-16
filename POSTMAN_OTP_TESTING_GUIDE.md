# 📮 Postman Testing Guide - OTP Verification System

## Prerequisites

- Backend running on `http://localhost:9092`
- Postman installed
- Backend console visible (to see OTP if email not configured)

---

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
  "email": "test@example.com",
  "useEmail": true
}
```

**Alternative (with phone):**
```json
{
  "email": "test@example.com",
  "phone": "+1234567890",
  "useEmail": true
}
```

### Expected Response (Success)

**Status:** `200 OK`

```json
{
  "message": "OTP sent successfully to test@example.com",
  "success": true
}
```

### Expected Response (Error)

**Status:** `400 Bad Request`

```json
{
  "error": "Email is required"
}
```

### What to Check

1. ✅ Response status is `200 OK`
2. ✅ Response contains `"success": true`
3. ✅ **Check backend console** - OTP will be printed:
   ```
   ========================================
   EMAIL OTP (Mail not configured):
   To: test@example.com
   OTP: 123456
   ========================================
   ```
4. ✅ Copy the OTP from console (you'll need it for next step)

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

**Use the OTP from Test 1:**
```json
{
  "email": "test@example.com",
  "otp": "123456"
}
```

**Note:** Replace `"123456"` with the actual OTP from backend console.

### Expected Response (Success)

**Status:** `200 OK`

```json
{
  "message": "OTP verified successfully",
  "success": true
}
```

### Expected Response (Invalid OTP)

**Status:** `400 Bad Request`

```json
{
  "error": "Invalid or expired OTP",
  "success": false
}
```

### Expected Response (Expired OTP)

**Status:** `400 Bad Request`

```json
{
  "error": "Invalid or expired OTP",
  "success": false
}
```

### What to Check

1. ✅ Response status is `200 OK` for valid OTP
2. ✅ Response contains `"success": true`
3. ✅ Response status is `400` for invalid/expired OTP

---

## 🧪 Test 3: Complete Registration Flow

### Step 1: Send OTP for Registration

**Method:** `POST`  
**URL:** `http://localhost:9092/api/auth/send-otp`

**Body:**
```json
{
  "email": "newuser@example.com",
  "useEmail": true
}
```

**Note the OTP from console**

### Step 2: Verify OTP

**Method:** `POST`  
**URL:** `http://localhost:9092/api/auth/verify-otp`

**Body:**
```json
{
  "email": "newuser@example.com",
  "otp": "123456"
}
```

### Step 3: Complete Registration (Using Existing Endpoint)

**Method:** `POST`  
**URL:** `http://localhost:9092/api/users/initiate`

**Body:**
```json
{
  "name": "John Doe",
  "email": "newuser@example.com",
  "password": "password123",
  "department": "Computer Science",
  "phone": "+1234567890",
  "isFirstYear": false
}
```

**Response:** OTP sent message

**Method:** `POST`  
**URL:** `http://localhost:9092/api/users/verify?otp=123456`

**Body:** (Same as above)

**Response:** User object with ID

---

## 📋 Postman Collection Setup

### Create a Collection

1. **Create New Collection:** "CampusLink OTP Testing"
2. **Add Environment Variables:**
   - `base_url`: `http://localhost:9092`
   - `test_email`: `test@example.com`
   - `otp_code`: (will be set manually)

### Request 1: Send OTP

**Name:** `Send OTP`  
**Method:** `POST`  
**URL:** `{{base_url}}/api/auth/send-otp`

**Body (raw JSON):**
```json
{
  "email": "{{test_email}}",
  "useEmail": true
}
```

**Tests Tab (to log OTP):**
```javascript
if (pm.response.code === 200) {
    console.log("Check backend console for OTP!");
    pm.environment.set("otp_sent", "true");
}
```

### Request 2: Verify OTP

**Name:** `Verify OTP`  
**Method:** `POST`  
**URL:** `{{base_url}}/api/auth/verify-otp`

**Body (raw JSON):**
```json
{
  "email": "{{test_email}}",
  "otp": "{{otp_code}}"
}
```

**Tests Tab:**
```javascript
if (pm.response.code === 200) {
    pm.test("OTP verified successfully", function () {
        pm.response.to.have.status(200);
        var jsonData = pm.response.json();
        pm.expect(jsonData.success).to.eql(true);
    });
}
```

---

## 🔍 Testing Scenarios

### Scenario 1: Valid OTP Flow

1. ✅ Send OTP → Get OTP from console
2. ✅ Verify OTP within 5 minutes → Should succeed
3. ✅ Try to verify same OTP again → Should fail (one-time use)

### Scenario 2: Expired OTP

1. ✅ Send OTP → Get OTP from console
2. ⏳ Wait 6 minutes (more than 5-minute expiry)
3. ✅ Try to verify OTP → Should fail with "Invalid or expired OTP"

### Scenario 3: Invalid OTP

1. ✅ Send OTP → Get OTP from console (e.g., `123456`)
2. ✅ Verify with wrong OTP (e.g., `999999`) → Should fail
3. ✅ Verify with correct OTP → Should succeed

### Scenario 4: Missing Email

1. ✅ Send OTP without email:
   ```json
   {
     "useEmail": true
   }
   ```
   → Should return `400 Bad Request` with "Email is required"

### Scenario 5: Multiple OTP Requests

1. ✅ Send OTP for `test@example.com` → Get OTP1
2. ✅ Send OTP again for same email → Get OTP2 (new OTP)
3. ✅ Verify with OTP1 → Should fail (replaced by OTP2)
4. ✅ Verify with OTP2 → Should succeed

---

## 📸 Sample Postman Screenshots Guide

### Request Configuration

**Headers Tab:**
```
Content-Type: application/json
```

**Body Tab:**
- Select: `raw`
- Select: `JSON` (from dropdown)
- Paste JSON body

**Send Button:**
- Click to send request
- Check response in bottom panel

### Response Panel

**Status:** Shows HTTP status code (200, 400, 500, etc.)  
**Time:** Request duration  
**Size:** Response size  
**Body:** JSON response (formatted)

---

## 🐛 Troubleshooting

### Issue: CORS Error

**Error:**
```
Access to XMLHttpRequest blocked by CORS policy
```

**Solution:**
- Ensure backend CORS is configured (already done)
- Check backend is running on port 9092
- Verify `SecurityConfig.java` has CORS enabled

### Issue: 401 Unauthorized

**Error:**
```
401 Unauthorized
```

**Solution:**
- Check `SecurityConfig.java` - `/api/auth/send-otp` and `/api/auth/verify-otp` should be in `permitAll()`
- Restart backend after changes

### Issue: OTP Not Found in Console

**Solution:**
- Check backend console output
- Ensure backend is running
- Check email service is working (or fallback to console)
- Verify request reached backend (check logs)

### Issue: OTP Always Invalid

**Solution:**
- Ensure you're using the OTP from the **most recent** send request
- Check OTP hasn't expired (5 minutes)
- Verify email matches exactly (case-sensitive)
- Check OTP wasn't already used (one-time use)

---

## ✅ Quick Test Checklist

- [ ] Backend running on port 9092
- [ ] Postman installed and open
- [ ] Send OTP request configured
- [ ] OTP received in backend console
- [ ] Verify OTP request configured
- [ ] OTP verified successfully
- [ ] Test expired OTP (wait 6 minutes)
- [ ] Test invalid OTP
- [ ] Test one-time use (verify twice)

---

## 🎯 Quick Copy-Paste Requests

### Send OTP
```http
POST http://localhost:9092/api/auth/send-otp
Content-Type: application/json

{
  "email": "test@example.com",
  "useEmail": true
}
```

### Verify OTP
```http
POST http://localhost:9092/api/auth/verify-otp
Content-Type: application/json

{
  "email": "test@example.com",
  "otp": "123456"
}
```

**Replace `123456` with actual OTP from backend console!**

---

## 📝 Notes

1. **OTP Expiry:** OTPs expire after 5 minutes
2. **One-Time Use:** Each OTP can only be used once
3. **Console Output:** If email not configured, OTP prints to backend console
4. **Email Format:** Email must be valid format (contains `@`)
5. **Case Sensitive:** Email matching is case-sensitive

---

## 🎉 You're Ready!

Follow these steps to test the OTP system in Postman. The OTP will appear in your backend console, making it easy to test without email configuration.

