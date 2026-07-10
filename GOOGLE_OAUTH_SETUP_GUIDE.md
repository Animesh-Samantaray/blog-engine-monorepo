# Google OAuth 2.0 Integration Setup Guide

This guide provides step-by-step instructions for integrating Google Authentication into your MERN Blog Management System using Passport.js.

## Prerequisites

- Node.js and npm installed
- MongoDB running locally or on MongoDB Atlas
- Google Account for OAuth configuration
- Your existing MERN Blog Management System

## Step 1: Install Required Backend Packages

Navigate to your server directory and install the required packages:

```bash
cd server
npm install passport passport-google-oauth20 express-session
```

## Step 2: Google Cloud Console Configuration

### 2.1 Create a Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Sign in with your Google account
3. Click on the project dropdown in the top navigation bar
4. Click "New Project"
5. Enter a project name (e.g., "Blog Management System")
6. Click "Create"
7. Wait for the project to be created (this may take a few minutes)
8. Select your new project from the dropdown

### 2.2 Enable Google+ API

1. In the left sidebar, navigate to "APIs & Services" > "Library"
2. Search for "Google+ API"
3. Click on it and click "Enable"
4. Wait for the API to be enabled

### 2.3 Configure OAuth Consent Screen

1. Navigate to "APIs & Services" > "OAuth consent screen"
2. Choose "External" user type (for production use)
3. Click "Create"
4. Fill in the required fields:
   - **App name**: Your Blog Management System
   - **User support email**: Your email address
   - **Developer contact information**: Your email address
5. Click "Save and Continue"
6. Skip the "Scopes" section (click "Save and Continue")
7. Skip the "Test users" section (click "Save and Continue")
8. Click "Back to Dashboard"

### 2.4 Create OAuth 2.0 Credentials

1. Navigate to "APIs & Services" > "Credentials"
2. Click "Create Credentials" > "OAuth client ID"
3. Select "Web application" as the application type
4. Fill in the required fields:
   - **Name**: Blog Management System Web Client
   - **Authorized JavaScript origins**: 
     - `http://localhost:5173` (for development)
     - `https://yourdomain.com` (for production)
   - **Authorized redirect URIs**:
     - `http://localhost:5000/api/auth/google/callback` (for development)
     - `https://yourdomain.com/api/auth/google/callback` (for production)
5. Click "Create"
6. Copy the **Client ID** and **Client Secret** - you'll need these for your `.env` file

## Step 3: Configure Environment Variables

Create or update your `.env` file in the server directory with the following variables:

```env
# MongoDB Connection
MONGODB_URI=mongodb://localhost:27017/blog-management

# Server Configuration
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:5173

# JWT Secret
JWT_SECRET=your-jwt-secret-key-here

# Google OAuth Configuration
GOOGLE_CLIENT_ID=your-google-client-id-here
GOOGLE_CLIENT_SECRET=your-google-client-secret-here
GOOGLE_CALLBACK_URL=http://localhost:5000/api/auth/google/callback

# Session Secret
SESSION_SECRET=your-session-secret-key-here
```

**Important Notes:**
- Replace `your-google-client-id-here` with the Client ID from Google Cloud Console
- Replace `your-google-client-secret-here` with the Client Secret from Google Cloud Console
- For production, update the URLs to match your production domain
- Generate strong random secrets for JWT_SECRET and SESSION_SECRET

## Step 4: Backend Implementation

### 4.1 Update User Model

The User model has been updated to:
- Make password optional for Google OAuth users
- Add `googleId` field for Google account linking

### 4.2 Create AdminEmail Model

A new model has been created to manage admin roles separately from user accounts.

### 4.3 Configure Passport.js

The Passport configuration file (`server/configs/passport.js`) has been created with:
- Google OAuth 2.0 strategy
- User creation/login logic
- Role assignment based on AdminEmail collection
- Session serialization/deserialization

### 4.4 Add Google OAuth Routes

The auth routes have been updated to include:
- `GET /api/auth/google` - Initiates Google OAuth flow
- `GET /api/auth/google/callback` - Handles Google OAuth callback

### 4.5 Add Admin Management Endpoints

New admin management endpoints:
- `POST /api/admin/add-admin` - Add email to admin list
- `DELETE /api/admin/remove-admin` - Remove email from admin list

### 4.6 Update Server Configuration

The server.js file has been updated to:
- Import and configure express-session
- Initialize Passport.js
- Configure session middleware

## Step 5: Frontend Implementation

### 5.1 Add Google OAuth Buttons

Google OAuth buttons have been added to:
- Login page (`client/src/pages/Login.jsx`)
- Register page (`client/src/pages/Register.jsx`)

Both buttons use official Google branding and redirect to the Google OAuth endpoint.

### 5.2 Update Auth Context

The AuthContext already handles authentication through the existing `/profile` endpoint, which will work seamlessly with Google OAuth users since they receive the same JWT cookie.

## Step 6: Client Environment Variables

Add the following to your client `.env` file:

```env
VITE_API_URL=http://localhost:5000
```

## Step 7: Testing the Integration

### 7.1 Start MongoDB

Ensure MongoDB is running:
```bash
# If using local MongoDB
mongod

# If using MongoDB Atlas, ensure your connection string is correct in .env
```

### 7.2 Start the Backend Server

```bash
cd server
npm run dev
```

The server should start on port 5000 (or your configured PORT).

