// Comprehensive responses for Eventify platform features
const responses = {
  // ===== AUTHENTICATION & ACCOUNT MANAGEMENT =====
  "how do i login":
    "You can login by clicking the 'Login' button in the navigation and entering your email and password. If you haven't verified your email yet, you'll need to check your inbox and click the verification link first.",
  login:
    "You can login by clicking the 'Login' button in the navigation and entering your email and password. If you haven't verified your email yet, you'll need to check your inbox and click the verification link first.",
  "sign in":
    "You can login by clicking the 'Login' button in the navigation and entering your email and password. If you haven't verified your email yet, you'll need to check your inbox and click the verification link first.",

  "how do i signup":
    "You can sign up by clicking the 'Register' button in the navigation and filling out the registration form with your name, email, and password. You'll receive a verification email to activate your account.",
  signup:
    "You can sign up by clicking the 'Register' button in the navigation and filling out the registration form with your name, email, and password. You'll receive a verification email to activate your account.",
  "register account":
    "You can sign up by clicking the 'Register' button in the navigation and filling out the registration form with your name, email, and password. You'll receive a verification email to activate your account.",
  "create account":
    "You can sign up by clicking the 'Register' button in the navigation and filling out the registration form with your name, email, and password. You'll receive a verification email to activate your account.",

  "email verification":
    "After registering, check your email inbox for a verification link. Click the link to activate your account. If you don't see the email, check your spam folder or request a new verification email.",
  "verify email":
    "After registering, check your email inbox for a verification link. Click the link to activate your account. If you don't see the email, check your spam folder or request a new verification email.",
  "account verification":
    "After registering, check your email inbox for a verification link. Click the link to activate your account. If you don't see the email, check your spam folder or request a new verification email.",

  "how do i logout":
    "Click the 'Logout' button in the top-right corner of the navigation bar. You'll be redirected to the landing page and will need to sign in again to access your account.",
  logout:
    "Click the 'Logout' button in the top-right corner of the navigation bar. You'll be redirected to the landing page and will need to sign in again to access your account.",
  "sign out":
    "Click the 'Logout' button in the top-right corner of the navigation bar. You'll be redirected to the landing page and will need to sign in again to access your account.",

  // ===== EVENT REGISTRATION & MANAGEMENT =====
  "how do i register for an event":
    "To register for an event, browse events on the 'All Events' page or from your dashboard recommendations. Click on any event card to view details, then click the 'Register' button. You must be logged in to register.",
  register:
    "To register for an event, browse events on the 'All Events' page or from your dashboard recommendations. Click on any event card to view details, then click the 'Register' button. You must be logged in to register.",
  registration:
    "To register for an event, browse events on the 'All Events' page or from your dashboard recommendations. Click on any event card to view details, then click the 'Register' button. You must be logged in to register.",
  "join event":
    "To register for an event, browse events on the 'All Events' page or from your dashboard recommendations. Click on any event card to view details, then click the 'Register' button. You must be logged in to register.",

  "can i cancel my registration":
    "Yes, you can cancel your registration by going to 'My Events' in your dashboard and clicking the 'Unregister' button next to the event. Note that some events may have registration deadlines after which cancellation is not allowed.",
  "cancel registration":
    "Yes, you can cancel your registration by going to 'My Events' in your dashboard and clicking the 'Unregister' button next to the event. Note that some events may have registration deadlines after which cancellation is not allowed.",
  unregister:
    "Yes, you can cancel your registration by going to 'My Events' in your dashboard and clicking the 'Unregister' button next to the event. Note that some events may have registration deadlines after which cancellation is not allowed.",
  "withdraw from event":
    "Yes, you can cancel your registration by going to 'My Events' in your dashboard and clicking the 'Unregister' button next to the event. Note that some events may have registration deadlines after which cancellation is not allowed.",

  "how do i view events":
    "You can view all events by clicking 'All Events' in the navigation. The page shows upcoming events with details like title, date, time, location, and registration status. You can also see personalized recommendations on your dashboard.",
  "view events":
    "You can view all events by clicking 'All Events' in the navigation. The page shows upcoming events with details like title, date, time, location, and registration status. You can also see personalized recommendations on your dashboard.",
  "see events":
    "You can view all events by clicking 'All Events' in the navigation. The page shows upcoming events with details like title, date, time, location, and registration status. You can also see personalized recommendations on your dashboard.",
  "browse events":
    "You can view all events by clicking 'All Events' in the navigation. The page shows upcoming events with details like title, date, time, location, and registration status. You can also see personalized recommendations on your dashboard.",

  "my events":
    "Your registered events are displayed in 'My Events' section. You can access this from your dashboard or the navigation menu. Here you can see all events you've registered for and manage your registrations.",
  "registered events":
    "Your registered events are displayed in 'My Events' section. You can access this from your dashboard or the navigation menu. Here you can see all events you've registered for and manage your registrations.",
  "my dashboard":
    "Your dashboard shows personalized event recommendations, your registered events, and quick access to all platform features. Access it from the navigation menu after logging in.",
  dashboard:
    "Your dashboard shows personalized event recommendations, your registered events, and quick access to all platform features. Access it from the navigation menu after logging in.",

  // ===== AI RECOMMENDATIONS =====
  recommendations:
    "Eventify uses AI-powered recommendations to suggest events based on your interests, past registrations, and similar user behavior. You'll see personalized recommendations on your dashboard and trending events that are popular across campus.",
  "ai recommendations":
    "Eventify uses AI-powered recommendations to suggest events based on your interests, past registrations, and similar user behavior. You'll see personalized recommendations on your dashboard and trending events that are popular across campus.",
  "personalized recommendations":
    "Eventify uses AI-powered recommendations to suggest events based on your interests, past registrations, and similar user behavior. You'll see personalized recommendations on your dashboard and trending events that are popular across campus.",
  "smart recommendations":
    "Eventify uses AI-powered recommendations to suggest events based on your interests, past registrations, and similar user behavior. You'll see personalized recommendations on your dashboard and trending events that are popular across campus.",
  "trending events":
    "Trending events are popular events that many students are registering for. These are displayed on your dashboard and help you discover what's currently popular across campus.",

  // ===== CERTIFICATES =====
  certificates:
    "After attending events, you can generate and download professional certificates of participation. Go to 'My Certificates' in the navigation to view and download your certificates. Certificates are automatically generated after event completion.",
  "my certificates":
    "After attending events, you can generate and download professional certificates of participation. Go to 'My Certificates' in the navigation to view and download your certificates. Certificates are automatically generated after event completion.",
  "download certificate":
    "To download a certificate, go to 'My Certificates' and click the download button next to any certificate. Certificates are generated in PDF format with professional university branding.",
  "generate certificate":
    "Certificates are automatically generated after you attend an event. Go to 'My Certificates' to view and download your certificates. If a certificate isn't available yet, the event may still be ongoing.",
  "certificate of participation":
    "Eventify automatically generates professional certificates for event participation. These certificates include your name, event details, and university branding. Access them from 'My Certificates' after attending events.",

  // ===== CLUB MANAGEMENT (ADMIN) =====
  "how do i create an event":
    "As a club admin, you can create events by going to your admin dashboard and clicking 'Create Event'. Fill in details like title, description, date, time, location, category, and maximum attendees. You can also upload event images.",
  "create event":
    "As a club admin, you can create events by going to your admin dashboard and clicking 'Create Event'. Fill in details like title, description, date, time, location, category, and maximum attendees. You can also upload event images.",
  "add event":
    "As a club admin, you can create events by going to your admin dashboard and clicking 'Create Event'. Fill in details like title, description, date, time, location, category, and maximum attendees. You can also upload event images.",

  "how do i edit an event":
    "Club admins can edit events by going to their admin dashboard, finding the event, and clicking the 'Edit' button. You can modify any event details including title, description, date, time, location, and attendee limits.",
  "edit event":
    "Club admins can edit events by going to their admin dashboard, finding the event, and clicking the 'Edit' button. You can modify any event details including title, description, date, time, location, and attendee limits.",
  "modify event":
    "Club admins can edit events by going to their admin dashboard, finding the event, and clicking the 'Edit' button. You can modify any event details including title, description, date, time, location, and attendee limits.",

  "delete event":
    "Club admins can delete events from their admin dashboard. Find the event you want to delete and click the 'Delete' button. Note that deleting an event will cancel all registrations and cannot be undone.",
  "remove event":
    "Club admins can delete events from their admin dashboard. Find the event you want to delete and click the 'Delete' button. Note that deleting an event will cancel all registrations and cannot be undone.",

  "manage events":
    "Club admins can manage events through the admin dashboard. You can create, edit, delete events, view registrations, mark attendance, and generate certificates for participants.",
  "event management":
    "Club admins can manage events through the admin dashboard. You can create, edit, delete events, view registrations, mark attendance, and generate certificates for participants.",

  "club management":
    "Club admins can manage their clubs through the 'Club Management' section. You can add members, assign admin roles, view club statistics, and manage all club-related activities.",
  "manage club":
    "Club admins can manage their clubs through the 'Club Management' section. You can add members, assign admin roles, view club statistics, and manage all club-related activities.",
  "club dashboard":
    "The club dashboard shows club statistics, member information, event performance, and quick access to club management tools. Access it from the admin navigation menu.",

  "attendance tracking":
    "Club admins can mark attendance for event participants through the event management interface. This is required before certificates can be generated for participants.",
  "mark attendance":
    "Club admins can mark attendance for event participants through the event management interface. This is required before certificates can be generated for participants.",

  // ===== THEME & CUSTOMIZATION =====
  theme:
    "You can change the theme by clicking the theme switcher icon in the top-right corner of the navigation. Eventify offers 32 beautiful themes including light, dark, and custom designs. Your theme preference is saved across sessions.",
  "dark mode":
    "You can switch to dark mode by clicking the theme switcher icon in the navigation. Eventify offers multiple dark themes and your preference is automatically saved.",
  "light mode":
    "You can switch to light mode by clicking the theme switcher icon in the navigation. Eventify offers multiple light themes and your preference is automatically saved.",
  "change theme":
    "You can change the theme by clicking the theme switcher icon in the top-right corner of the navigation. Eventify offers 32 beautiful themes including light, dark, and custom designs. Your theme preference is saved across sessions.",
  "customize appearance":
    "You can customize the appearance by clicking the theme switcher icon in the navigation. Choose from 32 different themes including light, dark, and colorful options.",

  // ===== PROFILE & SETTINGS =====
  profile:
    "Access your profile by clicking the profile icon in the top-right corner of the navigation. Here you can view and edit your personal information, change your avatar, and manage your account settings.",
  "my profile":
    "Access your profile by clicking the profile icon in the top-right corner of the navigation. Here you can view and edit your personal information, change your avatar, and manage your account settings.",
  "account settings":
    "Access your account settings through your profile page. You can update your personal information, change your avatar, and manage your account preferences.",
  "edit profile":
    "You can edit your profile by clicking the profile icon in the navigation and then clicking 'Edit Profile'. You can update your name, email, and upload a new avatar image.",

  // ===== SEARCH & FILTERING =====
  "search events":
    "You can search for events using the search bar on the 'All Events' page. Filter events by category, date, or keywords to find exactly what you're looking for.",
  "filter events":
    "You can filter events by category, date, location, or other criteria on the 'All Events' page. Use the filter options to narrow down your search results.",
  "find events":
    "You can find events by browsing the 'All Events' page, using the search function, or checking your personalized recommendations on the dashboard.",

  // ===== SCHEDULE & TIMING =====
  "event schedule":
    "Event schedules are displayed on each event's detail page. You can see the date, time, location, and duration of events. The system also prevents scheduling conflicts for the same location.",
  "event timing":
    "Event timing information is shown on each event card and detail page. You can see the exact date and time, and the system will warn you about any scheduling conflicts.",
  "registration deadline":
    "Each event has a registration deadline. You must register before this deadline to participate. After the deadline, registration will be closed automatically.",

  // ===== NOTIFICATIONS & EMAILS =====
  notifications:
    "Eventify sends email notifications for event registrations, reminders, and important updates. Make sure your email is verified to receive these notifications.",
  "email notifications":
    "Eventify sends email notifications for event registrations, reminders, and important updates. Make sure your email is verified to receive these notifications.",
  "event reminders":
    "You'll receive email reminders for events you've registered for. These reminders are sent before the event to help you remember your commitments.",

  // ===== MOBILE & RESPONSIVE =====
  mobile:
    "Eventify is fully responsive and works great on mobile devices. All features including event registration, certificate downloads, and theme switching are optimized for mobile use.",
  "mobile app":
    "Eventify is a web application that works perfectly on mobile devices through your browser. No app installation required - just visit the website on your phone or tablet.",
  responsive:
    "Eventify is fully responsive and adapts to any screen size. Whether you're using a phone, tablet, or computer, the interface will automatically adjust for the best experience.",

  // ===== TECHNICAL SUPPORT =====
  help: "I can help you with questions about registering for events, managing your account, creating events (if you're an admin), certificates, recommendations, and general Eventify usage. What would you like to know?",
  "what can you do":
    "I can help you with questions about registering for events, managing your account, creating events (if you're an admin), certificates, recommendations, and general Eventify usage. What would you like to know?",
  support:
    "I'm here to help with any questions about Eventify. You can ask me about events, registration, certificates, recommendations, or any other platform features.",
  troubleshoot:
    "If you're experiencing issues, try refreshing the page, checking your internet connection, or logging out and back in. For specific problems, please describe what you're trying to do and any error messages you see.",

  // ===== GREETINGS =====
  hello:
    "Hello! I'm the Eventify AI Assistant. I can help you with questions about events, registration, certificates, recommendations, and using the platform. How can I assist you today?",
  hi: "Hi there! I'm the Eventify AI Assistant. I can help you with questions about events, registration, certificates, recommendations, and using the platform. How can I assist you today?",
  "good morning":
    "Good morning! I'm the Eventify AI Assistant. I can help you with questions about events, registration, certificates, recommendations, and using the platform. How can I assist you today?",
  "good afternoon":
    "Good afternoon! I'm the Eventify AI Assistant. I can help you with questions about events, registration, certificates, recommendations, and using the platform. How can I assist you today?",
  "good evening":
    "Good evening! I'm the Eventify AI Assistant. I can help you with questions about events, registration, certificates, recommendations, and using the platform. How can I assist you today?",

  // ===== FEATURES OVERVIEW =====
  features:
    "Eventify offers many features: AI-powered event recommendations, automatic certificate generation, club management tools, theme customization, responsive design, email notifications, and more. What specific feature would you like to know about?",
  "what features":
    "Eventify offers many features: AI-powered event recommendations, automatic certificate generation, club management tools, theme customization, responsive design, email notifications, and more. What specific feature would you like to know about?",
  "platform features":
    "Eventify offers many features: AI-powered event recommendations, automatic certificate generation, club management tools, theme customization, responsive design, email notifications, and more. What specific feature would you like to know about?",

  // ===== DEFAULT RESPONSE =====
  default:
    "I'm not sure I understand. Could you please rephrase your question? I can help with event registration, account management, certificates, recommendations, club management, theme customization, and general Eventify questions.",
};

