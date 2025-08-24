import React, { useEffect } from "react";
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

import { EditEventPage } from "./pages/EditEventPage";
import { EditClubPage } from "./pages/EditClubPage";

import ClubsDashboard from "./pages/ClubsDashboard";
import ClubManagementPage from "./pages/ClubManagementPage";

import { SingleEventPage } from "./pages/SingleEventPage";
import { AllEventPage } from "./pages/AllEventPage";
import { MyEventPage } from "./pages/MyEventPage";
import { CertificatePage } from "./pages/CertificatePage";
import EventManagementPage from "./pages/EventManagementPage";
import Profile from "./pages/Profile";

function App() {
  // Set default theme to "dim" on app initialization
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (!savedTheme) {
      localStorage.setItem("theme", "dim");
      document.documentElement.setAttribute("data-theme", "dim");
    } else {
      document.documentElement.setAttribute("data-theme", savedTheme);
    }
  }, []);

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
          <Route path="/profile" element={<Profile />} />

          <Route path="/event/edit/:eventId" element={<EditEventPage />} />
          <Route path="/club/edit/:clubId" element={<EditClubPage />} />

          <Route path="/club-dashboard" element={<ClubsDashboard />} />
          <Route path="/club-management" element={<ClubManagementPage />} />

          <Route path="/event/:id" element={<SingleEventPage />} />
          <Route path="/events" element={<AllEventPage />} />
          <Route path="/my-events" element={<MyEventPage />} />
          <Route path="/certificates" element={<CertificatePage />} />
          <Route
            path="/event/manage/:eventId"
            element={<EventManagementPage />}
          />
        </Routes>
        <ChatbotWidget />
      </BrowserRouter>
    </ChatbotProvider>
  );
}

export default App;
