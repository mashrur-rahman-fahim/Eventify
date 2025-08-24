import React, { useState, useEffect } from "react";

const ThemeSwitcher = () => {
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "dim");
  const [isOpen, setIsOpen] = useState(false);

  // All available themes from tailwind.config.js
  const themes = [
    "light",
    "dark",
    "cupcake",
    "bumblebee",
    "emerald",
    "corporate",
    "synthwave",
    "retro",
    "cyberpunk",
    "valentine",
    "halloween",
    "garden",
    "forest",
    "aqua",
    "lofi",
    "pastel",
    "fantasy",
    "wireframe",
    "black",
    "luxury",
    "dracula",
    "cmyk",
    "autumn",
    "business",
    "acid",
    "lemonade",
    "night",
    "coffee",
    "winter",
    "dim",
    "nord",
    "sunset",
  ];

  // Theme icons for better visual representation
  const getThemeIcon = (themeName) => {
    const icons = {
      light: "☀️",
      dark: "🌙",
      cupcake: "🧁",
      bumblebee: "🐝",
      emerald: "💎",
      corporate: "🏢",
      synthwave: "🌆",
      retro: "📺",
      cyberpunk: "🤖",
      valentine: "💕",
      halloween: "🎃",
      garden: "🌺",
      forest: "🌲",
      aqua: "🌊",
      lofi: "🎧",
      pastel: "🎨",
      fantasy: "🧚",
      wireframe: "📐",
      black: "⚫",
      luxury: "💎",
      dracula: "🧛",
      cmyk: "🖨️",
      autumn: "🍂",
      business: "💼",
      acid: "⚗️",
      lemonade: "🍋",
      night: "🌃",
      coffee: "☕",
      winter: "❄️",
      dim: "🌆",
      nord: "🏔️",
      sunset: "🌅",
    };
    return icons[themeName] || "🎨";
  };

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  const handleThemeChange = (newTheme) => {
    setTheme(newTheme);
    setIsOpen(false);
  };

  return (
    <div className="dropdown dropdown-end">
      <div
        tabIndex={0}
        role="button"
        className="btn btn-ghost btn-circle"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Theme switcher"
      >
        <div className="text-xl">{getThemeIcon(theme)}</div>
      </div>
      <ul
        tabIndex={0}
        className={`dropdown-content menu p-2 shadow bg-base-200 rounded-box w-64 max-h-96 overflow-y-auto z-[9999] ${
          isOpen ? "block" : "hidden"
        }`}
      >
        <li className="menu-title">
          <span className="text-sm font-semibold text-base-content/70">
            Choose Theme
          </span>
        </li>
        {themes.map((themeName) => (
          <li key={themeName}>
            <button
              onClick={() => handleThemeChange(themeName)}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                theme === themeName
                  ? "bg-primary text-primary-content"
                  : "hover:bg-base-300"
              }`}
            >
              <span className="text-lg">{getThemeIcon(themeName)}</span>
              <span className="capitalize font-medium">
                {themeName === "dim" ? "Dim (Default)" : themeName}
              </span>
              {theme === themeName && (
                <svg
                  className="w-4 h-4 ml-auto"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              )}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ThemeSwitcher;
