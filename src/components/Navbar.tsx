"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showProfileLink, setShowProfileLink] = useState(false);

  useEffect(() => {
    // Check if cookie token exists
    const cookieTokenExists = document.cookie.includes("token=");
    setShowProfileLink(cookieTokenExists);
  }, []);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const closeMenu = () => {
    setIsOpen(false);
  };

  return (
    <nav className="bg-green-600 p-4">
      <div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8 flex items-center justify-between">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <Image
              src="/nav.png" // Replace with your actual logo path
              alt="Logo"
              width={80}
              height={60}
            />
          </div>
        </div>
        {/* Hamburger menu for mobile */}
        <div className="md:hidden">
          <button
            onClick={toggleMenu}
            className="text-gray-200 hover:text-white focus:outline-none focus:text-white"
          >
            <svg
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              {isOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>
        {/* Desktop navigation */}
        <div className="hidden md:block">
          <div className="ml-4 flex items-center md:ml-6">
            <Link
              href="/about"
              className="text-white hover:bg-white hover:text-green-600 px-5 py-3 rounded-md text-lg font-medium transition-colors duration-300"
            >
              About
            </Link>
            {/* Conditional profile link */}
            {showProfileLink ? (
              <Link
                href="/profile"
                className="text-white hover:bg-white hover:text-green-600 px-5 py-3 rounded-md text-lg font-medium transition-colors duration-300"
                onClick={closeMenu}
              >
                Profile
              </Link>
            ) : (
              <Link
                href="/login"
                className="text-white hover:bg-white hover:text-green-600 px-5 py-3 rounded-md text-lg font-medium transition-colors duration-300"
                onClick={closeMenu}
              >
                Login
              </Link>
            )}
            {/* Add more links as needed */}
          </div>
        </div>
      </div>
      {/* Mobile navigation menu */}
      <div
        className={`md:hidden fixed inset-0 bg-green-600 bg-opacity-90 z-10 transform transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex flex-col items-start py-8 space-y-4 px-6 relative">
          {/* Close button */}
          <button
            onClick={toggleMenu}
            className="absolute top-4 right-4 text-gray-200 hover:text-white focus:outline-none"
          >
            <svg
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
          <Link
            href="/about"
            className="text-white hover:bg-white hover:text-green-600 text-2xl font-medium transition-colors duration-300"
            onClick={closeMenu}
          >
            About
          </Link>
          {/* Conditional profile link or Login */}
          {showProfileLink ? (
            <Link
              href="/profile"
              className="text-white hover:bg-white hover:text-green-600 text-2xl font-medium transition-colors duration-300"
              onClick={closeMenu}
            >
              Profile
            </Link>
          ) : (
            <Link
              href="/login"
              className="text-white hover:bg-white hover:text-green-600 text-2xl font-medium transition-colors duration-300"
              onClick={closeMenu}
            >
              Login
            </Link>
          )}
          {/* Add more links as needed */}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
