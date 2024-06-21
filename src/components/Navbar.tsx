"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
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
              className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
            >
              About
            </Link>
            {/* Add more links as needed */}
          </div>
        </div>
        {/* Mobile navigation menu */}
        {isOpen && (
          <div className="md:hidden absolute top-0 left-0 w-full h-full bg-green-600 z-10">
            <div className="flex flex-col items-start py-4">
              <Link
                href="/about"
                className="text-gray-200 hover:text-white px-4 py-2"
              >
                About
              </Link>
              {/* Add more links as needed */}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
