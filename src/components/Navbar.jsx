"use client"

import { useState, useEffect } from "react"
import { Link, useLocation } from "react-router-dom"
import { Palette, Home, Brush } from "lucide-react"

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const location = useLocation()

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-200 ${
        scrolled ? "bg-white/90 dark:bg-slate-900/90 backdrop-blur-md shadow-sm" : "bg-white dark:bg-slate-900"
      }`}
    >
      <div className="container mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="relative flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 shadow-sm">
              <Palette className="w-4 h-4 text-white" />
            </div>
            <span className="text-lg font-medium bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 to-purple-500">
              ArtCanvas
            </span>
          </Link>

          {/* Navigation Links */}
          <div className="flex items-center gap-1">
            <NavLink to="/" active={location.pathname === "/"}>
              <Home className="w-4 h-4 mr-1.5" />
              Gallery
            </NavLink>
            <NavLink to="/draw" active={location.pathname === "/draw"}>
              <Brush className="w-4 h-4 mr-1.5" />
              Draw
            </NavLink>
          </div>
        </div>
      </div>
    </nav>
  )
}

// Navigation Link component
function NavLink({ to, active, children }) {
  return (
    <Link
      to={to}
      className={`flex items-center px-4 py-2 rounded-full text-sm font-medium transition-all ${
        active
          ? "bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-sm"
          : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
      }`}
    >
      {children}
    </Link>
  )
}
