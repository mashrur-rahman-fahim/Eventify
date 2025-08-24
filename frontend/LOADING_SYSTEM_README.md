# Loading System Documentation

## Overview

This project now includes a comprehensive loading system that provides consistent loading states across the entire application. The system includes both global loading overlays and component-specific loading states.

## Features

- **Global Loading Overlay**: Full-screen loading overlay for app-wide operations
- **Component Loading States**: Individual loading states for specific components
- **Loading Buttons**: Buttons with built-in loading states
- **Loading Cards**: Card-based loading components
- **Custom Hooks**: Easy-to-use hooks for managing loading states
- **Multiple Spinner Types**: Various spinner animations (clip, pulse, beat, ring, hash)

## Components

### 1. LoadingSpinner
Basic spinner component with multiple animation types.

```jsx
import { LoadingSpinner } from './components/loading';

<LoadingSpinner 
  type="ring" 
  size={24} 
  color="#3b82f6" 
  text="Loading..." 
/>
```

**Props:**
- `type`: 'clip' | 'pulse' | 'beat' | 'ring' | 'hash' (default: 'clip')
- `size`: number (default: 20)
- `color`: string (default: '#3b82f6')
- `text`: string (optional)
- `className`: string (optional)

### 2. LoadingOverlay
Full-screen overlay with backdrop blur.

```jsx
import { LoadingOverlay } from './components/loading';

<LoadingOverlay 
  isVisible={true}
  message="Loading your data..."
  spinnerType="ring"
  spinnerSize={40}
/>
```

**Props:**
- `isVisible`: boolean (default: false)
- `message`: string (default: 'Loading...')
- `spinnerType`: string (default: 'ring')
- `spinnerSize`: number (default: 40)
- `backdrop`: boolean (default: true)

### 3. LoadingButton
Button component with built-in loading state.

```jsx
import { LoadingButton } from './components/loading';

<LoadingButton 
  loading={isSubmitting}
  loadingText="Submitting..."
  onClick={handleSubmit}
>
  Submit Form
</LoadingButton>
```

**Props:**
- `loading`: boolean (default: false)
- `loadingText`: string (default: 'Loading...')
- `spinnerSize`: number (default: 16)
- All standard button props

### 4. LoadingCard
Card-based loading component.

```jsx
import { LoadingCard } from './components/loading';

<LoadingCard 
  message="Loading events..."
  spinnerType="pulse"
  height="h-64"
/>
```

**Props:**
- `message`: string (default: 'Loading content...')
- `spinnerType`: string (default: 'pulse')
- `spinnerSize`: number (default: 24)
- `height`: string (default: 'h-64')

## Context and Hooks

### LoadingContext
Global loading state management.

```jsx
import { useLoading } from './context/LoadingContext';

const { 
  globalLoading, 
  loadingMessage, 
  startLoading, 
  stopLoading, 
  withLoading 
} = useLoading();
```

**Methods:**
- `startLoading(taskId, message)`: Start a loading task
- `stopLoading(taskId)`: Stop a loading task
- `withLoading(taskId, message, asyncFunction)`: Execute async function with loading

### useLoadingState Hook
Local loading state management.

```jsx
import { useLoadingState } from './hooks/useLoadingState';

const { 
  loading, 
  error, 
  startLoading, 
  stopLoading, 
  withLoading 
} = useLoadingState();
```

## Usage Examples

### 1. Global Loading for API Calls

```jsx
import { useLoading } from './context/LoadingContext';

const MyComponent = () => {
  const { withLoading } = useLoading();

  const handleSubmit = async () => {
    try {
      await withLoading('submit', 'Submitting form...', async () => {
        await api.post('/api/submit', data);
      });
    } catch (error) {
      console.error(error);
    }
  };
};
```

### 2. Component-Specific Loading

```jsx
import { useLoadingState } from './hooks/useLoadingState';
import { LoadingButton } from './components/loading';

const MyForm = () => {
  const { loading, withLoading } = useLoadingState();

  const handleSubmit = async () => {
    await withLoading(async () => {
      await api.post('/api/submit', data);
    });
  };

  return (
    <LoadingButton 
      loading={loading}
      loadingText="Submitting..."
      onClick={handleSubmit}
    >
      Submit
    </LoadingButton>
  );
};
```

### 3. Loading Cards for Data Fetching

```jsx
import { LoadingCard } from './components/loading';

const EventsList = () => {
  const [loading, setLoading] = useState(true);
  const [events, setEvents] = useState([]);

  useEffect(() => {
    fetchEvents();
  }, []);

  if (loading) {
    return <LoadingCard message="Loading events..." />;
  }

  return <div>{/* Events list */}</div>;
};
```

## Integration with Existing Components

The loading system has been integrated into:

1. **LoginPage**: Loading button during login
2. **RegisterPage**: Loading button during registration
3. **Global App**: Global loading overlay for all operations
4. **API Calls**: Automatic loading states for async operations

## Best Practices

1. **Use Global Loading for**: User authentication, form submissions, data fetching
2. **Use Component Loading for**: Individual component operations
3. **Use Loading Buttons for**: Form submissions, actions that require user feedback
4. **Use Loading Cards for**: Content areas that are being populated

## Customization

You can customize the loading system by:

1. **Modifying spinner types** in `LoadingSpinner.jsx`
2. **Changing default colors** in the component props
3. **Adding new loading components** in the `loading/` directory
4. **Customizing the global overlay** in `GlobalLoadingOverlay.jsx`

## File Structure

```
src/
├── components/
│   └── loading/
│       ├── LoadingSpinner.jsx
│       ├── LoadingOverlay.jsx
│       ├── LoadingButton.jsx
│       ├── LoadingCard.jsx
│       ├── GlobalLoadingOverlay.jsx
│       └── index.js
├── context/
│   └── LoadingContext.jsx
├── hooks/
│   └── useLoadingState.js
└── App.jsx (updated with LoadingProvider)
```

This loading system provides a consistent and professional user experience across your entire application.
