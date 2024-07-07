"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import Cookies from "js-cookie";
import { useRouter, usePathname } from "next/navigation";

import {
  UserIcon,
  ArrowLeftStartOnRectangleIcon,
  PencilIcon,
  UserGroupIcon,
  ExclamationTriangleIcon,
} from "@heroicons/react/24/solid";

const Navbar = () => {
  const pathname = usePathname();
  const [user, setUser] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const token = Cookies.get("token");
    if (token) {
      setUser(true);
    }
  }, []);

  const router = useRouter();

  const signOut = () => {
    Cookies.remove("token");
    Cookies.remove("uuid");
    Cookies.remove("EtabId");
    Cookies.remove("user");
    window.location.reload();
  };

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const closeMenu = () => setIsMenuOpen(false);

  const menuItems = [
    { href: "/profile", label: "Profile", Icon: UserIcon },
    { href: "/group", label: "Group", Icon: UserGroupIcon },
    { href: "/year", label: "Notes", Icon: UserGroupIcon },
  ];

  const renderLink = ({ href, label, Icon }: any) => (
    <Link
      prefetch
      key={href}
      href={href}
      className={`flex flex-1 items-center gap-2 px-4 py-2 rounded-md text-lg font-medium transition-all duration-300 ${
        pathname === href
          ? "bg-white text-green-600 scale-105"
          : "hover:bg-white hover:text-green-600"
      }`}
      onClick={closeMenu}
      style={{ padding: "0.5rem 1rem" }} // Add padding here
    >
      <Icon className="h-6 w-6" />
      {label}
    </Link>
  );

  return (
    <nav className="bg-green-600 text-white py-4 px-4 md:px-12 flex items-center justify-between relative z-50">
      <div className="flex items-center flex-shrink-0">
        <Link href="/" prefetch={true}>
          <Image src="/nav.png" alt="Logo" width={120} height={80} />
        </Link>
      </div>

      <div className="lg:hidden">
        {user && (
          <button className="p-2 focus:outline-none" onClick={toggleMenu}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d={
                  isMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16m-7 6h7"
                }
              />
            </svg>
          </button>
        )}
      </div>

      {isMenuOpen && user && (
        <div className="lg:hidden absolute top-full left-0 w-full bg-green-600 shadow-lg z-50">
          <div
            className="flex flex-col space-y-2 p-4"
            style={{ margin: "0 1rem" }}
          >
            {" "}
            {/* Add margin here */}
            {menuItems.map(renderLink)}
            <button
              className="flex items-center gap-2 hover:bg-white hover:text-red-600 px-4 py-2 rounded-md text-lg font-medium transition-colors duration-300"
              onClick={() => {
                signOut();
                closeMenu();
              }}
              style={{ padding: "0.5rem 1rem" }} // Add padding here
            >
              <ArrowLeftStartOnRectangleIcon className="h-6 w-6" />
              Log Out
            </button>
          </div>
        </div>
      )}

      <div className="hidden lg:flex gap-4 items-center flex-grow justify-center">
        {user && <div className="flex gap-4">{menuItems.map(renderLink)}</div>}
      </div>

      <div className="hidden lg:flex gap-4 items-center">
        {user && (
          <button
            className="flex items-center gap-2 hover:bg-white hover:text-red-600 px-4 py-2 rounded-md text-lg font-medium transition-colors duration-300"
            onClick={signOut}
            style={{ padding: "0.5rem 1rem" }} // Add padding here
          >
            <ArrowLeftStartOnRectangleIcon className="h-6 w-6" />
            Log Out
          </button>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
