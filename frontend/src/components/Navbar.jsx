import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { VerifyContext } from "../context/VerifyContext";

export const Navbar = ({ handleLogout }) => {
  const { isAdmin } = useContext(VerifyContext);

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
    </>
  );

  return (
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
        <Link to="/" className="btn btn-ghost text-xl">
          Eventify
        </Link>
      </div>

      {/* Navbar Center: Desktop Links */}
      <div className="navbar-center hidden lg:flex">
        <ul className="menu menu-horizontal px-1">{navLinks}</ul>
      </div>

      {/* Navbar End: Logout Button */}
      <div className="navbar-end">
        <button onClick={handleLogout} className="btn btn-outline btn-error">
          Logout
        </button>
      </div>
    </div>
  );
};
