import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { VerifyContext } from "../context/VerifyContext";
import ConfirmationModal from "../components/ConfirmationModal";

export const Navbar = ({ handleLogout }) => {
  const { isAdmin, checkLogin, logout } = useContext(VerifyContext);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  useEffect(() => {
    checkLogin();
  }, []);

  // Define links based on user role
  const navLinks = isAdmin ? (
    <>
      {/* Admin Links */}
      <li>
        <Link to="/dashboard">Dashboard</Link>
      </li>
      <li>
        <Link to="/club">Club</Link>
      </li>
      <li>
        <Link to="/club-management">Manage Clubs</Link>
      </li>
      <li>
        <Link to="/create-event">Create Event</Link>
      </li>
      <li>
        <Link to="/certificates">Certificates</Link>
      </li>
    </>
  ) : (
    <>
      {/* Student Links */}
      <li>
        <Link to="/my-events">My Events</Link>
      </li>
      <li>
        <Link to="/events">All Events</Link>
      </li>
      <li>
        <Link to="/certificates">My Certificates</Link>
      </li>
    </>
  );

  const handleLogoutClick = () => {
    setShowLogoutModal(true);
  };

  const handleConfirmLogout = async () => {
    setIsLoggingOut(true);
    try {
      await handleLogout();
    } finally {
      setIsLoggingOut(false);
      setShowLogoutModal(false);
      logout();
    }
  };

  const handleCancelLogout = () => {
    setShowLogoutModal(false);
  };

  return (
    <>
      <div className="navbar bg-base-100 shadow-md">
        {/* Navbar Start: Logo and Mobile Dropdown */}
        <div className="navbar-start">
          {/* Mobile Dropdown Menu */}
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
              className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52"
            >
              {navLinks}
            </ul>
          </div>
          {/* App Name / Logo */}
          <Link to="/dashboard" className="btn btn-ghost text-xl">
            Eventify
          </Link>
        </div>

        {/* Navbar Center: Desktop Links */}
        <div className="navbar-center hidden lg:flex">
          <ul className="menu menu-horizontal px-1">{navLinks}</ul>
        </div>

        {/* Navbar End: Logout Button and profile*/}
        <div className="navbar-end flex gap-3 items-center">
          {/* Profile Icon */}
          <Link to="/profile" className="btn btn-ghost btn-circle avatar">
            <div className="w-10 rounded-full">
              <img
                src="https://cdn-icons-png.flaticon.com/512/149/149071.png"
                alt="profile"
              />
            </div>
          </Link>

          {/* Logout */}
          <button
            onClick={handleLogoutClick}
            className="btn btn-outline btn-error"
            disabled={isLoggingOut}
          >
            {isLoggingOut ? (
              <span className="loading loading-spinner loading-sm"></span>
            ) : (
              "Logout"
            )}
          </button>
        </div>
      </div>

      {/* Logout Confirmation Modal */}
      <ConfirmationModal
        isOpen={showLogoutModal}
        onClose={handleCancelLogout}
        onConfirm={handleConfirmLogout}
        title="Confirm Logout"
        message="Are you sure you want to logout? You will need to sign in again to access your account."
        confirmText="Logout"
        cancelText="Cancel"
        type="warning"
        isLoading={isLoggingOut}
      />
    </>
  );
};
