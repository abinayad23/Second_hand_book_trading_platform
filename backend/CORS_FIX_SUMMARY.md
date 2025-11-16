# CORS Configuration Fix

## Problem
The frontend (running on `http://localhost:5173`) was unable to make requests to the backend (running on `http://localhost:9092`) due to CORS (Cross-Origin Resource Sharing) policy blocking.

**Error Message:**
```
Access to XMLHttpRequest at 'http://localhost:9092/api/users/initiate' from origin 'http://localhost:5173' has been blocked by CORS policy: Response to preflight request doesn't pass access control check: No 'Access-Control-Allow-Origin' header is present on the requested resource.
```

## Solution

### 1. Global CORS Configuration in SecurityConfig
Added a `CorsConfigurationSource` bean in `SecurityConfig.java` that:
- Allows requests from `http://localhost:5173` (Vite default), `http://localhost:3000` (React default), and `http://localhost:5174` (Vite alternate)
- Allows all HTTP methods (GET, POST, PUT, DELETE, OPTIONS, PATCH)
- Allows all headers
- Enables credentials (for JWT tokens)
- Sets max age to 3600 seconds

### 2. Controller-Level CORS Annotations
Added `@CrossOrigin` annotations to all REST controllers:
- `UserController` - For authentication and user management
- `BookController` - For book operations
- `ReviewController` - For review operations
- `AdminController` - For admin operations
- `AuthController` - For authentication endpoints
- `ChatController` - Updated to include port 5173

## Files Modified

1. **backend/backend/campusLink/src/main/java/edu/gct/campusLink/config/SecurityConfig.java**
   - Added `CorsConfigurationSource` bean
   - Added `.cors()` configuration to SecurityFilterChain

2. **All Controller files:**
   - `UserController.java`
   - `BookController.java`
   - `ReviewController.java`
   - `AdminController.java`
   - `AuthController.java`
   - `ChatController.java`

## Testing

After restarting the backend server, the frontend should now be able to:
- ✅ Register new users (`/api/users/initiate`)
- ✅ Login (`/api/users/login`)
- ✅ Make all API calls without CORS errors

## Important Notes

1. **Local Development Only**: These CORS settings are configured for local development only. For production, you should:
   - Restrict allowed origins to your actual frontend domain
   - Use environment variables for configuration
   - Consider using a reverse proxy (nginx) to handle CORS

2. **Credentials**: `allowCredentials = true` is enabled to support JWT token authentication. This is necessary for the Authorization header to work properly.

3. **Preflight Requests**: The configuration handles OPTIONS preflight requests automatically, which browsers send before actual POST/PUT/DELETE requests.

## Next Steps

1. **Restart the backend server** for changes to take effect
2. **Clear browser cache** if issues persist
3. **Test registration** from the frontend

If you still encounter CORS errors after restarting:
- Verify the backend is running on port 9092
- Check browser console for specific error messages
- Ensure the frontend is running on one of the allowed ports (5173, 3000, or 5174)

