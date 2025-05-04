"use client"

import { useState, useEffect } from "react"
import { Link, useLocation } from "react-router-dom"
import { Palette, Home, Brush } from "lucide-react"
import confetti from "canvas-confetti"

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
        scrolled ? "bg-purple-900/80 backdrop-blur-md shadow-lg shadow-purple-500/10" : "bg-transparent"
      }`}
    >
      <div className="container mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="relative flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 shadow-lg shadow-purple-500/20 animate-pulse">
              <Palette className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-pink-400 via-purple-400 to-indigo-400 animate-gradient-text">
              ArtCanvas
            </span>
          </Link>

          {/* Navigation Links */}
          <div className="flex items-center gap-2">
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

// Update the NavLink component to properly use the Link component with ConfettiButton

// Navigation Link component
function NavLink({ to, active, children }) {
  return (
    <Link
      to={to}
      className={`flex items-center px-5 py-2 rounded-full text-sm font-medium transition-all ${
        active
          ? "bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 text-white shadow-lg shadow-purple-500/20"
          : "text-purple-200 hover:bg-purple-800/50 hover:text-white"
      }`}
      onClick={(e) => {
        // Trigger confetti without blocking navigation
        const rect = e.currentTarget.getBoundingClientRect()
        const x = (rect.left + rect.width / 2) / window.innerWidth
        const y = (rect.top + rect.height / 2) / window.innerHeight

        confetti({
          particleCount: 50,
          spread: 70,
          origin: { x, y },
          colors: ["#FF61D8", "#FF8A5B", "#FFD166", "#06D6A0", "#118AB2", "#5B5FFF", "#9B5DE5"],
        })
      }}
    >
      {children}
    </Link>
  )
}
