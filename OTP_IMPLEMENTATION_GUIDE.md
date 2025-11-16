# OTP Verification System - Complete Implementation Guide

## ✅ What's Been Implemented

### Backend (Spring Boot)

1. **OTPService.java** - Enhanced OTP service with:
   - 6-digit OTP generation
   - 5-minute expiration
   - One-time use (auto-delete after verification)
   - In-memory storage with timestamp tracking

2. **EmailService.java** - Email service for sending OTP:
   - Uses JavaMailSender
   - Falls back to console logging if email not configured
   - Works in development without email setup

3. **AuthController.java** - New OTP endpoints:
   - `POST /api/auth/send-otp` - Send OTP to email/phone
   - `POST /api/auth/verify-otp` - Verify OTP

4. **UserServiceImpl.java** - Updated to use new OTP system:
   - Uses new OTPService with expiration
   - Sends OTP via EmailService
   - Enhanced password handling

5. **pom.xml** - Added `spring-boot-starter-mail` dependency

6. **application.properties** - Email configuration added

### Frontend (React + TypeScript)

1. **OTPVerification.tsx** - Complete OTP input component:
   - 6-digit input boxes
   - Auto-focus and paste support
   - 5-minute countdown timer
   - Resend OTP functionality
   - Beautiful Tailwind UI

2. **otp.ts** - API service for OTP operations

3. **Register.tsx** - Updated registration flow:
   - Step 1: Fill registration form
   - Step 2: Verify OTP
   - Step 3: Complete registration

## 📁 File Structure

```
backend/
├── src/main/java/edu/gct/campusLink/
│   ├── service/
│   │   ├── OTPService.java          ✅ NEW
│   │   ├── EmailService.java        ✅ NEW
│   │   └── UserServiceImpl.java     ✅ UPDATED
│   └── controller/
│       └── AuthController.java      ✅ UPDATED
├── src/main/resources/
│   └── application.properties        ✅ UPDATED
└── pom.xml                           ✅ UPDATED

frontend/
├── src/
│   ├── api/
│   │   └── otp.ts                   ✅ NEW
│   ├── components/
│   │   └── OTPVerification.tsx      ✅ NEW
│   └── pages/
│       └── Register.tsx              ✅ UPDATED
```

## 🚀 Setup Instructions

### Backend Setup

1. **Add Mail Dependency** (Already added to pom.xml):
   ```xml
   <dependency>
       <groupId>org.springframework.boot</groupId>
       <artifactId>spring-boot-starter-mail</artifactId>
   </dependency>
   ```

2. **Configure Email** (Optional - for development, OTP prints to console):
   
   Edit `application.properties`:
   ```properties
   # Gmail SMTP Configuration
   spring.mail.host=smtp.gmail.com
   spring.mail.port=587
   spring.mail.username=your-email@gmail.com
   spring.mail.password=your-app-password
   spring.mail.properties.mail.smtp.auth=true
   spring.mail.properties.mail.smtp.starttls.enable=true
   spring.mail.properties.mail.smtp.starttls.required=true
   ```

   **For Gmail:**
   - Enable 2-factor authentication
   - Generate an "App Password" (not your regular password)
   - Use the app password in `spring.mail.password`

3. **Rebuild and Restart**:
   ```bash
   cd backend/backend/campusLink
   mvn clean install
   # Restart your Spring Boot application
   ```

### Frontend Setup

1. **Install Dependencies** (if needed):
   ```bash
   cd frontend
   npm install
   ```

2. **Run Frontend**:
   ```bash
   npm run dev
   ```

## 🧪 Testing the OTP System

### Test Without Email Configuration

1. **Start Backend** (without email config)
2. **Register a new user**:
   - Fill registration form
   - Click "Send OTP"
   - **Check backend console** - OTP will be printed:
     ```
     ========================================
     EMAIL OTP (Mail not configured):
     To: user@example.com
     OTP: 123456
     ========================================
     ```
3. **Enter OTP** in frontend
4. **Verify** - Registration completes

