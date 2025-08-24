# Eventify Frontend

A modern React application for university event management with AI-powered recommendations and comprehensive loading states.

## Features

- **Modern UI/UX**: Built with React 19, Vite, and Tailwind CSS
- **Loading System**: Comprehensive loading states with react-spinners
- **Authentication**: Secure login/registration with email verification
- **Event Management**: Create, manage, and attend university events
- **Club Management**: Admin tools for club organization
- **AI Assistant**: Integrated chatbot for user assistance
- **Certificate System**: Digital certificates for event participation
- **Responsive Design**: Mobile-first responsive design
- **Theme Support**: Dark/light mode with DaisyUI

## Loading System

This project includes a comprehensive loading system with:

- **Global Loading Overlay**: Full-screen loading for app-wide operations
- **Component Loading States**: Individual loading states for specific components
- **Loading Buttons**: Buttons with built-in loading states
- **Loading Cards**: Card-based loading components
- **Multiple Spinner Types**: Various animations (clip, pulse, beat, ring, hash)

See [LOADING_SYSTEM_README.md](./LOADING_SYSTEM_README.md) for detailed documentation.

## Tech Stack

- **React 19**: Latest React with concurrent features
- **Vite**: Fast build tool and dev server
- **Tailwind CSS**: Utility-first CSS framework
- **DaisyUI**: Component library for Tailwind
- **React Router**: Client-side routing
- **React Spinners**: Loading animations
- **Axios**: HTTP client for API calls
- **React Toastify**: Toast notifications

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start development server:
   ```bash
   npm run dev
   ```

3. Build for production:
   ```bash
   npm run build
   ```

## Project Structure

```
src/
├── components/
│   ├── loading/          # Loading system components
│   ├── dashboards/       # Dashboard components
│   └── ...              # Other components
├── context/             # React contexts
├── hooks/               # Custom hooks
├── pages/               # Page components
├── utils/               # Utility functions
└── App.jsx             # Main app component
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Documentation

- [Loading System](./LOADING_SYSTEM_README.md) - Comprehensive loading system guide
- [Toast System](./TOAST_SYSTEM_README.md) - Notification system documentation
- [Route Protection](./ROUTE_PROTECTION_README.md) - Authentication and routing
