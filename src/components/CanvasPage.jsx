"use client"

import { useRef, useState, useEffect } from "react"
import { createDrawing } from "../api"
import { useNavigate, Link } from "react-router-dom"
import {
  Trash2,
  Save,
  Eraser,
  Square,
  Circle,
  Triangle,
  Minus,
  Type,
  Download,
  Undo,
  Redo,
  Droplet,
  PenTool,
  ArrowLeft,
} from "lucide-react"
import confetti from "canvas-confetti"

export default function CanvasPage() {
  const navigate = useNavigate()
  const canvasRef = useRef(null)
  const [isDrawing, setIsDrawing] = useState(false)
  const [title, setTitle] = useState("")
  const [color, setColor] = useState("#FF61D8")
  const [brushSize, setBrushSize] = useState(5)
  const [tool, setTool] = useState("brush")
  const [startPos, setStartPos] = useState({ x: 0, y: 0 })
  const [history, setHistory] = useState([])
  const [historyIndex, setHistoryIndex] = useState(-1)

  // Initialize canvas
  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")
    ctx.fillStyle = "#ffffff"
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    saveToHistory()
  }, [])

  // Save current canvas state to history
  const saveToHistory = () => {
    const canvas = canvasRef.current
    const imageData = canvas.toDataURL()

    // If we're not at the end of the history, remove everything after current index
    if (historyIndex < history.length - 1) {
      setHistory(history.slice(0, historyIndex + 1))
    }

    setHistory([...history, imageData])
    setHistoryIndex(historyIndex + 1)
  }

  // Undo function
  const undo = () => {
    if (historyIndex > 0) {
      const newIndex = historyIndex - 1
      setHistoryIndex(newIndex)
      const canvas = canvasRef.current
      const ctx = canvas.getContext("2d")
      const img = new Image()
      img.src = history[newIndex]
      img.onload = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height)
        ctx.drawImage(img, 0, 0)
      }
    }
  }

  // Redo function
  const redo = () => {
    if (historyIndex < history.length - 1) {
      const newIndex = historyIndex + 1
      setHistoryIndex(newIndex)
      const canvas = canvasRef.current
      const ctx = canvas.getContext("2d")
      const img = new Image()
      img.src = history[newIndex]
      img.onload = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height)
        ctx.drawImage(img, 0, 0)
      }
    }
  }

  // Clear canvas
  const clearCanvas = () => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")
    ctx.fillStyle = "#ffffff"
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    saveToHistory()
  }

  // Start drawing
  const startDrawing = (e) => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")
    const rect = canvas.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    setStartPos({ x, y })

    if (tool === "brush" || tool === "eraser") {
      ctx.beginPath()
      ctx.moveTo(x, y)
      ctx.lineWidth = brushSize
      ctx.lineCap = "round"
      ctx.lineJoin = "round"
      ctx.strokeStyle = tool === "eraser" ? "#ffffff" : color
      setIsDrawing(true)
    } else if (tool === "bucket") {
      // Implement bucket fill
      floodFill(x, y, color)
    } else {
      setIsDrawing(true)
    }
  }

  // Draw on canvas
  const draw = (e) => {
    if (!isDrawing) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")
    const rect = canvas.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    if (tool === "brush" || tool === "eraser") {
      ctx.lineTo(x, y)
      ctx.stroke()
    } else if (tool === "line") {
      // Draw line preview
      const tempCanvas = document.createElement("canvas")
      tempCanvas.width = canvas.width
      tempCanvas.height = canvas.height
      const tempCtx = tempCanvas.getContext("2d")

      // Copy current canvas to temp canvas
      tempCtx.drawImage(canvas, 0, 0)

      // Draw the line
      tempCtx.beginPath()
      tempCtx.moveTo(startPos.x, startPos.y)
      tempCtx.lineTo(x, y)
      tempCtx.strokeStyle = color
      tempCtx.lineWidth = brushSize
      tempCtx.stroke()

      // Clear canvas and redraw
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      ctx.drawImage(tempCanvas, 0, 0)
    } else if (tool === "rectangle") {
      // Draw rectangle preview
      const tempCanvas = document.createElement("canvas")
      tempCanvas.width = canvas.width
      tempCanvas.height = canvas.height
      const tempCtx = tempCanvas.getContext("2d")

      // Copy current canvas to temp canvas
      tempCtx.drawImage(canvas, 0, 0)

      // Draw the rectangle
      const width = x - startPos.x
      const height = y - startPos.y
      tempCtx.beginPath()
      tempCtx.rect(startPos.x, startPos.y, width, height)
      tempCtx.strokeStyle = color
      tempCtx.lineWidth = brushSize
      tempCtx.stroke()

      // Clear canvas and redraw
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      ctx.drawImage(tempCanvas, 0, 0)
    } else if (tool === "circle") {
      // Draw circle preview
      const tempCanvas = document.createElement("canvas")
      tempCanvas.width = canvas.width
      tempCanvas.height = canvas.height
      const tempCtx = tempCanvas.getContext("2d")

      // Copy current canvas to temp canvas
      tempCtx.drawImage(canvas, 0, 0)

      // Draw the circle
      const radius = Math.sqrt(Math.pow(x - startPos.x, 2) + Math.pow(y - startPos.y, 2))
      tempCtx.beginPath()
      tempCtx.arc(startPos.x, startPos.y, radius, 0, 2 * Math.PI)
      tempCtx.strokeStyle = color
      tempCtx.lineWidth = brushSize
      tempCtx.stroke()

      // Clear canvas and redraw
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      ctx.drawImage(tempCanvas, 0, 0)
    } else if (tool === "triangle") {
      // Draw triangle preview
      const tempCanvas = document.createElement("canvas")
      tempCanvas.width = canvas.width
      tempCanvas.height = canvas.height
      const tempCtx = tempCanvas.getContext("2d")

      // Copy current canvas to temp canvas
      tempCtx.drawImage(canvas, 0, 0)

      // Draw the triangle
      tempCtx.beginPath()
      tempCtx.moveTo(startPos.x, startPos.y)
      tempCtx.lineTo(x, y)
      tempCtx.lineTo(startPos.x - (x - startPos.x), y)
      tempCtx.closePath()
      tempCtx.strokeStyle = color
      tempCtx.lineWidth = brushSize
      tempCtx.stroke()

      // Clear canvas and redraw
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      ctx.drawImage(tempCanvas, 0, 0)
    }
  }

  // Stop drawing
  const stopDrawing = () => {
    if (isDrawing) {
      setIsDrawing(false)
      saveToHistory()
    }
  }

  // Flood fill algorithm
  const floodFill = (x, y, fillColor) => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
    const data = imageData.data

    // Get the color at the clicked position
    const targetColor = getColorAtPixel(imageData, x, y)

    // Convert fill color from hex to rgba
    const fillColorRgb = hexToRgb(fillColor)

    // If target color is the same as fill color, return
    if (targetColor[0] === fillColorRgb.r && targetColor[1] === fillColorRgb.g && targetColor[2] === fillColorRgb.b) {
      return
    }

    // Queue for flood fill
    const queue = []
    queue.push([x, y])

    while (queue.length > 0) {
      const [nx, ny] = queue.shift()

      // Check if pixel is within canvas bounds
      if (nx < 0 || ny < 0 || nx >= canvas.width || ny >= canvas.height) {
        continue
      }

      // Get color at current pixel
      const currentColor = getColorAtPixel(imageData, nx, ny)

      // Check if current pixel color matches target color
      if (
        currentColor[0] === targetColor[0] &&
        currentColor[1] === targetColor[1] &&
        currentColor[2] === targetColor[2]
      ) {
        // Set the color at current pixel
        setColorAtPixel(imageData, nx, ny, fillColorRgb)

        // Add adjacent pixels to queue
        queue.push([nx + 1, ny])
        queue.push([nx - 1, ny])
        queue.push([nx, ny + 1])
        queue.push([nx, ny - 1])
      }
    }

    // Update canvas with filled area
    ctx.putImageData(imageData, 0, 0)
    saveToHistory()
  }

  // Get color at pixel
  const getColorAtPixel = (imageData, x, y) => {
    const { width, data } = imageData
    const index = (y * width + x) * 4
    return [data[index], data[index + 1], data[index + 2]]
  }

  // Set color at pixel
  const setColorAtPixel = (imageData, x, y, color) => {
    const { width, data } = imageData
    const index = (y * width + x) * 4
    data[index] = color.r
    data[index + 1] = color.g
    data[index + 2] = color.b
    data[index + 3] = 255 // Alpha
  }

  // Convert hex to rgb
  const hexToRgb = (hex) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
    return result
      ? {
          r: Number.parseInt(result[1], 16),
          g: Number.parseInt(result[2], 16),
          b: Number.parseInt(result[3], 16),
        }
      : { r: 0, g: 0, b: 0 }
  }

  // Download canvas as image
  const downloadCanvas = () => {
    const canvas = canvasRef.current
    const link = document.createElement("a")
    link.download = `${title || "drawing"}.png`
    link.href = canvas.toDataURL()
    link.click()
  }

  // Save drawing to database
  const handleSave = async () => {
    const canvas = canvasRef.current
    const data = canvas.toDataURL()
    if (!title.trim()) return alert("Title is required")
    try {
      await createDrawing({ title, data })
      // Trigger confetti on successful save
      confetti({
        particleCount: 150,
        spread: 100,
        origin: { y: 0.6 },
      })
      alert("Drawing saved!")
      navigate("/")
    } catch (err) {
      alert("Error saving drawing")
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-400 via-purple-400 to-indigo-400">
          Create Drawing
        </h1>
        <Link
          to="/"
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-gradient-to-r from-purple-500 to-indigo-500 text-white text-sm font-medium rounded-full shadow-lg shadow-purple-500/20 hover:shadow-xl hover:shadow-purple-500/30 hover:scale-105 transition-all w-fit"
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
          <ArrowLeft className="w-4 h-4" />
          Back to Gallery
        </Link>
      </div>

      <div className="relative">
        <div className="absolute -inset-1 bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 rounded-xl blur opacity-50"></div>
        <div className="relative bg-purple-900/80 backdrop-blur-sm rounded-xl overflow-hidden shadow-xl">
          <div className="p-6 border-b border-purple-800/30">
            {/* Tools Panel */}
            <div className="grid grid-cols-5 sm:grid-cols-10 gap-2 mb-6">
              <ToolButton
                name="Brush"
                icon={<PenTool size={18} />}
                active={tool === "brush"}
                onClick={() => setTool("brush")}
              />
              <ToolButton
                name="Eraser"
                icon={<Eraser size={18} />}
                active={tool === "eraser"}
                onClick={() => setTool("eraser")}
              />
              <ToolButton
                name="Bucket Fill"
                icon={<Droplet size={18} />}
                active={tool === "bucket"}
                onClick={() => setTool("bucket")}
              />
              <ToolButton
                name="Line"
                icon={<Minus size={18} />}
                active={tool === "line"}
                onClick={() => setTool("line")}
              />
              <ToolButton
                name="Rectangle"
                icon={<Square size={18} />}
                active={tool === "rectangle"}
                onClick={() => setTool("rectangle")}
              />
              <ToolButton
                name="Circle"
                icon={<Circle size={18} />}
                active={tool === "circle"}
                onClick={() => setTool("circle")}
              />
              <ToolButton
                name="Triangle"
                icon={<Triangle size={18} />}
                active={tool === "triangle"}
                onClick={() => setTool("triangle")}
              />
              <ToolButton
                name="Text"
                icon={<Type size={18} />}
                active={tool === "text"}
                onClick={() => setTool("text")}
              />
              <ToolButton name="Clear" icon={<Trash2 size={18} />} onClick={clearCanvas} />
              <ToolButton name="Download" icon={<Download size={18} />} onClick={downloadCanvas} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="space-y-3">
                <label className="block text-sm font-medium text-purple-200">Brush Size: {brushSize}px</label>
                <input
                  type="range"
                  min="1"
                  max="50"
                  value={brushSize}
                  onChange={(e) => setBrushSize(Number.parseInt(e.target.value))}
                  className="w-full h-2 bg-purple-800 rounded-full appearance-none cursor-pointer"
                />
                <div className="flex justify-between text-xs text-purple-300">
                  <span>1px</span>
                  <span>25px</span>
                  <span>50px</span>
                </div>
              </div>

              <div className="space-y-3">
                <label className="block text-sm font-medium text-purple-200">Color</label>
                <div className="flex gap-2">
                  <input
                    type="color"
                    value={color}
                    onChange={(e) => setColor(e.target.value)}
                    className="w-10 h-10 rounded cursor-pointer border border-purple-700"
                  />
                  <div className="grid grid-cols-5 gap-2 flex-1">
                    {[
                      "#FF61D8", // pink
                      "#FF8A5B", // coral
                      "#FFD166", // yellow
                      "#06D6A0", // teal
                      "#118AB2", // blue
                      "#5B5FFF", // indigo
                      "#9B5DE5", // purple
                      "#F72585", // hot pink
                      "#000000", // black
                      "#ffffff", // white
                    ].map((c) => (
                      <button
                        key={c}
                        onClick={() => setColor(c)}
                        className={`w-8 h-8 rounded-full border-2 transition-transform hover:scale-110 ${
                          c === color ? "border-white shadow-lg shadow-purple-500/30" : "border-transparent"
                        }`}
                        style={{ backgroundColor: c }}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6">
              <button
                onClick={(e) => {
                  undo()
                  if (historyIndex > 0) {
                    // Only trigger confetti if undo is possible
                    const rect = e.currentTarget.getBoundingClientRect()
                    const x = (rect.left + rect.width / 2) / window.innerWidth
                    const y = (rect.top + rect.height / 2) / window.innerHeight

                    confetti({
                      particleCount: 30,
                      spread: 50,
                      origin: { x, y },
                      colors: ["#118AB2", "#5B5FFF", "#9B5DE5"],
                    })
                  }
                }}
                disabled={historyIndex <= 0}
                className={`flex items-center justify-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  historyIndex <= 0
                    ? "bg-purple-800/50 text-purple-400 cursor-not-allowed"
                    : "bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-lg shadow-blue-500/20 hover:shadow-xl hover:shadow-blue-500/30 hover:scale-105"
                }`}
              >
                <Undo size={16} />
                Undo
              </button>
              <button
                onClick={(e) => {
                  redo()
                  if (historyIndex < history.length - 1) {
                    // Only trigger confetti if redo is possible
                    const rect = e.currentTarget.getBoundingClientRect()
                    const x = (rect.left + rect.width / 2) / window.innerWidth
                    const y = (rect.top + rect.height / 2) / window.innerHeight

                    confetti({
                      particleCount: 30,
                      spread: 50,
                      origin: { x, y },
                      colors: ["#118AB2", "#5B5FFF", "#9B5DE5"],
                    })
                  }
                }}
                disabled={historyIndex >= history.length - 1}
                className={`flex items-center justify-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  historyIndex >= history.length - 1
                    ? "bg-purple-800/50 text-purple-400 cursor-not-allowed"
                    : "bg-gradient-to-r from-green-500 to-teal-500 text-white shadow-lg shadow-green-500/20 hover:shadow-xl hover:shadow-green-500/30 hover:scale-105"
                }`}
              >
                <Redo size={16} />
                Redo
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <input
                type="text"
                placeholder="Drawing Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-4 py-2 bg-purple-800/50 border border-purple-700 rounded-full text-white placeholder-purple-300 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
              />
              <button
                onClick={(e) => {
                  handleSave()
                  const rect = e.currentTarget.getBoundingClientRect()
                  const x = (rect.left + rect.width / 2) / window.innerWidth
                  const y = (rect.top + rect.height / 2) / window.innerHeight

                  confetti({
                    particleCount: 30,
                    spread: 50,
                    origin: { x, y },
                    colors: ["#FF61D8", "#FF8A5B", "#FFD166", "#06D6A0", "#118AB2", "#5B5FFF", "#9B5DE5"],
                  })
                }}
                className="flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-pink-500 to-purple-500 text-white text-sm font-medium rounded-full shadow-lg shadow-pink-500/20 hover:shadow-xl hover:shadow-pink-500/30 hover:scale-105 transition-all"
              >
                <Save size={16} />
                Save Drawing
              </button>
              <button
                onClick={(e) => {
                  downloadCanvas()
                  const rect = e.currentTarget.getBoundingClientRect()
                  const x = (rect.left + rect.width / 2) / window.innerWidth
                  const y = (rect.top + rect.height / 2) / window.innerHeight

                  confetti({
                    particleCount: 30,
                    spread: 50,
                    origin: { x, y },
                    colors: ["#FF61D8", "#FF8A5B", "#FFD166", "#06D6A0", "#118AB2", "#5B5FFF", "#9B5DE5"],
                  })
                }}
                className="flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-500 to-indigo-500 text-white text-sm font-medium rounded-full shadow-lg shadow-purple-500/20 hover:shadow-xl hover:shadow-purple-500/30 hover:scale-105 transition-all"
              >
                <Download size={16} />
                Download
              </button>
            </div>
          </div>

          {/* Canvas */}
          <div className="bg-white p-6 flex justify-center">
            <div className="relative rounded-md shadow-xl overflow-hidden">
              <div className="absolute -inset-1 bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 rounded-xl blur-sm opacity-50"></div>
              <canvas
                ref={canvasRef}
                width={800}
                height={500}
                className="relative w-full max-w-4xl cursor-crosshair"
                onMouseDown={startDrawing}
                onMouseMove={draw}
                onMouseUp={stopDrawing}
                onMouseLeave={stopDrawing}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// Tool button component
function ToolButton({ name, icon, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`p-2 rounded-full transition-all ${
        active
          ? "bg-gradient-to-r from-pink-500 to-purple-500 text-white shadow-lg shadow-pink-500/20"
          : "bg-purple-800/50 text-purple-200 hover:bg-purple-700/70 hover:text-white"
      }`}
      title={name}
    >
      {icon}
    </button>
  )
}
