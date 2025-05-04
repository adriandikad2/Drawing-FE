"use client"

import { useEffect, useState } from "react"

export default function FloatingShapes() {
  const [shapes, setShapes] = useState([])

  useEffect(() => {
    // Create initial shapes
    const initialShapes = Array.from({ length: 15 }, (_, i) => createRandomShape(i))
    setShapes(initialShapes)

    // Animation loop
    const interval = setInterval(() => {
      setShapes((prevShapes) =>
        prevShapes.map((shape) => ({
          ...shape,
          top: shape.top + shape.speedY,
          left: shape.left + shape.speedX,
          rotation: shape.rotation + shape.rotationSpeed,
          // Reset position if out of viewport
          ...(shape.top > window.innerHeight + 100 ? { top: -100 } : {}),
          ...(shape.top < -100 ? { top: window.innerHeight } : {}),
          ...(shape.left > window.innerWidth + 100 ? { left: -100 } : {}),
          ...(shape.left < -100 ? { left: window.innerWidth } : {}),
        })),
      )
    }, 50)

    return () => clearInterval(interval)
  }, [])

  function createRandomShape(id) {
    const shapes = ["circle", "square", "triangle", "star", "heart"]
    const colors = [
      "#FF61D8", // pink
      "#FF8A5B", // coral
      "#FFD166", // yellow
      "#06D6A0", // teal
      "#118AB2", // blue
      "#5B5FFF", // indigo
      "#9B5DE5", // purple
    ]

    return {
      id,
      shape: shapes[Math.floor(Math.random() * shapes.length)],
      color: colors[Math.floor(Math.random() * colors.length)],
      size: Math.random() * 30 + 10,
      top: Math.random() * window.innerHeight,
      left: Math.random() * window.innerWidth,
      rotation: Math.random() * 360,
      rotationSpeed: (Math.random() - 0.5) * 2,
      speedX: (Math.random() - 0.5) * 2,
      speedY: (Math.random() - 0.5) * 2,
      opacity: Math.random() * 0.5 + 0.1,
    }
  }

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {shapes.map((shape) => (
        <div
          key={shape.id}
          className="absolute"
          style={{
            top: `${shape.top}px`,
            left: `${shape.left}px`,
            width: `${shape.size}px`,
            height: `${shape.size}px`,
            opacity: shape.opacity,
            transform: `rotate(${shape.rotation}deg)`,
            transition: "transform 0.5s ease-out",
          }}
        >
          {shape.shape === "circle" && (
            <div className="w-full h-full rounded-full" style={{ backgroundColor: shape.color }}></div>
          )}
          {shape.shape === "square" && (
            <div className="w-full h-full rounded-md" style={{ backgroundColor: shape.color }}></div>
          )}
          {shape.shape === "triangle" && (
            <div
              className="w-0 h-0"
              style={{
                borderLeft: `${shape.size / 2}px solid transparent`,
                borderRight: `${shape.size / 2}px solid transparent`,
                borderBottom: `${shape.size}px solid ${shape.color}`,
              }}
            ></div>
          )}
          {shape.shape === "star" && (
            <div className="text-center" style={{ color: shape.color, fontSize: `${shape.size}px` }}>
              ★
            </div>
          )}
          {shape.shape === "heart" && (
            <div className="text-center" style={{ color: shape.color, fontSize: `${shape.size}px` }}>
              ❤
            </div>
          )}
        </div>
      ))}
    </div>
  )
}
