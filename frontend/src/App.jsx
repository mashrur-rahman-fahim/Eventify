import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { DashboardPage } from "./pages/DashboardPage";
import { TestPage } from "./pages/TestPage";
import { RegisterPage } from "./pages/RegisterPage";
import { VerifyEmail } from "./pages/VerifyEmail";
import { LoginPage } from "./pages/LoginPage";
import ChatbotPage from "./pages/ChatbotPage";
import { ChatbotProvider } from "./context/ChatbotContext";
import ChatbotWidget from "./components/ChatbotWidget";
import { LandingPage } from "./pages/LandingPage";
import { CreateEventPage } from "./pages/CreateEventPage";
function App() {
  return (
    <ChatbotProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/test" element={<TestPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/verify/:token" element={<VerifyEmail />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/chatbot" element={<ChatbotPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/create-event" element={<CreateEventPage />} />
        </Routes>
        <ChatbotWidget />
      </BrowserRouter>
    </ChatbotProvider>
  );
}

export default App;
