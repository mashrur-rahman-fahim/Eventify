// Predefined responses for common questions
const responses = {
  // Registration related
  "how do i register for an event":
    "To register for an event, simply click on the 'Register' button on any event card or event detail page. You'll need to be logged in to register for events.",
  register:
    "To register for an event, simply click on the 'Register' button on any event card or event detail page. You'll need to be logged in to register for events.",
  registration:
    "To register for an event, simply click on the 'Register' button on any event card or event detail page. You'll need to be logged in to register for events.",

  // Cancellation related
  "can i cancel my registration":
    "Yes, you can cancel your registration by going to your dashboard and clicking the 'Unregister' button next to the event you want to cancel from.",
  "cancel registration":
    "Yes, you can cancel your registration by going to your dashboard and clicking the 'Unregister' button next to the event you want to cancel from.",
  unregister:
    "Yes, you can cancel your registration by going to your dashboard and clicking the 'Unregister' button next to the event you want to cancel from.",

  // Event creation (admin)
  "how do i create an event":
    "As a club admin, you can create events by going to your admin dashboard and clicking the 'Create Event' button. You'll need to fill in details like title, description, date, time, and location.",
  "create event":
    "As a club admin, you can create events by going to your admin dashboard and clicking the 'Create Event' button. You'll need to fill in details like title, description, date, time, and location.",

  // Event management
  "how do i edit an event":
    "Club admins can edit events by going to their admin dashboard, finding the event they want to edit, and clicking the 'Edit' button. You can modify any event details.",
  "edit event":
    "Club admins can edit events by going to their admin dashboard, finding the event they want to edit, and clicking the 'Edit' button. You can modify any event details.",

  // Viewing events
  "how do i view events":
    "You can view all events on the homepage or by clicking 'All Events' in the navigation. Each event shows details like title, date, time, and location.",
  "view events":
    "You can view all events on the homepage or by clicking 'All Events' in the navigation. Each event shows details like title, date, time, and location.",
  "see events":
    "You can view all events on the homepage or by clicking 'All Events' in the navigation. Each event shows details like title, date, time, and location.",

  // Dashboard
  "my dashboard":
    "Your dashboard shows all events you've registered for. You can access it by clicking 'My Events' in the navigation after logging in.",
  dashboard:
    "Your dashboard shows all events you've registered for. You can access it by clicking 'My Events' in the navigation after logging in.",

  // Authentication
  "how do i login":
    "You can login by clicking the 'Login' button in the navigation and entering your email and password.",
  login:
    "You can login by clicking the 'Login' button in the navigation and entering your email and password.",
  "sign in":
    "You can login by clicking the 'Login' button in the navigation and entering your email and password.",

  "how do i signup":
    "You can sign up by clicking the 'Register' button in the navigation and filling out the registration form with your name, email, and password.",
  signup:
    "You can sign up by clicking the 'Register' button in the navigation and filling out the registration form with your name, email, and password.",
  "register account":
    "You can sign up by clicking the 'Register' button in the navigation and filling out the registration form with your name, email, and password.",

  // General help
  help: "I can help you with questions about registering for events, managing your account, creating events (if you're an admin), and general Eventify usage. What would you like to know?",
  "what can you do":
    "I can help you with questions about registering for events, managing your account, creating events (if you're an admin), and general Eventify usage. What would you like to know?",
  hello:
    "Hello! I'm the Eventify chatbot. I can help you with questions about events, registration, and using the platform. How can I assist you today?",
  hi: "Hi there! I'm the Eventify chatbot. I can help you with questions about events, registration, and using the platform. How can I assist you today?",

  // Default response
  default:
    "I'm not sure I understand. Could you please rephrase your question? I can help with event registration, account management, and general Eventify questions.",
};

// Function to find the best matching response
function findBestResponse(userMessage) {
  const message = userMessage.toLowerCase().trim();

  // Check for exact matches first
  for (const [key, response] of Object.entries(responses)) {
    if (message.includes(key)) {
      return response;
    }
  }

  // Check for partial matches
  const words = message.split(" ");
  for (const word of words) {
    for (const [key, response] of Object.entries(responses)) {
      if (key.includes(word) || word.includes(key)) {
        return response;
      }
    }
  }

  // Return default response if no match found
  return responses.default;
}

// Main chatbot function
export function processMessage(userMessage) {
  const response = findBestResponse(userMessage);
  return {
    message: response,
    timestamp: new Date(),
    type: "bot",
  };
}

// Get suggested questions for quick access
export function getSuggestedQuestions() {
  return [
    "How do I register for an event?",
    "Can I cancel my registration?",
    "How do I view events?",
    "How do I create an event?",
    "What is my dashboard?",
  ];
}
