# 📧 Email Setup Guide - Send OTP to Email

## Quick Setup for Gmail

### Step 1: Enable 2-Step Verification

1. Go to [Google Account Security](https://myaccount.google.com/security)
2. Enable **2-Step Verification** (if not already enabled)

### Step 2: Generate App Password

1. Go to [App Passwords](https://myaccount.google.com/apppasswords)
2. Select **Mail** as the app
3. Select **Other (Custom name)** as device
4. Enter "CampusLink" as the name
5. Click **Generate**
6. **Copy the 16-character password** (it looks like: `abcd efgh ijkl mnop`)

### Step 3: Configure application.properties

Edit `backend/backend/campusLink/src/main/resources/application.properties`:

```properties
spring.mail.host=smtp.gmail.com
spring.mail.port=587
spring.mail.username=your-actual-email@gmail.com
spring.mail.password=abcd efgh ijkl mnop
spring.mail.properties.mail.smtp.auth=true
spring.mail.properties.mail.smtp.starttls.enable=true
spring.mail.properties.mail.smtp.starttls.required=true
```

**Replace:**
- `your-actual-email@gmail.com` → Your Gmail address
- `abcd efgh ijkl mnop` → The 16-character app password (you can remove spaces)

### Step 4: Restart Backend

```bash
# Stop the backend (Ctrl+C)
# Then restart:
mvn spring-boot:run
```

### Step 5: Test

Send OTP request in Postman:
```json
POST http://localhost:9092/api/auth/send-otp
{
  "email": "recipient@example.com",
  "useEmail": true
}
```

**Check the recipient's email inbox** - OTP should arrive within seconds!

---

## Alternative Email Providers

### Outlook/Hotmail

```properties
spring.mail.host=smtp-mail.outlook.com
spring.mail.port=587
spring.mail.username=your-email@outlook.com
spring.mail.password=your-password
spring.mail.properties.mail.smtp.auth=true
spring.mail.properties.mail.smtp.starttls.enable=true
```

### Yahoo Mail

```properties
spring.mail.host=smtp.mail.yahoo.com
spring.mail.port=587
spring.mail.username=your-email@yahoo.com
spring.mail.password=your-app-password
spring.mail.properties.mail.smtp.auth=true
spring.mail.properties.mail.smtp.starttls.enable=true
```

### Custom SMTP Server

```properties
spring.mail.host=your-smtp-server.com
spring.mail.port=587
spring.mail.username=your-username
spring.mail.password=your-password
spring.mail.properties.mail.smtp.auth=true
spring.mail.properties.mail.smtp.starttls.enable=true
```

---

## Troubleshooting

### Email Not Sending

1. **Check backend console** for error messages
2. **Verify app password** - Make sure you're using the app password, not your regular password
3. **Check Gmail settings** - Ensure "Less secure app access" is enabled (if using older method)
4. **Check firewall** - Port 587 should be open
5. **Test connection** - Try sending from another email client first

### Common Errors

**"Authentication failed"**
- Wrong password
- Using regular password instead of app password
- 2-Step Verification not enabled

**"Connection timeout"**
- Firewall blocking port 587
- Network issues
- Wrong SMTP host

**"535-5.7.8 Username and Password not accepted"**
- Need to use App Password (not regular password)
- 2-Step Verification required

---

## Testing Without Email (Development)

If you don't want to configure email, the system will automatically:
- Print OTP to backend console
- Return success response
- Work perfectly for development/testing

Just **comment out** all `spring.mail.*` properties in `application.properties`.

---

## Security Notes

⚠️ **Never commit email passwords to Git!**

Use environment variables or external configuration:

```properties
spring.mail.password=${EMAIL_PASSWORD}
```

Then set environment variable:
```bash
export EMAIL_PASSWORD=your-app-password
```

---

## ✅ Verification

After setup, you should see in backend console:
```
✅ Email sent successfully to: recipient@example.com
   OTP: 123456
```

And the recipient will receive an email with the OTP!