### Test With Email Configuration

1. **Configure Gmail SMTP** in `application.properties`
2. **Start Backend**
3. **Register a new user**:
   - Fill registration form
   - Click "Send OTP"
   - **Check email inbox** for OTP
4. **Enter OTP** in frontend
5. **Verify** - Registration completes

### API Testing (Postman/curl)

**Send OTP:**
```bash
POST http://localhost:9092/api/auth/send-otp
Content-Type: application/json

{
  "email": "test@example.com",
  "useEmail": true
}
```

**Verify OTP:**
```bash
POST http://localhost:9092/api/auth/verify-otp
Content-Type: application/json

{
  "email": "test@example.com",
  "otp": "123456"
}
```

## 📋 OTP Rules

✅ **6-digit OTP** (000000 - 999999)  
✅ **5-minute expiration**  
✅ **One-time use** (deleted after verification)  
✅ **In-memory storage** (HashMap with timestamp)  
✅ **Auto-cleanup** of expired OTPs  

## 🔧 How It Works

### Registration Flow

1. **User fills registration form** → Clicks "Send OTP"
2. **Backend generates OTP** → Stores with timestamp
3. **Email sent** (or printed to console)
4. **User enters OTP** → Frontend sends to `/api/auth/verify-otp`
5. **Backend verifies**:
   - Checks if OTP exists
   - Checks if not expired (5 minutes)
   - Checks if matches
   - Deletes OTP after use
6. **Registration completes** → User created in database

### OTP Storage

```java
// In-memory storage
Map<String, OTPData> otpStore
// Key: email/phone
// Value: {otp: "123456", timestamp: LocalDateTime}
```

### Expiration Logic

```java
// Check expiration
long minutesElapsed = ChronoUnit.MINUTES.between(timestamp, now);
if (minutesElapsed > 5) {
    // Expired - remove and reject
}
```

## 🎨 Frontend Features

### OTPVerification Component

- ✅ **6 input boxes** for OTP digits
- ✅ **Auto-focus** next input on typing
- ✅ **Paste support** (paste 6-digit code)
- ✅ **Backspace navigation** (goes to previous input)
- ✅ **5-minute countdown timer**
- ✅ **Resend OTP** button (after expiration)
- ✅ **Loading states** and error handling
- ✅ **Beautiful Tailwind UI**

## 🐛 Troubleshooting

### OTP Not Received

1. **Check backend console** - OTP is always printed there
2. **Check email spam folder** (if email configured)
3. **Verify email configuration** in `application.properties`
4. **Check CORS** - Ensure frontend can call backend

### OTP Expired

- OTPs expire after 5 minutes
- Click "Resend OTP" to get a new one
- Timer shows remaining time

### Invalid OTP

- Ensure you're entering the correct 6-digit code
- Check backend console for the actual OTP
- OTP can only be used once

### Email Not Sending

- **Development mode**: OTP prints to console (this is normal)
- **Production mode**: Configure SMTP in `application.properties`
- Check Gmail app password (not regular password)

## 📝 Notes

1. **Development Mode**: Email service works without configuration - OTP prints to console
2. **Production Mode**: Configure SMTP for actual email sending
3. **Security**: OTPs are stored in memory (not database) - they're cleared on server restart
4. **Expiration**: OTPs auto-expire after 5 minutes
5. **One-time Use**: Each OTP can only be used once

## ✅ Complete Checklist

- [x] Backend OTP service with expiration
- [x] Email service for sending OTP
- [x] OTP endpoints (`/api/auth/send-otp`, `/api/auth/verify-otp`)
- [x] Frontend OTP input component
- [x] Registration flow integration
- [x] Timer and resend functionality
- [x] Error handling
- [x] CORS configuration
- [x] Documentation

## 🎉 You're All Set!

The OTP system is fully functional. Test it by:
1. Starting the backend
2. Opening the frontend registration page
3. Filling the form and sending OTP
4. Checking console/email for OTP
5. Entering OTP and completing registration

