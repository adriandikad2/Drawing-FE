"use client"

import { useEffect, useState } from "react"
import { getDrawings, deleteDrawing } from "../api"
import { Link } from "react-router-dom"
import { Trash2, Eye, Loader2, ImageIcon, PlusCircle } from "lucide-react"
import confetti from "canvas-confetti"

export default function GalleryPage() {
  const [drawings, setDrawings] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchDrawings = async () => {
    setLoading(true)
    try {
      const res = await getDrawings()
      setDrawings(res.data)
    } catch (error) {
      console.error("Error fetching drawings:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchDrawings()
  }, [])

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this drawing?")) return

    try {
      await deleteDrawing(id)
      fetchDrawings()
    } catch (error) {
      console.error("Error deleting drawing:", error)
    }
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-400 via-purple-400 to-indigo-400">
          Your Artwork
        </h1>
        <Link
          to="/draw"
          className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 text-white text-sm font-medium rounded-full shadow-lg shadow-purple-500/20 hover:shadow-xl hover:shadow-purple-500/30 hover:scale-105 transition-all"
          onClick={(e) => {
            // Trigger confetti without blocking navigation
            const rect = e.currentTarget.getBoundingClientRect()
            const x = (rect.left + rect.width / 2) / window.innerWidth
            const y = (rect.top + rect.height / 2) / window.innerHeight

            confetti({
              particleCount: 100,
              spread: 70,
              origin: { x, y },
              colors: ["#FF61D8", "#FF8A5B", "#FFD166", "#06D6A0", "#118AB2", "#5B5FFF", "#9B5DE5"],
            })
          }}
        >
          <PlusCircle className="w-5 h-5" />
          New Drawing
        </Link>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="w-10 h-10 text-pink-400 animate-spin" />
        </div>
      ) : drawings.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 px-4 border-2 border-dashed border-purple-500/30 rounded-xl bg-purple-900/20 backdrop-blur-sm">
          <div className="relative">
            <div className="absolute inset-0 blur-xl bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 opacity-30 rounded-full"></div>
            <ImageIcon className="w-16 h-16 text-purple-300 relative" />
          </div>
          <h3 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-400 via-purple-400 to-indigo-400 mt-4 mb-2">
            No artwork yet
          </h3>
          <p className="text-purple-300 mb-8 text-center max-w-md">
            Create your first masterpiece and it will appear here in all its colorful glory!
          </p>
          <Link
            to="/draw"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 text-white text-sm font-medium rounded-full shadow-lg shadow-purple-500/20 hover:shadow-xl hover:shadow-purple-500/30 hover:scale-105 transition-all"
            onClick={(e) => {
              // Trigger confetti without blocking navigation
              const rect = e.currentTarget.getBoundingClientRect()
              const x = (rect.left + rect.width / 2) / window.innerWidth
              const y = (rect.top + rect.height / 2) / window.innerHeight

              confetti({
                particleCount: 100,
                spread: 70,
                origin: { x, y },
                colors: ["#FF61D8", "#FF8A5B", "#FFD166", "#06D6A0", "#118AB2", "#5B5FFF", "#9B5DE5"],
              })
            }}
          >
            <PlusCircle className="w-5 h-5" />
            Create Drawing
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {drawings.map((drawing, index) => (
            <div
              key={drawing.id}
              className="group relative"
              style={{
                animationDelay: `${index * 0.1}s`,
                animation: "fadeIn 0.5s ease-out forwards",
              }}
            >
              <div className="absolute -inset-1 bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 rounded-xl blur opacity-30 group-hover:opacity-100 transition-all duration-300"></div>
              <div className="relative bg-purple-900/80 backdrop-blur-sm rounded-xl overflow-hidden shadow-xl transition-all duration-300 group-hover:scale-[1.02] group-hover:shadow-purple-500/20">
                <div className="aspect-square overflow-hidden bg-white relative">
                  <img
                    src={drawing.data || "/placeholder.svg"}
                    alt={drawing.title}
                    className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-purple-900/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center p-4">
                    <div className="flex gap-3 scale-90 group-hover:scale-100 transition-transform duration-300">
                      <Link
                        to={`/view/${drawing.id}`}
                        className="flex items-center justify-center w-12 h-12 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-full hover:shadow-lg hover:shadow-pink-500/30 transition-all duration-300 hover:scale-110"
                      >
                        <Eye className="w-5 h-5" />
                      </Link>
                      <button
                        onClick={() => handleDelete(drawing.id)}
                        className="flex items-center justify-center w-12 h-12 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-full hover:shadow-lg hover:shadow-red-500/30 transition-all duration-300 hover:scale-110"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="font-bold text-lg text-transparent bg-clip-text bg-gradient-to-r from-pink-300 to-purple-300 truncate">
                    {drawing.title}
                  </h3>
                  <p className="text-xs text-purple-300 mt-1">{formatDate(drawing.created_at)}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
