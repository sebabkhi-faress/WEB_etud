"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import Cookies from "js-cookie"
import { usePathname } from "next/navigation"

import {
  UserIcon,
  ArrowLeftStartOnRectangleIcon,
  ArrowRightEndOnRectangleIcon,
  PencilIcon,
  QuestionMarkCircleIcon,
} from "@heroicons/react/24/solid"

const Navbar = () => {
  const pathname = usePathname()
  const [user, setUser] = useState(false)
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  useEffect(() => {
    const token = Cookies.get("token")
    if (token) {
      setUser(true)
    }
  }, [])

  const signOut = () => {
    Cookies.remove("token")
    Cookies.remove("uuid")
    Cookies.remove("EtabId")
    Cookies.remove("user")
    window.location.reload()
  }

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen)
  const closeMenu = () => setIsMenuOpen(false)

  const menuItems = [
    { href: "/profile", label: "Profile", Icon: UserIcon },
    { href: "/panel", label: "Panel", Icon: PencilIcon },
    { href: "/about", label: "About", Icon: QuestionMarkCircleIcon },
  ]
  const logoutMenuItems = [
    { href: "/", label: "Login", Icon: ArrowRightEndOnRectangleIcon },
    { href: "/about", label: "About", Icon: QuestionMarkCircleIcon },
  ]
  const renderLink = ({ href, label, Icon }: any) => {
    const regex = new RegExp(`^${href}(/[a-zA-Z0-9]+)*$`)
    return (
      <Link
        prefetch={false}
        key={href}
        href={href}
        className={`hover:bg-white hover:text-green-600 flex flex-1 items-center gap-2 px-4 py-2 rounded-md text-lg font-medium transition-all duration-300 text-green-800 scale-105 ${
          regex.test(pathname) ? "bg-white" : "bg-white/50"
        }`}
        onClick={closeMenu}
        style={{ padding: "0.5rem 1rem" }} // Add padding here
      >
        <Icon className="h-6 w-6" />
        {label}
      </Link>
    )
  }

  return (
    <nav className="bg-green-600 text-white py-3 px-3 md:px-8 flex items-center justify-between relative z-50">
      <div className="flex items-center flex-shrink-0">
        <Link href="/">
          <Image src="/logo-white.png" alt="Logo" width={50} height={60} />
        </Link>
      </div>

      <div className="lg:hidden">
        {
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
        }
      </div>

      {isMenuOpen && (
        <div className="lg:hidden absolute top-full left-0 w-full bg-green-600 shadow-lg z-50">
          <div className="flex flex-col gap-2 px-6 py-4">
            {user ? (
              <>
                {menuItems.map(renderLink)}
                <hr className="" />
                <button
                  className="bg-red-200/70 text-red-800 scale-105 flex items-center gap-2 hover:bg-white hover:text-red-600 px-4 py-2 rounded-md text-lg font-medium transition-colors duration-300"
                  onClick={() => {
                    signOut()
                    closeMenu()
                  }}
                  style={{ padding: "0.5rem 1rem" }} // Add padding here
                >
                  <ArrowLeftStartOnRectangleIcon className="h-6 w-6" />
                  Log Out
                </button>
              </>
            ) : (
              logoutMenuItems.map(renderLink)
            )}
          </div>
        </div>
      )}

      <div className="hidden lg:flex gap-4 items-center flex-grow justify-center">
        {user && <div className="flex gap-4">{menuItems.map(renderLink)}</div>}
      </div>

      <div className="hidden lg:flex gap-4 items-center">
        {user ? (
          <button
            className="flex items-center gap-2 bg-red-200/70 text-red-800 hover:bg-white hover:text-red-600 px-4 py-2 rounded-md text-lg font-medium transition-colors duration-300"
            onClick={signOut}
            style={{ padding: "0.5rem 1rem" }} // Add padding here
          >
            <ArrowLeftStartOnRectangleIcon className="h-6 w-6" />
            Log Out
          </button>
        ) : (
          <div className="flex gap-4">
            {renderLink({
              href: "/about",
              label: "About",
              Icon: QuestionMarkCircleIcon,
            })}
          </div>
        )}
      </div>
    </nav>
  )
}

export default Navbar
