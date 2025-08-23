# Eventify Chatbot Feature

## Overview

The Eventify chatbot is an AI-powered assistant that helps users with common questions about the Eventify platform. It provides instant support for event registration, account management, and general platform usage.

## Features

### 🤖 Smart Responses

- Predefined responses for common Eventify questions
- Natural language processing for user queries
- Context-aware suggestions

### 💬 Multiple Interfaces

- **Floating Widget**: Always accessible chat button in bottom-right corner
- **Full-Screen Page**: Dedicated `/chatbot` route for immersive experience
- **Quick Access**: Links from login and landing pages

### 📱 User Experience

- Real-time message exchange
- Loading indicators
- Auto-scroll to latest messages
- Conversation history for logged-in users
- Quick suggestion buttons

### 🔐 Authentication Integration

- Public access for basic questions
- Conversation history for authenticated users
- User-specific chat sessions

## Backend Implementation

### Models

- `Conversation`: Stores chat history with user messages and bot responses
- `Message`: Individual message schema with sender, content, and timestamp

### Services

- `chatbotService.js`: Core logic for processing messages and generating responses
- Predefined responses for common Eventify questions
- Smart matching algorithm for user queries

### Controllers

- `chatbotController.js`: API endpoints for chat functionality
- Message processing, conversation history, and suggestions

### Routes

- `POST /api/chat/send`: Send a message and get bot response
- `GET /api/chat/suggestions`: Get suggested questions
- `GET /api/chat/history`: Get conversation history (authenticated)
- `DELETE /api/chat/clear`: Clear conversation history (authenticated)

## Frontend Implementation

### Context

- `ChatbotContext.jsx`: Global state management for chat functionality
- Message history, loading states, and API integration

### Components

- `ChatbotWidget.jsx`: Floating chat interface
- `ChatbotPage.jsx`: Full-screen chat experience

### Features

- Real-time message updates
- Auto-scroll and focus management
- Responsive design with Tailwind CSS
- Loading animations and error handling

## Usage

### For Users

1. **Quick Questions**: Click the chat button in the bottom-right corner
2. **Full Experience**: Visit `/chatbot` for a dedicated chat page
3. **From Login**: Use the "Chat with AI Assistant" link on the login page

### Common Questions the Bot Can Answer

- How to register for events
- How to cancel registrations
- How to view events
- How to create events (for admins)
- How to edit events (for admins)
- Login and signup process
- Dashboard navigation

### For Developers

The chatbot is designed to be easily extensible:

1. **Add New Responses**: Update the `responses` object in `chatbotService.js`
2. **Modify Matching Logic**: Adjust the `findBestResponse` function
3. **Add New Suggestions**: Update the `getSuggestedQuestions` function
4. **Customize UI**: Modify the React components in the frontend

## Technical Details

### Response Matching Algorithm

1. **Exact Match**: Checks if user message contains exact response keys
2. **Partial Match**: Checks individual words for partial matches
3. **Default Response**: Returns generic help message if no match found

### Database Schema

```javascript
Conversation {
  userId: ObjectId,
  messages: [{
    content: String,
    sender: 'user' | 'bot',
    timestamp: Date
  }],
  createdAt: Date,
  updatedAt: Date
}
```

### API Endpoints

- All endpoints support CORS and authentication where needed
- Error handling with appropriate HTTP status codes
- JSON responses with consistent structure

## Future Enhancements

- Integration with external AI services (OpenAI, etc.)
- Multi-language support
- Voice input/output
- Advanced conversation context
- Analytics and usage tracking
- Custom bot personalities for different user roles

## Dependencies

- **Backend**: Express.js, Mongoose, bcrypt
- **Frontend**: React, React Router, Tailwind CSS
- **State Management**: React Context API
- **HTTP Client**: Axios

## Security Considerations

- Input validation and sanitization
- Rate limiting for API endpoints
- Authentication for sensitive operations
- CORS configuration for cross-origin requests
