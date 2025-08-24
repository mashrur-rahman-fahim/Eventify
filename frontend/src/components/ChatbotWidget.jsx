import React, { useState, useRef, useEffect } from "react";
import { useChatbot } from "../context/ChatbotContext.jsx";

const ChatbotWidget = () => {
  const {
    isOpen,
    toggleChat,
    messages,
    sendMessage,
    isLoading,
    suggestions,
    clearConversation,
  } = useChatbot();

  const [inputMessage, setInputMessage] = useState("");
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Focus input when chat opens
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

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

  if (!isOpen) {
    return (
      <div className="fixed bottom-6 right-6 z-50">
        <button
          onClick={toggleChat}
          className="btn btn-primary btn-circle btn-lg shadow-2xl hover:scale-110 transition-all duration-300 animate-pulse"
          aria-label="Open AI Assistant"
        >
          <span className="text-2xl">🤖</span>
        </button>
      </div>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Chat Container */}
      <div className="card w-96 bg-base-100 shadow-2xl border border-base-300">
        {/* Chat Header */}
        <div className="card-body p-0">
          <div className="bg-gradient-to-r from-primary to-primary-focus text-primary-content p-4 rounded-t-2xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="avatar placeholder">
                  <div className="bg-primary-content text-primary rounded-full w-10">
                    <span className="text-lg">🤖</span>
                  </div>
                </div>
                <div>
                  <h3 className="font-bold text-lg">Eventify AI</h3>
                  <p className="text-primary-content/80 text-sm">
                    {isLoading ? "Typing..." : "Online"}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={clearConversation}
                  className="btn btn-ghost btn-sm btn-circle text-primary-content hover:bg-primary-content/20"
                  title="Clear conversation"
                >
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
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                    />
                  </svg>
                </button>
                <button
                  onClick={toggleChat}
                  className="btn btn-ghost btn-sm btn-circle text-primary-content hover:bg-primary-content/20"
                  title="Close chat"
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
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
            </div>
          </div>

          {/* Chat Messages */}
          <div className="h-80 overflow-y-auto p-4 bg-base-50">
            {messages.length === 0 && (
              <div className="text-center py-8">
                <div className="avatar placeholder mb-4">
                  <div className="bg-primary/20 text-primary rounded-full w-16 h-16">
                    <span className="text-2xl">🤖</span>
                  </div>
                </div>
                <h4 className="font-bold text-base-content mb-2">
                  Hi! I'm your AI Assistant
                </h4>
                <p className="text-base-content/70 text-sm mb-4">
                  Ask me anything about Eventify!
                </p>

                {/* Quick Suggestions */}
                {suggestions.length > 0 && (
                  <div className="space-y-2">
                    {suggestions.slice(0, 3).map((suggestion, index) => (
                      <button
                        key={index}
                        onClick={() => handleSuggestionClick(suggestion)}
                        className="btn btn-outline btn-primary btn-sm w-full justify-start text-left h-auto p-3 text-xs"
                      >
                        <span className="text-sm mr-2">💡</span>
                        {suggestion}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}

            {messages.map((message) => (
              <div
                key={message.id}
                className={`chat ${
                  message.sender === "user" ? "chat-end" : "chat-start"
                } mb-3`}
              >
                {message.sender === "assistant" && (
                  <div className="chat-image avatar">
                    <div className="w-8 rounded-full bg-primary text-primary-content flex items-center justify-center">
                      <span className="text-xs">🤖</span>
                    </div>
                  </div>
                )}
                <div
                  className={`chat-bubble ${
                    message.sender === "user"
                      ? "chat-bubble-primary"
                      : "chat-bubble-secondary"
                  } max-w-xs text-sm`}
                >
                  <p className="whitespace-pre-wrap">{message.content}</p>
                </div>
                <div className="chat-footer opacity-50 text-xs">
                  {formatTime(message.timestamp)}
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="chat chat-start mb-3">
                <div className="chat-image avatar">
                  <div className="w-8 rounded-full bg-primary text-primary-content flex items-center justify-center">
                    <span className="text-xs">🤖</span>
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

          {/* Quick Actions */}
          {messages.length > 0 && (
            <div className="bg-base-200 p-3 border-t border-base-300">
              <div className="flex flex-wrap gap-1">
                <button
                  onClick={() =>
                    handleSuggestionClick("How do I register for an event?")
                  }
                  className="btn btn-xs btn-outline"
                  disabled={isLoading}
                >
                  📝 Help
                </button>
                <button
                  onClick={() =>
                    handleSuggestionClick("Tell me about upcoming events")
                  }
                  className="btn btn-xs btn-outline"
                  disabled={isLoading}
                >
                  📅 Events
                </button>
                <button
                  onClick={() =>
                    handleSuggestionClick("How do I get my certificate?")
                  }
                  className="btn btn-xs btn-outline"
                  disabled={isLoading}
                >
                  🏆 Cert
                </button>
              </div>
            </div>
          )}

          {/* Input Form */}
          <div className="p-4 border-t border-base-300">
            <form onSubmit={handleSubmit} className="flex gap-2">
              <div className="form-control flex-1">
                <input
                  ref={inputRef}
                  type="text"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  placeholder="Type your message..."
                  className="input input-bordered input-sm w-full"
                  disabled={isLoading}
                />
              </div>
              <button
                type="submit"
                disabled={!inputMessage.trim() || isLoading}
                className="btn btn-primary btn-sm"
              >
                {isLoading ? (
                  <span className="loading loading-spinner loading-xs"></span>
                ) : (
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
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatbotWidget;
