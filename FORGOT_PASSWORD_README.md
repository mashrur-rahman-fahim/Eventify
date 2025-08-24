# Forgot Password System

This document describes the forgot password functionality implemented in the Eventify application.

## Overview

The forgot password system allows users to reset their password if they forget it. The system includes:

1. **Forgot Password Page** - Users enter their email to request a password reset
2. **Password Reset Email** - A secure email with a reset link is sent to the user
3. **Reset Password Page** - Users can set a new password using the reset link

## Backend Implementation

### New Fields Added to User Model

```javascript
// Password reset fields
resetPasswordToken: {
  type: String,
  default: null,
},
resetPasswordExpires: {
  type: Date,
  default: null,
},
```

### New API Endpoints

1. **POST /api/forgot-password**

   - Request body: `{ email: string }`
   - Generates a reset token and sends reset email
   - Returns: `{ message: "Password reset email sent successfully" }`

2. **POST /api/reset-password**

   - Request body: `{ token: string, newPassword: string }`
   - Validates token and updates password
   - Returns: `{ message: "Password reset successfully" }`

3. **GET /api/verify-reset-token/:token**
   - Validates if a reset token is valid and not expired
   - Returns: `{ message: "Token is valid" }` or error

### Email Service

Added `sendPasswordResetEmail` function that sends a styled HTML email with:

- Reset link with token
- Expiration information (1 hour)
- Fallback text link

## Frontend Implementation

### New Pages

1. **ForgotPasswordPage** (`/forgot-password`)

   - Email input form
   - Validation and error handling
   - Success/error messages
   - DaisyUI styling with Tailwind

2. **ResetPasswordPage** (`/reset-password/:token`)
   - Token validation on page load
   - New password and confirm password inputs
   - Password visibility toggles
   - Automatic redirect to login after success

### Features

- **Responsive Design**: Works on all screen sizes
- **Theme Support**: Integrates with existing theme system
- **Loading States**: Shows loading spinners during API calls
- **Error Handling**: Comprehensive error messages
- **Validation**: Client-side form validation
- **Security**: Token expiration (1 hour)

### API Integration

Added `forgotPasswordAPI` object in `api.js` with:

- `requestPasswordReset(email)`
- `resetPassword(token, newPassword)`
- `verifyResetToken(token)`

## Security Features

1. **Token Generation**: Uses crypto.randomBytes(32) for secure tokens
2. **Token Expiration**: Tokens expire after 1 hour
3. **One-time Use**: Tokens are cleared after password reset
4. **Email Validation**: Verifies user exists before sending email
5. **Password Validation**: Minimum 6 characters required

## User Flow

1. User clicks "Forgot password?" on login page
2. User enters email on forgot password page
3. System sends reset email with secure link
4. User clicks link in email
5. User enters new password on reset page
6. System validates token and updates password
7. User is redirected to login page

## Environment Variables Required

Make sure these environment variables are set in your backend:

```env
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
EMAIL_FROM=your-email@gmail.com
FRONTEND_URL=http://localhost:5173
```

## Testing

To test the forgot password system:

1. Start both backend and frontend servers
2. Go to `/login` and click "Forgot password?"
3. Enter a valid email address
4. Check your email for the reset link
5. Click the link and set a new password
6. Try logging in with the new password

## Styling

The pages use DaisyUI components with Tailwind CSS:

- Cards with backdrop blur effects
- Gradient backgrounds
- Responsive design
- Loading spinners
- Alert components for messages
- Consistent with existing app design
