# Toast Notification System

A comprehensive, responsive toast notification system for the Eventify application using **react-toastify**.

## 🚀 Features

- ✅ **Responsive Design**: Works perfectly on mobile devices
- ✅ **High Z-Index**: Appears above all other elements (z-[9999])
- ✅ **Auto-Dismiss**: Automatically disappears after 5 seconds (configurable)
- ✅ **Manual Close**: Users can manually close toasts
- ✅ **Smooth Animations**: Built-in animations and transitions
- ✅ **Multiple Types**: Success, Error, Warning, Info
- ✅ **Application-Specific**: Pre-built patterns for common app actions
- ✅ **Accessible**: Proper ARIA labels and keyboard navigation
- ✅ **Dark Theme Support**: Automatically adapts to theme changes
- ✅ **Draggable**: Users can drag toasts around
- ✅ **Pause on Hover**: Toasts pause when hovered

## 📦 Installation

The system uses `react-toastify` which is already installed:

```bash
npm install react-toastify
```

## 🎯 Quick Start

### 1. Basic Usage

```jsx
import { appToasts, showToast } from "../utils/toast";

// Basic toast types
showToast.success("Operation completed successfully!", "Success");
showToast.error("Something went wrong!", "Error");
showToast.warning("Please check your input!", "Warning");
showToast.info("Here's some information!", "Info");

// Application-specific toasts
appToasts.loginSuccess();
appToasts.joinRequestSent("Tech Club");
appToasts.eventCreated("Conference 2024");
```

### 2. Toast Container Setup

The `ToastContainer` is already configured in `App.jsx`:

```jsx
<ToastContainer
  position="top-right"
  autoClose={5000}
  hideProgressBar={false}
  newestOnTop={false}
  closeOnClick
  rtl={false}
  pauseOnFocusLoss
  draggable
  pauseOnHover
  theme="light"
  style={{ zIndex: 9999 }}
/>
```

## 📋 Available Toast Methods

### Basic Methods (`showToast`)

- `showToast.success(message, title)` - Green success toast
- `showToast.error(message, title)` - Red error toast
- `showToast.warning(message, title)` - Yellow warning toast
- `showToast.info(message, title)` - Blue info toast

### Application-Specific Methods (`appToasts`)

#### Authentication

- `appToasts.loginSuccess()` - Login success message
- `appToasts.logoutSuccess()` - Logout success message
- `appToasts.registrationSuccess()` - Registration success message
- `appToasts.emailVerificationSuccess()` - Email verification success
- `appToasts.passwordResetSuccess()` - Password reset success

#### Club Management

- `appToasts.clubCreated(clubName)` - Club creation success
- `appToasts.clubUpdated(clubName)` - Club update success
- `appToasts.clubDeleted(clubName)` - Club deletion success
- `appToasts.joinRequestSent(clubName)` - Join request sent
- `appToasts.joinRequestApproved(clubName)` - Join request approved
- `appToasts.joinRequestRejected(clubName)` - Join request rejected

#### Event Management

- `appToasts.eventCreated(eventName)` - Event creation success
- `appToasts.eventUpdated(eventName)` - Event update success
- `appToasts.eventDeleted(eventName)` - Event deletion success
- `appToasts.certificateGenerated(eventName)` - Certificate generation success

#### Profile & Other

- `appToasts.profileUpdated()` - Profile update success

#### Error Handling

- `appToasts.networkError()` - Network connection error
- `appToasts.serverError()` - Server-side error
- `appToasts.validationError(field)` - Form validation error
- `appToasts.permissionDenied()` - Permission denied error
- `appToasts.sessionExpired()` - Session expiration warning

## 📱 Mobile Responsiveness

The toast system is fully responsive:

- **Desktop**: Toasts appear in the top-right corner
- **Mobile**: Toasts span the full width with proper margins
- **Touch-friendly**: Large touch targets for mobile users
- **Readable**: Optimized text size and spacing for mobile screens

### Responsive CSS

```css
@media (max-width: 640px) {
  .Toastify__toast-container {
    width: 100% !important;
    padding: 0 1rem !important;
  }

  .Toastify__toast {
    margin-bottom: 0.5rem !important;
    border-radius: 0.5rem !important;
  }

  .Toastify__toast-body {
    font-size: 0.875rem !important;
    padding: 0.75rem !important;
  }
}
```

