# Route Protection System

This document explains the professional route protection system implemented in the frontend application.

## Overview

The route protection system provides a centralized, efficient way to handle authentication and authorization across the application. It eliminates the need for manual `checkLogin()` calls in every component and provides a clean separation of concerns.

## Architecture

### 1. Authentication Context (`VerifyProvider`)

The `VerifyProvider` manages the global authentication state:

```javascript
{
  isVerified: boolean,      // User is authenticated
  isAdmin: boolean,         // User has admin role
  isLoading: boolean,       // Authentication check in progress
  isInitialized: boolean,   // Initial auth check completed
  user: object,            // User data
  checkLogin: function,    // Manual auth check (rarely needed)
  logout: function,        // Logout function
  updateUser: function     // Update user data
}
```

**Key Features:**

- Automatic initialization on app load
- Caching to prevent unnecessary API calls
- Memoized functions to prevent re-renders
- Centralized logout handling

### 2. Route Guards

Three types of route guards provide different levels of protection:

#### `ProtectedRoute`

- **Purpose**: Routes that require authentication
- **Behavior**:
  - Shows loading spinner during auth check
  - Redirects to `/login` if not authenticated
  - Preserves intended destination in location state
- **Usage**: Student and general user routes

#### `AdminRoute`

- **Purpose**: Routes that require admin privileges
- **Behavior**:
  - Shows loading spinner during auth check
  - Redirects to `/login` if not authenticated
  - Redirects to `/dashboard` if not admin
- **Usage**: Admin-only routes

#### `PublicRoute`

- **Purpose**: Public routes that redirect authenticated users
- **Behavior**:
  - Shows loading spinner during auth check
  - Redirects authenticated users to specified destination
- **Usage**: Login, register, and landing pages

## Route Classification

### Public Routes (No Protection)

- `/` - Landing page
- `/test` - Test page
- `/chatbot` - Chatbot page

### Public Routes (Redirect Authenticated Users)

- `/login` - Login page (redirects to `/dashboard`)
- `/register` - Register page (redirects to `/dashboard`)
- `/verify/:token` - Email verification (redirects to `/dashboard`)

### Protected Routes (Require Authentication)

- `/dashboard` - User dashboard
- `/profile` - User profile
- `/events` - All events
- `/my-events` - User's events
- `/certificates` - User's certificates
- `/event/:id` - Single event view

### Admin Routes (Require Admin Role)

- `/club` - Club management
- `/club-management` - Club management dashboard
- `/create-event` - Create new event
- `/event/edit/:eventId` - Edit event
- `/club/edit/:clubId` - Edit club
- `/event/manage/:eventId` - Event management
- `/club-dashboard` - Club dashboard

## Implementation Benefits

### 1. Performance

- **Single Auth Check**: Authentication is checked once on app initialization
- **Caching**: Prevents redundant API calls
- **Memoization**: Prevents unnecessary re-renders

### 2. User Experience

- **Loading States**: Consistent loading spinners during auth checks
- **Smart Redirects**: Preserves intended destination after login
- **Role-Based Access**: Automatic redirection based on user role

### 3. Developer Experience

- **Clean Components**: No manual auth checks in components
- **Centralized Logic**: All auth logic in one place
- **Type Safety**: Clear route protection types
- **Easy Maintenance**: Add new protected routes easily

### 4. Security

- **Route-Level Protection**: Impossible to access protected routes without auth
- **Role-Based Access**: Admin routes protected at route level
- **Automatic Redirects**: Users can't stay on unauthorized pages

## Usage Examples

### Adding a New Protected Route

```javascript
// In App.jsx
<Route
  path="/new-protected-route"
  element={
    <ProtectedRoute>
      <NewProtectedComponent />
    </ProtectedRoute>
  }
/>
```

### Adding a New Admin Route

```javascript
// In App.jsx
<Route
  path="/new-admin-route"
  element={
    <AdminRoute>
      <NewAdminComponent />
    </AdminRoute>
  }
/>
```

### Adding a New Public Route

```javascript
// In App.jsx
<Route
  path="/new-public-route"
  element={
    <PublicRoute redirectTo="/dashboard">
      <NewPublicComponent />
    </PublicRoute>
  }
/>
```

## Migration from Old System

### Before (Old System)

```javascript
// Every component had these patterns:
useEffect(() => {
  checkLogin();
}, [checkLogin]);

useEffect(() => {
  if (!isVerified && !isLoading) {
    navigate("/login");
  }
}, [isVerified, isLoading, navigate]);

const handleLogout = async () => {
  try {
    await api.get("/api/logout");
  } catch (error) {
    console.error("Logout failed", error);
  } finally {
    navigate("/login");
  }
};
```

### After (New System)

```javascript
// Components are clean and focused on their purpose
// No manual auth checks needed
// No manual logout handling needed
export const MyComponent = () => {
  return (
    <div>
      <Navbar />
      <main>{/* Component content */}</main>
    </div>
  );
};
```

## Best Practices

1. **Don't call `checkLogin()` manually** - It's handled automatically
2. **Use route guards** - Don't implement auth checks in components
3. **Leverage context** - Use `useContext(VerifyContext)` for user data
4. **Handle loading states** - Route guards provide consistent loading
5. **Use proper redirects** - Let route guards handle navigation

## Troubleshooting

### Common Issues

1. **Infinite Loading**: Check if `isInitialized` is being set properly
2. **Wrong Redirects**: Verify route guard configuration in `App.jsx`
3. **Auth State Not Updating**: Use `updateUser()` after login/registration
4. **Role Not Detected**: Ensure backend returns correct role in auth response

### Debug Tips

1. Check `VerifyProvider` state in React DevTools
2. Verify route guard logic in browser console
3. Check network requests for auth endpoints
4. Validate user role in backend response