### 7.3 Start the Frontend Development Server

```bash
cd client
npm run dev
```

The frontend should start on port 5173.

### 7.4 Test Google OAuth Flow

1. Navigate to `http://localhost:5173/login`
2. Click "Continue with Google"
3. You should be redirected to Google's OAuth consent screen
4. Sign in with your Google account
5. Grant permissions to your application
6. You should be redirected back to your application's home page
7. Check that you're logged in with your Google account information

### 7.5 Test Admin Role Management

1. Log in as an existing admin (via email/password)
2. Use the admin dashboard to add a Google email to the admin list:
   ```bash
   POST /api/admin/add-admin
   {
     "email": "google-user@gmail.com"
   }
   ```
3. Log out and log in with the Google account
4. Verify that the Google user now has admin role

## Step 8: Production Deployment

### 8.1 Update Google Cloud Console for Production

1. Go to Google Cloud Console > Credentials
2. Edit your OAuth client ID
3. Add your production domain to:
   - Authorized JavaScript origins
   - Authorized redirect URIs
4. Save changes

### 8.2 Update Environment Variables for Production

Update your production `.env` file with:
- Production URLs for CLIENT_URL and GOOGLE_CALLBACK_URL
- Production MongoDB connection string
- Strong secrets for JWT_SECRET and SESSION_SECRET

### 8.3 Configure HTTPS

Google OAuth requires HTTPS in production:
- Use a reverse proxy (nginx, Apache) with SSL certificates
- Or use a platform that provides HTTPS (Vercel, Netlify, Heroku, etc.)

## Common Errors and Solutions

### Error: "redirect_uri_mismatch"

**Cause:** The redirect URI in Google Cloud Console doesn't match the callback URL in your application.

**Solution:**
1. Check your `.env` file for `GOOGLE_CALLBACK_URL`
2. Ensure it exactly matches one of the Authorized redirect URIs in Google Cloud Console
3. Include the full URL with protocol (http:// or https://)

### Error: "unauthorized_client"

**Cause:** The Client ID or Client Secret is incorrect.

**Solution:**
1. Verify your Client ID and Client Secret in Google Cloud Console
2. Ensure they're correctly set in your `.env` file
3. Restart your server after updating environment variables

### Error: "access_denied"

**Cause:** User denied access or OAuth consent screen is not properly configured.

**Solution:**
1. Ensure OAuth consent screen is properly configured
2. Check that your app is in "Testing" mode and your email is added as a test user
3. For production, ensure your app is verified by Google

### Error: "Session expired"

**Cause:** Session cookie expired or session secret changed.

**Solution:**
1. Check your SESSION_SECRET in `.env`
2. Ensure it's consistent across server restarts
3. Consider increasing session duration if needed

### Error: "CORS issues"

**Cause:** Frontend and backend origins not properly configured.

**Solution:**
1. Ensure your backend CORS configuration includes your frontend URL
2. Check that your Google OAuth redirect URIs are correct
3. Verify your CLIENT_URL in `.env` matches your frontend URL

## Security Best Practices

1. **Never commit `.env` files** to version control
2. **Use strong, random secrets** for JWT_SECRET and SESSION_SECRET
3. **Enable HTTPS** in production for OAuth to work properly
4. **Regularly rotate** your OAuth secrets
5. **Limit OAuth scopes** to only what your application needs
6. **Implement rate limiting** on OAuth endpoints
7. **Monitor OAuth usage** in Google Cloud Console for suspicious activity
8. **Keep dependencies updated** to patch security vulnerabilities

## API Endpoints Reference

### Authentication Endpoints
- `POST /api/auth/register` - Register with email/password
- `POST /api/auth/login` - Login with email/password
- `POST /api/auth/logout` - Logout user
- `GET /api/auth/google` - Initiate Google OAuth
- `GET /api/auth/google/callback` - Google OAuth callback

### Admin Management Endpoints
- `POST /api/admin/add-admin` - Add email to admin list
- `DELETE /api/admin/remove-admin` - Remove email from admin list

### Profile Endpoint
- `GET /api/profile` - Get current user profile (used for authentication check)

## Troubleshooting Checklist

If Google OAuth is not working:

1. ✅ Verify Google Cloud Console configuration
2. ✅ Check environment variables are set correctly
3. ✅ Ensure MongoDB is running
4. ✅ Check server logs for error messages
5. ✅ Verify callback URL matches exactly
6. ✅ Check that OAuth consent screen is configured
7. ✅ Ensure your email is added as a test user (for testing mode)
8. ✅ Verify CORS configuration
9. ✅ Check that Passport.js is properly initialized
10. ✅ Test with incognito/private browser mode

## Additional Resources

- [Passport.js Documentation](http://www.passportjs.org/)
- [Google OAuth 2.0 Documentation](https://developers.google.com/identity/protocols/oauth2)
- [Google Cloud Console](https://console.cloud.google.com/)
- [Express Session Documentation](https://github.com/expressjs/session)

## Support

If you encounter issues not covered in this guide:

1. Check the browser console for JavaScript errors
2. Check the server terminal for backend errors
3. Verify all configurations match the setup instructions
4. Ensure all environment variables are properly set
5. Test with a fresh browser session (incognito mode)

---

**Note:** This integration preserves all existing email/password authentication functionality while adding Google OAuth as an additional login method. Both authentication methods work seamlessly together.
