"use client"

import { useState, useEffect } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import Cookies from 'js-cookie'
import {
  User,
  LogOut,
  LogIn,
  HelpCircle,
  GraduationCap,
  ChevronLeft,
  ChevronRight,
  Menu,
} from 'lucide-react'

interface SidebarItemProps {
  title: string
  path: string
  icon: React.ReactNode
  isExpanded: boolean
  isActive: boolean
}

const SidebarItem: React.FC<SidebarItemProps> = ({
  title,
  path,
  icon,
  isExpanded,
  isActive
}) => {
  return (
    <Link
      href={path}
      className={`
        flex items-center px-4 py-3 my-1 rounded-xl font-sans font-medium antialiased transition-all duration-300
        ${isActive
          ? 'bg-green-600 text-white shadow-lg scale-105'
          : 'text-gray-700 hover:bg-green-50 hover:text-green-800 hover:scale-105'}
      `}
    >
      <div className="flex items-center">
        <span className={`transition-transform duration-300 ${isActive ? 'scale-110' : ''}`}>{icon}</span>
        {isExpanded && <span className="ml-3 truncate">{title}</span>}
      </div>
    </Link>
  )
}

interface SidebarLayoutProps {
  children: React.ReactNode
}

const SidebarLayout: React.FC<SidebarLayoutProps> = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const pathname = usePathname()
  const router = useRouter()
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const token = Cookies.get("token")
    if (token) {
      setIsLoggedIn(true)
      if (pathname === '/') {
        router.push('/panel')
      }
    } else {
      setIsLoggedIn(false)
      if (pathname !== '/') {
        router.push('/')
      }
    }
    setIsLoading(false)
  }, [pathname, router])

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen)
  }

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }

  const signOut = () => {
    Cookies.remove("token")
    Cookies.remove("uuid")
    window.location.href = "/"
  }

  const sidebarItems = [
    {
      title: 'Profile',
      path: '/profile',
      icon: <User size={20} className="transition-colors duration-300" />
    },
    {
      title: 'Panel',
      path: '/panel',
      icon: <GraduationCap size={20} className="transition-colors duration-300" />
    },
    {
      title: 'About',
      path: '/about',
      icon: <HelpCircle size={20} className="transition-colors duration-300" />
    }
  ]

  const renderSidebar = () => (
    <div
      className={`bg-white text-card-foreground border-r border-gray-200 flex flex-col h-full transition-all duration-300 ${
        isSidebarOpen ? 'w-64' : 'w-16'
      } font-sans antialiased shadow-lg`}
    >
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        {isSidebarOpen && (
          <Link href="/" className="text-xl font-bold text-green-600 transition-colors hover:text-green-700">
            WebEtu
          </Link>
        )}
        <button
          onClick={toggleSidebar}
          className={`transition-all duration-200 hover:bg-gray-100 p-2 rounded-lg ${!isSidebarOpen ? 'mx-auto' : ''}`}
        >
          {isSidebarOpen ? (
            <ChevronLeft size={20} className="transition-transform duration-300 hover:scale-110" />
          ) : (
            <ChevronRight size={20} className="transition-transform duration-300 hover:scale-110" />
          )}
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-2">
        {sidebarItems.map((item) => (
          <SidebarItem
            key={item.path}
            title={item.title}
            path={item.path}
            icon={item.icon}
            isExpanded={isSidebarOpen}
            isActive={pathname === item.path}
          />
        ))}
      </div>

      <div className="p-4 border-t border-gray-200">
        <button
          onClick={signOut}
          className="w-full flex items-center justify-center font-sans font-medium antialiased text-white bg-red-500 hover:bg-red-600 transition-all duration-200 rounded-xl px-4 py-3 hover:scale-105 shadow-md"
        >
          <LogOut size={20} className="transition-transform duration-300 hover:scale-110 mr-2" />
          {isSidebarOpen && <span>Sign Out</span>}
        </button>
      </div>
    </div>
  )

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
      </div>
    )
  }

  if (!isLoggedIn) {
    return <div className="min-h-screen bg-gray-50">{children}</div>
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <div
        className={`fixed inset-0 bg-black/50 z-40 transition-opacity duration-300 ${
          isMobileMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setIsMobileMenuOpen(false)}
      />
      <div
        className={`fixed inset-y-0 left-0 z-50 w-64 transition-transform duration-300 transform ${
          isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        } md:relative md:translate-x-0`}
      >
        {renderSidebar()}
      </div>

      <div className="flex-1 flex flex-col h-full overflow-hidden">
        <header className="bg-white shadow-sm px-6 py-3 flex justify-between items-center border-b border-gray-200">
          <button
            onClick={toggleMobileMenu}
            className="md:hidden transition-transform duration-200 hover:bg-gray-100 p-2 rounded-lg"
          >
            <Menu size={20} className="transition-transform duration-300 hover:scale-110" />
          </button>

          <div className="font-medium text-gray-800">
            {pathname.split('/').pop()?.charAt(0).toUpperCase() + pathname.split('/').pop()?.slice(1) || 'Dashboard'}
          </div>

          <div className="flex items-center space-x-4">
            <Link href="/profile" className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center hover:scale-105 transition-transform duration-200">
                <User size={16} className="text-green-600" />
              </div>
            </Link>
          </div>
        </header>

        <main className="flex-1 overflow-auto p-6 bg-gray-50">
          {children}
        </main>
      </div>
    </div>
  )
}

export default SidebarLayout 