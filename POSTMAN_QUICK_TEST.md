# 🚀 Quick Postman Test - OTP System

## Step-by-Step Testing

### 1️⃣ Send OTP

**Request:**
```
POST http://localhost:9092/api/auth/send-otp
```

**Headers:**
```
Content-Type: application/json
```

**Body (raw JSON):**
```json
{
  "email": "test@example.com",
  "useEmail": true
}
```

**What to do:**
1. Click **Send**
2. Check **Response** - Should be `200 OK`
3. **IMPORTANT:** Check **backend console** - OTP will be printed there!
4. **Copy the OTP** (e.g., `123456`)

---

### 2️⃣ Verify OTP

**Request:**
```
POST http://localhost:9092/api/auth/verify-otp
```

**Headers:**
```
Content-Type: application/json
```

**Body (raw JSON):**
```json
{
  "email": "test@example.com",
  "otp": "123456"
}
```

**Replace `123456` with the OTP from Step 1!**

**What to do:**
1. Paste the OTP from backend console
2. Click **Send**
3. Check **Response** - Should be `200 OK` with `"success": true`

---

## ✅ Expected Responses

### Send OTP (Success)
```json
{
  "message": "OTP sent successfully to test@example.com",
  "success": true
}
```

### Verify OTP (Success)
```json
{
  "message": "OTP verified successfully",
  "success": true
}
```

### Verify OTP (Invalid/Expired)
```json
{
  "error": "Invalid or expired OTP",
  "success": false
}
```

---

## 🎯 Test Scenarios

### ✅ Valid Flow
1. Send OTP → Get `200 OK`
2. Copy OTP from console
3. Verify OTP → Get `200 OK` with `success: true`

### ❌ Invalid OTP
1. Send OTP → Get OTP from console
2. Verify with wrong OTP (e.g., `999999`) → Get `400` error

### ⏰ Expired OTP
1. Send OTP → Get OTP from console
2. **Wait 6 minutes** (more than 5-minute expiry)
3. Verify OTP → Get `400` error (expired)

### 🔄 One-Time Use
1. Send OTP → Get OTP from console
2. Verify OTP → Get `200 OK` ✅
3. Verify same OTP again → Get `400` error ❌ (already used)

---

## 📝 Quick Copy-Paste

### Send OTP
```http
POST http://localhost:9092/api/auth/send-otp
Content-Type: application/json

{"email":"test@example.com","useEmail":true}
```

### Verify OTP (replace OTP!)
```http
POST http://localhost:9092/api/auth/verify-otp
Content-Type: application/json

{"email":"test@example.com","otp":"123456"}
```

---

## 🐛 Troubleshooting

**CORS Error?**
- Backend CORS is configured ✅
- Ensure backend is running on port 9092

**401 Unauthorized?**
- Check SecurityConfig - OTP endpoints should be in `permitAll()`
- Restart backend

**OTP Not in Console?**
- Check backend console output
- Ensure backend is running
- Check request reached backend

**Always Invalid OTP?**
- Use OTP from **most recent** send request
- Check OTP hasn't expired (5 minutes)
- Verify email matches exactly
- Check OTP wasn't already used

---

## 🎉 That's It!

Follow these steps to test the OTP system. The OTP will appear in your backend console, making it easy to test!

