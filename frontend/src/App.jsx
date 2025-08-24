import React, { useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { DashboardPage } from "./pages/DashboardPage";
import { TestPage } from "./pages/TestPage";
import { RegisterPage } from "./pages/RegisterPage";
import { VerifyEmail } from "./pages/VerifyEmail";
import { LoginPage } from "./pages/LoginPage";
import { ForgotPasswordPage } from "./pages/ForgotPasswordPage";
import { ResetPasswordPage } from "./pages/ResetPasswordPage";
import ChatbotPage from "./pages/ChatbotPage";
import { ChatbotProvider } from "./context/ChatbotContext";
import { UserProvider } from "./context/UserContext";
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
import ToastDemo from "./components/ToastDemo";

function App() {
  // Set default theme to "dark" on app initialization
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (!savedTheme) {
      localStorage.setItem("theme", "dark");
      document.documentElement.setAttribute("data-theme", "dark");
    } else {
      document.documentElement.setAttribute("data-theme", savedTheme);
    }
  }, []);

  return (
    <UserProvider>
      <ChatbotProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/test" element={<TestPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/verify/:token" element={<VerifyEmail />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
            <Route
              path="/reset-password/:token"
              element={<ResetPasswordPage />}
            />
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
            <Route path="/toast-demo" element={<ToastDemo />} />
          </Routes>
          <ChatbotWidget />
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
        </BrowserRouter>
      </ChatbotProvider>
    </UserProvider>
  );
}

export default App;
