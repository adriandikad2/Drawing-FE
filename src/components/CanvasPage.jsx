"use client"

import { useRef, useState, useEffect } from "react"
import { createDrawing } from "../api"
import { useNavigate } from "react-router-dom"
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

export default function CanvasPage() {
  const navigate = useNavigate()
  const canvasRef = useRef(null)
  const [isDrawing, setIsDrawing] = useState(false)
  const [title, setTitle] = useState("")
  const [color, setColor] = useState("#6366f1")
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
      alert("Drawing saved!")
      navigate("/")
    } catch (err) {
      alert("Error saving drawing")
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-2xl font-medium text-slate-900 dark:text-white">Create Drawing</h1>
        <button
          onClick={() => navigate("/")}
          className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-sm font-medium rounded-full hover:bg-slate-300 dark:hover:bg-slate-700 transition-colors w-fit"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Gallery
        </button>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-200 dark:border-slate-700">
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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6"></div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="space-y-3">
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                Brush Size: {brushSize}px
              </label>
              <input
                type="range"
                min="1"
                max="50"
                value={brushSize}
                onChange={(e) => setBrushSize(Number.parseInt(e.target.value))}
                className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-full appearance-none cursor-pointer"
              />
              <div className="flex justify-between text-xs text-slate-500 dark:text-slate-400">
                <span>1px</span>
                <span>25px</span>
                <span>50px</span>
              </div>
            </div>

            <div className="space-y-3">
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Color</label>
              <div className="flex gap-2">
                <input
                  type="color"
                  value={color}
                  onChange={(e) => setColor(e.target.value)}
                  className="w-10 h-10 rounded cursor-pointer border border-slate-200 dark:border-slate-700"
                />
                <div className="grid grid-cols-5 gap-2 flex-1">
                  {[
                    "#6366f1", // indigo
                    "#8b5cf6", // violet
                    "#ec4899", // pink
                    "#f43f5e", // rose
                    "#f97316", // orange
                    "#eab308", // yellow
                    "#22c55e", // green
                    "#06b6d4", // cyan
                    "#000000", // black
                    "#ffffff", // white
                  ].map((c) => (
                    <button
                      key={c}
                      onClick={() => setColor(c)}
                      className={`w-8 h-8 rounded-full border-2 transition-transform hover:scale-110 ${
                        c === color ? "border-indigo-500 shadow-sm" : "border-transparent"
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
              onClick={undo}
              disabled={historyIndex <= 0}
              className={`flex items-center justify-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all ${
                historyIndex <= 0
                  ? "bg-slate-200 dark:bg-slate-700 text-slate-400 dark:text-slate-500 cursor-not-allowed"
                  : "bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-300 dark:hover:bg-slate-600"
              }`}
            >
              <Undo size={16} />
              Undo
            </button>
            <button
              onClick={redo}
              disabled={historyIndex >= history.length - 1}
              className={`flex items-center justify-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all ${
                historyIndex >= history.length - 1
                  ? "bg-slate-200 dark:bg-slate-700 text-slate-400 dark:text-slate-500 cursor-not-allowed"
                  : "bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-300 dark:hover:bg-slate-600"
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
              className="w-full px-4 py-2 bg-slate-100 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-full text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
            <button
              onClick={handleSave}
              className="flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-500 text-white text-sm font-medium rounded-full shadow-sm hover:shadow-md transition-shadow"
            >
              <Save size={16} />
              Save Drawing
            </button>
            <button
              onClick={downloadCanvas}
              className="flex items-center justify-center gap-2 px-4 py-2 bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 text-sm font-medium rounded-full hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors"
            >
              <Download size={16} />
              Download
            </button>
          </div>
        </div>

        {/* Canvas */}
        <div className="bg-slate-100 dark:bg-slate-900 p-6 flex justify-center">
          <div className="bg-white rounded-md shadow-sm overflow-hidden">
            <canvas
              ref={canvasRef}
              width={800}
              height={500}
              className="w-full max-w-4xl cursor-crosshair"
              onMouseDown={startDrawing}
              onMouseMove={draw}
              onMouseUp={stopDrawing}
              onMouseLeave={stopDrawing}
            />
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
          ? "bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-sm"
          : "bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-300 dark:hover:bg-slate-600"
      }`}
      title={name}
    >
      {icon}
    </button>
  )
}
