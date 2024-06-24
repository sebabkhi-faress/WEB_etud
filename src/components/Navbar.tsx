"use client";

import Link from "next/link";
import Image from "next/image";
import { useAuth } from "./AuthProvider";
import {
  UserIcon,
  ArrowLeftStartOnRectangleIcon,
  ArrowRightEndOnRectangleIcon,
} from "@heroicons/react/16/solid";
import { usePathname } from "next/navigation";

const Navbar = () => {
  const { user, signOut } = useAuth();

  const pathname = usePathname();

  return (
    <nav className="bg-green-600 h-20 py-4 px-12 flex items-center justify-between">
      <div className="flex items-center flex-shrink-0">
        <Link href="/">
          <Image
            src="/nav.png" // Replace with your actual logo path
            alt="Logo"
            width={120}
            height={80}
          />
        </Link>
      </div>

      <div className="ml-4 flex items-center md:ml-6 space-x-2">
        {user ? (
          pathname === "/" ? (
            <Link
              href="/profile"
              className={`flex gap-2 text-white hover:bg-white hover:text-green-600 px-5 py-3 rounded-md text-lg font-medium transition-colors duration-300 ${
                pathname !== "/" ? "hidden" : ""
              }`}
            >
              <UserIcon className="h-6 w-6" />
              Profile
            </Link>
          ) : (
            <button
              className="flex gap-2 text-white hover:bg-white hover:text-red-600 px-5 py-3 rounded-md text-lg font-medium transition-colors duration-300"
              onClick={() => signOut()}
            >
              <ArrowLeftStartOnRectangleIcon className="h-6 w-6" />
              Sign Out
            </button>
          )
        ) : (
          <>
            <Link
              href="/login"
              className={`flex gap-2 text-white hover:bg-white hover:text-green-600 px-5 py-3 rounded-md text-lg font-medium transition-colors duration-300 ${
                pathname === "/login" ? "hidden" : ""
              }`}
            >
              <ArrowRightEndOnRectangleIcon className="h-6 w-6" />
              Sign In
            </Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
