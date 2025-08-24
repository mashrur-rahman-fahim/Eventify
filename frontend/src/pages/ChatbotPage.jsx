import React, { useState, useRef, useEffect } from "react";
import { useChatbot } from "../context/ChatbotContext.jsx";
import { Link } from "react-router-dom";
import ThemeSwitcher from "../components/ThemeSwitcher";

const ChatbotPage = () => {
  const { messages, sendMessage, isLoading, suggestions, clearConversation } =
    useChatbot();

  const [inputMessage, setInputMessage] = useState("");
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Focus input on mount
  useEffect(() => {
    setTimeout(() => inputRef.current?.focus(), 100);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (inputMessage.trim() && !isLoading) {
      sendMessage(inputMessage);
      setInputMessage("");
    }
  };

  const handleSuggestionClick = (suggestion) => {
    sendMessage(suggestion);
  };

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatDate = (timestamp) => {
    return new Date(timestamp).toLocaleDateString([], {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-base-200 via-base-100 to-base-300">
      {/* Header */}
      <div className="navbar bg-base-100/80 backdrop-blur-md shadow-lg sticky top-0 z-50">
        <div className="navbar-start">
          <Link to="/" className="btn btn-ghost btn-circle">
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
          </Link>
          <div className="flex items-center gap-3 ml-4">
            <div className="avatar placeholder">
              <div className="bg-primary text-primary-content rounded-full w-12">
                <span className="text-xl">🤖</span>
              </div>
            </div>
            <div>
              <h1 className="text-xl font-bold text-base-content">
                Eventify AI Assistant
              </h1>
              <p className="text-sm text-base-content/70">
                Your intelligent helper for all things Eventify
              </p>
            </div>
          </div>
        </div>
        <div className="navbar-end gap-2">
          <ThemeSwitcher />
          <button
            onClick={clearConversation}
            className="btn btn-ghost btn-circle"
            title="Clear conversation"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
              />
            </svg>
          </button>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6 max-w-4xl">
        <div className="card bg-base-100 shadow-xl border border-base-300">
          {/* Chat Messages */}
          <div className="card-body p-0">
            <div className="h-[600px] overflow-y-auto p-6">
              {messages.length === 0 && (
                <div className="text-center py-12">
                  <div className="avatar placeholder mb-6">
                    <div className="bg-primary/20 text-primary rounded-full w-24 h-24">
                      <span className="text-4xl">🤖</span>
                    </div>
                  </div>
                  <h3 className="text-2xl font-bold text-base-content mb-4">
                    Welcome to Eventify AI Assistant!
                  </h3>
                  <p className="text-base-content/70 mb-8 max-w-md mx-auto">
                    I'm here to help you with all your Eventify questions. Ask
                    me about events, registration, certificates, or anything
                    else!
                  </p>

                  {/* Suggestions */}
                  {suggestions.length > 0 && (
                    <div className="max-w-lg mx-auto">
                      <p className="text-sm text-base-content/60 mb-4 font-medium">
                        Try asking me about:
                      </p>
                      <div className="grid gap-3">
                        {suggestions.map((suggestion, index) => (
                          <button
                            key={index}
                            onClick={() => handleSuggestionClick(suggestion)}
                            className="btn btn-outline btn-primary justify-start text-left h-auto p-4 hover:scale-105 transition-transform"
                          >
                            <span className="text-lg mr-3">💡</span>
                            {suggestion}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {messages.map((message, index) => {
                const showDate =
                  index === 0 ||
                  new Date(message.timestamp).toDateString() !==
                    new Date(messages[index - 1].timestamp).toDateString();

                return (
                  <div key={message.id}>
                    {showDate && (
                      <div className="text-center my-6">
                        <div className="badge badge-neutral badge-lg">
                          {formatDate(message.timestamp)}
                        </div>
                      </div>
                    )}
                    <div
                      className={`chat ${
                        message.sender === "user" ? "chat-end" : "chat-start"
                      } mb-4`}
                    >
                      {message.sender === "assistant" && (
                        <div className="chat-image avatar">
                          <div className="w-10 rounded-full bg-primary text-primary-content flex items-center justify-center">
                            <span className="text-sm">🤖</span>
                          </div>
                        </div>
                      )}
                      <div
                        className={`chat-bubble ${
                          message.sender === "user"
                            ? "chat-bubble-primary"
                            : "chat-bubble-secondary"
                        } max-w-xs lg:max-w-md`}
                      >
                        <p className="whitespace-pre-wrap">{message.content}</p>
                      </div>
                      <div className="chat-footer opacity-50 text-xs">
                        {formatTime(message.timestamp)}
                      </div>
                    </div>
                  </div>
                );
              })}

              {isLoading && (
                <div className="chat chat-start mb-4">
                  <div className="chat-image avatar">
                    <div className="w-10 rounded-full bg-primary text-primary-content flex items-center justify-center">
                      <span className="text-sm">🤖</span>
                    </div>
                  </div>
                  <div className="chat-bubble chat-bubble-secondary">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-base-content/60 rounded-full animate-bounce"></div>
                      <div
                        className="w-2 h-2 bg-base-content/60 rounded-full animate-bounce"
                        style={{ animationDelay: "0.1s" }}
                      ></div>
                      <div
                        className="w-2 h-2 bg-base-content/60 rounded-full animate-bounce"
                        style={{ animationDelay: "0.2s" }}
                      ></div>
                    </div>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Input Form */}
            <div className="border-t border-base-300 p-6">
              <form onSubmit={handleSubmit} className="flex gap-3">
                <div className="form-control flex-1">
                  <input
                    ref={inputRef}
                    type="text"
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    placeholder="Type your message here..."
                    className="input input-bordered w-full"
                    disabled={isLoading}
                  />
                </div>
                <button
                  type="submit"
                  disabled={!inputMessage.trim() || isLoading}
                  className="btn btn-primary"
                >
                  {isLoading ? (
                    <span className="loading loading-spinner loading-sm"></span>
                  ) : (
                    <>
                      <span>Send</span>
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                        />
                      </svg>
                    </>
                  )}
                </button>
              </form>

              {/* Quick Actions */}
              {messages.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-4">
                  <button
                    onClick={() =>
                      handleSuggestionClick("How do I register for an event?")
                    }
                    className="btn btn-sm btn-outline"
                    disabled={isLoading}
                  >
                    📝 Registration Help
                  </button>
                  <button
                    onClick={() =>
                      handleSuggestionClick("Tell me about upcoming events")
                    }
                    className="btn btn-sm btn-outline"
                    disabled={isLoading}
                  >
                    📅 Upcoming Events
                  </button>
                  <button
                    onClick={() =>
                      handleSuggestionClick("How do I get my certificate?")
                    }
                    className="btn btn-sm btn-outline"
                    disabled={isLoading}
                  >
                    🏆 Certificates
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatbotPage;
