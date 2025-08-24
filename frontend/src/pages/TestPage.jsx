import React from "react";
import { Navbar } from "../components/Navbar";
import ThemeSwitcher from "../components/ThemeSwitcher";

export const TestPage = () => {
  const handleLogout = () => {
    // Handle logout logic
    console.log("Logout clicked");
  };

  return (
    <div className="min-h-screen bg-base-100">
      <Navbar handleLogout={handleLogout} />

      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-primary mb-4">
            🎨 Theme Switcher Test Page
          </h1>
          <p className="text-lg text-base-content/70 mb-6">
            Test all available themes using the theme switcher in the navbar
          </p>

          {/* Standalone Theme Switcher for testing */}
          <div className="flex justify-center mb-8">
            <div className="card bg-base-200 shadow-lg p-6">
              <h3 className="text-xl font-semibold mb-4">
                Standalone Theme Switcher
              </h3>
              <ThemeSwitcher />
            </div>
          </div>
        </div>

        {/* Theme Preview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <div className="card bg-primary text-primary-content shadow-lg">
            <div className="card-body">
              <h2 className="card-title">Primary Card</h2>
              <p>This card uses primary colors</p>
            </div>
          </div>

          <div className="card bg-secondary text-secondary-content shadow-lg">
            <div className="card-body">
              <h2 className="card-title">Secondary Card</h2>
              <p>This card uses secondary colors</p>
            </div>
          </div>

          <div className="card bg-accent text-accent-content shadow-lg">
            <div className="card-body">
              <h2 className="card-title">Accent Card</h2>
              <p>This card uses accent colors</p>
            </div>
          </div>
        </div>

        {/* Color Palette Display */}
        <div className="card bg-base-200 shadow-lg">
          <div className="card-body">
            <h2 className="card-title text-2xl mb-6">Current Theme Colors</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              <div className="text-center">
                <div className="w-16 h-16 bg-primary rounded-lg mx-auto mb-2"></div>
                <span className="text-sm font-medium">Primary</span>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-secondary rounded-lg mx-auto mb-2"></div>
                <span className="text-sm font-medium">Secondary</span>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-accent rounded-lg mx-auto mb-2"></div>
                <span className="text-sm font-medium">Accent</span>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-neutral rounded-lg mx-auto mb-2"></div>
                <span className="text-sm font-medium">Neutral</span>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-info rounded-lg mx-auto mb-2"></div>
                <span className="text-sm font-medium">Info</span>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-success rounded-lg mx-auto mb-2"></div>
                <span className="text-sm font-medium">Success</span>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-warning rounded-lg mx-auto mb-2"></div>
                <span className="text-sm font-medium">Warning</span>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-error rounded-lg mx-auto mb-2"></div>
                <span className="text-sm font-medium">Error</span>
              </div>
            </div>
          </div>
        </div>

        {/* Instructions */}
        <div className="mt-8 text-center">
          <div className="alert alert-info">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              className="stroke-current shrink-0 w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              ></path>
            </svg>
            <div>
              <h3 className="font-bold">How to Test Themes</h3>
              <div className="text-sm">
                Click the theme icon in the navbar to open the theme switcher
                dropdown. Choose any theme to see how it affects the entire
                application. The "dim" theme is set as the default.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
