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
import CreateEventPage from "./pages/CreateEventPage";
import { ClubPage } from "./pages/ClubPage";

import ClubsDashboard from "./pages/ClubsDashboard";

import { SingleEventPage } from "./pages/SingleEventPage";

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
          <Route path="/club" element={<ClubPage />} />

          <Route path="/club-dashboard" element={<ClubsDashboard />} />

          <Route path="/event/:id" element={<SingleEventPage />} />

        </Routes>
        <ChatbotWidget />
      </BrowserRouter>
    </ChatbotProvider>
  );
}

export default App;
