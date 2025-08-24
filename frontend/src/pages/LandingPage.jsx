import React, { useState, useEffect, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { VerifyContext } from "../context/VerifyContext";
import ThemeSwitcher from "../components/ThemeSwitcher";

export const LandingPage = () => {
  const { isVerified, checkLogin, isLoading } = useContext(VerifyContext);
  const navigate = useNavigate();
  useEffect(() => {
    checkLogin();
  }, []);

  useEffect(() => {
    if (isVerified && !isLoading) {
      navigate("/dashboard");
    }
  }, [isVerified, isLoading, navigate]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [animatedNumbers, setAnimatedNumbers] = useState({
    events: 0,
    students: 0,
    clubs: 0,
    certificates: 0,
  });

  // Hero carousel images/content
  const heroSlides = [
    {
      title: "Discover Amazing University Events",
      subtitle: "Connect, Learn, and Grow with Your University Community",
      image:
        "https://images.unsplash.com/photo-1540575467063-178a50c2df87?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
      cta: "Explore Events",
    },
    {
      title: "AI-Powered Event Recommendations",
      subtitle: "Get personalized event suggestions based on your interests",
      image:
        "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
      cta: "Get Started",
    },
    {
      title: "Manage Your Club Events",
      subtitle: "Powerful tools for club admins to organize and manage events",
      image:
        "https://images.unsplash.com/photo-1511578314322-379afb476865?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2069&q=80",
      cta: "Admin Portal",
    },
  ];

  // Auto-slide effect
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [heroSlides.length]);

  // Animated numbers effect
  useEffect(() => {
    const targets = {
      events: 150,
      students: 2500,
      clubs: 45,
      certificates: 890,
    };
    const duration = 2000;
    const steps = 60;
    const stepTime = duration / steps;

    const timers = [];

    Object.keys(targets).forEach((key) => {
      const target = targets[key];
      const increment = target / steps;
      let current = 0;

      const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
          current = target;
          clearInterval(timer);
        }
        setAnimatedNumbers((prev) => ({ ...prev, [key]: Math.floor(current) }));
      }, stepTime);

      timers.push(timer);
    });
    // Cleanup function
    return () => timers.forEach(clearInterval);
  }, []);

  const features = [
    {
      icon: "🎯",
      title: "Smart Recommendations",
      description:
        "ML-powered system suggests events based on your interests and activity history",
      color: "from-purple-400 to-pink-400",
    },
    {
      icon: "🤖",
      title: "AI Assistant",
      description: "24/7 chatbot support for instant answers to your questions",
      color: "from-blue-400 to-cyan-400",
    },
    {
      icon: "🏆",
      title: "Digital Certificates",
      description:
        "Automatically generated certificates for event participation",
      color: "from-yellow-400 to-orange-400",
    },
    {
      icon: "👥",
      title: "Club Management",
      description:
        "Advanced tools for club admins to manage events and members",
      color: "from-green-400 to-teal-400",
    },
    {
      icon: "📅",
      title: "Event Discovery",
      description:
        "Discover and register for events across all university clubs",
      color: "from-indigo-400 to-purple-400",
    },
    {
      icon: "📊",
      title: "Analytics Dashboard",
      description: "Comprehensive insights and analytics for event organizers",
      color: "from-pink-400 to-red-400",
    },
  ];

  return (
    <div className="min-h-screen bg-base-100">
      {/* Navigation */}
      <div className="navbar bg-base-100/90 shadow-lg sticky top-0 z-50 backdrop-blur-md">
        <div className="navbar-start">
          <div className="dropdown">
            <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h8m-8 6h16"
                />
              </svg>
            </div>
            <ul
              tabIndex={0}
              className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-200 rounded-box w-52"
            >
              <li>
                <a href="#features">Features</a>
              </li>
              <li>
                <a href="#stats">Statistics</a>
              </li>
              <li>
                <a href="#about">About</a>
              </li>
              <li>
                <Link to="/chatbot" className="text-primary font-semibold">
                  🤖 AI Assistant
                </Link>
              </li>
            </ul>
          </div>
          <div className="btn btn-ghost text-2xl font-bold text-primary flex items-center gap-3">
            <img src="/vite.svg" alt="Eventify Logo" className="w-10 h-10" />
            <span>Eventify</span>
          </div>
        </div>
        <div className="navbar-center hidden lg:flex">
          <ul className="menu menu-horizontal px-1">
            <li>
              <a
                href="#features"
                className="hover:text-primary transition-colors"
              >
                Features
              </a>
            </li>
            <li>
              <a href="#stats" className="hover:text-primary transition-colors">
                Statistics
              </a>
            </li>
            <li>
              <a href="#about" className="hover:text-primary transition-colors">
                About
              </a>
            </li>
            <li>
              <Link
                to="/chatbot"
                className="hover:text-primary transition-colors text-primary font-semibold"
              >
                🤖 AI Assistant
              </Link>
            </li>
          </ul>
        </div>
        <div className="navbar-end gap-2">
          <ThemeSwitcher />
          <Link to="/login" className="btn btn-ghost">
            Login
          </Link>
          <Link to="/register" className="btn btn-primary">
            Get Started
          </Link>
        </div>
      </div>

      {/* Hero Section with Carousel */}
      <section className="relative overflow-hidden">
        <div className="carousel w-full h-screen relative">
          {" "}
          {/* Added relative here */}
          {heroSlides.map((slide, index) => (
            <div
              key={index}
              className={`carousel-item absolute w-full h-full transition-opacity duration-1000 ${
                index === currentSlide ? "opacity-100 z-10" : "opacity-0 z-0"
              }`}
              style={{ transform: "none" }} // Prevent default carousel translation
            >
              <div
                className="w-full h-full bg-cover bg-center bg-no-repeat"
                style={{ backgroundImage: `url(${slide.image})` }}
              >
                <div className="w-full h-full bg-black bg-opacity-50 flex items-center justify-center">
                  <div className="text-center text-white px-4 max-w-4xl">
                    <h1 className="text-6xl md:text-7xl font-bold mb-6 animate-pulse">
                      {slide.title}
                    </h1>
                    <p className="text-xl md:text-2xl mb-8">{slide.subtitle}</p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                      <Link
                        to="/register"
                        className="btn btn-primary btn-lg hover:scale-105 transition-transform"
                      >
                        {slide.cta}
                      </Link>
                      <Link
                        to="/events"
                        className="btn btn-outline btn-lg text-white border-white hover:scale-105 transition-transform"
                      >
                        Browse Events
                      </Link>
                      <Link
                        to="/chatbot"
                        className="btn btn-secondary btn-lg hover:scale-105 transition-transform"
                      >
                        🤖 AI Assistant
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Carousel Indicators */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-2">
          {heroSlides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-3 h-3 rounded-full transition-all ${
                index === currentSlide ? "bg-white" : "bg-white bg-opacity-50"
              }`}
            />
          ))}
        </div>

        {/* Floating Action Button */}
        <div className="absolute bottom-20 right-8">
          <Link
            to="/chatbot"
            className="btn btn-circle btn-primary btn-lg shadow-2xl hover:scale-110 transition-transform animate-bounce"
          >
            🤖
          </Link>
        </div>
      </section>

      {/* Statistics Section */}
      <section id="stats" className="py-20 bg-base-200">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold mb-4 text-base-content">
              Platform Statistics
            </h2>
            <p className="text-xl text-base-content/70">
              Join thousands of students in the Eventify community
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center group hover:scale-105 transition-transform">
              <div className="bg-base-100 rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow border border-primary/20">
                <div className="text-4xl mb-4">🎉</div>
                <div className="text-4xl font-bold text-primary mb-2">
                  {animatedNumbers.events}+
                </div>
                <div className="text-lg font-semibold text-base-content/70">
                  Events Hosted
                </div>
              </div>
            </div>

            <div className="text-center group hover:scale-105 transition-transform">
              <div className="bg-base-100 rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow border border-secondary/20">
                <div className="text-4xl mb-4">👨‍🎓</div>
                <div className="text-4xl font-bold text-secondary mb-2">
                  {animatedNumbers.students}+
                </div>
                <div className="text-lg font-semibold text-base-content/70">
                  Active Students
                </div>
              </div>
            </div>

            <div className="text-center group hover:scale-105 transition-transform">
              <div className="bg-base-100 rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow border border-accent/20">
                <div className="text-4xl mb-4">🏫</div>
                <div className="text-4xl font-bold text-accent mb-2">
                  {animatedNumbers.clubs}+
                </div>
                <div className="text-lg font-semibold text-base-content/70">
                  University Clubs
                </div>
              </div>
            </div>

            <div className="text-center group hover:scale-105 transition-transform">
              <div className="bg-base-100 rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow border border-info/20">
                <div className="text-4xl mb-4">🏆</div>
                <div className="text-4xl font-bold text-info mb-2">
                  {animatedNumbers.certificates}+
                </div>
                <div className="text-lg font-semibold text-base-content/70">
                  Certificates Issued
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-base-100">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold mb-4 text-base-content">
              Powerful Features
            </h2>
            <p className="text-xl text-base-content/70 max-w-3xl mx-auto">
              Eventify combines cutting-edge technology with intuitive design to
              create the ultimate university event management experience
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="group hover:scale-105 transition-all duration-300 hover:-translate-y-2"
              >
                <div className="card bg-base-200 shadow-lg hover:shadow-xl transition-shadow h-full border border-primary/10">
                  <div className="card-body p-8">
                    <div
                      className={`w-16 h-16 rounded-xl bg-primary/10 flex items-center justify-center text-2xl mb-6 group-hover:scale-110 transition-transform`}
                    >
                      {feature.icon}
                    </div>
                    <h3 className="card-title text-2xl mb-4 text-base-content group-hover:text-primary transition-colors">
                      {feature.title}
                    </h3>
                    <p className="text-base-content/70 leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-base-200">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold mb-4 text-base-content">
              How It Works
            </h2>
            <p className="text-xl text-base-content/70">
              Get started in just a few simple steps
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center group">
              <div className="relative mb-8">
                <div className="w-24 h-24 bg-primary rounded-full flex items-center justify-center text-primary-content text-3xl font-bold mx-auto group-hover:scale-110 transition-transform shadow-lg">
                  1
                </div>
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-primary/60 rounded-full animate-ping"></div>
              </div>
              <h3 className="text-2xl font-bold mb-4 text-base-content">
                Sign Up
              </h3>
              <p className="text-base-content/70">
                Create your account as a student or club admin to get started
              </p>
            </div>

            <div className="text-center group">
              <div className="relative mb-8">
                <div className="w-24 h-24 bg-secondary rounded-full flex items-center justify-center text-secondary-content text-3xl font-bold mx-auto group-hover:scale-110 transition-transform shadow-lg">
                  2
                </div>
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-secondary/60 rounded-full animate-ping"></div>
              </div>
              <h3 className="text-2xl font-bold mb-4 text-base-content">
                Discover
              </h3>
              <p className="text-base-content/70">
                Browse events or get AI-powered recommendations based on your
                interests
              </p>
            </div>

            <div className="text-center group">
              <div className="relative mb-8">
                <div className="w-24 h-24 bg-accent rounded-full flex items-center justify-center text-accent-content text-3xl font-bold mx-auto group-hover:scale-110 transition-transform shadow-lg">
                  3
                </div>
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-accent/60 rounded-full animate-ping"></div>
              </div>
              <h3 className="text-2xl font-bold mb-4 text-base-content">
                Participate
              </h3>
              <p className="text-base-content/70">
                Register for events and earn certificates upon completion
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* AI Assistant Section */}
      <section className="py-20 bg-gradient-to-br from-primary/10 via-base-100 to-secondary/10">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold mb-4 text-base-content">
              Meet Your AI Assistant 🤖
            </h2>
            <p className="text-xl text-base-content/70 max-w-3xl mx-auto">
              Get instant help and answers to all your questions about Eventify
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Content Column */}
            <div className="space-y-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center text-3xl">
                  🤖
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-primary">
                    24/7 Support
                  </h3>
                  <p className="text-base-content/70">
                    Always here to help you
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-success/20 rounded-full flex items-center justify-center text-success text-sm font-bold mt-1">
                    ✓
                  </div>
                  <div>
                    <h4 className="font-semibold text-base-content">
                      Event Discovery
                    </h4>
                    <p className="text-base-content/70">
                      Ask about upcoming events, categories, and recommendations
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-success/20 rounded-full flex items-center justify-center text-success text-sm font-bold mt-1">
                    ✓
                  </div>
                  <div>
                    <h4 className="font-semibold text-base-content">
                      Registration Help
                    </h4>
                    <p className="text-base-content/70">
                      Get guidance on how to register for events and manage your
                      account
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-success/20 rounded-full flex items-center justify-center text-success text-sm font-bold mt-1">
                    ✓
                  </div>
                  <div>
                    <h4 className="font-semibold text-base-content">
                      Certificate Information
                    </h4>
                    <p className="text-base-content/70">
                      Learn about digital certificates and how to download them
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-success/20 rounded-full flex items-center justify-center text-success text-sm font-bold mt-1">
                    ✓
                  </div>
                  <div>
                    <h4 className="font-semibold text-base-content">
                      General Support
                    </h4>
                    <p className="text-base-content/70">
                      Any questions about the platform? Just ask!
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 mt-8">
                <Link
                  to="/chatbot"
                  className="btn btn-primary btn-lg hover:scale-105 transition-transform"
                >
                  🤖 Try AI Assistant
                </Link>
                <Link
                  to="/register"
                  className="btn btn-outline btn-lg hover:scale-105 transition-transform"
                >
                  Get Started
                </Link>
              </div>
            </div>

            {/* Visual Column */}
            <div className="relative">
              <div className="bg-base-100 rounded-2xl shadow-2xl p-8 border border-primary/20">
                <div className="space-y-4">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-white">
                      🤖
                    </div>
                    <div>
                      <h4 className="font-semibold">AI Assistant</h4>
                      <p className="text-sm text-base-content/70">Online</p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="chat chat-start">
                      <div className="chat-bubble chat-bubble-primary">
                        Hi! I'm your AI assistant. How can I help you today?
                      </div>
                    </div>

                    <div className="chat chat-end">
                      <div className="chat-bubble">
                        How do I register for an event?
                      </div>
                    </div>

                    <div className="chat chat-start">
                      <div className="chat-bubble chat-bubble-primary">
                        To register for an event, simply browse the events page,
                        click on an event you're interested in, and use the
                        "Register" button. You'll receive a confirmation email
                        once registered!
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating elements */}
              <div className="absolute -top-4 -right-4 w-8 h-8 bg-primary/20 rounded-full animate-pulse"></div>
              <div className="absolute -bottom-4 -left-4 w-6 h-6 bg-secondary/20 rounded-full animate-pulse delay-1000"></div>
            </div>
          </div>
        </div>
      </section>

      {/* About Us Section */}
      <section id="about" className="py-20 bg-base-100">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold mb-4 text-base-content">
              About Eventify
            </h2>
            <p className="text-xl text-base-content/70 max-w-3xl mx-auto">
              Connecting students, empowering clubs, and building a more vibrant
              campus community through technology.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Image Column */}
            <div className="order-last md:order-first">
              <img
                src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80"
                alt="Students collaborating on a project"
                className="rounded-2xl shadow-xl w-full h-full object-cover"
              />
            </div>

            {/* Text Content Column */}
            <div className="space-y-6">
              <h3 className="text-3xl font-bold text-primary">Our Story</h3>
              <p className="text-base-content/80 leading-relaxed">
                Created as a hackathon project, Eventify was born from a simple
                observation: university life is filled with incredible
                opportunities, but they're often hidden in plain sight. We saw
                students missing out on amazing events and club admins
                struggling with outdated tools. We knew there had to be a better
                way.
              </p>
              <p className="text-base-content/80 leading-relaxed">
                Our mission is to break down these barriers. By creating a
                single, intelligent platform, we empower students to discover
                events that match their passions and help clubs reach a wider
                audience. We believe that a connected campus is a thriving
                campus.
              </p>
              <div className="alert bg-base-200 shadow-md">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  className="stroke-info shrink-0 w-6 h-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  ></path>
                </svg>
                <div>
                  <h3 className="font-bold">Our Vision</h3>
                  <div className="text-xs">
                    To be the central hub for every university event, fostering
                    a culture of participation, discovery, and community.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-neutral text-neutral-content">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-5xl font-bold mb-6">Ready to Get Started?</h2>
          <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
            Join the Eventify community today and discover amazing events,
            connect with like-minded students, and enhance your university
            experience
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/register"
              className="btn btn-lg btn-primary hover:scale-105 transition-transform font-semibold"
            >
              Sign Up as Student
            </Link>
            <Link
              to="/register"
              className="btn btn-lg btn-outline border-neutral-content text-neutral-content hover:bg-neutral-content hover:text-neutral hover:scale-105 transition-transform font-semibold"
            >
              Join as Club Admin
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-base-300 py-12 text-base-content">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="font-bold text-2xl mb-4 text-primary">
                Eventify
              </div>
              <p className="text-base-content/70">
                The ultimate university event management platform powered by AI
                and designed for student success.
              </p>
            </div>

            <div>
              <h4 className="font-bold mb-4 text-base-content">Features</h4>
              <ul className="space-y-2 text-base-content/70">
                <li>
                  <a href="#" className="hover:text-primary transition-colors">
                    Event Discovery
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-primary transition-colors">
                    AI Recommendations
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-primary transition-colors">
                    Club Management
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-primary transition-colors">
                    Digital Certificates
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold mb-4 text-base-content">Support</h4>
              <ul className="space-y-2 text-base-content/70">
                <li>
                  <Link
                    to="/chatbot"
                    className="hover:text-primary transition-colors"
                  >
                    AI Assistant
                  </Link>
                </li>
                <li>
                  <a href="#" className="hover:text-primary transition-colors">
                    Help Center
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-primary transition-colors">
                    Contact Us
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-primary transition-colors">
                    FAQs
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold mb-4 text-base-content">Connect</h4>
              <div className="flex space-x-4">
                <a
                  href="#"
                  className="text-2xl hover:text-primary transition-colors"
                >
                  📱
                </a>
                <a
                  href="#"
                  className="text-2xl hover:text-primary transition-colors"
                >
                  💬
                </a>
                <a
                  href="#"
                  className="text-2xl hover:text-primary transition-colors"
                >
                  📧
                </a>
                <a
                  href="#"
                  className="text-2xl hover:text-primary transition-colors"
                >
                  🐦
                </a>
              </div>
            </div>
          </div>

          <div className="border-t border-base-content/20 mt-8 pt-8 text-center text-base-content/60">
            <p>
              &copy; 2025 Eventify. Built with passion for academic excellence .
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};