## 🎨 Theme Support

The system automatically adapts to theme changes:

### Light Theme

- Success: Green background
- Error: Red background
- Warning: Yellow background
- Info: Blue background

### Dark Theme

- Success: Dark green background
- Error: Dark red background
- Warning: Dark yellow background
- Info: Dark blue background

## 🔧 Configuration

### Toast Configuration (`toastConfig`)

```javascript
export const toastConfig = {
  position: "top-right",
  autoClose: 5000,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
  progress: undefined,
  theme: "light",
  rtl: false,
};
```

### Custom Styles

```javascript
export const customToastStyles = {
  success: {
    style: {
      background: "#10b981",
      color: "white",
      borderRadius: "8px",
      boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
    },
  },
  // ... other styles
};
```

## 📖 Integration Examples

### Login Page

```jsx
const handleLogin = async () => {
  try {
    const response = await api.post("/api/login", formData);
    if (response.status === 200) {
      appToasts.loginSuccess();
      navigate("/dashboard");
    }
  } catch (error) {
    appToasts.error(
      "Login failed. Please check your credentials.",
      "Login Failed"
    );
  }
};
```

### Join Request

```jsx
const handleJoinRequest = async (clubId) => {
  try {
    await api.post(`/api/club/join/${clubId}`);
    const club = allClubs.find((c) => c._id === clubId);
    appToasts.joinRequestSent(club?.name || "Club");
  } catch (error) {
    appToasts.error("Failed to send join request.", "Request Failed");
  }
};
```

### Form Validation

```jsx
const handleSubmit = () => {
  if (!formData.email) {
    appToasts.validationError("email");
    return;
  }

  if (!formData.password) {
    appToasts.validationError("password");
    return;
  }

  // Continue with submission...
};
```

## 🎮 Demo

Visit `/toast-demo` to see all toast types in action and test the system.

## 📁 File Structure

```
frontend/
├── src/
│   ├── utils/
│   │   └── toast.js              # Toast utility functions
│   ├── components/
│   │   └── ToastDemo.jsx         # Demo component
│   ├── App.jsx                   # ToastContainer setup
│   └── index.css                 # Responsive styles
└── TOAST_SYSTEM_README.md        # This documentation
```

## 🛠️ Customization

### Adding New Toast Types

```javascript
// In utils/toast.js
export const appToasts = {
  // ... existing toasts

  // Add new toast
  customAction: (param) =>
    showToast.success(`Custom action with ${param}`, "Custom Action"),
};
```

### Custom Duration

```javascript
import { toast } from "react-toastify";

// Show toast for 10 seconds
toast.success("Custom duration message", {
  autoClose: 10000,
  ...customToastStyles.success,
});

// Show toast that doesn't auto-dismiss
toast.warning("Important notice", {
  autoClose: false,
  ...customToastStyles.warning,
});
```

## 🐛 Troubleshooting

### Toast Not Appearing

- Ensure `ToastContainer` is in `App.jsx`
- Check that the component is using the correct import
- Verify z-index is not being overridden

### Mobile Issues

- Check that responsive CSS is loaded
- Ensure touch targets are large enough
- Test on actual mobile devices

### Styling Issues

- Verify react-toastify CSS is imported
- Check for CSS conflicts
- Ensure theme variables are set correctly

## 📚 Best Practices

1. **Use Appropriate Types**: Choose the right toast type for your message
2. **Keep Messages Concise**: Short, clear messages work best
3. **Use Application-Specific Methods**: Leverage pre-built patterns when possible
4. **Handle Errors Gracefully**: Always show user-friendly error messages
5. **Test on Mobile**: Ensure toasts work well on all screen sizes
6. **Don't Overuse**: Too many toasts can overwhelm users
7. **Consistent Messaging**: Use consistent language across similar actions

## 🔄 Migration from Alert

Replace `alert()` calls with appropriate toast notifications:

```javascript
// Before
alert("Join request sent successfully!");

// After
appToasts.joinRequestSent(clubName);
```

## 📈 Performance

- Toasts are automatically cleaned up after dismissal
- No memory leaks from event listeners
- Efficient rendering with react-toastify
- Minimal bundle size impact

---

**🎉 The toast system is now fully integrated and ready to use throughout your application!**
