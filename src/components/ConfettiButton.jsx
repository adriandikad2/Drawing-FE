"use client"

import { useState, forwardRef } from "react"
import confetti from "canvas-confetti"

const ConfettiButton = forwardRef(({ children, onClick, className, as: Component = "button", ...props }, ref) => {
  const [confettiCount, setConfettiCount] = useState(0)

  const handleClick = (e) => {
    // Don't stop propagation or prevent default - this allows navigation to work

    // Trigger confetti
    const rect = e.currentTarget.getBoundingClientRect()
    const x = (rect.left + rect.width / 2) / window.innerWidth
    const y = (rect.top + rect.height / 2) / window.innerHeight

    const count = confettiCount
    setConfettiCount(count + 1)

    // Different confetti patterns based on click count
    if (count % 3 === 0) {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { x, y },
        colors: ["#FF61D8", "#FF8A5B", "#FFD166", "#06D6A0", "#118AB2", "#5B5FFF", "#9B5DE5"],
      })
    } else if (count % 3 === 1) {
      confetti({
        particleCount: 50,
        angle: 60,
        spread: 55,
        origin: { x, y },
        colors: ["#FF61D8", "#FF8A5B", "#FFD166", "#06D6A0", "#118AB2"],
      })
      confetti({
        particleCount: 50,
        angle: 120,
        spread: 55,
        origin: { x, y },
        colors: ["#118AB2", "#5B5FFF", "#9B5DE5"],
      })
    } else {
      const end = Date.now() + 1000

      const colors = ["#FF61D8", "#FF8A5B", "#FFD166", "#06D6A0", "#118AB2", "#5B5FFF", "#9B5DE5"]
      ;(function frame() {
        confetti({
          particleCount: 2,
          angle: 60,
          spread: 55,
          origin: { x, y },
          colors: [colors[Math.floor(Math.random() * colors.length)]],
        })
        confetti({
          particleCount: 2,
          angle: 120,
          spread: 55,
          origin: { x, y },
          colors: [colors[Math.floor(Math.random() * colors.length)]],
        })

        if (Date.now() < end) {
          requestAnimationFrame(frame)
        }
      })()
    }

    // Call the original onClick handler if provided
    if (onClick) onClick(e)
  }

  return (
    <Component
      ref={ref}
      onClick={handleClick}
      className={`relative overflow-hidden transition-all duration-300 ${className}`}
      {...props}
    >
      <span className="relative z-10">{children}</span>
    </Component>
  )
})

ConfettiButton.displayName = "ConfettiButton"

export default ConfettiButton
