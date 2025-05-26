"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import Cookies from "js-cookie"
import { usePathname } from "next/navigation"
import { getProfileData, getImage } from "@/utils/api/profile"
import { decode } from 'jsonwebtoken'

import {
  UserIcon,
  ArrowLeftStartOnRectangleIcon,
  ArrowRightEndOnRectangleIcon,
  QuestionMarkCircleIcon,
  AcademicCapIcon,
  ChevronDownIcon,
} from "@heroicons/react/24/solid"

const Navbar = () => {
  const pathname = usePathname()
  const [user, setUser] = useState(false)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [profileData, setProfileData] = useState<any>(null)
  const [profileImage, setProfileImage] = useState<string | null>(null)

  useEffect(() => {
    const token = Cookies.get("token")
    const uuid = Cookies.get("uuid")
    
    if (token && uuid) {
      setUser(true)
      // Fetch profile data and image
      const fetchProfileData = async () => {
        try {
          // Decode token to get user (username/registration number)
          const tokenPayload = decode(token) as any;
          if (!tokenPayload || typeof tokenPayload !== "object") {
            console.error("Invalid token payload");
            return;
          }
          
          const userFromToken = tokenPayload.userName as string;
          
          const [profileResponse, image] = await Promise.all([
            getProfileData(token, userFromToken, uuid),
            getImage(token, userFromToken, uuid)
          ])
          if (profileResponse.success) {
            setProfileData(profileResponse.data)
          }
          if (image) {
            setProfileImage(image)
          }
        } catch (error) {
          console.error("Error fetching profile data:", error)
        }
      }
      fetchProfileData()
    }
  }, [])

  const signOut = () => {
    Cookies.remove("token")
    Cookies.remove("uuid")
    Cookies.remove("studentRegistrationNumber")
    window.location.href = "/"
  }

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen)
  const closeMenu = () => setIsMenuOpen(false)
  const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen)

  const isAuthMenuItems = [
    { href: "/panel", label: "Panel", Icon: AcademicCapIcon },
    { href: "/about", label: "About", Icon: QuestionMarkCircleIcon },
  ]
  const notAuthMenuItems = [
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
        className={`hover:bg-white flex flex-1 items-center gap-2 px-4 py-2 rounded text-lg font-medium transition-all duration-300 text-green-800 scale-103 ${
          regex.test(pathname) ? "bg-white" : "bg-white/50"
        }`}
        onClick={closeMenu}
        aria-label={label}
      >
        <Icon className="h-6 w-6" />
        {label}
      </Link>
    )
  }

  const renderProfileDropdown = () => (
    <div className="relative">
      <button
        onClick={toggleDropdown}
        className="flex items-center gap-3 bg-white/10 hover:bg-white/20 px-4 py-2 rounded-lg transition-colors duration-300 text-white"
      >
        <div className="relative w-10 h-10 rounded-full overflow-hidden border-2 border-white">
          <Image
            src={profileImage ? `data:image/png;base64,${profileImage}` : "/images/unavailable.png"}
            alt="Profile"
            fill
            className="object-cover"
          />
        </div>
        <div className="text-left">
          <div className="font-medium">
            {profileData ? `${profileData.individuPrenomLatin} ${profileData.individuNomLatin}` : 'Loading...'}
          </div>
        </div>
        <ChevronDownIcon className={`h-5 w-5 transition-transform duration-300 ${isDropdownOpen ? 'rotate-180' : ''}`} />
      </button>

      {isDropdownOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 z-50">
          <Link
            href="/profile"
            className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-green-50 hover:text-green-700 transition-colors duration-300"
            onClick={() => setIsDropdownOpen(false)}
          >
            <UserIcon className="h-5 w-5" />
            Profile
          </Link>
          <button
            onClick={() => {
              signOut()
              setIsDropdownOpen(false)
            }}
            className="w-full text-left flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 transition-colors duration-300"
          >
            <ArrowLeftStartOnRectangleIcon className="h-5 w-5" />
            Sign Out
          </button>
        </div>
      )}
    </div>
  )

  return (
    <nav className="bg-green-700 text-white py-3 px-3 md:px-8 flex items-center justify-between relative z-50">
      <div className="flex items-center flex-shrink-0">
        <Link prefetch={false} href="/">
          <Image
            priority={true}
            src="/images/logo-white.png"
            alt="Logo"
            width={50}
            height={60}
          />
        </Link>
      </div>

      <div className="lg:hidden">
        <button
          className="p-2 focus:outline-none"
          onClick={toggleMenu}
          aria-label="Toggle menu"
        >
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
      </div>

      {isMenuOpen && (
        <div className="lg:hidden md:px-3 absolute top-full left-0 w-full bg-green-700 z-50">
          <div className="flex flex-col gap-2 px-6 pb-4 pt-2">
            {user ? (
              <>
                <div className="relative w-full">
                  <button
                    onClick={toggleDropdown}
                    className="flex items-center justify-between w-full gap-3 bg-white/10 hover:bg-white/20 px-4 py-3 rounded-lg transition-colors duration-300 text-white focus:outline-none"
                    aria-expanded={isDropdownOpen}
                    aria-haspopup="true"
                  >
                    <div className="flex items-center gap-3">
                      <div className="relative w-10 h-10 rounded-full overflow-hidden border-2 border-white">
                        <Image
                          src={profileImage ? `data:image/png;base64,${profileImage}` : "/images/unavailable.png"}
                          alt="Profile"
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="text-left">
                        <div className="font-medium text-white">
                          {profileData ? `${profileData.individuPrenomLatin} ${profileData.individuNomLatin}` : 'Loading...'}
                        </div>
                      </div>
                    </div>
                    <ChevronDownIcon className={`h-5 w-5 text-white transition-transform duration-300 ${isDropdownOpen ? 'rotate-180' : ''}`} />
                  </button>

                  {isDropdownOpen && (
                    <div className="absolute top-full left-0 mt-2 w-full bg-white rounded-lg shadow-lg py-1 z-50">
                      <Link
                        href="/profile"
                        className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-green-50 hover:text-green-700 transition-colors duration-300"
                        onClick={() => {
                          setIsDropdownOpen(false)
                          closeMenu()
                        }}
                      >
                        <UserIcon className="h-5 w-5" />
                        Profile
                      </Link>
                      <button
                        onClick={() => {
                          signOut()
                          setIsDropdownOpen(false)
                          closeMenu()
                        }}
                        className="w-full text-left flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 transition-colors duration-300"
                      >
                        <ArrowLeftStartOnRectangleIcon className="h-5 w-5" />
                        Sign Out
                      </button>
                    </div>
                  )}
                </div>
                
                <hr className="my-2 border-gray-600"/>
                {isAuthMenuItems.map(renderLink)}
              </>
            ) : (
              <>{notAuthMenuItems.map(renderLink)}</>
            )}
          </div>
        </div>
      )}

      <div className="hidden lg:flex gap-4 items-center flex-grow justify-center">
        {user && (
          <div className="flex gap-4">{isAuthMenuItems.map(renderLink)}</div>
        )}
      </div>

      <div className="hidden lg:flex gap-4 items-center">
        {user ? (
          renderProfileDropdown()
        ) : (
          <div className="flex gap-4">{notAuthMenuItems.map(renderLink)}</div>
        )}
      </div>
    </nav>
  )
}

export default Navbar
