"use client";

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
    <nav className="bg-green-600 py-4 px-4 md:px-12 flex items-center justify-between">
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

      <div className="hidden md:flex items-center space-x-2">
        {user && (
          <>
            {pathname !== "/group" && (
              <Link
                href="/group" // Adjust the href for your Group page
                className="flex gap-2 text-white hover:bg-white hover:text-green-600 px-4 py-2 rounded-md text-lg font-medium transition-colors duration-300"
              >
                <UserIcon className="h-6 w-6" />
                Group
              </Link>
            )}

            {pathname !== "/profile" && (
              <Link
                href="/profile"
                className="flex gap-2 text-white hover:bg-white hover:text-green-600 px-4 py-2 rounded-md text-lg font-medium transition-colors duration-300"
              >
                <UserIcon className="h-6 w-6" />
                Profile
              </Link>
            )}
            
            <button
              className="flex gap-2 text-white hover:bg-white hover:text-red-600 px-4 py-2 rounded-md text-lg font-medium transition-colors duration-300"
              onClick={() => signOut()}
            >
              <ArrowLeftStartOnRectangleIcon className="h-6 w-6" />
              Sign Out
            </button>
          </>
        )}

        {!user && (
          <Link
            href="/login"
            className={`flex gap-2 text-white hover:bg-white hover:text-green-600 px-4 py-2 rounded-md text-lg font-medium transition-colors duration-300 ${
              pathname === "/login" ? "hidden" : ""
            }`}
          >
            <ArrowRightEndOnRectangleIcon className="h-6 w-6" />
            Sign In
          </Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