// Enhanced function to find the best matching response
function findBestResponse(userMessage) {
  const message = userMessage.toLowerCase().trim();

  // Check for exact matches first
  for (const [key, response] of Object.entries(responses)) {
    if (message.includes(key)) {
      return response;
    }
  }

  // Check for partial matches with word boundaries
  const words = message.split(" ");
  for (const word of words) {
    if (word.length > 2) {
      // Only check words longer than 2 characters
      for (const [key, response] of Object.entries(responses)) {
        if (key.includes(word) || word.includes(key)) {
          return response;
        }
      }
    }
  }

  // Check for synonyms and related terms
  const synonyms = {
    signup: "signup",
    "sign up": "signup",
    "create account": "signup",
    "new account": "signup",
    signin: "login",
    "sign in": "login",
    "log in": "login",
    signout: "logout",
    "sign out": "logout",
    "log out": "logout",
    join: "register",
    enroll: "register",
    attend: "register",
    participate: "register",
    leave: "unregister",
    withdraw: "unregister",
    drop: "unregister",
    see: "view events",
    look: "view events",
    find: "search events",
    search: "search events",
    browse: "view events",
    list: "view events",
    show: "view events",
    display: "view events",
    recommend: "recommendations",
    suggest: "recommendations",
    ai: "ai recommendations",
    "machine learning": "ai recommendations",
    ml: "ai recommendations",
    cert: "certificates",
    certificate: "certificates",
    diploma: "certificates",
    award: "certificates",
    club: "club management",
    organization: "club management",
    group: "club management",
    admin: "club management",
    administrator: "club management",
    organizer: "club management",
    create: "create event",
    add: "create event",
    new: "create event",
    edit: "edit event",
    modify: "edit event",
    change: "edit event",
    update: "edit event",
    delete: "delete event",
    remove: "delete event",
    cancel: "delete event",
    theme: "theme",
    appearance: "theme",
    look: "theme",
    style: "theme",
    color: "theme",
    dark: "dark mode",
    light: "light mode",
    profile: "profile",
    account: "profile",
    settings: "profile",
    preferences: "profile",
    user: "profile",
    personal: "profile",
    help: "help",
    support: "help",
    assist: "help",
    guide: "help",
    tutorial: "help",
    how: "help",
    what: "help",
    when: "help",
    where: "help",
    why: "help",
  };

  for (const [synonym, key] of Object.entries(synonyms)) {
    if (message.includes(synonym) && responses[key]) {
      return responses[key];
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

// Comprehensive suggested questions for quick access
export function getSuggestedQuestions() {
  return [
    "How do I register for an event?",
    "Can I cancel my registration?",
    "How do I view events?",
    "How do I create an event?",
    "What are AI recommendations?",
    "How do I download certificates?",
    "How do I change the theme?",
    "How do I manage my club?",
    "What is my dashboard?",
    "How do I edit my profile?",
    "How do I search for events?",
    "What are trending events?",
    "How do I mark attendance?",
    "How do I verify my email?",
    "How do I logout?",
  ];
}
