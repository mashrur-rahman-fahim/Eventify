import React, { useState } from "react";
import { Link } from "react-router-dom";
import api, { forgotPasswordAPI } from "../utils/api";
import ThemeSwitcher from "../components/ThemeSwitcher";

export const ForgotPasswordPage = () => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setMessage("");

    if (!email.trim()) {
      setError("Email is required");
      setIsLoading(false);
      return;
    }

    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Please enter a valid email address");
      setIsLoading(false);
      return;
    }

    try {
      const response = await forgotPasswordAPI.requestPasswordReset(email);
      setMessage(response.message);
      setEmail("");
    } catch (error) {
      console.log(error);
      setError(
        error.response?.data?.message ||
          "Failed to send reset email. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 via-base-200 to-secondary/10 relative overflow-hidden">
      {/* Navbar */}
      <div className="navbar bg-base-100/90 shadow-lg backdrop-blur-md">
        <div className="navbar-start">
          <Link
            to="/"
            className="btn btn-ghost text-xl flex items-center gap-2"
          >
            <img
              src="https://res.cloudinary.com/dsb7ttev4/image/upload/v1756038824/vite_q17xlv.svg"
              alt="Eventify Logo"
              className="w-8 h-8"
            />
            <span className="font-bold">Eventify</span>
          </Link>
        </div>
        <div className="navbar-end gap-2">
          <Link
            to="/chatbot"
            className="btn btn-ghost text-primary font-semibold"
          >
            🤖 AI Assistant
          </Link>
          <ThemeSwitcher />
          <Link to="/login" className="btn btn-ghost">
            Sign In
          </Link>
        </div>
      </div>

      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/20 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-secondary/20 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-accent/10 rounded-full blur-3xl"></div>
      </div>

      {/* Forgot Password Form Container */}
      <div className="flex items-center justify-center min-h-screen p-4 relative z-10">
        <div className="card w-full max-w-md bg-base-100/80 backdrop-blur-xl shadow-2xl border border-base-300/50 relative z-10">
          <div className="card-body p-8">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="mb-4">
                <svg
                  className="w-16 h-16 mx-auto text-primary"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                  />
                </svg>
              </div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                Forgot Password?
              </h1>
              <p className="text-base-content/70 mt-2">
                Enter your email address and we'll send you a link to reset your
                password
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Email Input */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-medium flex items-center gap-2">
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"
                      />
                    </svg>
                    Email Address
                  </span>
                </label>
                <input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="input input-bordered w-full pl-4 pr-4 h-12 bg-base-100/50 backdrop-blur-sm border-base-300 focus:border-primary focus:bg-base-100 transition-all duration-200"
                  required
                />
              </div>

              {/* Success Message */}
              {message && (
                <div className="alert alert-success">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="stroke-current shrink-0 h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <span>{message}</span>
                </div>
              )}

              {/* Error Message */}
              {error && (
                <div className="alert alert-error">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="stroke-current shrink-0 h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <span>{error}</span>
                </div>
              )}

              {/* Submit Button */}
              <div className="form-control">
                <button
                  type="submit"
                  className="btn btn-primary w-full h-12"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <span className="loading loading-spinner loading-sm"></span>
                      Sending...
                    </>
                  ) : (
                    <>
                      <svg
                        className="w-5 h-5 mr-2"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                        />
                      </svg>
                      Send Reset Link
                    </>
                  )}
                </button>
              </div>
            </form>

            {/* Back to Login Link */}
            <div className="text-center mt-6">
              <p className="text-sm text-base-content/70">
                Remember your password?{" "}
                <Link
                  to="/login"
                  className="link link-primary font-semibold hover:text-primary-focus transition-colors"
                >
                  Back to Login
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
