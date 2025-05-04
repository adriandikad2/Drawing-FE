"use client"

import { useEffect, useState } from "react"
import { useParams, Link } from "react-router-dom"
import { getDrawingById } from "../api"
import { ArrowLeft, Download, Loader2, Calendar } from "lucide-react"
import ConfettiButton from "./ConfettiButton"
import confetti from "canvas-confetti"

export default function ViewPage() {
  const { id } = useParams()
  const [drawing, setDrawing] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchDrawing = async () => {
      setLoading(true)
      try {
        const response = await getDrawingById(id)
        setDrawing(response.data)
      } catch (err) {
        console.error("Error fetching drawing:", err)
        setError("Failed to load the drawing. It may have been deleted or doesn't exist.")
      } finally {
        setLoading(false)
      }
    }

    fetchDrawing()
  }, [id])

  const handleDownload = () => {
    if (!drawing) return

    const link = document.createElement("a")
    link.download = `${drawing.title}.png`
    link.href = drawing.data
    link.click()
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="w-10 h-10 text-pink-400 animate-spin" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-4 border-2 border-dashed border-purple-500/30 rounded-xl bg-purple-900/20 backdrop-blur-sm">
        <h3 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-pink-400 mb-4">
          {error}
        </h3>
        <ConfettiButton
          as={Link}
          to="/"
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-gradient-to-r from-purple-500 to-indigo-500 text-white text-sm font-medium rounded-full shadow-lg shadow-purple-500/20 hover:shadow-xl hover:shadow-purple-500/30 hover:scale-105 transition-all"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Gallery
        </ConfettiButton>
      </div>
    )
  }

  if (!drawing) return null

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
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
        <ConfettiButton
          onClick={handleDownload}
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-gradient-to-r from-pink-500 to-purple-500 text-white text-sm font-medium rounded-full shadow-lg shadow-purple-500/20 hover:shadow-xl hover:shadow-purple-500/30 hover:scale-105 transition-all w-fit"
        >
          <Download className="w-4 h-4" />
          Download
        </ConfettiButton>
      </div>

      <div className="relative">
        <div className="absolute -inset-1 bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 rounded-xl blur opacity-50"></div>
        <div className="relative bg-purple-900/80 backdrop-blur-sm rounded-xl overflow-hidden shadow-xl">
          <div className="p-6 border-b border-purple-800/30">
            <h1 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-400 via-purple-400 to-indigo-400">
              {drawing.title}
            </h1>
            <div className="flex items-center text-purple-300 text-sm mt-2">
              <Calendar className="w-4 h-4 mr-1.5" />
              {formatDate(drawing.created_at)}
            </div>
          </div>

          <div className="bg-white p-6 flex justify-center">
            <img
              src={drawing.data || "/placeholder.svg"}
              alt={drawing.title}
              className="max-w-full max-h-[70vh] rounded-md shadow-lg"
            />
          </div>
        </div>
      </div>
    </div>
  )
}
